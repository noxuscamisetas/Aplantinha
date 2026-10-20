/* Orientação e marcos do cuidado. Não concede recursos ou altera a biologia. */
const NOMES_ESTAGIOS_CULTIVO = {
  SEMENTE: "Semente", GERMINACAO: "Germinação", BROTO: "Broto",
  JOVEM: "Planta jovem", MADURA: "Planta madura"
};

function registrarNovidadeCultivo(cultivo, tipo, titulo, texto) {
  cultivo.ultimaNovidade = {
    tipo, titulo, texto, dia: estado.tempo.dia, hora: estado.tempo.hora
  };
}

function registrarMudancaCultivo(vaso, estagioAntes, tempo) {
  const c = vaso.cultivo;
  if (c.estagio === estagioAntes) return;
  const mensagens = {
    GERMINACAO: ["O primeiro sinal de vida", "A semente começou a germinar. O que estava escondido no solo está mudando."],
    BROTO: ["Olha, um broto!", "Sua planta atravessou mais uma etapa. Continue observando a água e as mudanças."],
    JOVEM: ["Ela está tomando forma", "O broto virou uma planta jovem. A história deste cultivo continua crescendo."],
    MADURA: ["Seu cuidado trouxe a planta até aqui", "Ela amadureceu. Com saúde suficiente, pode oferecer colheitas e uma Semente-DNA."]
  };
  const mensagem = mensagens[c.estagio];
  if (!mensagem) return;
  registrarNovidadeCultivo(c, "CRESCIMENTO", ...mensagem);
  const registro = `Dia ${tempo.dia}, ${String(tempo.hora).padStart(2, "0")}h · Vaso ${vaso.id}: ${NOMES_ESTAGIOS_CULTIVO[c.estagio]}.`;
  c.historico ??= [];
  c.historico.unshift(registro);
  log(registro);
}

function abrirInventarioDoCuidado(aba) {
  abaV0861 = aba;
  renderInventarioOperacionalV0861();
}

function proximoCuidado() {
  const vasos = estado.quartoV080.vasos.filter(v => v.cultivo);
  const urgente = vasos.find(v => v.cultivo.umidade < 25 || v.cultivo.saude < 30);
  if (urgente) return {
    titulo: "Uma planta precisa do seu cuidado",
    texto: `Observe o Vaso ${urgente.id}. Água na medida e tempo ajudam a planta a se recuperar.`,
    acao: "Visitar a planta", vaso: urgente.id
  };
  const pronta = vasos.find(v => v.cultivo.producaoPronta && v.cultivo.saude >= 30);
  if (pronta) return {
    titulo: "Tem uma colheita esperando por você",
    texto: `O Vaso ${pronta.id} está pronto para colher. Frutos e flores podem virar moedas e resíduos para novos solos.`,
    acao: "Ver a colheita", vaso: pronta.id
  };
  const madura = vasos.find(v => v.cultivo.estagio === "MADURA" && v.cultivo.saude >= 40 && !v.cultivo.sementeDnaGerada);
  if (madura) return {
    titulo: "E se você plantar a próxima geração?",
    texto: `A planta do Vaso ${madura.id} pode oferecer sua Semente-DNA. A descendente leva essa história adiante.`,
    acao: "Visitar a planta", vaso: madura.id
  };
  if (vasos.length) return {
    titulo: "Devagar, alguma coisa muda",
    texto: "Observe a água, cuide da planta e avance um período. Cada vaso pode viver uma história diferente.",
    acao: "Acompanhar cultivo", vaso: vasos[0].id
  };
  const livre = estado.quartoV080.vasos.find(v => v.desbloqueado && !v.cultivo);
  if (livre && sementesDisponiveisV080().length && solosDisponiveisV080().length) return {
    titulo: "Uma semente. Um começo.",
    texto: "Escolha uma semente, prepare o vaso e descubra o que acontece quando você cuida dela.",
    acao: "Preparar um vaso", vaso: livre.id
  };
  const jardim = estado.jardimV088?.slots.some(s => s.cultivo);
  return {
    titulo: jardim ? "Sua história está no Jardim" : "O próximo começo está nos seus materiais",
    texto: jardim ? "Os cultivos do Jardim estão em espera. Devolva uma planta a um vaso para continuar cuidando."
      : "Confira suas sementes e solos. O armário guarda materiais, e a lojinha oferece solo para novos cultivos.",
    acao: "Conferir inventário", aba: "SEMENTES"
  };
}

function atualizarExperienciaCultivo() {
  document.querySelector("#guiaCultivo")?.remove();
  document.querySelector("#momentoCultivo")?.remove();
  const raiz = document.querySelector("#universoLaboratorioV081");
  if (!raiz) return;
  if (ambienteAtualV081 === "LABORATORIO") {
    const dica = proximoCuidado();
    const guia = document.createElement("section");
    guia.id = "guiaCultivo";
    guia.className = "guia-cultivo";
    guia.setAttribute("aria-labelledby", "tituloGuiaCultivo");
    guia.innerHTML = `<div><span class="etiqueta-cuidado">CUIDAR · OBSERVAR · DESCOBRIR</span>
      <h2 id="tituloGuiaCultivo"></h2><p></p></div><button type="button"></button>`;
    guia.querySelector("h2").textContent = dica.titulo;
    guia.querySelector("p").textContent = dica.texto;
    const botao = guia.querySelector("button");
    botao.textContent = dica.acao;
    botao.onclick = () => dica.vaso ? irEstacaoV081(dica.vaso) : abrirInventarioDoCuidado(dica.aba);
    raiz.prepend(guia);
  }
  if (ambienteAtualV081 === "ESTACAO") {
    const c = cultivoDoVaso(vasoSelecionadoV081);
    const cena = document.querySelector(".cena-planta-v084");
    if (!c || !cena) return;
    cena.dataset.baseSemente = c.base;
    const estagio = cena.querySelector(".estagio-planta-v084");
    if (estagio) estagio.textContent = NOMES_ESTAGIOS_CULTIVO[c.estagio] || c.estagio;
    const novidade = c.ultimaNovidade;
    if (novidade) {
      const momento = document.createElement("aside");
      momento.id = "momentoCultivo";
      momento.className = "momento-cultivo";
      momento.setAttribute("role", "status");
      momento.innerHTML = `<span class="etiqueta-cuidado">ACONTECEU NESTE CULTIVO</span><strong></strong><p></p>`;
      momento.querySelector("strong").textContent = novidade.titulo;
      momento.querySelector("p").textContent = novidade.texto;
      if (novidade.tipo === "COLHEITA" || novidade.tipo === "DNA") {
        const ver = document.createElement("button");
        ver.type = "button";
        ver.textContent = novidade.tipo === "DNA" ? "Examinar a Semente-DNA" : "Ver frutos e flores";
        ver.onclick = () => abrirInventarioDoCuidado(novidade.tipo === "DNA" ? "SEMENTES" : "COLHEITA");
        momento.appendChild(ver);
      }
      cena.appendChild(momento);
    }
  }
}

const eventosAntesDaExperiencia = instalarEventosV081;
instalarEventosV081 = function() {
  eventosAntesDaExperiencia();
  atualizarExperienciaCultivo();
};
atualizarExperienciaCultivo();
