const SAVE_KEY = "aplantinha_v04";


const SEMENTES_BASE = {
  S1: { vigor: 2, sombra: 1, seca: 0 },
  S2: { vigor: 1, sombra: 2, seca: 0 },
  S3: { vigor: 1, sombra: 0, seca: 2 },
  S4: { vigor: 2, sombra: 0, seca: 1 },
  S5: { vigor: 1, sombra: 1, seca: 1 }
};


const estagios = [
  "SEMENTE",
  "GERMINACAO",
  "BROTO",
  "JOVEM",
  "MADURA"
];


const limites = [
  0,
  5,
  12,
  22,
  35
];


const solos = {

  COMUM: {
    crescimento: 1,
    retencao: 1,
    nutricao: 0,
    consumoAgua: 11
  },

  MINERAL: {
    crescimento: 2,
    retencao: 0,
    nutricao: 0,
    consumoAgua: 15
  },

  ORGANICO: {
    crescimento: 1,
    retencao: 2,
    nutricao: 1,
    consumoAgua: 7
  },

  ADITIVADO_CASCA: {
    crescimento: 2,
    retencao: 1,
    nutricao: 2,
    consumoAgua: 9
  },

  ADITIVADO_PETALA: {
    crescimento: 1,
    retencao: 2,
    nutricao: 2,
    consumoAgua: 6
  }

};


const luzValor = {
  SOMBRA: 0,
  NATURAL: 1,
  ARTIFICIAL_FRACA: 1,
  ARTIFICIAL_FORTE: 2
};


function estadoInicial() {

  return {

    versao: "0.4",

    moedas: 30,

    sementeBase: "S1",

    geracao: 0,

    dna: structuredClone(
      SEMENTES_BASE.S1
    ),

    idade: 0,
    energia: 0,

    estagio: "SEMENTE",
    indiceEstagio: 0,

    solo: "COMUM",

    umidade: 55,

    luz: "NATURAL",

    producaoPronta: false,
    ciclosDesdeColheita: 0,

    sementeDnaGerada: false,
    sementeDNA: null,

    contadoresVida: {
      sombra: 0,
      seca: 0,
      soloRico: 0,
      excessoAgua: 0,
      luzForte: 0
    },

    inventario: {

      FRUTO: 0,
      FLOR: 0,

      CASCA: 0,
      PETALA: 0,

      SOLO_COMUM: 1,
      SOLO_MINERAL: 0,
      SOLO_ORGANICO: 0,

      SOLO_ADITIVADO_CASCA: 0,
      SOLO_ADITIVADO_PETALA: 0,

      LAMPADA_FRACA: 0,
      LAMPADA_FORTE: 0
    },

    historico: [
      "Um novo universo aguarda seu primeiro cultivo."
    ],

    linhagem: [
      {
        geracao: 0,
        dna: structuredClone(
          SEMENTES_BASE.S1
        ),
        origem: "S1"
      }
    ]
  };

}


let estado;


function salvar() {

  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify(estado)
  );

}


function carregar() {

  const bruto =
    localStorage.getItem(
      SAVE_KEY
    );

  if (!bruto) {

    estado = estadoInicial();

    salvar();

    return;

  }

  try {

    estado =
      JSON.parse(bruto);

  } catch {

    estado =
      estadoInicial();

  }

  salvar();

}


function reiniciar() {

  const confirmar =
    confirm(
      "Reiniciar todo o universo salvo?"
    );

  if (!confirmar) {
    return;
  }

  localStorage.removeItem(
    SAVE_KEY
  );

  estado =
    estadoInicial();

  salvar();

  render();

}


function log(msg) {

  estado.historico.unshift(
    msg
  );

  estado.historico =
    estado.historico.slice(
      0,
      120
    );

}


function regimeAgua() {

  if (
    estado.umidade < 25
  ) {

    return "SECA";

  }

  if (
    estado.umidade > 78
  ) {

    return "EXCESSO";

  }

  return "ADEQUADA";

}


function regar() {

  const antes =
    estado.umidade;

  estado.umidade =
    Math.min(
      100,
      estado.umidade + 28
    );

  const ganho =
    estado.umidade - antes;

  log(
    `Você regou o vaso: +${ganho}% de umidade.`
  );

  salvar();

  render();

}


