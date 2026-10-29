/*
============================================================
A PLANTINHA — V0.8
UNIVERSO DO QUARTO — MÚLTIPLOS VASOS
============================================================

Primeira integração visual.

- 5 posições de cultivo
- 3 liberadas inicialmente
- 2 bloqueadas
- Semente -> Vaso -> Solo -> PLAY
- x1 / x2 / x3 por vaso
- barra contínua de água
- pressionar/segurar para regar
- vasos recebem o MESMO relógio global
- aceleração NÃO multiplica Sol/Lua

IMPORTANTE:
Ainda não substitui totalmente o motor antigo.
É uma camada nova, independente e persistente.
*/


/* ==========================================================
   CONFIGURAÇÃO
   ========================================================== */

const QUARTO_V080 = {

  aceleracao: {

    1: {
      desenvolvimento: 1,
      agua: 1
    },

    2: {
      desenvolvimento: 2,
      agua: 1.5
    },

    3: {
      desenvolvimento: 3,
      agua: 2.1
    }

  },

  solos: {

    SOLO_COMUM: {
      nome: "Solo comum",
      crescimento: 2,
      retencao: 0
    },

    SOLO_ORGANICO: {
      nome: "Solo orgânico",
      crescimento: 2,
      retencao: 2
    },

    SOLO_MINERAL: {
      nome: "Solo mineral",
      crescimento: 2,
      retencao: -2
    },

    SOLO_ADITIVADO_CASCA: {
      nome: "Solo com casca",
      crescimento: 3,
      retencao: 1
    },

    SOLO_ADITIVADO_PETALA: {
      nome: "Solo com pétala",
      crescimento: 2,
      retencao: 1
    }

  }

};


const NOMES_SEMENTES_V080 = {

  S1: "Verde",
  S2: "Vermelha",
  S3: "Azul",
  S4: "Marrom",
  S5: "Amarela"

};


const DNA_BASE_V080 = {

  S1: {
    vigor: 2,
    sombra: 1,
    seca: 0,
    plasticidade: 0
  },

  S2: {
    vigor: 3,
    sombra: 0,
    seca: 0,
    plasticidade: 0
  },

  S3: {
    vigor: 1,
    sombra: 2,
    seca: 0,
    plasticidade: 0
  },

  S4: {
    vigor: 1,
    sombra: 0,
    seca: 2,
    plasticidade: 0
  },

  S5: {
    vigor: 1,
    sombra: 1,
    seca: 1,
    plasticidade: 1
  }

};


/* ==========================================================
   ESTADO
   ========================================================== */

let montagemV080 = {

  vaso: null,

  semente: null,

  solo: null

};


let regandoV080 = null;

let intervaloRegaV080 = null;


/* ==========================================================
   GARANTIR ESTADO
   ========================================================== */

function garantirQuartoV080() {

  estado.quartoV080 ??= {

    versao: 1,

    ultimoTempoProcessado: null,

    vasos: [

      {
        id: 1,
        desbloqueado: true,
        cultivo: null
      },

      {
        id: 2,
        desbloqueado: true,
        cultivo: null
      },

      {
        id: 3,
        desbloqueado: true,
        cultivo: null
      },

      {
        id: 4,
        desbloqueado: false,
        cultivo: null
      },

      {
        id: 5,
        desbloqueado: false,
        cultivo: null
      }

    ]

  };

}


/* ==========================================================
   TEMPO GLOBAL
   ========================================================== */

function tempoGlobalV080() {

  const dia =
    estado.tempo?.dia
    ??
    1;


  const hora =
    estado.tempo?.hora
    ??
    0;


  let luz = "LUA";


  if (
    hora === 6
    ||
    hora === 12
  ) {

    luz = "SOL";

  }


  return {

    dia,

    hora,

    luz,

    assinatura:
      `${dia}-${hora}`

  };

}


/* ==========================================================
   SEMENTES DISPONÍVEIS
   ========================================================== */

