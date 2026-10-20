/*
================================================================
A PLANTINHA — V0.8.3
PLANTA COMPLETA POR VASO
================================================================

Objetivo:

- cada vaso passa a possuir sua própria planta completa;
- preservar compatibilidade com quarto_v080;
- preservar o relógio global;
- preservar a biologia existente;
- preparar produção, DNA, linhagem e histórico por vaso;
- fornecer render procedural para a Estação.

IMPORTANTE:
esta camada NÃO cria uma segunda biologia.
Ela organiza estado e interface.
================================================================
*/


/* ============================================================
   UTILIDADES
   ============================================================ */

function cloneV083(valor) {

  if (
    valor === undefined
    ||
    valor === null
  ) {
    return valor;
  }

  return structuredClone(valor);

}


function numeroV083(
  valor,
  fallback = 0
) {

  const n =
    Number(valor);

  return Number.isFinite(n)
    ? n
    : fallback;

}


function limitarV083(
  valor,
  minimo,
  maximo
) {

  return Math.max(
    minimo,
    Math.min(
      maximo,
      valor
    )
  );

}


/* ============================================================
   PERFIL BASE DA SEMENTE
   ============================================================ */

function dnaBaseV083(
  sementeId
) {

  /*
  Primeiro tentamos aproveitar exatamente
  a definição biológica existente.
  */

  if (
    typeof SEMENTES_BASE !==
    "undefined"
  ) {

    const direto =
      SEMENTES_BASE[
        sementeId
      ];

    if (direto) {
      return cloneV083(
        direto
      );
    }


    /*
    Compatibilidade com nomes usados
    no quarto:
    VERDE, VERMELHA etc.
    */

    const mapa = {
      VERDE: "S1",
      VERMELHA: "S2",
      AZUL: "S3",
      MARROM: "S4",
      AMARELA: "S5"
    };


    const chave =
      mapa[
        sementeId
      ];


    if (
      chave
      &&
      SEMENTES_BASE[chave]
    ) {

      return cloneV083(
        SEMENTES_BASE[chave]
      );

    }

  }


  return {
    vigor: 1,
    sombra: 1,
    seca: 1
  };

}


/* ============================================================
   ESTADO COMPLETO DE UMA PLANTA
   ============================================================ */