function consumirAgua() {

  const solo =
    solos[estado.solo];

  let consumo =
    solo.consumoAgua;


  if (
    estado.luz === "ARTIFICIAL_FORTE"
  ) {

    consumo += 3;

  }


  if (
    estado.luz === "SOMBRA"
  ) {

    consumo -= 2;

  }


  consumo =
    Math.max(
      2,
      consumo
    );


  estado.umidade =
    Math.max(
      0,
      estado.umidade - consumo
    );

}


function atualizarEstagio() {

  let novo =
    estado.indiceEstagio;

  limites.forEach(
    (limite, i) => {

      if (
        estado.energia >= limite
      ) {

        novo = i;

      }

    }
  );


  if (
    novo >
    estado.indiceEstagio
  ) {

    estado.indiceEstagio =
      novo;

    estado.estagio =
      estagios[novo];

    log(
      `Novo estágio: ${estado.estagio}`
    );


    if (
      estado.estagio === "MADURA"
    ) {

      estado.producaoPronta =
        true;

      estado.ciclosDesdeColheita =
        0;

    }

  }

}


function ciclo() {

  estado.idade++;

  consumirAgua();

  const solo =
    solos[estado.solo];

  const agua =
    regimeAgua();

  let ganho =
    solo.crescimento;


  if (
    solo.nutricao >= 2
  ) {

    estado.contadoresVida
      .soloRico++;

  }


  if (
    agua === "ADEQUADA"
  ) {

    ganho += 2;

  }


  if (
    agua === "EXCESSO"
  ) {

    ganho +=
      solo.retencao - 1;

    estado.contadoresVida
      .excessoAgua++;

    log(
      "O solo está encharcado."
    );

  }


  if (
    agua === "SECA"
  ) {

    ganho -= 2;

    estado.contadoresVida
      .seca++;

    log(
      "A planta passou por seca."
    );

  }


  ganho +=
    luzValor[
      estado.luz
    ];


  ganho +=
    estado.dna.vigor;


  if (
    estado.luz === "SOMBRA"
  ) {

    ganho +=
      estado.dna.sombra;

    estado.contadoresVida
      .sombra++;

  }


  if (
    estado.luz === "ARTIFICIAL_FORTE"
  ) {

    estado.contadoresVida
      .luzForte++;

  }


  if (
    agua === "SECA"
  ) {

    ganho +=
      estado.dna.seca;

  }


  estado.energia +=
    Math.max(
      0,
      ganho
    );


  atualizarEstagio();


  if (
    estado.estagio === "MADURA"
    &&
    !estado.producaoPronta
  ) {

    estado.ciclosDesdeColheita++;

    if (
      estado.ciclosDesdeColheita
      >= 3
    ) {

      estado.producaoPronta =
        true;

      estado.ciclosDesdeColheita =
        0;

      log(
        "A planta produziu novamente."
      );

    }

  }


  log(
    `Ciclo ${estado.idade} — ${estado.luz}, umidade ${estado.umidade}%`
  );


  salvar();

  render();

}