function sementesDisponiveisV080() {

  garantirInventarioV070?.();


  const resultado = [];


  /*
  ----------------------------------------------------------
  SEMENTES ANCESTRAIS EMPILHÁVEIS
  ----------------------------------------------------------
  */

  for (
    const base
    of [
      "S1",
      "S2",
      "S3",
      "S4",
      "S5"
    ]
  ) {

    const chave =
      `SEMENTE_${base}`;


    const quantidade =
      Number(
        estado.inventario?.[chave]
        ||
        0
      );


    if (
      quantidade > 0
    ) {

      resultado.push({

        origem:
          "PILHA",

        chave,

        base,

        id:
          chave,

        nome:
          `Semente ${NOMES_SEMENTES_V080[base]}`,

        geracao:
          0,

        quantidade,

        dna:
          structuredClone(
            DNA_BASE_V080[base]
          )

      });

    }

  }


  /*
  ----------------------------------------------------------
  SEMENTES-DNA INDIVIDUAIS
  ----------------------------------------------------------
  */

  const itens =
    estado
      .inventarioEstruturado
      ?.itens
    ||
    [];


  for (
    const item
    of itens
  ) {

    if (
      item.tipo !==
      "SEMENTE_DNA"
    ) {

      continue;

    }


    resultado.push({

      origem:
        "INDIVIDUAL",

      id:
        item.id,

      base:
        item.sementeBase
        ||
        "S1",

      nome:
        item.nome
        ||
        `Semente-DNA G${item.geracao}`,

      geracao:
        item.geracao
        ||
        1,

      quantidade:
        1,

      dna:
        structuredClone(
          item.dna
          ||
          {}
        ),

      linhagem: structuredClone(item.linhagem || []),
      historiaMae: structuredClone(item.historiaMae || {}),
      origemSementeId: item.id

    });

  }


  return resultado;

}


/* ==========================================================
   SOLOS DISPONÍVEIS
   ========================================================== */

function solosDisponiveisV080() {

  const resultado = [];


  for (
    const [
      chave,
      dados
    ]
    of Object.entries(
      QUARTO_V080.solos
    )
  ) {

    const quantidade =
      Number(
        estado.inventario?.[chave]
        ||
        0
      );


    if (
      quantidade > 0
    ) {

      resultado.push({

        chave,

        nome:
          dados.nome,

        quantidade

      });

    }

  }


  return resultado;

}


/* ==========================================================
   CONSUMO TRANSACIONAL
   ========================================================== */

function consumirSementeV080(
  semente
) {

  if (
    semente.origem ===
    "PILHA"
  ) {

    if (
      (
        estado.inventario?.[
          semente.chave
        ]
        ||
        0
      )
      <= 0
    ) {

      return false;

    }


    estado.inventario[
      semente.chave
    ]--;


    return true;

  }


  const itens =
    estado
      .inventarioEstruturado
      ?.itens;


  if (!itens) {

    return false;

  }


  const indice =
    itens.findIndex(
      item =>
        item.id
        ===
        semente.id
    );


  if (
    indice < 0
  ) {

    return false;

  }


  itens.splice(
    indice,
    1
  );


  return true;

}


function consumirSoloV080(
  chave
) {

  if (
    (
      estado.inventario?.[
        chave
      ]
      ||
      0
    )
    <= 0
  ) {

    return false;

  }


  estado.inventario[
    chave
  ]--;


  return true;

}


/* ==========================================================
   CRIAR CULTIVO
   ========================================================== */

function criarCultivoV080(
  semente,
  solo
) {

  return {

    id:
      "PL-"
      +
      Date.now()
      +
      "-"
      +
      Math.floor(
        Math.random() * 1000
      ),

    base:
      semente.base,

    nomeSemente:
      semente.nome,

    geracao:
      semente.geracao,

    dna:
      structuredClone(
        semente.dna
      ),

    linhagem: semente.linhagem?.length
      ? structuredClone(semente.linhagem)
      : [{ geracao: semente.geracao, origem: semente.base,
          dna: structuredClone(semente.dna) }],

    origemSementeId: semente.origemSementeId || semente.id,

    solo,

    velocidade:
      1,

    umidade:
      55,

    saude:
      100,

    desenvolvimento:
      0,

    energia:
      0,

    estagio:
      "SEMENTE",

    exposicaoSol:
      0,

    exposicaoLua:
      0,

    passosAmbientais:
      0,

    consumoAgua:
      0,

    aguaAdicionada:
      0,

    iniciadoEm:
      Date.now()

  };

}


/* ==========================================================
   PLAY
   ========================================================== */

