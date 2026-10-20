/*
==========================================================
A PLANTINHA — V0.7
INVENTÁRIO ESTRUTURADO
==========================================================

Objetivo:

Separar:

1. RECURSOS EMPILHÁVEIS
   SOLO_COMUM x3
   CASCA x2
   etc.

2. OBJETOS INDIVIDUAIS
   Semente-DNA #SD-00001
   Futuramente:
   Fruto #FR-00001
   Flor  #FL-00001

Nesta versão o inventário antigo permanece como fonte
das quantidades para não quebrar compras/vendas existentes.

O inventário estruturado espelha essas quantidades e já
armazena objetos individuais de forma permanente.
*/


const CATALOGO_INVENTARIO_V070 = {

  /*
  ========================================================
  SEMENTES ANCESTRAIS
  ========================================================
  */

  SEMENTE_S1: {
    categoria: "SEMENTES",
    nome: "Semente Verde",
    icone: "🌱"
  },

  SEMENTE_S2: {
    categoria: "SEMENTES",
    nome: "Semente Vermelha",
    icone: "🌱"
  },

  SEMENTE_S3: {
    categoria: "SEMENTES",
    nome: "Semente Azul",
    icone: "🌱"
  },

  SEMENTE_S4: {
    categoria: "SEMENTES",
    nome: "Semente Marrom",
    icone: "🌱"
  },

  SEMENTE_S5: {
    categoria: "SEMENTES",
    nome: "Semente Amarela",
    icone: "🌱"
  },


  /*
  ========================================================
  COLHEITA
  ========================================================
  */

  FRUTO: {
    categoria: "COLHEITA",
    nome: "Fruto",
    icone: "🍎"
  },

  FLOR: {
    categoria: "COLHEITA",
    nome: "Flor",
    icone: "🌸"
  },


  /*
  ========================================================
  MATERIAIS
  ========================================================
  */

  CASCA: {
    categoria: "MATERIAIS",
    nome: "Casca",
    icone: "🍂"
  },

  PETALA: {
    categoria: "MATERIAIS",
    nome: "Pétala",
    icone: "🌺"
  },


  /*
  ========================================================
  SOLOS
  ========================================================
  */

  SOLO_COMUM: {
    categoria: "SOLOS",
    nome: "Solo comum",
    icone: "🪴"
  },

  SOLO_MINERAL: {
    categoria: "SOLOS",
    nome: "Solo mineral",
    icone: "🪨"
  },

  SOLO_ORGANICO: {
    categoria: "SOLOS",
    nome: "Solo orgânico",
    icone: "🌿"
  },

  SOLO_ADITIVADO_CASCA: {
    categoria: "SOLOS",
    nome: "Solo com casca",
    icone: "🍂"
  },

  SOLO_ADITIVADO_PETALA: {
    categoria: "SOLOS",
    nome: "Solo com pétala",
    icone: "🌺"
  },


  /*
  ========================================================
  ITENS / FERRAMENTAS
  ========================================================
  */

  LAMPADA_FRACA: {
    categoria: "ITENS",
    nome: "Lâmpada fraca",
    icone: "💡"
  },

  LAMPADA_FORTE: {
    categoria: "ITENS",
    nome: "Lâmpada forte",
    icone: "🔆"
  }

};


const ABAS_INVENTARIO_V070 = {

  SEMENTES: {
    nome: "Sementes",
    icone: "🌱"
  },

  COLHEITA: {
    nome: "Colheita",
    icone: "🍎"
  },

  MATERIAIS: {
    nome: "Materiais",
    icone: "🍂"
  },

  SOLOS: {
    nome: "Solos",
    icone: "🪴"
  },

  ITENS: {
    nome: "Itens",
    icone: "🔧"
  }

};


let abaInventarioV070 =
  "SEMENTES";


/*
==========================================================
ESTRUTURA PERSISTENTE
==========================================================
*/


function garantirInventarioV070() {

  estado.inventarioEstruturado ??= {

    versao: 1,

    pilhas: {},

    itens: [],

    sequencias: {
      SD: 0,
      FR: 0,
      FL: 0,
      PT: 0,
      CS: 0
    }

  };


  estado.inventarioEstruturado.pilhas ??= {};

  estado.inventarioEstruturado.itens ??= [];

  estado.inventarioEstruturado.sequencias ??= {
    SD: 0,
    FR: 0,
    FL: 0,
    PT: 0,
    CS: 0
  };


  sincronizarPilhasV070();

}