function calcularFenotipo() {

  const dna =
    estado.dna;

  const solo =
    solos[estado.solo];

  const sombras =
    estado.contadoresVida.sombra;

  const secas =
    estado.contadoresVida.seca;

  const soloRico =
    estado.contadoresVida.soloRico;

  const excessoAgua =
    estado.contadoresVida.excessoAgua;


  let altura =
    125
    +
    dna.vigor * 18
    +
    solo.crescimento * 8;

  altura -=
    Math.min(
      secas * 3,
      28
    );

  altura +=
    Math.min(
      soloRico * 1.5,
      20
    );


  let caule =
    8
    +
    dna.vigor * 3
    +
    solo.nutricao * 2;


  let larguraFolha =
    42
    +
    dna.sombra * 12
    +
    Math.min(
      sombras * 1.2,
      16
    )
    -
    dna.seca * 5;


  larguraFolha =
    Math.max(
      26,
      larguraFolha
    );


  let comprimentoFolha =
    52
    +
    dna.vigor * 6
    +
    dna.seca * 6
    +
    Math.min(
      soloRico,
      12
    );


  let hue =
    112
    +
    dna.sombra * 7
    -
    dna.seca * 5
    +
    solo.nutricao * 4
    +
    Math.min(
      sombras * .6,
      8
    );


  let saturacao =
    42
    +
    dna.vigor * 7
    +
    solo.nutricao * 5
    -
    Math.min(
      secas * 2,
      18
    );


  let luminosidade =
    38
    +
    solo.nutricao * 4
    -
    Math.min(
      secas * 1.2,
      12
    )
    +
    Math.min(
      excessoAgua * .5,
      5
    );


  let folhas =
    4
    +
    dna.vigor;


  if (
    estado.estagio === "MADURA"
  ) {

    folhas += 2;

  }


  folhas +=
    Math.min(
      Math.floor(
        soloRico / 4
      ),
      2
    );


  let angulo =
    28
    +
    dna.sombra * 5
    -
    dna.seca * 3;


  let formaFolha =
    "normal";


  if (
    dna.sombra >= 2
    &&
    dna.seca <= 1
  ) {

    formaFolha =
      "larga";

  }


  if (
    dna.seca >= 2
  ) {

    formaFolha =
      "estreita";

  }


  let inclinacao =
    0;


  if (
    estado.luz === "SOMBRA"
  ) {

    inclinacao =
      -4;

  }


  if (
    estado.luz ===
    "ARTIFICIAL_FORTE"
  ) {

    inclinacao =
      5;

  }


  let estresse =
    0;


  if (
    regimeAgua() === "SECA"
  ) {

    estresse += 3;

  }


  if (
    regimeAgua() === "EXCESSO"
  ) {

    estresse += 2;

  }


  estresse +=
    Math.min(
      secas,
      4
    );


  const floracaoVisual =
    estado.estagio === "MADURA"
    &&
    estado.producaoPronta;


  return {

    altura:
      Math.round(altura),

    caule:
      Math.round(caule),

    larguraFolha:
      Math.round(larguraFolha),

    comprimentoFolha:
      Math.round(comprimentoFolha),

    folhas:
      Math.max(
        2,
        Math.min(
          folhas,
          10
        )
      ),

    hue:
      Math.round(hue),

    saturacao:
      Math.round(saturacao),

    luminosidade:
      Math.round(luminosidade),

    angulo:
      Math.round(angulo),

    inclinacao,

    formaFolha,

    estresse,

    floracaoVisual
  };

}


function colher() {

  if (
    estado.estagio !== "MADURA"
  ) {

    log(
      "A planta ainda não está madura."
    );

    render();

    return;

  }


  if (
    !estado.producaoPronta
  ) {

    log(
      "Ainda não há nova produção."
    );

    render();

    return;

  }


  let frutos = 0;
  let flores = 0;


  if (
    regimeAgua() === "ADEQUADA"
  ) {

    frutos++;

  }


  if (
    estado.dna.vigor >= 2
  ) {

    frutos++;

  }


  if (
    estado.luz === "NATURAL"
    ||
    estado.luz ===
    "ARTIFICIAL_FORTE"
  ) {

    flores++;

  }


  if (
    estado.luz === "SOMBRA"
    &&
    estado.dna.sombra >= 2
  ) {

    flores++;

  }


  estado.inventario.FRUTO +=
    frutos;

  estado.inventario.FLOR +=
    flores;


  estado.producaoPronta =
    false;

  estado.ciclosDesdeColheita =
    0;


  log(
    `Colheita: ${frutos} fruto(s), ${flores} flor(es).`
  );


  salvar();

  render();

}


function gerarSementeDNA() {

  if (
    estado.estagio !== "MADURA"
  ) {

    log(
      "A planta ainda não está madura."
    );

    render();

    return;

  }


  if (
    estado.sementeDnaGerada
  ) {

    log(
      "Esta planta já forneceu sua Semente-DNA."
    );

    render();

    return;

  }


  const novoDNA =
    structuredClone(
      estado.dna
    );


  const alteracoes = [];


  if (
    estado.contadoresVida.sombra
    >= 3
    &&
    novoDNA.sombra < 3
  ) {

    novoDNA.sombra++;

    alteracoes.push(
      "ADAPTACAO_SOMBRA"
    );

  }


  if (
    estado.contadoresVida.seca
    >= 3
    &&
    novoDNA.seca < 3
  ) {

    novoDNA.seca++;

    alteracoes.push(
      "ADAPTACAO_SECA"
    );

  }


  estado.sementeDNA = {

    sementeBase:
      estado.sementeBase,

    geracao:
      estado.geracao + 1,

    dna:
      novoDNA,

    alteracoes,

    historiaMae: {
      idade:
        estado.idade,

      sombra:
        estado.contadoresVida.sombra,

      seca:
        estado.contadoresVida.seca,

      soloRico:
        estado.contadoresVida.soloRico,

      excessoAgua:
        estado.contadoresVida.excessoAgua,

      luzForte:
        estado.contadoresVida.luzForte
    }

  };


  estado.sementeDnaGerada =
    true;


  if (
    alteracoes.length
  ) {

    log(
      "Semente-DNA produzida: "
      +
      alteracoes.join(", ")
    );

  }

  else {

    log(
      "Semente-DNA produzida sem alteração hereditária."
    );

  }


  salvar();

  render();

}