function confirmarPlantioV080() {

  garantirQuartoV080();


  const vaso =
    estado.quartoV080.vasos.find(
      v =>
        v.id
        ===
        montagemV080.vaso
    );


  if (
    !vaso
    ||
    !vaso.desbloqueado
    ||
    vaso.cultivo
  ) {

    return;

  }


  const sementes =
    sementesDisponiveisV080();


  const semente =
    sementes.find(
      s =>
        s.id
        ===
        montagemV080.semente
    );


  if (!semente) {

    alert(
      "Essa semente não está mais disponível."
    );

    return;

  }


  if (
    !montagemV080.solo
  ) {

    return;

  }


  /*
  ----------------------------------------------------------
  TRANSAÇÃO

  primeiro valida tudo;
  depois consome.
  ----------------------------------------------------------
  */


  if (!solosDisponiveisV080().some(solo => solo.chave === montagemV080.solo)) {

    alert(
      "Esse solo não está mais disponível."
    );

    return;

  }


  const itemOriginal = semente.origem === "INDIVIDUAL"
    ? structuredClone(estado.inventarioEstruturado.itens.find(item => item.id === semente.id))
    : null;

  const sementeConsumida =
    consumirSementeV080(
      semente
    );


  if (!sementeConsumida) {

    return;

  }


  const soloConsumido =
    consumirSoloV080(
      montagemV080.solo
    );


  /*
  Rollback simples se algo inesperado ocorrer.
  */

  if (!soloConsumido) {

    if (
      semente.origem ===
      "PILHA"
    ) {

      estado.inventario[
        semente.chave
      ]++;

    }

    else if (itemOriginal) {
      estado.inventarioEstruturado.itens.push(itemOriginal);
    }


    alert(
      "Não foi possível iniciar o cultivo."
    );

    return;

  }


  vaso.cultivo =
    criarCultivoV080(
      semente,
      montagemV080.solo
    );


  montagemV080 = {

    vaso: null,

    semente: null,

    solo: null

  };


  fecharMontagemV080();


  if (
    typeof log ===
    "function"
  ) {

    log(
      `Novo cultivo iniciado no Vaso ${vaso.id}.`
    );

  }


  salvar();

  render();

}


/* ==========================================================
   PROCESSAMENTO BIOLÓGICO
   ========================================================== */

function atualizarEstagioV080(
  cultivo
) {

  const d =
    cultivo.desenvolvimento;


  if (
    d >= 18
  ) {

    cultivo.estagio =
      "MADURA";

  }

  else if (
    d >= 12
  ) {

    cultivo.estagio =
      "JOVEM";

  }

  else if (
    d >= 6
  ) {

    cultivo.estagio =
      "BROTO";

  }

  else if (
    d >= 2
  ) {

    cultivo.estagio =
      "GERMINACAO";

  }

  else {

    cultivo.estagio =
      "SEMENTE";

  }

}


