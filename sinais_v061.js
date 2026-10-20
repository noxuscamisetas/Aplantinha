/*
==========================================================
A PLANTINHA — V0.6.1
SINAIS DO UNIVERSO
==========================================================

Tipos:

BUFF
ALERTA
EVENTO

Esta camada NÃO altera regras.
Apenas traduz estados internos em sinais visuais.
*/


const SINAIS_V061 = {

  SOLO_RICO: {
    tipo: "BUFF",
    icone: "🌱",
    texto: "Solo rico"
  },

  BEM_HIDRATADA: {
    tipo: "BUFF",
    icone: "💧",
    texto: "Bem hidratada"
  },

  REPOUSANDO: {
    tipo: "BUFF",
    icone: "🌙",
    texto: "Descansando"
  },

  SECA: {
    tipo: "ALERTA",
    icone: "⚠️",
    texto: "Precisa de água"
  },

  ENCHARCADA: {
    tipo: "ALERTA",
    icone: "💦",
    texto: "Água demais"
  },

  SAUDE_BAIXA: {
    tipo: "ALERTA",
    icone: "🩹",
    texto: "Planta debilitada"
  },

  COLHEITA: {
    tipo: "EVENTO",
    icone: "🌼",
    texto: "Colheita disponível"
  },

  SEMENTE_DNA: {
    tipo: "EVENTO",
    icone: "🧬",
    texto: "Semente-DNA disponível"
  },

  ADAPTACAO: {
    tipo: "EVENTO",
    icone: "✨",
    texto: "Algo mudou na semente"
  }

};


let ultimoEstadoSinaisV061 = {

  producaoPronta: null,

  sementeDisponivel: null,

  adaptacaoConhecida: false,

  regimeAgua: null,

  saude: null

};


/*
==========================================================
CRIAR ÁREA DOS SINAIS
==========================================================
*/


function criarAreaSinaisV061() {

  if (
    document.querySelector(
      "#areaSinaisV061"
    )
  ) {

    return;

  }


  const plantaArea =
    document.querySelector(
      ".planta-area"
    );


  if (!plantaArea) {
    return;
  }


  const area =
    document.createElement(
      "div"
    );


  area.id =
    "areaSinaisV061";


  area.className =
    "area-sinais-v061";


  plantaArea.appendChild(
    area
  );

}


/*
==========================================================
MOSTRAR SINAL
==========================================================
*/


function mostrarSinalV061(
  id,
  opcoes = {}
) {

  criarAreaSinaisV061();


  const modelo =
    SINAIS_V061[id];


  if (!modelo) {
    return;
  }


  const area =
    document.querySelector(
      "#areaSinaisV061"
    );


  if (!area) {
    return;
  }


  /*
  Evita duplicar sinal persistente.
  */

  const existente =
    area.querySelector(
      `[data-sinal="${id}"]`
    );


  if (
    existente
    &&
    opcoes.persistente
  ) {

    return;

  }


  const sinal =
    document.createElement(
      "div"
    );


  sinal.dataset.sinal =
    id;


  sinal.className =
    `
      sinal-v061
      sinal-${modelo.tipo.toLowerCase()}-v061
    `;


  sinal.innerHTML = `

    <span class="sinal-icone-v061">
      ${modelo.icone}
    </span>

    <span class="sinal-texto-v061">
      ${opcoes.texto || modelo.texto}
    </span>

  `;


  area.appendChild(
    sinal
  );


  if (
    !opcoes.persistente
  ) {

    setTimeout(
      () => {

        sinal.classList.add(
          "saindo"
        );

      },
      opcoes.duracao || 1600
    );


    setTimeout(
      () => {

        sinal.remove();

      },
      (opcoes.duracao || 1600)
      + 350
    );

  }

}


/*
==========================================================
REMOVER SINAL PERSISTENTE
==========================================================
*/


function removerSinalV061(
  id
) {

  document
    .querySelector(
      `[data-sinal="${id}"]`
    )
    ?.remove();

}


/*
==========================================================
BUFFS MOMENTÂNEOS
==========================================================
*/