/*
==========================================================
SINCRONIZA INVENTÁRIO ANTIGO
==========================================================

Por enquanto:

estado.inventario
    ↓
inventarioEstruturado.pilhas

Assim nenhuma ação antiga quebra.
*/


function sincronizarPilhasV070() {

  const antigo =
    estado.inventario || {};


  for (
    const chave
    of Object.keys(
      CATALOGO_INVENTARIO_V070
    )
  ) {

    estado
      .inventarioEstruturado
      .pilhas[chave] =
        Number(
          antigo[chave] || 0
        );

  }

}


/*
==========================================================
GERADOR DE IDs
==========================================================
*/


function novoIdInventarioV070(
  prefixo
) {

  garantirInventarioV070();


  const sequencias =
    estado
      .inventarioEstruturado
      .sequencias;


  sequencias[prefixo] ??= 0;

  sequencias[prefixo]++;


  return (
    prefixo
    +
    "-"
    +
    String(
      sequencias[prefixo]
    ).padStart(
      5,
      "0"
    )
  );

}


/*
==========================================================
OBJETO INDIVIDUAL
==========================================================
*/


function adicionarItemIndividualV070(
  dados
) {

  garantirInventarioV070();


  if (!dados?.id) {
    return null;
  }


  const existe =
    estado
      .inventarioEstruturado
      .itens
      .some(
        item =>
          item.id === dados.id
      );


  if (existe) {

    return estado
      .inventarioEstruturado
      .itens
      .find(
        item =>
          item.id === dados.id
      );

  }


  const item = {

    criadoEm:
      Date.now(),

    ...structuredClone(
      dados
    )

  };


  estado
    .inventarioEstruturado
    .itens
    .push(
      item
    );


  salvar();


  return item;

}


/*
==========================================================
CAPTURA A SEMENTE-DNA EXISTENTE
==========================================================

O motor atual mantém uma Semente-DNA em estado.sementeDNA.

Aqui transformamos isso em objeto individual.
*/


function capturarSementeDNAV070() {

  garantirInventarioV070();


  const semente =
    estado.sementeDNA;


  if (!semente) {
    return;
  }


  /*
  Criamos uma assinatura estável da semente atual.
  Isso impede que cada render crie outra cópia.
  */

  const assinatura = JSON.stringify({

    geracao:
      semente.geracao,

    base:
      semente.sementeBase
      ||
      estado.sementeBase,

    dna:
      semente.dna,

    alteracoes:
      semente.alteracoes || []

  });


  const jaExiste =
    estado
      .inventarioEstruturado
      .itens
      .some(
        item =>
          item.tipo === "SEMENTE_DNA"
          &&
          item.assinaturaOrigem
            === assinatura
      );


  if (jaExiste) {
    return;
  }


  const id =
    novoIdInventarioV070(
      "SD"
    );


  const ancestral =
    estado.corSemente
    ||
    (
      typeof SEMENTES_V060
      !== "undefined"
      &&
      SEMENTES_V060[
        estado.sementeBase
      ]?.cor
    )
    ||
    estado.sementeBase
    ||
    "DESCONHECIDA";


  adicionarItemIndividualV070({

    id,

    tipo:
      "SEMENTE_DNA",

    categoria:
      "SEMENTES",

    nome:
      `Semente-DNA G${semente.geracao}`,

    icone:
      "🧬",

    assinaturaOrigem:
      assinatura,

    geracao:
      semente.geracao,

    ancestral,

    sementeBase:
      semente.sementeBase
      ||
      estado.sementeBase,

    dna:
      structuredClone(
        semente.dna || {}
      ),

    alteracoes:
      structuredClone(
        semente.alteracoes || []
      ),

    historiaMae:
      structuredClone(
        semente.historiaMae || {}
      ),

    procedencia: {

      plantaGeracao:
        estado.geracao,

      plantaBase:
        estado.sementeBase,

      cor:
        estado.corSemente
        || ancestral,

      idadeDaPlanta:
        estado.idade,

      dia:
        estado.tempo?.dia
        ?? null

    }

  });


  if (
    typeof mostrarSinalV061
    === "function"
  ) {

    mostrarSinalV061(
      "SEMENTE_DNA",
      {
        duracao: 2200,
        texto:
          "Semente-DNA guardada no inventário!"
      }
    );

  }

}


/*
==========================================================
CRIAR INTERFACE
==========================================================
*/