function processarCultivoV080(
  cultivo,
  tempo
) {

  const dna =
    cultivo.dna
    ||
    {};


  const configSolo =
    QUARTO_V080.solos[
      cultivo.solo
    ]
    ||
    QUARTO_V080.solos.SOLO_COMUM;


  const perfil =
    QUARTO_V080.aceleracao[
      cultivo.velocidade
    ] || QUARTO_V080.aceleracao[1];

  const estagioAnterior = cultivo.estagio;
  cultivo.idade = (cultivo.idade ?? cultivo.passosAmbientais ?? 0) + 1;
  cultivo.contadoresVida ??= {};
  const historia = cultivo.contadoresVida;
  for (const chave of ["sol", "lua", "repouso", "sombra", "seca",
    "soloRico", "excessoAgua", "luzForte"]) {
    historia[chave] ??= 0;
  }
  historia[tempo.luz === "SOL" ? "sol" : "lua"]++;
  if (tempo.luz === "LUA") historia.repouso++;
  const luzEfetiva = luzEfetivaCultivo(cultivo, tempo);
  let mudouLuz = false;
  if (luzEfetiva !== "LUA") {
    if (luzEfetiva === "SOMBRA") historia.sombra++;
    mudouLuz = Boolean(cultivo.ultimaLuzDiurna && cultivo.ultimaLuzDiurna !== luzEfetiva);
    if (mudouLuz) historia.mudancasLuz = (historia.mudancasLuz || 0) + 1;
    cultivo.ultimaLuzDiurna = luzEfetiva;
  }
  if (cultivo.solo.includes("ADITIVADO") || cultivo.solo === "SOLO_ORGANICO") {
    historia.soloRico++;
  }


  /*
  ----------------------------------------------------------
  AMBIENTE UMA VEZ
  ----------------------------------------------------------
  */

  cultivo.passosAmbientais++;


  if (
    tempo.luz ===
    "SOL"
  ) {

    cultivo.exposicaoSol++;

  }

  else {

    cultivo.exposicaoLua++;

  }


  /*
  ----------------------------------------------------------
  CONSUMO DE ÁGUA
  ----------------------------------------------------------
  */

  let metabolismo =
    11;


  metabolismo +=
    Math.max(
      0,
      (dna.vigor || 1)
      -
      1
    )
    *
    1.5;


  metabolismo -=
    configSolo.retencao;


  if (
    tempo.luz ===
    "LUA"
  ) {

    metabolismo -= 4;

  }


  const demanda =
    Math.max(
      2,
      metabolismo
      *
      perfil.agua
    );


  cultivo.consumoAgua +=
    demanda;


  cultivo.umidade =
    Math.max(
      0,
      cultivo.umidade
      -
      demanda
    );

  if (cultivo.umidade < 25) historia.seca++;
  if (cultivo.umidade > 78) historia.excessoAgua++;


  /*
  ----------------------------------------------------------
  SAÚDE
  ----------------------------------------------------------
  */

  if (
    cultivo.umidade < 20
  ) {

    const dano =
      Math.max(
        0,
        6
        -
        (
          (dna.seca || 0)
          *
          2
        )
      );


    cultivo.saude -=
      dano;

  }

  else if (
    cultivo.umidade < 30
  ) {

    cultivo.saude -=
      Math.max(
        0,
        2
        -
        (dna.seca || 0)
      );

  }

  else if (
    cultivo.umidade > 85
  ) {

    cultivo.saude -=
      2;

  }

  else if (
    cultivo.umidade >= 35
    &&
    cultivo.umidade <= 75
  ) {

    cultivo.saude +=
      2;

  }


  cultivo.saude =
    Math.max(
      0,
      Math.min(
        100,
        cultivo.saude
      )
    );


  /*
  ----------------------------------------------------------
  DESENVOLVIMENTO
  ----------------------------------------------------------
  */

  let ganho =
    configSolo.crescimento
    +
    (dna.vigor || 1);


  if (
    tempo.luz ===
    "SOL"
  ) {

    ganho += luzEfetiva === "SOMBRA" ? 2 * geneCultivo(cultivo, "sombra") - 2 : 2;

  }


  if (
    cultivo.umidade >= 30
    &&
    cultivo.umidade <= 78
  ) {

    ganho += 2;

  }

  else if (
    cultivo.umidade < 20
  ) {

    ganho -= 4;

    ganho +=
      (dna.seca || 0);

  }

  else if (
    cultivo.umidade > 85
  ) {

    ganho -= 1;

  }


  if (
    cultivo.saude < 60
  ) {

    ganho -= 2;

  }


  if (
    cultivo.saude < 30
  ) {

    ganho -= 2;

  }


  if (
    cultivo.saude <= 0
  ) {

    ganho = 0;

  }


  ganho =
    Math.max(
      0,
      ganho
    );


  // Plasticidade responde a uma mudança diurna realmente processada, não a cliques.
  if (mudouLuz && cultivo.saude > 0) ganho += geneCultivo(cultivo, "plasticidade");
  cultivo.energia +=
    ganho
    *
    perfil.desenvolvimento;


  // Saúde zero é colapso reversível, mas não permite crescer.
  if (cultivo.saude > 0) {
    const crescimento = desenvolvimentoDoPerfil(cultivo, tempo, configSolo) * perfil.desenvolvimento;
    cultivo.desenvolvimento = Math.round((cultivo.desenvolvimento + crescimento) * 10000) / 10000;
  }


  atualizarEstagioV080(
    cultivo
  );

  cultivo.indiceEstagio = estagios.indexOf(cultivo.estagio);
  cultivo.exposicoes = {
    ambientais: cultivo.passosAmbientais,
    sol: cultivo.exposicaoSol,
    lua: cultivo.exposicaoLua
  };
  cultivo.consumoAguaTotal = cultivo.consumoAgua;
  cultivo.aguaRecebidaTotal = cultivo.aguaAdicionada;

  // Mesmos limites da V0.4.2: primeira produção na maturidade,
  // próximas a cada três períodos; saúde abaixo de 30 bloqueia produção.
  if (cultivo.estagio === "MADURA") {
    if (cultivo.saude < 30) {
      cultivo.producaoPronta = false;
      cultivo.ciclosDesdeColheita = 0;
    } else if (estagioAnterior !== "MADURA") {
      cultivo.producaoPronta = true;
      cultivo.ciclosDesdeColheita = 0;
    } else if (!cultivo.producaoPronta) {
      cultivo.ciclosDesdeColheita = (cultivo.ciclosDesdeColheita || 0) + 1;
      if (cultivo.ciclosDesdeColheita >= 3) {
        cultivo.producaoPronta = true;
        cultivo.ciclosDesdeColheita = 0;
      }
    }
  }

}