function criarPlantaCompletaV083(
  cultivo,
  vasoId
) {

  const semente =
    cultivo?.semente
    ||
    cultivo?.sementeBase
    ||
    cultivo?.base
    ||
    "VERDE";


  const solo =
    cultivo?.solo
    ||
    "COMUM";


  const dnaExistente =
    cultivo?.dna
    ||
    cultivo?.sementeDNA?.dna
    ||
    null;


  return {

    /*
    IDENTIDADE
    */

    id:
      cultivo?.plantaId
      ||
      `${vasoId}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2,8)}`,

    vasoId,

    sementeBase:
      semente,

    geracao:
      numeroV083(
        cultivo?.geracao,
        0
      ),

    dna:
      cloneV083(
        dnaExistente
        ||
        dnaBaseV083(
          semente
        )
      ),


    /*
    BIOLOGIA ATUAL
    */

    idade:
      numeroV083(
        cultivo?.idade,
        cultivo?.desenvolvimento
        || 0
      ),

    desenvolvimento:
      numeroV083(
        cultivo?.desenvolvimento,
        cultivo?.idade
        || 0
      ),

    energia:
      numeroV083(
        cultivo?.energia,
        0
      ),

    saude:
      limitarV083(
        numeroV083(
          cultivo?.saude,
          100
        ),
        0,
        100
      ),

    umidade:
      limitarV083(
        numeroV083(
          cultivo?.umidade,
          55
        ),
        0,
        100
      ),

    estagio:
      cultivo?.estagio
      ||
      "SEMENTE",

    indiceEstagio:
      numeroV083(
        cultivo?.indiceEstagio,
        0
      ),

    solo,


    /*
    PRODUÇÃO
    */

    producaoPronta:
      Boolean(
        cultivo?.producaoPronta
      ),

    ciclosDesdeColheita:
      numeroV083(
        cultivo?.ciclosDesdeColheita,
        0
      ),

    sementeDnaGerada:
      Boolean(
        cultivo?.sementeDnaGerada
      ),

    sementeDNA:
      cloneV083(
        cultivo?.sementeDNA
        ||
        null
      ),


    /*
    HISTÓRIA AMBIENTAL
    */

    contadoresVida: {

      sombra:
        numeroV083(
          cultivo
            ?.contadoresVida
            ?.sombra,
          0
        ),

      seca:
        numeroV083(
          cultivo
            ?.contadoresVida
            ?.seca,
          0
        ),

      soloRico:
        numeroV083(
          cultivo
            ?.contadoresVida
            ?.soloRico,
          0
        ),

      excessoAgua:
        numeroV083(
          cultivo
            ?.contadoresVida
            ?.excessoAgua,
          0
        ),

      luzForte:
        numeroV083(
          cultivo
            ?.contadoresVida
            ?.luzForte,
          0
        ),

      lua:
        numeroV083(
          cultivo
            ?.contadoresVida
            ?.lua,
          0
        ),

      sol:
        numeroV083(
          cultivo
            ?.contadoresVida
            ?.sol,
          0
        ),

      repouso:
        numeroV083(
          cultivo
            ?.contadoresVida
            ?.repouso,
          0
        )

    },


    /*
    EXPOSIÇÕES DO NOVO QUARTO
    */

    exposicoes: {

      ambientais:
        numeroV083(
          cultivo
            ?.exposicoes
            ?.ambientais,
          0
        ),

      sol:
        numeroV083(
          cultivo
            ?.exposicoes
            ?.sol,
          0
        ),

      lua:
        numeroV083(
          cultivo
            ?.exposicoes
            ?.lua,
          0
        )

    },


    /*
    CONSUMO / REGA
    */

    consumoAguaTotal:
      numeroV083(
        cultivo?.consumoAguaTotal,
        0
      ),

    aguaRecebidaTotal:
      numeroV083(
        cultivo?.aguaRecebidaTotal,
        0
      ),

    numeroRegas:
      numeroV083(
        cultivo?.numeroRegas,
        0
      ),


    /*
    LINHAGEM
    */

    linhagem:
      cloneV083(
        cultivo?.linhagem
        ||
        [
          {
            geracao:
              numeroV083(
                cultivo?.geracao,
                0
              ),

            origem:
              semente,

            dna:
              cloneV083(
                dnaExistente
                ||
                dnaBaseV083(
                  semente
                )
              )
          }
        ]
      ),


    /*
    HISTÓRICO LOCAL
    */

    historico:
      cloneV083(
        cultivo?.historico
        ||
        [
          `Cultivo iniciado no ${vasoId}.`
        ]
      )

  };

}


/* ============================================================
   MIGRAÇÃO DOS CULTIVOS EXISTENTES
   ============================================================ */

function garantirPlantasPorVasoV083() {

  if (
    typeof garantirQuartoV080 ===
    "function"
  ) {
    garantirQuartoV080();
  }


  const vasos =
    estado
      ?.quartoV080
      ?.vasos;


  if (
    !Array.isArray(
      vasos
    )
  ) {
    return;
  }


  let alterou =
    false;


  for (
    const vaso
    of vasos
  ) {

    if (
      !vaso?.cultivo
    ) {
      continue;
    }


    if (
      !vaso.cultivo.plantaV083
    ) {

      vaso.cultivo.plantaV083 =
        criarPlantaCompletaV083(
          vaso.cultivo,
          vaso.id
        );

      alterou =
        true;

    }

  }


  if (
    alterou
    &&
    typeof salvar ===
    "function"
  ) {
    salvar();
  }

}


/* ============================================================
   ACESSO À PLANTA DE UM VASO
   ============================================================ */

