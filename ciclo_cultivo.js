/* Liga produção e herança ao cultivo físico, sem usar a planta global legada.
   Regras de produção/saúde/herança preservadas de app.js e health_v042.js. */

function cultivoDoVaso(vasoId) {
  return estado.quartoV080?.vasos.find(vaso => vaso.id === vasoId)?.cultivo;
}

function retratoDoCultivo(cultivo) {
  const tempo = tempoGlobalV080();
  return {
    id: cultivo.id,
    geracao: cultivo.geracao,
    sementeBase: cultivo.base,
    cor: SEMENTES_V060[cultivo.base]?.cor || cultivo.base,
    dna: structuredClone(cultivo.dna),
    saude: cultivo.saude,
    idade: cultivo.idade ?? cultivo.passosAmbientais,
    solo: cultivo.solo,
    luz: tempo.luz === "SOL" ? "NATURAL" : "LUA",
    umidade: cultivo.umidade,
    dia: tempo.dia,
    hora: tempo.hora
  };
}

function colherCultivo(vasoId) {
  const cultivo = cultivoDoVaso(vasoId);
  if (!cultivo || cultivo.estagio !== "MADURA"
      || cultivo.saude < 30 || !cultivo.producaoPronta) return false;

  const retrato = retratoDoCultivo(cultivo);
  let frutos = Number(cultivo.umidade >= 25 && cultivo.umidade <= 78)
    + Number(cultivo.dna.vigor >= 2);
  let flores = Number(retrato.luz === "NATURAL");
  if (cultivo.saude < 55) frutos = Math.max(0, frutos - 1);
  if (cultivo.saude < 45) flores = Math.max(0, flores - 1);

  cultivo.producaoPronta = false;
  cultivo.ciclosDesdeColheita = 0;
  for (const [tipo, quantidade] of [["FRUTO", frutos], ["FLOR", flores]]) {
    estado.inventario[tipo] = (estado.inventario[tipo] || 0) + quantidade;
    for (let i = 0; i < quantidade; i++) {
      criarObjetoColheitaV071(tipo, { cultivoId: cultivo.id, vaso: vasoId }, retrato);
    }
  }
  const mensagem = `Vaso ${vasoId}: colheita de ${frutos} fruto(s) e ${flores} flor(es).`;
  cultivo.historico ??= [];
  cultivo.historico.unshift(mensagem);
  log(mensagem);
  if (frutos + flores > 0 && typeof registrarColheitaCaderno === "function") {
    registrarColheitaCaderno(cultivo, frutos, flores);
  }
  if (typeof registrarNovidadeCultivo === "function") {
    registrarNovidadeCultivo(cultivo, "COLHEITA", "O cuidado virou colheita",
      `${frutos} fruto(s) e ${flores} flor(es) no inventário. A planta continua viva e pode produzir de novo.`);
  }
  sincronizarTodasV083();
  salvar();
  render();
  return true;
}

function gerarSementeDoCultivo(vasoId) {
  const cultivo = cultivoDoVaso(vasoId);
  if (!cultivo || cultivo.estagio !== "MADURA"
      || cultivo.saude < 40 || cultivo.sementeDnaGerada) return false;

  const dna = structuredClone(cultivo.dna);
  const historia = cultivo.contadoresVida || {};
  const alteracoes = [];
  for (const [campo, nome] of [["sombra", "ADAPTACAO_SOMBRA"], ["seca", "ADAPTACAO_SECA"]]) {
    if ((historia[campo] || 0) >= 3 && (dna[campo] || 0) < 3) {
      dna[campo] = (dna[campo] || 0) + 1;
      alteracoes.push(nome);
    }
  }
  const geracao = (cultivo.geracao || 0) + 1;
  const id = novoIdInventarioV070("SD");
  const linhagem = structuredClone(cultivo.linhagem || cultivo.plantaV083?.linhagem || []);
  linhagem.push({ geracao, origem: cultivo.base, dna: structuredClone(dna),
    plantaMae: cultivo.id, sementeId: id, alteracoes: [...alteracoes] });
  const semente = {
    id, tipo: "SEMENTE_DNA", categoria: "SEMENTES", icone: "🧬",
    nome: `Semente-DNA G${geracao}`, localizacao: "INVENTARIO",
    sementeBase: cultivo.base, ancestral: SEMENTES_V060[cultivo.base]?.cor || cultivo.base,
    geracao, dna, alteracoes, linhagem,
    historiaMae: { ...structuredClone(historia), idade: cultivo.idade ?? cultivo.passosAmbientais,
      saudeFinal: cultivo.saude, cultivoId: cultivo.id },
    procedencia: { cultivoId: cultivo.id, vaso: vasoId, dia: estado.tempo.dia,
      hora: estado.tempo.hora }
  };
  // Marcar antes de salvar o objeto impede duplicação ao recarregar/renderizar.
  cultivo.sementeDnaGerada = true;
  cultivo.sementeDNA = structuredClone(semente);
  adicionarItemIndividualV070(semente);
  log(`Vaso ${vasoId}: Semente-DNA G${geracao} guardada no inventário.`);
  if (typeof registrarNovidadeCultivo === "function") {
    registrarNovidadeCultivo(cultivo, "DNA", "Uma história pode continuar",
      `A Semente-DNA G${geracao} carrega a linhagem desta planta. Você pode plantá-la em outro vaso.`);
  }
  sincronizarTodasV083();
  salvar();
  render();
  return true;
}