/* ==========================================================
   OBSERVAR RELÓGIO GLOBAL
   ========================================================== */

function processarTempoQuartoV080() {

  garantirQuartoV080();


  const tempo =
    tempoGlobalV080();


  /*
  Na primeira execução apenas sincroniza.
  Não inventamos um ciclo retroativo.
  */

  if (
    estado
      .quartoV080
      .ultimoTempoProcessado
    === null
  ) {

    estado
      .quartoV080
      .ultimoTempoProcessado =
        tempo.assinatura;


    return;

  }


  if (
    estado
      .quartoV080
      .ultimoTempoProcessado
    ===
    tempo.assinatura
  ) {

    return;

  }


  for (
    const vaso
    of estado.quartoV080.vasos
  ) {

    if (
      vaso.cultivo
    ) {

      processarCultivoV080(
        vaso.cultivo,
        tempo
      );

    }

  }


  estado
    .quartoV080
    .ultimoTempoProcessado =
      tempo.assinatura;


  salvar();

}


/* ==========================================================
   REGA CONTÍNUA
   ========================================================== */

function iniciarRegaV080(
  vasoId
) {

  const vaso =
    estado.quartoV080.vasos.find(
      v =>
        v.id === vasoId
    );


  if (
    !vaso?.cultivo
  ) {

    return;

  }


  pararRegaV080();


  regandoV080 =
    vasoId;

  vaso.cultivo.numeroRegas = (vaso.cultivo.numeroRegas || 0) + 1;


  const aplicarAgua =
    () => {

      const atual =
        estado.quartoV080.vasos.find(
          v =>
            v.id === regandoV080
        );


      if (
        !atual?.cultivo
      ) {

        pararRegaV080();

        return;

      }


      /*
      +1.2 por pulso de 100 ms.

      Visualmente vira uma entrada contínua.
      Depois balanceamos.
      */

      const antes =
        atual.cultivo.umidade;


      atual.cultivo.umidade =
        Math.min(
          100,
          atual.cultivo.umidade
          +
          1.2
        );


      atual.cultivo.aguaAdicionada +=
        atual.cultivo.umidade
        -
        antes;


      atualizarBarraVasoV080(
        vasoId
      );

    };


  aplicarAgua();


  intervaloRegaV080 =
    setInterval(
      aplicarAgua,
      100
    );

}


function pararRegaV080() {

  if (
    intervaloRegaV080
  ) {

    clearInterval(
      intervaloRegaV080
    );

  }


  intervaloRegaV080 =
    null;


  if (
    regandoV080 !==
    null
  ) {

    salvar();

  }


  regandoV080 =
    null;

}


/* ==========================================================
   VELOCIDADE
   ========================================================== */

function mudarVelocidadeV080(
  vasoId,
  velocidade
) {

  const vaso =
    estado.quartoV080.vasos.find(
      v =>
        v.id === vasoId
    );


  if (
    !vaso?.cultivo
  ) {

    return;

  }


  if (
    ![
      1,
      2,
      3
    ].includes(
      velocidade
    )
  ) {

    return;

  }


  vaso.cultivo.velocidade =
    velocidade;


  salvar();

  renderQuartoV080();

}


/* ==========================================================
   BARRA DE ÁGUA
   ========================================================== */

function classeAguaV080(
  umidade
) {

  if (
    umidade < 20
  ) {

    return "seca";

  }


  if (
    umidade > 85
  ) {

    return "excesso";

  }


  return "boa";

}