function vasoV083(
  vasoId
) {

  garantirPlantasPorVasoV083();


  return (
    estado
      ?.quartoV080
      ?.vasos
      ?.find(
        vaso =>
          vaso.id ===
          vasoId
      )
    ||
    null
  );

}


function plantaDoVasoV083(
  vasoId
) {

  return (
    vasoV083(
      vasoId
    )
      ?.cultivo
      ?.plantaV083
    ||
    null
  );

}


/* ============================================================
   SINCRONIZAÇÃO
   ============================================================ */

function sincronizarCultivoParaPlantaV083(
  vaso
) {

  if (
    !vaso?.cultivo
  ) {
    return;
  }


  if (
    !vaso.cultivo.plantaV083
  ) {

    vaso.cultivo.plantaV083 =
      criarPlantaCompletaV083(
        vaso.cultivo,
        vaso.id
      );

  }


  const cultivo =
    vaso.cultivo;


  const planta =
    cultivo.plantaV083;


  /*
  quarto_v080 continua sendo autoridade
  para os campos que já simula.
  */

  const campos = [
    "idade",
    "desenvolvimento",
    "energia",
    "saude",
    "umidade",
    "estagio",
    "indiceEstagio",
    "solo",
    "consumoAguaTotal",
    "aguaRecebidaTotal",
    "numeroRegas",
    "producaoPronta",
    "ciclosDesdeColheita",
    "sementeDnaGerada",
    "sementeDNA"
  ];


  for (
    const campo
    of campos
  ) {

    if (
      cultivo[campo] !==
      undefined
    ) {

      planta[campo] =
        cloneV083(
          cultivo[campo]
        );

    }

  }


  if (
    cultivo.exposicoes
  ) {

    planta.exposicoes =
      cloneV083(
        cultivo.exposicoes
      );

  }


  if (
    cultivo.contadoresVida
  ) {

    planta.contadoresVida = {

      ...planta.contadoresVida,

      ...cloneV083(
        cultivo.contadoresVida
      )

    };

  }

}


function sincronizarTodasV083() {

  garantirPlantasPorVasoV083();


  const vasos =
    estado
      ?.quartoV080
      ?.vasos
    ||
    [];


  for (
    const vaso
    of vasos
  ) {

    sincronizarCultivoParaPlantaV083(
      vaso
    );

  }

}


/* ============================================================
   PLANTA PROCEDURAL
   ============================================================ */

function aparenciaPlantaV083(
  planta
) {

  const dna =
    planta?.dna
    ||
    {};


  const vigor =
    numeroV083(
      dna.vigor,
      1
    );


  const sombra =
    numeroV083(
      dna.sombra,
      1
    );


  const seca =
    numeroV083(
      dna.seca,
      1
    );


  const saude =
    numeroV083(
      planta?.saude,
      100
    );


  const mapaCor = {

    VERDE:
      "var(--planta-verde-v083,#70bd76)",

    S1:
      "var(--planta-verde-v083,#70bd76)",

    VERMELHA:
      "var(--planta-vermelha-v083,#b96e6e)",

    S2:
      "var(--planta-vermelha-v083,#b96e6e)",

    AZUL:
      "var(--planta-azul-v083,#6f9db9)",

    S3:
      "var(--planta-azul-v083,#6f9db9)",

    MARROM:
      "var(--planta-marrom-v083,#9d8061)",

    S4:
      "var(--planta-marrom-v083,#9d8061)",

    AMARELA:
      "var(--planta-amarela-v083,#c2b766)",

    S5:
      "var(--planta-amarela-v083,#c2b766)"

  };


  return {

    cor:
      mapaCor[
        planta.sementeBase
      ]
      ||
      mapaCor.VERDE,

    escala:
      0.88
      +
      vigor * 0.08,

    inclinacao:
      sombra > vigor
      ?
      -3
      :
      vigor > sombra
      ?
      3
      :
      0,

    folhas:
      limitarV083(
        2
        +
        vigor
        +
        Math.floor(
          numeroV083(
            planta.desenvolvimento,
            0
          )
          /
          8
        ),
        2,
        9
      ),

    opacidade:
      limitarV083(
        0.45
        +
        saude / 180,
        0.45,
        1
      ),

    seca

  };

}