function sinalizarCicloV061() {

  const solo =
    solos[
      estado.solo
    ];


  if (
    solo
    &&
    solo.nutricao >= 2
  ) {

    mostrarSinalV061(
      "SOLO_RICO"
    );

  }


  const agua =
    regimeAgua();


  if (
    agua === "ADEQUADA"
  ) {

    mostrarSinalV061(
      "BEM_HIDRATADA",
      {
        duracao: 1200
      }
    );

  }


  if (
    estado.luz === "LUA"
  ) {

    mostrarSinalV061(
      "REPOUSANDO",
      {
        duracao: 1200
      }
    );

  }

}


/*
==========================================================
ESTADOS PERSISTENTES
==========================================================
*/


function atualizarAlertasV061() {

  criarAreaSinaisV061();


  const agua =
    regimeAgua();


  /*
  SECA
  */

  if (
    agua === "SECA"
  ) {

    mostrarSinalV061(
      "SECA",
      {
        persistente: true
      }
    );

  }

  else {

    removerSinalV061(
      "SECA"
    );

  }


  /*
  ENCHARCAMENTO
  */

  if (
    agua === "EXCESSO"
  ) {

    mostrarSinalV061(
      "ENCHARCADA",
      {
        persistente: true
      }
    );

  }

  else {

    removerSinalV061(
      "ENCHARCADA"
    );

  }


  /*
  SAÚDE
  */

  if (
    estado.saude !== undefined
    &&
    estado.saude < 40
  ) {

    mostrarSinalV061(
      "SAUDE_BAIXA",
      {
        persistente: true
      }
    );

  }

  else {

    removerSinalV061(
      "SAUDE_BAIXA"
    );

  }


  /*
  COLHEITA
  */

  if (
    estado.estagio === "MADURA"
    &&
    estado.producaoPronta
    &&
    estado.saude >= 30
  ) {

    mostrarSinalV061(
      "COLHEITA",
      {
        persistente: true
      }
    );

  }

  else {

    removerSinalV061(
      "COLHEITA"
    );

  }


  /*
  SEMENTE-DNA
  */

  const podeSemente =
    (
      estado.estagio === "MADURA"

      &&

      !estado.sementeDnaGerada

      &&

      estado.saude >= 40
    );


  if (
    podeSemente
  ) {

    mostrarSinalV061(
      "SEMENTE_DNA",
      {
        persistente: true
      }
    );

  }

  else {

    removerSinalV061(
      "SEMENTE_DNA"
    );

  }

}


/*
==========================================================
DETECTAR NOVA ADAPTAÇÃO
==========================================================
*/


function verificarAdaptacaoV061() {

  if (
    !estado.sementeDNA
    ||
    !estado.sementeDNA.alteracoes
  ) {

    ultimoEstadoSinaisV061
      .adaptacaoConhecida = false;

    return;

  }


  const temAdaptacao =
    estado.sementeDNA
      .alteracoes
      .length > 0;


  if (
    temAdaptacao

    &&

    !ultimoEstadoSinaisV061
      .adaptacaoConhecida
  ) {

    mostrarSinalV061(
      "ADAPTACAO",
      {
        duracao: 3000,

        texto:
          "Nova característica na Semente-DNA!"
      }
    );

  }


  ultimoEstadoSinaisV061
    .adaptacaoConhecida =
      temAdaptacao;

}


/*
==========================================================
ENVOLVER CICLO
==========================================================
*/


const cicloAnteriorV061 =
  document
    .querySelector(
      "#btnCiclo"
    )
    .onclick;


document
  .querySelector(
    "#btnCiclo"
  )
  .onclick =
    function() {

      cicloAnteriorV061();

      sinalizarCicloV061();

      atualizarAlertasV061();

      verificarAdaptacaoV061();

    };


/*
==========================================================
ENVOLVER RENDER
==========================================================
*/


const renderAnteriorV061 =
  render;


render =
  function() {

    renderAnteriorV061();

    atualizarAlertasV061();

    verificarAdaptacaoV061();

  };


criarAreaSinaisV061();

render();