function atualizarBarraVasoV080(
  vasoId
) {

  const vaso =
    estado.quartoV080.vasos.find(
      v =>
        v.id === vasoId
    );


  const cultivo =
    vaso?.cultivo;


  if (!cultivo) {

    return;

  }


  const barra =
    document.querySelector(
      `[data-agua-barra-v080="${vasoId}"]`
    );


  const texto =
    document.querySelector(
      `[data-agua-texto-v080="${vasoId}"]`
    );


  if (
    barra
  ) {

    barra.style.width =
      `${cultivo.umidade}%`;


    barra.className =
      "agua-preenchimento-v080 "
      +
      classeAguaV080(
        cultivo.umidade
      );

  }


  if (
    texto
  ) {

    texto.textContent =
      `${Math.round(
        cultivo.umidade
      )}%`;

  }

}


/* ==========================================================
   HTML DE UM VASO
   ========================================================== */

function htmlVasoV080(
  vaso
) {

  if (
    !vaso.desbloqueado
  ) {

    return `

      <div class="
        vaso-card-v080
        vaso-bloqueado-v080
      ">

        <div class="vaso-numero-v080">
          VASO ${vaso.id}
        </div>

        <div class="vaso-bloqueio-v080">
          🔒
        </div>

        <strong>
          Espaço bloqueado
        </strong>

        <span>
          Ainda não disponível
        </span>

      </div>

    `;

  }


  if (
    !vaso.cultivo
  ) {

    return `

      <button
        type="button"
        class="
          vaso-card-v080
          vaso-livre-v080
        "
        data-vaso-livre-v080="${vaso.id}"
      >

        <div class="vaso-numero-v080">
          VASO ${vaso.id}
        </div>

        <div class="vaso-vazio-icone-v080">
          ＋
        </div>

        <strong>
          Novo cultivo
        </strong>

        <span>
          Escolher semente e solo
        </span>

      </button>

    `;

  }


  const c =
    vaso.cultivo;


  const cor =
    NOMES_SEMENTES_V080[
      c.base
    ]
    ||
    c.base;


  return `

    <div
      class="vaso-card-v080 vaso-ativo-v080"
      data-vaso-v080="${vaso.id}"
    >

      <div class="vaso-cabecalho-v080">

        <div>

          <span class="vaso-numero-v080">
            VASO ${vaso.id}
          </span>

          <strong>
            🌱 ${cor}
          </strong>

        </div>


        <span class="estagio-v080">
          ${c.estagio}
        </span>

      </div>


      <div class="planta-placeholder-v080">

        <div class="
          planta-broto-v080
          planta-${c.estagio.toLowerCase()}-v080
        ">
          🌱
        </div>

      </div>


      <div class="solo-label-v080">

        ${
          QUARTO_V080.solos[
            c.solo
          ]?.nome
          ||
          c.solo
        }

      </div>


      <div class="agua-linha-v080">

        <span>
          💧 Água
        </span>

        <b
          data-agua-texto-v080="${vaso.id}"
        >
          ${Math.round(
            c.umidade
          )}%
        </b>

      </div>


      <div class="agua-barra-v080">

        <div
          data-agua-barra-v080="${vaso.id}"
          class="
            agua-preenchimento-v080
            ${classeAguaV080(
              c.umidade
            )}
          "
          style="
            width:${c.umidade}%;
          "
        ></div>

      </div>


      <div class="vaso-status-v080">

        <span>
          ❤️ ${c.saude}%
        </span>

        <span>
          ⚡ ${Math.round(
            c.energia
          )}
        </span>

      </div>


      <div class="velocidades-v080">

        ${[1,2,3]
          .map(
            velocidade => `

              <button
                type="button"
                data-velocidade-v080="${vaso.id}:${velocidade}"
                class="
                  ${
                    c.velocidade
                    ===
                    velocidade
                    ?
                    "ativa"
                    :
                    ""
                  }
                "
              >
                ×${velocidade}
              </button>

            `
          )
          .join("")}

      </div>


      <button
        type="button"
        class="regar-v080"
        data-regar-v080="${vaso.id}"
      >

        <span>
          💧
        </span>

        Segure para regar

      </button>

    </div>

  `;

}


/* ==========================================================
   CRIAR PAINEL DO QUARTO
   ========================================================== */