function vender(tipo) {

  if (
    estado.inventario[tipo]
    <= 0
  ) {

    log(
      `Você não possui ${tipo}.`
    );

    render();

    return;

  }


  estado.inventario[tipo]--;


  if (
    tipo === "FRUTO"
  ) {

    estado.moedas += 5;

    estado.inventario.CASCA++;

    log(
      "Fruto vendido por 5 moedas."
    );

  }


  if (
    tipo === "FLOR"
  ) {

    estado.moedas += 4;

    estado.inventario.PETALA++;

    log(
      "Flor vendida por 4 moedas."
    );

  }


  salvar();

  render();

}


function produzirSolo(tipo) {

  const residuo =
    tipo === "CASCA"
      ? "CASCA"
      : "PETALA";


  const destino =
    tipo === "CASCA"
      ? "SOLO_ADITIVADO_CASCA"
      : "SOLO_ADITIVADO_PETALA";


  if (
    estado.inventario[residuo]
    < 1
  ) {

    log(
      `Falta ${residuo}.`
    );

    render();

    return;

  }


  if (
    estado.inventario.SOLO_COMUM
    < 1
  ) {

    log(
      "Falta SOLO_COMUM."
    );

    render();

    return;

  }


  estado.inventario[residuo]--;

  estado.inventario.SOLO_COMUM--;

  estado.inventario[destino]++;


  log(
    `${destino} produzido.`
  );


  salvar();

  render();

}


function comprar(
  item,
  preco
) {

  if (
    estado.moedas < preco
  ) {

    log(
      "Moedas insuficientes."
    );

    render();

    return;

  }


  estado.moedas -=
    preco;


  estado.inventario[item] =
    (
      estado.inventario[item]
      || 0
    )
    + 1;


  log(
    `${item} comprado.`
  );


  salvar();

  render();

}


function mudarLuz() {

  const opcoes = [
    "SOMBRA",
    "NATURAL"
  ];


  if (
    estado.inventario
      .LAMPADA_FRACA > 0
  ) {

    opcoes.push(
      "ARTIFICIAL_FRACA"
    );

  }


  if (
    estado.inventario
      .LAMPADA_FORTE > 0
  ) {

    opcoes.push(
      "ARTIFICIAL_FORTE"
    );

  }


  let atual =
    opcoes.indexOf(
      estado.luz
    );


  if (
    atual === -1
  ) {

    atual = 0;

  }


  estado.luz =
    opcoes[
      (
        atual + 1
      )
      %
      opcoes.length
    ];


  log(
    `Luz alterada para ${estado.luz}.`
  );


  salvar();

  render();

}


function abrirModalDescendente() {

  if (
    !estado.sementeDNA
  ) {

    log(
      "Nenhuma Semente-DNA disponível."
    );

    render();

    return;

  }


  const container =
    document.querySelector(
      "#solosDisponiveis"
    );


  const mapa = {

    SOLO_COMUM:
      "COMUM",

    SOLO_MINERAL:
      "MINERAL",

    SOLO_ORGANICO:
      "ORGANICO",

    SOLO_ADITIVADO_CASCA:
      "ADITIVADO_CASCA",

    SOLO_ADITIVADO_PETALA:
      "ADITIVADO_PETALA"

  };


  const opcoes = [];


  Object.entries(
    mapa
  ).forEach(
    ([item, soloInterno]) => {

      if (
        estado.inventario[item]
        > 0
      ) {

        opcoes.push({
          item,
          soloInterno
        });

      }

    }
  );


  if (
    opcoes.length === 0
  ) {

    container.innerHTML =
      `
      <div class="texto-ajuda">
        Você não possui nenhum solo disponível.
      </div>
      `;

  }

  else {

    container.innerHTML =
      opcoes
        .map(
          opcao =>
          `
          <button
            data-solo-item="${opcao.item}"
            data-solo-interno="${opcao.soloInterno}"
          >
            ${opcao.item}
          </button>
          `
        )
        .join("");


    container
      .querySelectorAll(
        "[data-solo-item]"
      )
      .forEach(
        botao => {

          botao.onclick =
            () => {

              plantarDescendente(
                botao.dataset
                  .soloItem,

                botao.dataset
                  .soloInterno
              );

            };

        }
      );

  }


  document
    .querySelector(
      "#modalDescendente"
    )
    .classList
    .remove(
      "escondido"
    );

}