function instalarAcoesDoCultivo() {
  if (ambienteAtualV081 !== "ESTACAO") return;
  const cultivo = cultivoDoVaso(vasoSelecionadoV081);
  const controles = document.querySelector(".controles-estacao-v084");
  if (!cultivo || !controles) return;
  document.querySelector("#producaoCultivo")?.remove();
  const area = document.createElement("section");
  area.id = "producaoCultivo";
  area.className = "controle-bloco-v084 producao-cultivo";
  const madura = cultivo.estagio === "MADURA";
  const status = !madura ? "A produção começa quando a planta amadurecer."
    : cultivo.saude < 30 ? "Cuide da planta para ela voltar a produzir."
    : cultivo.producaoPronta ? "Sua planta tem uma colheita pronta."
    : `Faltam ${Math.max(0, 3 - (cultivo.ciclosDesdeColheita || 0))} período(s) com saúde suficiente para uma nova colheita.`;
  area.innerHTML = `<strong>🌼 Colheita e descendência</strong>
    <p role="status">${status}</p>
    <div class="acoes-producao-cultivo">
      <button type="button" id="colherCultivo" ${!madura || cultivo.saude < 30 || !cultivo.producaoPronta ? "disabled" : ""}>🌼 Colher</button>
      <button type="button" id="sementeCultivo" ${!madura || cultivo.saude < 40 || cultivo.sementeDnaGerada ? "disabled" : ""}>🧬 ${cultivo.sementeDnaGerada ? "Semente-DNA já fornecida" : "Gerar Semente-DNA"}</button>
    </div>`;
  const vasoId = vasoSelecionadoV081;
  area.querySelector("#colherCultivo").onclick = () => colherCultivo(vasoId);
  area.querySelector("#sementeCultivo").onclick = () => gerarSementeDoCultivo(vasoId);
  controles.appendChild(area);
}

function atualizarTituloDoUniverso() {
  const titulo = document.querySelector("#linhagemTopo");
  if (!titulo) return;
  const cultivo = ambienteAtualV081 === "ESTACAO" ? cultivoDoVaso(vasoSelecionadoV081) : null;
  titulo.textContent = cultivo
    ? `${nomeSementeV081(cultivo)} • geração ${cultivo.geracao || 0}`
    : "Cada cultivo tem sua história";
}

const eventosAntesDoCicloCultivo = instalarEventosV081;
instalarEventosV081 = function() {
  eventosAntesDoCicloCultivo();
  instalarAcoesDoCultivo();
  atualizarTituloDoUniverso();
};

const renderAntesDoCicloCultivo = render;
render = function() {
  renderAntesDoCicloCultivo();
  atualizarTituloDoUniverso();
};

// Saves anteriores já maduros nunca tiveram os campos de produção no cultivo.
// Inicializar somente os campos ausentes preserva colheitas e DNA já usados.
for (const recipiente of [...(estado.quartoV080?.vasos || []), ...(estado.jardimV088?.slots || [])]) {
  const cultivo = recipiente.cultivo;
  if (!cultivo) continue;
  cultivo.producaoPronta ??= cultivo.plantaV083?.producaoPronta
    || (cultivo.estagio === "MADURA" && cultivo.saude >= 30);
  cultivo.ciclosDesdeColheita ??= cultivo.plantaV083?.ciclosDesdeColheita || 0;
  cultivo.sementeDnaGerada ??= cultivo.plantaV083?.sementeDnaGerada || false;
  cultivo.sementeDNA ??= cultivo.plantaV083?.sementeDNA || null;
}
sincronizarTodasV083();
salvar();
render();