function criarQuartoV080() {

  if (
    document.querySelector(
      "#quartoV080"
    )
  ) {

    return;

  }


  const painel =
    document.createElement(
      "section"
    );


  painel.id =
    "quartoV080";


  painel.className =
    "quarto-v080";


  /*
  Colocamos antes do inventário quando possível.
  */

  const inventario =
    document.querySelector(
      "#inventario"
    );


  if (
    inventario?.parentNode
  ) {

    inventario.parentNode.insertBefore(
      painel,
      inventario
    );

  }

  else {

    document.body.appendChild(
      painel
    );

  }

}


/* ==========================================================
   RENDER
   ========================================================== */

function renderQuartoV080() {

  garantirQuartoV080();

  criarQuartoV080();


  const area =
    document.querySelector(
      "#quartoV080"
    );


  if (!area) {

    return;

  }


  const tempo =
    tempoGlobalV080();


  area.innerHTML = `

    <div class="quarto-topo-v080">

      <div>

        <span class="quarto-eyebrow-v080">
          ÁREA DE CULTIVO
        </span>

        <h2>
          Quarto
        </h2>

      </div>


      <div class="relogio-quarto-v080">

        <strong>
          Dia ${tempo.dia}
        </strong>

        <span>
          ${String(
            tempo.hora
          ).padStart(
            2,
            "0"
          )}:00
          •
          ${
            tempo.luz ===
            "SOL"
            ?
            "☀️"
            :
            "🌙"
          }
        </span>

      </div>

    </div>


    <div class="vasos-grid-v080">

      ${estado
        .quartoV080
        .vasos
        .map(
          htmlVasoV080
        )
        .join("")}

    </div>

  `;


  /*
  Vasos livres.
  */

  area
    .querySelectorAll(
      "[data-vaso-livre-v080]"
    )
    .forEach(
      botao => {

        botao.addEventListener(
          "click",
          () => {

            abrirMontagemV080(
              Number(
                botao.dataset
                  .vasoLivreV080
              )
            );

          }
        );

      }
    );


  /*
  Velocidades.
  */

  area
    .querySelectorAll(
      "[data-velocidade-v080]"
    )
    .forEach(
      botao => {

        botao.addEventListener(
          "click",
          () => {

            const [
              vaso,
              velocidade
            ] =
              botao.dataset
                .velocidadeV080
                .split(":")
                .map(Number);


            mudarVelocidadeV080(
              vaso,
              velocidade
            );

          }
        );

      }
    );


  /*
  Segurar para regar.
  */

  area
    .querySelectorAll(
      "[data-regar-v080]"
    )
    .forEach(
      botao => {

        const vaso =
          Number(
            botao.dataset
              .regarV080
          );


        botao.addEventListener(
          "pointerdown",
          evento => {

            evento.preventDefault();

            iniciarRegaV080(
              vaso
            );

          }
        );


        botao.addEventListener(
          "pointerup",
          pararRegaV080
        );


        botao.addEventListener(
          "pointercancel",
          pararRegaV080
        );


        botao.addEventListener(
          "pointerleave",
          pararRegaV080
        );

      }
    );

}


/* ==========================================================
   MODAL DE MONTAGEM
   ========================================================== */

function abrirMontagemV080(
  vasoId
) {

  montagemV080 = {

    vaso:
      vasoId,

    semente:
      null,

    solo:
      null

  };


  let modal =
    document.querySelector(
      "#montagemV080"
    );


  if (!modal) {

    modal =
      document.createElement(
        "div"
      );


    modal.id =
      "montagemV080";


    modal.className =
      "montagem-modal-v080";


    document.body.appendChild(
      modal
    );

  }


  renderMontagemV080();

}


function fecharMontagemV080() {

  document
    .querySelector(
      "#montagemV080"
    )
    ?.remove();

}


/* ==========================================================
   RENDER MONTAGEM
   ========================================================== */