function fecharModalDescendente() {

  document
    .querySelector(
      "#modalDescendente"
    )
    .classList
    .add(
      "escondido"
    );

}


function plantarDescendente(
  itemSolo,
  soloInterno
) {

  const semente =
    estado.sementeDNA;


  if (!semente) {

    fecharModalDescendente();

    return;

  }


  if (
    estado.inventario[itemSolo]
    < 1
  ) {

    log(
      "Solo não disponível."
    );

    fecharModalDescendente();

    render();

    return;

  }


  estado.inventario[itemSolo]--;


  estado.linhagem.push({

    geracao:
      semente.geracao,

    dna:
      structuredClone(
        semente.dna
      ),

    origem:
      estado.sementeBase,

    alteracoes:
      structuredClone(
        semente.alteracoes
      )

  });


  const moedas =
    estado.moedas;

  const inventario =
    structuredClone(
      estado.inventario
    );

  const historicoAntigo =
    structuredClone(
      estado.historico
    );

  const linhagem =
    structuredClone(
      estado.linhagem
    );


  estado = {

    versao: "0.4",

    moedas,

    sementeBase:
      semente.sementeBase,

    geracao:
      semente.geracao,

    dna:
      structuredClone(
        semente.dna
      ),

    idade: 0,

    energia: 0,

    estagio:
      "SEMENTE",

    indiceEstagio: 0,

    solo:
      soloInterno,

    umidade:
      55,

    luz:
      "NATURAL",

    producaoPronta:
      false,

    ciclosDesdeColheita:
      0,

    sementeDnaGerada:
      false,

    sementeDNA:
      null,

    contadoresVida: {
      sombra: 0,
      seca: 0,
      soloRico: 0,
      excessoAgua: 0,
      luzForte: 0
    },

    inventario,

    historico: [
      `Geração ${semente.geracao} plantada em ${soloInterno}.`,
      ...historicoAntigo
    ],

    linhagem

  };


  salvar();

  fecharModalDescendente();

  render();

}


function folhaHTML(
  indice,
  fenotipo
) {

  const lado =
    indice % 2 === 0
      ? -1
      : 1;


  const nivel =
    Math.floor(
      indice / 2
    );


  const top =
    28
    +
    nivel * 31;


  const rotacao =
    lado *
    (
      fenotipo.angulo
      +
      nivel * 2
    );


  const origem =
    lado === -1
      ? "right center"
      : "left center";


  return `
    <div
      class="
        folha
        folha-${fenotipo.formaFolha}
      "
      style="
        --folha-w:${fenotipo.comprimentoFolha}px;
        --folha-h:${fenotipo.larguraFolha}px;
        --folha-hue:${fenotipo.hue};
        --folha-sat:${fenotipo.saturacao}%;
        --folha-light:${fenotipo.luminosidade}%;
        top:${top}px;
        ${lado === -1 ? "right" : "left"}:
          ${fenotipo.caule - 1}px;
        transform:
          rotate(${rotacao}deg);
        transform-origin:${origem};
      "
    ></div>
  `;

}