function criarInventarioV070() {

  if (
    document.querySelector(
      "#modalInventarioV070"
    )
  ) {

    return;

  }


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "modalInventarioV070";


  modal.className =
    "inventario-modal-v070 escondido";


  modal.innerHTML = `

    <div class="inventario-caixa-v070">

      <div class="inventario-topo-v070">

        <div>

          <span class="inventario-eyebrow-v070">
            SUA COLEÇÃO
          </span>

          <h2>
            Inventário
          </h2>

        </div>


        <div class="inventario-topo-direita-v070">

          <div class="inventario-moedas-v070">
            🪙
            <strong id="moedasInventarioV070">
              0
            </strong>
          </div>

          <button
            id="fecharInventarioV070"
            class="fechar-inventario-v070"
          >
            ✕
          </button>

        </div>

      </div>


      <div
        id="abasInventarioV070"
        class="abas-inventario-v070"
      ></div>


      <div
        id="conteudoInventarioV070"
        class="conteudo-inventario-v070"
      ></div>

    </div>

  `;


  document.body.appendChild(
    modal
  );


  document
    .querySelector(
      "#fecharInventarioV070"
    )
    .onclick =
      fecharInventarioV070;


  modal.onclick =
    evento => {

      if (
        evento.target === modal
      ) {

        fecharInventarioV070();

      }

    };

}


/*
==========================================================
ABAS
==========================================================
*/


function renderAbasInventarioV070() {

  const area =
    document.querySelector(
      "#abasInventarioV070"
    );


  if (!area) {
    return;
  }


  area.innerHTML =
    Object.entries(
      ABAS_INVENTARIO_V070
    )
    .map(
      ([id, aba]) => `

        <button
          class="
            aba-inventario-v070
            ${
              abaInventarioV070 === id
              ? "ativa"
              : ""
            }
          "
          data-aba-inventario="${id}"
        >

          <span>
            ${aba.icone}
          </span>

          ${aba.nome}

        </button>

      `
    )
    .join("");


  area
    .querySelectorAll(
      "[data-aba-inventario]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            abaInventarioV070 =
              botao.dataset
                .abaInventario;

            renderInventarioV070();

          };

      }
    );

}


/*
==========================================================
PILHAS
==========================================================
*/


function pilhasDaAbaV070(
  categoria
) {

  garantirInventarioV070();


  return Object.entries(
    CATALOGO_INVENTARIO_V070
  )
  .filter(
    ([chave, dados]) => {

      return (
        dados.categoria
        === categoria
        &&
        (
          estado
            .inventarioEstruturado
            .pilhas[chave]
          || 0
        ) > 0
      );

    }
  );

}


/*
==========================================================
INDIVIDUAIS
==========================================================
*/


function individuaisDaAbaV070(
  categoria
) {

  garantirInventarioV070();


  return estado
    .inventarioEstruturado
    .itens
    .filter(
      item =>
        item.categoria
        === categoria
    );

}


/*
==========================================================
CARD EMPILHÁVEL
==========================================================
*/


function htmlPilhaV070(
  chave,
  dados
) {

  const qtd =
    estado
      .inventarioEstruturado
      .pilhas[chave]
    || 0;


  return `

    <button
      class="item-inventario-v070"
      data-pilha-v070="${chave}"
    >

      <div class="item-icone-v070">
        ${dados.icone}
      </div>

      <div class="item-info-v070">

        <strong>
          ${dados.nome}
        </strong>

        <span>
          Recurso
        </span>

      </div>

      <div class="item-quantidade-v070">
        ×${qtd}
      </div>

    </button>

  `;

}


/*
==========================================================
CARD INDIVIDUAL
==========================================================
*/


function htmlIndividualV070(
  item
) {

  let subtitulo =
    "Item único";


  if (
    item.tipo ===
    "SEMENTE_DNA"
  ) {

    subtitulo =
      `Geração ${item.geracao}`;

  }


  return `

    <button
      class="
        item-inventario-v070
        item-individual-v070
      "
      data-item-v070="${item.id}"
    >

      <div class="item-icone-v070">
        ${item.icone || "📦"}
      </div>

      <div class="item-info-v070">

        <strong>
          ${item.nome}
        </strong>

        <span>
          ${subtitulo}
        </span>

      </div>

      <div class="item-id-v070">
        ${item.id}
      </div>

    </button>

  `;

}


/*
==========================================================
RENDER CONTEÚDO
==========================================================
*/


