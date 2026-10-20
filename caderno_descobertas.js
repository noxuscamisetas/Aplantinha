/* Memórias de cultivos reais. O caderno não modifica genética ou recursos. */
const CONQUISTAS_CADERNO = [
  { id: "PRIMEIRO_PLANTIO", titulo: "Um começo", texto: "Plante sua primeira semente." },
  { id: "PRIMEIRO_BROTO", titulo: "Olha, um broto!", texto: "Acompanhe um cultivo até o estágio de broto." },
  { id: "PRIMEIRA_COLHEITA", titulo: "Fruto do cuidado", texto: "Colha frutos ou flores de uma planta." },
  { id: "PRIMEIRA_DESCENDENTE", titulo: "A história continua", texto: "Plante uma Semente-DNA de uma nova geração." },
  { id: "SOLO_COM_HISTORIA", titulo: "Nada termina aqui", texto: "Prepare solo com casca ou pétala de uma colheita." },
  { id: "GERACOES_JUNTAS", titulo: "De uma geração à outra", texto: "Mantenha duas gerações de uma mesma ancestral no universo." }
];

function garantirCaderno() {
  estado.cadernoDescobertas ??= { versao: 1, plantas: [], conquistas: [] };
  return estado.cadernoDescobertas;
}

function momentoDoCaderno() {
  return { dia: estado.tempo?.dia || 1, hora: estado.tempo?.hora || 0 };
}

function conquistarNoCaderno(id) {
  const livro = garantirCaderno();
  if (!livro.conquistas.some(item => item.id === id)) {
    livro.conquistas.push({ id, ...momentoDoCaderno() });
  }
}

function cultivosDoCaderno() {
  return [
    ...(estado.quartoV080?.vasos || []).filter(v => v.cultivo)
      .map(v => ({ cultivo: v.cultivo, local: `Vaso ${v.id}` })),
    ...(estado.jardimV088?.slots || []).filter(s => s.cultivo)
      .map(s => ({ cultivo: s.cultivo, local: `Jardim ${s.id}` }))
  ];
}

function retratoParaCaderno(c) {
  return {
    sementeBase: c.base, geracao: c.geracao || 0,
    dna: structuredClone(c.dna || {}), estagio: c.estagio,
    saude: c.saude, umidade: c.umidade, energia: c.energia,
    idade: c.idade ?? c.passosAmbientais ?? 0,
    solo: c.solo, producaoPronta: !!c.producaoPronta,
    contadoresVida: structuredClone(c.contadoresVida || {}),
    exposicoes: structuredClone(c.exposicoes || {}),
    linhagem: structuredClone(c.linhagem || c.plantaV083?.linhagem || [])
  };
}

function atualizarCaderno() {
  const livro = garantirCaderno();
  const vivos = cultivosDoCaderno();
  for (const registro of livro.plantas) registro.local = "Memória do cultivo";
  for (const { cultivo: c, local } of vivos) {
    const id = c.id || c.plantaV083?.id;
    if (!id) continue;
    let registro = livro.plantas.find(p => p.id === id);
    if (!registro) {
      registro = { id, nome: "", primeiroRegistro: momentoDoCaderno(),
        colheitas: 0, frutosColhidos: 0, floresColhidas: 0, maiorEstagio: 0 };
      livro.plantas.push(registro);
    }
    registro.local = local;
    registro.retrato = retratoParaCaderno(c);
    registro.ultimoRegistro = momentoDoCaderno();
    registro.maiorEstagio = Math.max(registro.maiorEstagio,
      estagios.indexOf(c.estagio));
    registro.historico = [...(c.historico || c.plantaV083?.historico || [])].slice(0, 8);
    conquistarNoCaderno("PRIMEIRO_PLANTIO");
    if (registro.maiorEstagio >= estagios.indexOf("BROTO")) conquistarNoCaderno("PRIMEIRO_BROTO");
    if (c.geracao > 0) conquistarNoCaderno("PRIMEIRA_DESCENDENTE");
  }
  // Migração: só reconhece colheitas antigas quando restou evidência material.
  if (livro.plantas.some(p => p.colheitas > 0)
      || estado.inventarioEstruturado?.itens.some(item =>
        ["FRUTO", "FLOR", "CASCA", "PETALA"].includes(item.tipo)
        && (item.origemPlanta?.id || item.procedencia?.cultivoId))) {
    conquistarNoCaderno("PRIMEIRA_COLHEITA");
  }
  if (estado.receitasProduzidasV0870?.some(r => r.tipo === "PREPARO_SOLO")) {
    conquistarNoCaderno("SOLO_COM_HISTORIA");
  }
  if (vivos.some(({ cultivo: a }) => vivos.some(({ cultivo: b }) =>
    a.base === b.base && a.geracao !== b.geracao))) {
    conquistarNoCaderno("GERACOES_JUNTAS");
  }
}