function renderPlanta() {

  const el =
    document.querySelector(
      "#plantaVisual"
    );


  if (
    estado.estagio ===
    "SEMENTE"
  ) {

    el.innerHTML =
      `
      <div class="semente-v3"></div>
      `;

    return;

  }


  const fenotipo =
    calcularFenotipo();


  let escala = .36;


  if (
    estado.estagio ===
    "GERMINACAO"
  ) {

    escala = .28;

  }


  if (
    estado.estagio ===
    "BROTO"
  ) {

    escala = .48;

  }


  if (
    estado.estagio ===
    "JOVEM"
  ) {

    escala = .76;

  }


  if (
    estado.estagio ===
    "MADURA"
  ) {

    escala = 1;

  }


  let folhasHTML = "";


  const quantidadeFolhas =
    Math.max(
      2,
      Math.round(
        fenotipo.folhas
        *
        Math.max(
          escala,
          .4
        )
      )
    );


  for (
    let i = 0;
    i < quantidadeFolhas;
    i++
  ) {

    folhasHTML +=
      folhaHTML(
        i,
        fenotipo
      );

  }


  let flores = "";


  if (
    fenotipo.floracaoVisual
  ) {

    flores =
      `
      <div class="flor-visual flor-a">
        ✿
      </div>

      <div class="flor-visual flor-b">
        ✿
      </div>
      `;

  }


  const classeEstresse =
    fenotipo.estresse >= 4
      ? "planta-estressada"
      : "";


  el.innerHTML =
    `
    <div
      class="
        planta-fenotipo
        ${classeEstresse}
      "
      style="
        --altura:${fenotipo.altura}px;
        --caule:${fenotipo.caule}px;
        --escala:${escala};
        --inclinacao:${fenotipo.inclinacao}deg;
        --caule-hue:${fenotipo.hue};
        --caule-sat:${Math.max(
          30,
          fenotipo.saturacao - 10
        )}%;
        --caule-light:${Math.max(
          25,
          fenotipo.luminosidade - 8
        )}%;
      "
    >

      <div class="caule-fenotipo">

        ${folhasHTML}

        ${flores}

        <div class="ponta-crescimento"></div>

      </div>

    </div>
    `;

}


function renderAmbiente() {

  const ambiente =
    document.querySelector(
      "#ambiente"
    );

  const lampada =
    document.querySelector(
      "#lampada"
    );


  ambiente.classList.remove(
    "sombra",
    "artificial"
  );


  lampada.classList.remove(
    "ativa"
  );


  if (
    estado.luz ===
    "SOMBRA"
  ) {

    ambiente.classList.add(
      "sombra"
    );

  }


  if (
    estado.luz ===
    "ARTIFICIAL_FRACA"
    ||
    estado.luz ===
    "ARTIFICIAL_FORTE"
  ) {

    ambiente.classList.add(
      "artificial"
    );

    lampada.classList.add(
      "ativa"
    );

  }

}


function renderInventario() {

  const itens =
    Object.entries(
      estado.inventario
    )
    .filter(
      ([_, qtd]) =>
        qtd > 0
    );


  document
    .querySelector(
      "#inventario"
    )
    .innerHTML =
      itens.length

      ? itens
        .map(
          ([nome, qtd]) =>
          `
          <div class="item-inventario">

            <span>
              ${nome}
            </span>

            <strong>
              ${qtd}
            </strong>

          </div>
          `
        )
        .join("")

      : `
        <div>
          Inventário vazio
        </div>
        `;

}


function renderLog() {

  document
    .querySelector(
      "#log"
    )
    .innerHTML =
      estado.historico
        .slice(
          0,
          60
        )
        .map(
          x =>
          `
          <div>
            • ${x}
          </div>
          `
        )
        .join("");

}


function nomeLuz() {

  const nomes = {

    SOMBRA:
      "Sombra",

    NATURAL:
      "Luz natural",

    ARTIFICIAL_FRACA:
      "Lâmpada fraca",

    ARTIFICIAL_FORTE:
      "Lâmpada forte"

  };

  return nomes[
    estado.luz
  ];

}


function nomeUmidade() {

  const regime =
    regimeAgua();


  if (
    regime === "SECA"
  ) {

    return `${estado.umidade}% — seco`;

  }


  if (
    regime === "EXCESSO"
  ) {

    return `${estado.umidade}% — encharcado`;

  }


  return `${estado.umidade}% — adequado`;

}