function renderConteudoInventarioV070() {

  const area =
    document.querySelector(
      "#conteudoInventarioV070"
    );


  if (!area) {
    return;
  }


  const pilhas =
    pilhasDaAbaV070(
      abaInventarioV070
    );


  const individuais =
    individuaisDaAbaV070(
      abaInventarioV070
    );


  if (
    pilhas.length === 0
    &&
    individuais.length === 0
  ) {

    area.innerHTML = `

      <div class="inventario-vazio-v070">

        <div>
          📦
        </div>

        <strong>
          Nada aqui ainda
        </strong>

        <p>
          Conforme você cuida da planta,
          novos itens aparecem por aqui.
        </p>

      </div>

    `;

    return;

  }


  area.innerHTML = `

    <div class="lista-inventario-v070">

      ${individuais
        .map(
          htmlIndividualV070
        )
        .join("")}

      ${pilhas
        .map(
          ([chave, dados]) =>
            htmlPilhaV070(
              chave,
              dados
            )
        )
        .join("")}

    </div>

  `;


  area
    .querySelectorAll(
      "[data-item-v070]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            abrirFichaItemV070(
              botao.dataset
                .itemV070
            );

          };

      }
    );


  area
    .querySelectorAll(
      "[data-pilha-v070]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            abrirFichaPilhaV070(
              botao.dataset
                .pilhaV070
            );

          };

      }
    );

}


/*
==========================================================
FICHA DE PILHA
==========================================================
*/


function abrirFichaPilhaV070(
  chave
) {

  const dados =
    CATALOGO_INVENTARIO_V070[
      chave
    ];


  if (!dados) {
    return;
  }


  const qtd =
    estado
      .inventarioEstruturado
      .pilhas[chave]
    || 0;


  abrirFichaGenericaV070({

    icone:
      dados.icone,

    titulo:
      dados.nome,

    subtitulo:
      `Quantidade: ${qtd}`,

    corpo: `

      <div class="ficha-linha-v070">

        <span>
          Tipo
        </span>

        <strong>
          Recurso empilhável
        </strong>

      </div>

      <div class="ficha-linha-v070">

        <span>
          Categoria
        </span>

        <strong>
          ${dados.categoria}
        </strong>

      </div>

    `

  });

}


/*
==========================================================
FICHA DE ITEM INDIVIDUAL
==========================================================
*/


function abrirFichaItemV070(
  id
) {

  const item =
    estado
      .inventarioEstruturado
      .itens
      .find(
        item =>
          item.id === id
      );


  if (!item) {
    return;
  }


  if (
    item.tipo ===
    "SEMENTE_DNA"
  ) {

    abrirFichaSementeDNAV070(
      item
    );

    return;

  }


  abrirFichaGenericaV070({

    icone:
      item.icone || "📦",

    titulo:
      item.nome,

    subtitulo:
      item.id,

    corpo: `

      <div class="ficha-linha-v070">

        <span>
          ID
        </span>

        <strong>
          ${item.id}
        </strong>

      </div>

    `

  });

}


/*
==========================================================
FICHA DA SEMENTE-DNA
==========================================================
*/


function abrirFichaSementeDNAV070(
  item
) {

  const dna =
    item.dna || {};


  const alteracoes =
    item.alteracoes || [];


  const textoAlteracoes =
    alteracoes.length
    ? alteracoes
        .map(
          a =>
            a
              .replaceAll(
                "_",
                " "
              )
        )
        .join(", ")
    : "Nenhuma alteração registrada";


  abrirFichaGenericaV070({

    icone:
      "🧬",

    titulo:
      item.nome,

    subtitulo:
      `${item.id} • origem ${item.ancestral}`,

    corpo: `

      <div class="ficha-secao-v070">

        <h4>
          Características
        </h4>

        <div class="dna-ficha-grid-v070">

          <div>
            <span>Vigor</span>
            <strong>
              ${dna.vigor ?? "—"}
            </strong>
          </div>

          <div>
            <span>Sombra</span>
            <strong>
              ${dna.sombra ?? "—"}
            </strong>
          </div>

          <div>
            <span>Seca</span>
            <strong>
              ${dna.seca ?? "—"}
            </strong>
          </div>

          ${
            dna.plasticidade !== undefined
            ? `

              <div>
                <span>
                  Plasticidade
                </span>

                <strong>
                  ${dna.plasticidade}
                </strong>
              </div>

            `
            : ""
          }

        </div>

      </div>


      <div class="ficha-secao-v070">

        <h4>
          Linhagem
        </h4>

        <div class="ficha-linha-v070">

          <span>
            Geração
          </span>

          <strong>
            ${item.geracao}
          </strong>

        </div>

        <div class="ficha-linha-v070">

          <span>
            Ancestral
          </span>

          <strong>
            ${item.ancestral}
          </strong>

        </div>

      </div>


      <div class="ficha-secao-v070">

        <h4>
          Alterações
        </h4>

        <p class="texto-ficha-v070">
          ${textoAlteracoes}
        </p>

      </div>


      <div class="ficha-secao-v070">

        <h4>
          Procedência
        </h4>

        <div class="ficha-linha-v070">

          <span>
            Planta-mãe
          </span>

          <strong>
            G${item.procedencia?.plantaGeracao ?? "—"}
          </strong>

        </div>

        <div class="ficha-linha-v070">

          <span>
            Idade ao produzir
          </span>

          <strong>
            ${item.procedencia?.idadeDaPlanta ?? "—"}
          </strong>

        </div>

        ${
          item.procedencia?.dia !== null
          &&
          item.procedencia?.dia !== undefined
          ? `

            <div class="ficha-linha-v070">

              <span>
                Dia
              </span>

              <strong>
                ${item.procedencia.dia}
              </strong>

            </div>

          `
          : ""
        }

      </div>

    `

  });

}