function renderMontagemV080() {

  const modal =
    document.querySelector(
      "#montagemV080"
    );


  if (!modal) {

    return;

  }


  const sementes =
    sementesDisponiveisV080();


  const solos =
    solosDisponiveisV080();


  const sementeAtual =
    sementes.find(
      s =>
        s.id ===
        montagemV080.semente
    );


  const soloAtual =
    solos.find(
      s =>
        s.chave ===
        montagemV080.solo
    );


  const pronto =
    Boolean(
      montagemV080.vaso
      &&
      montagemV080.semente
      &&
      montagemV080.solo
    );


  modal.innerHTML = `

    <div class="montagem-caixa-v080">

      <button
        type="button"
        id="fecharMontagemV080"
        class="fechar-montagem-v080"
      >
        ✕
      </button>


      <span class="quarto-eyebrow-v080">
        NOVO CULTIVO
      </span>

      <h3>
        Vaso ${montagemV080.vaso}
      </h3>


      <div class="montagem-etapa-v080">

        <strong>
          1. Escolha a semente
        </strong>


        <div class="opcoes-montagem-v080">

          ${
            sementes.length
            ?
            sementes
              .map(
                semente => `

                  <button
                    type="button"
                    data-semente-montagem-v080="${semente.id}"
                    class="
                      ${
                        montagemV080.semente
                        ===
                        semente.id
                        ?
                        "selecionada"
                        :
                        ""
                      }
                    "
                  >

                    🌱

                    <span>
                      ${semente.nome}
                    </span>

                    <small>
                      ${
                        semente.geracao
                        ?
                        `G${semente.geracao}`
                        :
                        `×${semente.quantidade}`
                      }
                    </small>

                  </button>

                `
              )
              .join("")
            :
            `
              <p class="sem-opcoes-v080">
                Você não possui sementes disponíveis.
              </p>
            `
          }

        </div>

      </div>


      <div class="montagem-etapa-v080">

        <strong>
          2. Escolha o solo
        </strong>


        <div class="opcoes-montagem-v080">

          ${
            solos.length
            ?
            solos
              .map(
                solo => `

                  <button
                    type="button"
                    data-solo-montagem-v080="${solo.chave}"
                    class="
                      ${
                        montagemV080.solo
                        ===
                        solo.chave
                        ?
                        "selecionada"
                        :
                        ""
                      }
                    "
                  >

                    🪴

                    <span>
                      ${solo.nome}
                    </span>

                    <small>
                      ×${solo.quantidade}
                    </small>

                  </button>

                `
              )
              .join("")
            :
            `
              <p class="sem-opcoes-v080">
                Você não possui solo disponível.
              </p>
            `
          }

        </div>

      </div>


      <div class="resumo-montagem-v080">

        <span>
          🌱
          ${
            sementeAtual
              ?.nome
            ||
            "Semente"
          }
        </span>

        <b>
          +
        </b>

        <span>
          🪴
          ${
            soloAtual
              ?.nome
            ||
            "Solo"
          }
        </span>

        <b>
          →
        </b>

        <span>
          Vaso ${montagemV080.vaso}
        </span>

      </div>


      <button
        type="button"
        id="playMontagemV080"
        class="play-montagem-v080"
        ${pronto ? "" : "disabled"}
      >
        ▶ Começar cultivo
      </button>

    </div>

  `;


  modal
    .querySelector(
      "#fecharMontagemV080"
    )
    .addEventListener(
      "click",
      fecharMontagemV080
    );


  modal
    .querySelectorAll(
      "[data-semente-montagem-v080]"
    )
    .forEach(
      botao => {

        botao.addEventListener(
          "click",
          () => {

            montagemV080.semente =
              botao.dataset
                .sementeMontagemV080;


            renderMontagemV080();

          }
        );

      }
    );


  modal
    .querySelectorAll(
      "[data-solo-montagem-v080]"
    )
    .forEach(
      botao => {

        botao.addEventListener(
          "click",
          () => {

            montagemV080.solo =
              botao.dataset
                .soloMontagemV080;


            renderMontagemV080();

          }
        );

      }
    );


  modal
    .querySelector(
      "#playMontagemV080"
    )
    ?.addEventListener(
      "click",
      confirmarPlantioV080
    );

}


/* ==========================================================
   HOOK NO RENDER EXISTENTE
   ========================================================== */

const renderAnteriorV080 =
  render;


render =
  function() {

    garantirQuartoV080();

    processarTempoQuartoV080();

    renderAnteriorV080();

    renderQuartoV080();

  };


/* ==========================================================
   SEGURANÇA DA REGA
   ========================================================== */

window.addEventListener(
  "pointerup",
  pararRegaV080
);


window.addEventListener(
  "blur",
  pararRegaV080
);


/* ==========================================================
   INICIALIZAÇÃO
   ========================================================== */

garantirQuartoV080();

criarQuartoV080();

salvar();

render();