function renderUmidade() {

  const barra =
    document.querySelector(
      "#barraUmidade"
    );

  const texto =
    document.querySelector(
      "#umidadeTexto"
    );

  const estadoTexto =
    document.querySelector(
      "#estadoUmidade"
    );

  const vaso =
    document.querySelector(
      ".vaso"
    );


  if (
    !barra
    ||
    !texto
    ||
    !estadoTexto
    ||
    !vaso
  ) {

    return;

  }


  barra.style.width =
    `${estado.umidade}%`;


  texto.textContent =
    `${estado.umidade}%`;


  vaso.classList.remove(
    "seco",
    "encharcado"
  );


  const regime =
    regimeAgua();


  if (
    regime === "SECA"
  ) {

    vaso.classList.add(
      "seco"
    );

    estadoTexto.textContent =
      "seco";

  }


  else if (
    regime === "EXCESSO"
  ) {

    vaso.classList.add(
      "encharcado"
    );

    estadoTexto.textContent =
      "encharcado";

  }


  else {

    estadoTexto.textContent =
      "adequado";

  }

}

function render() {

  document
    .querySelector(
      "#moedas"
    )
    .textContent =
      estado.moedas;


  document
    .querySelector(
      "#idade"
    )
    .textContent =
      estado.idade;


  document
    .querySelector(
      "#estagio"
    )
    .textContent =
      estado.estagio;


  document
    .querySelector(
      "#statusEstagio"
    )
    .textContent =
      estado.estagio;


  document
    .querySelector(
      "#soloAtual"
    )
    .textContent =
      estado.solo;


  document
    .querySelector(
      "#geracao"
    )
    .textContent =
      estado.geracao;


  document
    .querySelector(
      "#dnaVigor"
    )
    .textContent =
      estado.dna.vigor;


  document
    .querySelector(
      "#dnaSombra"
    )
    .textContent =
      estado.dna.sombra;


  document
    .querySelector(
      "#dnaSeca"
    )
    .textContent =
      estado.dna.seca;


  document
    .querySelector(
      "#linhagemTopo"
    )
    .textContent =
      `Semente ${estado.sementeBase} • geração ${estado.geracao}`;


  document
    .querySelector(
      "#btnAgua"
    )
    .textContent =
      `💧 Regar — ${nomeUmidade()}`;


  document
    .querySelector(
      "#btnLuz"
    )
    .textContent =
      `☀️ ${nomeLuz()}`;


  document
    .querySelector(
      "#btnColher"
    )
    .disabled =
      estado.estagio !==
      "MADURA";


  document
    .querySelector(
      "#btnSementeDNA"
    )
    .disabled =
      estado.estagio !== "MADURA"
      ||
      estado.sementeDnaGerada;


  document
    .querySelector(
      "#btnPlantarDescendente"
    )
    .disabled =
      !estado.sementeDNA;


  renderPlanta();

  renderUmidade();

  renderAmbiente();

  renderInventario();

  renderLog();

  salvar();

}


document
  .querySelector(
    "#btnAgua"
  )
  .onclick =
    regar;


document
  .querySelector(
    "#btnLuz"
  )
  .onclick =
    mudarLuz;


document
  .querySelector(
    "#btnCiclo"
  )
  .onclick =
    ciclo;


document
  .querySelector(
    "#btnColher"
  )
  .onclick =
    colher;


document
  .querySelector(
    "#btnSementeDNA"
  )
  .onclick =
    gerarSementeDNA;


document
  .querySelector(
    "#btnVenderFruto"
  )
  .onclick =
    () =>
      vender(
        "FRUTO"
      );


document
  .querySelector(
    "#btnVenderFlor"
  )
  .onclick =
    () =>
      vender(
        "FLOR"
      );


document
  .querySelector(
    "#btnSoloCasca"
  )
  .onclick =
    () =>
      produzirSolo(
        "CASCA"
      );


document
  .querySelector(
    "#btnSoloPetala"
  )
  .onclick =
    () =>
      produzirSolo(
        "PETALA"
      );


document
  .querySelector(
    "#btnPlantarDescendente"
  )
  .onclick =
    abrirModalDescendente;


document
  .querySelector(
    "#btnCancelarDescendente"
  )
  .onclick =
    fecharModalDescendente;


document
  .querySelector(
    "#btnNovoJogo"
  )
  .onclick =
    reiniciar;


document
  .querySelectorAll(
    "[data-compra]"
  )
  .forEach(
    btn => {

      btn.onclick =
        () => {

          comprar(
            btn.dataset.compra,
            Number(
              btn.dataset.preco
            )
          );

        };

    }
  );


carregar();

render();