function htmlPlantaProceduralV083(
  planta
) {

  if (!planta) {

    return `
      <div class="planta-v083-vazia">
        🪴
      </div>
    `;

  }


  const visual =
    aparenciaPlantaV083(
      planta
    );


  const estagio =
    planta.estagio
    ||
    "SEMENTE";


  if (
    estagio ===
    "SEMENTE"
  ) {

    return `

      <div
        class="planta-procedural-v083 semente"
        style="
          --cor-planta-v083:${visual.cor};
          --escala-v083:${visual.escala};
          --opacidade-v083:${visual.opacidade};
        "
      >

        <div class="semente-procedural-v083">
        </div>

      </div>

    `;

  }


  if (
    estagio ===
    "GERMINACAO"
  ) {

    return `

      <div
        class="planta-procedural-v083 germinacao"
        style="
          --cor-planta-v083:${visual.cor};
          --escala-v083:${visual.escala};
          --opacidade-v083:${visual.opacidade};
        "
      >

        <div class="caule-v083">
        </div>

        <div class="folha-v083 folha-a-v083">
        </div>

      </div>

    `;

  }


  const quantidadeFolhas =
    estagio === "BROTO"
    ?
    Math.min(
      visual.folhas,
      4
    )
    :
    estagio === "JOVEM"
    ?
    Math.min(
      visual.folhas,
      6
    )
    :
    visual.folhas;


  let folhas =
    "";


  for (
    let i = 0;
    i < quantidadeFolhas;
    i++
  ) {

    folhas += `

      <div
        class="
          folha-v083
          folha-dinamica-v083
          folha-v083-${i}
        "
        style="
          --indice-folha:${i};
        "
      >
      </div>

    `;

  }


  const producao =
    planta.producaoPronta
    ?
    `
      <div
        class="fruto-procedural-v083"
        title="Produção disponível"
      >
        ●
      </div>
    `
    :
    "";


  return `

    <div
      class="
        planta-procedural-v083
        ${estagio.toLowerCase()}
      "
      style="
        --cor-planta-v083:${visual.cor};
        --escala-v083:${visual.escala};
        --opacidade-v083:${visual.opacidade};
        --inclinacao-v083:${visual.inclinacao}deg;
      "
    >

      <div class="caule-v083">
      </div>

      ${folhas}

      ${producao}

    </div>

  `;

}


/* ============================================================
   ALERTAS DA PLANTA
   ============================================================ */

function alertasPlantaV083(
  planta
) {

  const alertas =
    [];


  if (!planta) {
    return alertas;
  }


  if (
    planta.umidade <= 20
  ) {

    alertas.push({
      tipo: "agua",
      icone: "💧",
      texto: "Água baixa"
    });

  }


  if (
    planta.umidade >= 82
  ) {

    alertas.push({
      tipo: "excesso",
      icone: "🌊",
      texto: "Solo encharcado"
    });

  }


  if (
    planta.saude <= 40
  ) {

    alertas.push({
      tipo: "saude",
      icone: "❤️",
      texto: "Planta frágil"
    });

  }


  if (
    planta.producaoPronta
  ) {

    alertas.push({
      tipo: "colheita",
      icone: "🍎",
      texto: "Colheita disponível"
    });

  }


  if (
    planta.sementeDNA
  ) {

    alertas.push({
      tipo: "dna",
      icone: "🧬",
      texto: "Semente-DNA fornecida ao inventário"
    });

  }


  return alertas;

}


/* ============================================================
   PAINEL DE INFORMAÇÕES DA ESTAÇÃO
   ============================================================ */