function registrarColheitaCaderno(cultivo, frutos, flores) {
  atualizarCaderno();
  const registro = garantirCaderno().plantas.find(p => p.id === cultivo.id);
  if (registro) {
    registro.colheitas++;
    registro.frutosColhidos += frutos;
    registro.floresColhidas += flores;
  }
  conquistarNoCaderno("PRIMEIRA_COLHEITA");
}

function escaparCaderno(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function nomeRegistroCaderno(registro) {
  return registro.nome || `Cultivo ${NOMES_SEMENTES_V080[registro.retrato.sementeBase] || "descoberto"}`;
}

function nomeSoloCaderno(solo) {
  return QUARTO_V080.solos[solo]?.nome || "Solo do cultivo";
}

let abaCaderno = "PLANTAS";
let focoAntesDoCaderno = null;

function fecharCaderno() {
  const dialogo = document.querySelector("#cadernoDescobertas");
  dialogo?.close();
  focoAntesDoCaderno?.focus();
}

function abrirCaderno() {
  pararRegaV080();
  let dialogo = document.querySelector("#cadernoDescobertas");
  if (!dialogo) {
    dialogo = document.createElement("dialog");
    dialogo.id = "cadernoDescobertas";
    dialogo.setAttribute("aria-labelledby", "tituloCaderno");
    document.body.appendChild(dialogo);
  }
  if (!dialogo.open) focoAntesDoCaderno = document.activeElement;
  renderCaderno();
  if (!dialogo.open) dialogo.showModal();
}

function renderCaderno() {
  const livro = garantirCaderno();
  const dialogo = document.querySelector("#cadernoDescobertas");
  dialogo.innerHTML = `<header class="caderno-topo"><div>
    <span class="etiqueta-cuidado">CUIDADOS QUE VIRARAM HISTÓRIA</span>
    <h2 id="tituloCaderno">Caderno de Descobertas</h2>
    <p>Um lugar para lembrar do que nasceu por aqui.</p></div>
    <button type="button" id="fecharCaderno" aria-label="Fechar caderno">×</button></header>
    <nav class="caderno-abas" aria-label="Seções do caderno">
      <button type="button" data-aba-caderno="PLANTAS" aria-pressed="${abaCaderno === "PLANTAS"}">Minhas plantas · ${livro.plantas.length}</button>
      <button type="button" data-aba-caderno="CONQUISTAS" aria-pressed="${abaCaderno === "CONQUISTAS"}">Conquistas · ${livro.conquistas.length}/${CONQUISTAS_CADERNO.length}</button>
    </nav><div id="conteudoCaderno"></div>`;
  dialogo.querySelector("#fecharCaderno").onclick = fecharCaderno;
  dialogo.querySelectorAll("[data-aba-caderno]").forEach(botao => {
    botao.onclick = () => {
      abaCaderno = botao.dataset.abaCaderno;
      renderCaderno();
      dialogo.querySelector(`[data-aba-caderno="${abaCaderno}"]`).focus();
    };
  });
  const conteudo = dialogo.querySelector("#conteudoCaderno");
  if (abaCaderno === "CONQUISTAS") {
    conteudo.innerHTML = `<p class="caderno-introducao">Pequenos objetivos para experimentar. Cuide, observe e veja suas histórias ganharem novas páginas.</p>
      <div class="conquistas-caderno">${CONQUISTAS_CADERNO.map(meta => {
        const conquista = livro.conquistas.find(c => c.id === meta.id);
        return `<article class="conquista-caderno ${conquista ? "concluida" : ""}">
          <span class="selo-conquista" aria-hidden="true">${conquista ? "✓" : "○"}</span>
          <div><h3>${meta.titulo}</h3><p>${meta.texto}</p>
          <small>${conquista ? `Conquistada no dia ${conquista.dia}` : "Para descobrir jogando"}</small></div></article>`;
      }).join("")}</div>`;
    return;
  }
  if (!livro.plantas.length) {
    conteudo.innerHTML = `<div class="caderno-vazio"><span aria-hidden="true">❧</span>
      <h3>A primeira página espera por uma semente</h3>
      <p>Plante em um vaso. Seu cultivo aparecerá aqui com retrato, geração e espaço para um nome.</p></div>`;
    return;
  }
  conteudo.innerHTML = `<p class="caderno-introducao">Retratos, nomes e lembranças dos seus cultivos. Novas páginas surgem conforme você planta, e as memórias ficam mesmo quando o vaso muda.</p>
    <div class="plantas-caderno">${[...livro.plantas].reverse().map(registro => {
      const p = registro.retrato;
      return `<button type="button" class="pagina-planta" data-planta-caderno="${escaparCaderno(registro.id)}">
        <div class="retrato-caderno" aria-hidden="true">${htmlPlantaProceduralV083(p)}</div>
        <span class="etiqueta-cuidado">${escaparCaderno(registro.local)}</span>
        <strong>${escaparCaderno(nomeRegistroCaderno(registro))}</strong>
        <span>Geração ${p.geracao} · ${escaparCaderno(NOMES_ESTAGIOS_CULTIVO[p.estagio] || p.estagio)}</span>
        <small>Conhecer esta história →</small></button>`;
    }).join("")}</div>`;
  conteudo.querySelectorAll("[data-planta-caderno]").forEach(botao => {
    botao.onclick = () => abrirPaginaCaderno(botao.dataset.plantaCaderno);
  });
}

function abrirPaginaCaderno(id) {
  const registro = garantirCaderno().plantas.find(p => p.id === id);
  if (!registro) return;
  const p = registro.retrato;
  const dialogo = document.querySelector("#cadernoDescobertas");
  const conteudo = dialogo.querySelector("#conteudoCaderno");
  conteudo.innerHTML = `<button type="button" id="voltarPaginasCaderno">← Minhas plantas</button>
    <article class="detalhe-caderno"><div class="retrato-caderno grande" aria-hidden="true">${htmlPlantaProceduralV083(p)}</div>
    <div><span class="etiqueta-cuidado">${escaparCaderno(registro.local)}</span>
      <h3>${escaparCaderno(nomeRegistroCaderno(registro))}</h3>
      <form id="nomeNoCaderno"><label for="nomePlantaCaderno">Nome no caderno</label>
        <div class="nome-caderno"><input id="nomePlantaCaderno" maxlength="40" value="${escaparCaderno(registro.nome)}" placeholder="Como você quer chamar esta planta?" autocomplete="off">
        <button type="submit">Guardar nome</button></div><span id="resultadoNomeCaderno" role="status"></span></form>
      <dl class="ficha-caderno"><div><dt>Ancestral</dt><dd>Semente ${escaparCaderno(NOMES_SEMENTES_V080[p.sementeBase] || p.sementeBase)}</dd></div>
        <div><dt>Geração</dt><dd>${p.geracao}</dd></div>
        <div><dt>Solo</dt><dd>${escaparCaderno(nomeSoloCaderno(p.solo))}</dd></div>
        <div><dt>Registrada pela primeira vez</dt><dd>Dia ${registro.primeiroRegistro.dia}</dd></div>
        <div><dt>Colheitas acompanhadas</dt><dd>${registro.colheitas}</dd></div></dl>
      <h4>De onde ela veio</h4><p class="genealogia-caderno">${(p.linhagem || []).map(g => `Geração ${g.geracao}`).join(" → ") || `Geração ${p.geracao}`}</p>
      <h4>Memórias do cultivo</h4><ul class="memorias-caderno">${registro.historico.map(texto => `<li>${escaparCaderno(texto)}</li>`).join("") || "<li>O começo desta história já está registrado.</li>"}</ul>
    </div></article>`;
  conteudo.querySelector("#voltarPaginasCaderno").onclick = renderCaderno;
  conteudo.querySelector("#nomeNoCaderno").onsubmit = evento => {
    evento.preventDefault();
    registro.nome = conteudo.querySelector("#nomePlantaCaderno").value.trim().replace(/\s+/g, " ").slice(0, 40);
    salvar();
    conteudo.querySelector("h3").textContent = nomeRegistroCaderno(registro);
    conteudo.querySelector("#resultadoNomeCaderno").textContent = "Nome guardado no seu caderno.";
  };
  conteudo.querySelector("#voltarPaginasCaderno").focus();
}

function atualizarBotaoCaderno() {
  let barra = document.querySelector("#atalhoCaderno");
  if (!barra) {
    barra = document.createElement("div");
    barra.id = "atalhoCaderno";
    barra.innerHTML = `<button type="button" id="abrirCaderno">Caderno de Descobertas <span></span></button>`;
    document.querySelector(".topo").after(barra);
    barra.querySelector("button").onclick = abrirCaderno;
  }
  const livro = garantirCaderno();
  barra.querySelector("span").textContent = `${livro.plantas.length} cultivo(s) · ${livro.conquistas.length} conquista(s)`;
}

const salvarAntesDoCaderno = salvar;
salvar = function() {
  atualizarCaderno();
  salvarAntesDoCaderno();
};
const renderAntesDoCaderno = render;
render = function() {
  renderAntesDoCaderno();
  atualizarBotaoCaderno();
};
salvar();
atualizarBotaoCaderno();