/*
==========================================================
MODAL DA FICHA
==========================================================
*/


function abrirFichaGenericaV070(
  dados
) {

  let modal =
    document.querySelector(
      "#fichaItemV070"
    );


  if (!modal) {

    modal =
      document.createElement(
        "div"
      );


    modal.id =
      "fichaItemV070";


    modal.className =
      "ficha-item-modal-v070";


    document.body.appendChild(
      modal
    );

  }


  modal.innerHTML = `

    <div class="ficha-item-caixa-v070">

      <button
        id="fecharFichaItemV070"
        class="fechar-ficha-v070"
      >
        ✕
      </button>


      <div class="ficha-item-cabecalho-v070">

        <div class="ficha-item-icone-v070">
          ${dados.icone}
        </div>

        <div>

          <h3>
            ${dados.titulo}
          </h3>

          <span>
            ${dados.subtitulo || ""}
          </span>

        </div>

      </div>


      <div class="ficha-item-corpo-v070">

        ${dados.corpo || ""}

      </div>

    </div>

  `;


  modal
    .querySelector(
      "#fecharFichaItemV070"
    )
    .onclick =
      () => {

        modal.remove();

      };


  modal.onclick =
    evento => {

      if (
        evento.target === modal
      ) {

        modal.remove();

      }

    };

}


/*
==========================================================
ABRIR / FECHAR INVENTÁRIO
==========================================================
*/


function abrirInventarioV070() {

  garantirInventarioV070();

  capturarSementeDNAV070();

  criarInventarioV070();

  renderInventarioV070();


  document
    .querySelector(
      "#modalInventarioV070"
    )
    ?.classList
    .remove(
      "escondido"
    );

}


function fecharInventarioV070() {

  document
    .querySelector(
      "#modalInventarioV070"
    )
    ?.classList
    .add(
      "escondido"
    );

}


/*
==========================================================
RENDER INVENTÁRIO
==========================================================
*/


function renderInventarioV070() {

  garantirInventarioV070();

  capturarSementeDNAV070();

  renderAbasInventarioV070();

  renderConteudoInventarioV070();


  const moedas =
    document.querySelector(
      "#moedasInventarioV070"
    );


  if (moedas) {

    moedas.textContent =
      estado.moedas ?? 0;

  }

}


/*
==========================================================
TRANSFORMA CARD ANTIGO EM BOTÃO
==========================================================
*/


function prepararBotaoInventarioV070() {

  const cardAntigo =
    document.querySelector(
      "#inventario"
    );


  if (!cardAntigo) {
    return;
  }


  cardAntigo.innerHTML = `

    <button
      id="abrirInventarioV070"
      class="abrir-inventario-v070"
    >

      <span>
        🎒
      </span>

      <div>

        <strong>
          Abrir inventário
        </strong>

        <small>
          Sementes, colheitas e materiais
        </small>

      </div>

      <b>
        ›
      </b>

    </button>

  `;


  document
    .querySelector(
      "#abrirInventarioV070"
    )
    .onclick =
      abrirInventarioV070;

}


/*
==========================================================
ENVOLVE RENDER
==========================================================
*/


const renderAnteriorV070 =
  render;


render =
  function() {

    garantirInventarioV070();

    capturarSementeDNAV070();

    renderAnteriorV070();

    prepararBotaoInventarioV070();

  };


/*
==========================================================
INICIALIZAÇÃO
==========================================================
*/


garantirInventarioV070();

capturarSementeDNAV070();

criarInventarioV070();

salvar();

render();