function htmlEstadoEstacaoV083(
  planta
) {

  if (!planta) {
    return "";
  }


  const dna =
    planta.dna
    ||
    {};


  return `

    <div class="estado-estacao-v083">

      <div>
        <span>Estágio</span>
        <strong>
          ${planta.estagio}
        </strong>
      </div>

      <div>
        <span>Saúde</span>
        <strong>
          ❤️ ${Math.round(planta.saude)}%
        </strong>
      </div>

      <div>
        <span>Umidade</span>
        <strong>
          💧 ${Math.round(planta.umidade)}%
        </strong>
      </div>

      <div>
        <span>Solo</span>
        <strong>
          ${planta.solo}
        </strong>
      </div>

      <div>
        <span>Geração</span>
        <strong>
          G${planta.geracao}
        </strong>
      </div>

      <div>
        <span>DNA</span>
        <strong>
          V${dna.vigor ?? "—"}
          •
          S${dna.sombra ?? "—"}
          •
          D${dna.seca ?? "—"}
        </strong>
      </div>

    </div>

  `;

}


/* ============================================================
   RENDERIZAÇÃO NA ESTAÇÃO EXISTENTE
   ============================================================ */

function aplicarPlantaNaEstacaoV083(
  vasoId
) {

  const planta =
    plantaDoVasoV083(
      vasoId
    );


  if (!planta) {
    return;
  }


  /*
  Procuramos alvos já existentes sem exigir
  alteração estrutural no HTML.
  */

  const candidatosVisual = [

    "#plantaEstacaoV081",

    "#plantaEstacaoV080",

    ".planta-estacao-v081",

    ".planta-estacao-v080",

    "[data-planta-estacao]"

  ];


  let alvoVisual =
    null;


  for (
    const seletor
    of candidatosVisual
  ) {

    alvoVisual =
      document.querySelector(
        seletor
      );

    if (alvoVisual) {
      break;
    }

  }


  if (alvoVisual) {

    alvoVisual.innerHTML =
      htmlPlantaProceduralV083(
        planta
      );

  }


  /*
  Painel complementar criado automaticamente.
  */

  const estacao =
    document.querySelector(
      ".estacao-v081"
    )
    ||
    document.querySelector(
      ".estacao-cultivo-v081"
    )
    ||
    alvoVisual
      ?.parentElement;


  if (estacao) {

    let painel =
      estacao.querySelector(
        "#estadoEstacaoV083"
      );


    if (!painel) {

      painel =
        document.createElement(
          "div"
        );

      painel.id =
        "estadoEstacaoV083";

      estacao.appendChild(
        painel
      );

    }


    painel.innerHTML =
      htmlEstadoEstacaoV083(
        planta
      );


    /*
    Alertas
    */

    let areaAlertas =
      estacao.querySelector(
        "#alertasEstacaoV083"
      );


    if (!areaAlertas) {

      areaAlertas =
        document.createElement(
          "div"
        );

      areaAlertas.id =
        "alertasEstacaoV083";

      areaAlertas.className =
        "alertas-estacao-v083";

      estacao.prepend(
        areaAlertas
      );

    }


    areaAlertas.innerHTML =
      alertasPlantaV083(
        planta
      )
      .map(
        alerta => `

          <div
            class="
              alerta-estacao-v083
              alerta-${alerta.tipo}
            "
          >
            ${alerta.icone}
            ${alerta.texto}
          </div>

        `
      )
      .join("");

  }

}


/* ============================================================
   DESCOBRE ESTAÇÃO ATUAL
   ============================================================ */

function vasoAtualEstacaoV083() {

  /*
  quarto_v080/v081 pode já possuir uma variável
  indicando estação selecionada.
  */

  if (
    typeof vasoSelecionadoV081 !==
    "undefined"
    &&
    vasoSelecionadoV081
  ) {

    return vasoSelecionadoV081;

  }


  if (
    typeof vasoAtualV081 !==
    "undefined"
    &&
    vasoAtualV081
  ) {

    return vasoAtualV081;

  }


  /*
  Fallback: atributo no DOM.
  */

  const elemento =
    document.querySelector(
      "[data-vaso-atual]"
    );


  if (
    elemento?.dataset?.vasoAtual
  ) {

    return elemento.dataset.vasoAtual;

  }


  return null;

}


/* ============================================================
   OBSERVADOR LEVE DA INTERFACE
   ============================================================ */

let ultimoVasoRenderizadoV083 =
  null;


function atualizarInterfaceV083() {

  sincronizarTodasV083();


  const vasoId =
    vasoAtualEstacaoV083();


  if (vasoId) {

    aplicarPlantaNaEstacaoV083(
      vasoId
    );

    ultimoVasoRenderizadoV083 =
      vasoId;

  }


  if (
    typeof salvar ===
    "function"
  ) {
    salvar();
  }

}


/* ============================================================
   NOVOS PLANTIOS
   ============================================================ */

function garantirNovoPlantioV083() {

  garantirPlantasPorVasoV083();

  sincronizarTodasV083();

}


/*
Interceptamos a confirmação somente DEPOIS
que a rotina oficial executar.

Assim quem continua decidindo:
- consumo de inventário
- vaso
- solo
- semente
é a lógica V0.8.0.
*/

if (
  typeof confirmarPlantioV080 ===
  "function"
) {

  const confirmarAnteriorV083 =
    confirmarPlantioV080;


  confirmarPlantioV080 =
    function(...args) {

      const resultado =
        confirmarAnteriorV083(
          ...args
        );


      garantirNovoPlantioV083();


      return resultado;

    };

}


/* ============================================================
   RELÓGIO GLOBAL
   ============================================================ */

/*
Não substituímos o relógio.

Depois de cada render do laboratório,
sincronizamos os estados.
*/

if (
  typeof renderLaboratorioV081 ===
  "function"
) {

  const renderLabAnteriorV083 =
    renderLaboratorioV081;


  renderLaboratorioV081 =
    function(...args) {

      sincronizarTodasV083();


      const resultado =
        renderLabAnteriorV083(
          ...args
        );


      const vasoId =
        vasoAtualEstacaoV083();


      if (vasoId) {

        aplicarPlantaNaEstacaoV083(
          vasoId
        );

      }


      return resultado;

    };

}


/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

garantirPlantasPorVasoV083();

sincronizarTodasV083();

salvar?.();

console.log(
  "[A Plantinha] V0.8.3 — plantas completas por vaso carregadas."
);




/* ============================================================
   V0.8.3.1 — REPARO DEFINITIVO DA IDENTIDADE
   ============================================================ */

(function repararIdentidadesV0831() {

  const vasos =
    estado
      ?.quartoV080
      ?.vasos
    ||
    [];


  let alterou =
    false;


  for (
    const vaso
    of vasos
  ) {

    const cultivo =
      vaso?.cultivo;


    const planta =
      cultivo?.plantaV083;


    if (
      !cultivo
      ||
      !planta
    ) {
      continue;
    }


    /*
    A identidade canônica é a base do cultivo:
    S1 / S2 / S3 / S4 / S5

    "VERDE", "AZUL" etc. ficam apenas como
    nomes amigáveis de interface.
    */

    const baseCorreta =
      cultivo.base
      ||
      cultivo.sementeBase
      ||
      cultivo.semente;


    if (
      baseCorreta
      &&
      planta.sementeBase
      !==
      baseCorreta
    ) {

      console.log(
        `[V0.8.3.1] Vaso ${vaso.id}:`,
        planta.sementeBase,
        "→",
        baseCorreta
      );


      planta.sementeBase =
        baseCorreta;


      alterou =
        true;

    }


    /*
    Corrige também a origem inicial da linhagem.
    */

    if (
      baseCorreta
      &&
      Array.isArray(
        planta.linhagem
      )
      &&
      planta.linhagem.length
    ) {

      if (
        planta
          .linhagem[0]
          .origem
        !==
        baseCorreta
      ) {

        planta
          .linhagem[0]
          .origem =
            baseCorreta;


        alterou =
          true;

      }

    }

  }


  if (
    alterou
    &&
    typeof salvar ===
    "function"
  ) {

    salvar();

    console.log(
      "[A Plantinha] Identidades V0.8.3 reparadas."
    );

  }

})();
