/*
==========================================================
A PLANTINHA — V0.7.1
COLHEITA COM IDENTIDADE
==========================================================

FRUTOS, FLORES, CASCAS E PÉTALAS passam a possuir:

- ID único;
- planta de origem;
- geração;
- semente ancestral;
- saúde no momento da produção;
- solo;
- luz;
- dia;
- procedência.

O motor antigo continua usando contadores para
compatibilidade.

Esta camada observa as transações e cria os
objetos correspondentes no inventário estruturado.
*/


/*
==========================================================
CATÁLOGO
==========================================================
*/


const TIPOS_COLHEITA_V071 = {

  FRUTO: {
    prefixo: "FR",
    nome: "Fruto",
    icone: "🍎",
    categoria: "COLHEITA"
  },

  FLOR: {
    prefixo: "FL",
    nome: "Flor",
    icone: "🌸",
    categoria: "COLHEITA"
  },

  CASCA: {
    prefixo: "CS",
    nome: "Casca",
    icone: "🍂",
    categoria: "MATERIAIS"
  },

  PETALA: {
    prefixo: "PT",
    nome: "Pétala",
    icone: "🌺",
    categoria: "MATERIAIS"
  }

};


/*
==========================================================
GARANTIAS
==========================================================
*/


function garantirColheitaV071() {

  if (
    typeof garantirInventarioV070
    === "function"
  ) {

    garantirInventarioV070();

  }


  estado.colheitaIdentificada ??= {

    versao: 1,

    inicializada: false

  };

}


/*
==========================================================
FOTOGRAFIA DA PLANTA
==========================================================
*/


function retratoPlantaV071() {

  return {

    geracao:
      estado.geracao,

    sementeBase:
      estado.sementeBase,

    cor:
      estado.corSemente
      ||
      estado.sementeBase,

    dna:
      structuredClone(
        estado.dna || {}
      ),

    saude:
      estado.saude ?? 100,

    idade:
      estado.idade,

    solo:
      estado.solo,

    luz:
      estado.luz,

    umidade:
      estado.umidade,

    dia:
      estado.tempo?.dia
      ?? null,

    hora:
      estado.tempo?.hora
      ?? null

  };

}


/*
==========================================================
QUALIDADE INICIAL
==========================================================

Ainda NÃO é uma lei definitiva.

É somente uma classificação simples para começarmos
a consultar diferenças entre colheitas.

Não altera crescimento nem genética.
*/


function qualidadeColheitaV071(
  retrato
) {

  const saude =
    retrato.saude ?? 100;


  if (
    saude >= 90
  ) {

    return {
      nivel: 3,
      nome: "Ótima"
    };

  }


  if (
    saude >= 60
  ) {

    return {
      nivel: 2,
      nome: "Boa"
    };

  }


  return {
    nivel: 1,
    nome: "Simples"
  };

}


/*
==========================================================
CRIAR OBJETO
==========================================================
*/


function criarObjetoColheitaV071(
  tipo,
  origemExtra = {},
  retratoOrigem = null
) {

  garantirColheitaV071();


  const modelo =
    TIPOS_COLHEITA_V071[
      tipo
    ];


  if (!modelo) {
    return null;
  }


  const retrato =
    structuredClone(retratoOrigem || retratoPlantaV071());


  const qualidade =
    qualidadeColheitaV071(
      retrato
    );


  const id =
    novoIdInventarioV070(
      modelo.prefixo
    );


  const item = {

    id,

    tipo,

    categoria:
      modelo.categoria,

    nome:
      modelo.nome,

    icone:
      modelo.icone,

    qualidade,

    origemPlanta:
      retrato,

    procedencia: {

      plantaGeracao:
        retrato.geracao,

      plantaBase:
        retrato.sementeBase,

      cor:
        retrato.cor,

      idadeDaPlanta:
        retrato.idade,

      dia:
        retrato.dia,

      hora:
        retrato.hora,

      ...structuredClone(
        origemExtra
      )

    }

  };


  adicionarItemIndividualV070(
    item
  );


  return item;

}


/*
==========================================================
BUSCA ITEM DISPONÍVEL
==========================================================
*/


function primeiroItemV071(
  tipo
) {

  garantirColheitaV071();


  return estado
    .inventarioEstruturado
    .itens
    .find(
      item =>
        item.tipo === tipo
    )
    || null;

}


/*
==========================================================
REMOVER OBJETO INDIVIDUAL
==========================================================
*/


function removerItemV071(
  id
) {

  garantirColheitaV071();


  const indice =
    estado
      .inventarioEstruturado
      .itens
      .findIndex(
        item =>
          item.id === id
      );


  if (
    indice < 0
  ) {

    return null;

  }


  const [
    removido
  ] =
    estado
      .inventarioEstruturado
      .itens
      .splice(
        indice,
        1
      );


  return removido;

}


/*
==========================================================
CAPTURA DE COLHEITA
==========================================================
*/


function registrarNovosItensV071(
  tipo,
  quantidade
) {

  if (
    quantidade <= 0
  ) {

    return [];

  }


  const criados = [];


  for (
    let i = 0;
    i < quantidade;
    i++
  ) {

    const item =
      criarObjetoColheitaV071(
        tipo
      );


    if (item) {

      criados.push(
        item
      );

    }

  }


  return criados;

}


/*
==========================================================
CONTAGEM INDIVIDUAL
==========================================================
*/


function contarIndividuaisV071(
  tipo
) {

  garantirColheitaV071();


  return estado
    .inventarioEstruturado
    .itens
    .filter(
      item =>
        item.tipo === tipo
    )
    .length;

}


/*
==========================================================
SINCRONIZAR SAVE ANTIGO
==========================================================

Se o jogador já tinha frutos/flores antes desta versão,
criamos objetos equivalentes uma única vez.

Eles recebem procedência "legado".
*/


function migrarColheitaAntigaV071() {

  garantirColheitaV071();


  if (
    estado
      .colheitaIdentificada
      .inicializada
  ) {

    return;

  }


  const antigo =
    estado.inventario || {};


  for (
    const tipo
    of [
      "FRUTO",
      "FLOR",
      "CASCA",
      "PETALA"
    ]
  ) {

    const quantidade =
      Number(
        antigo[tipo] || 0
      );


    const existentes =
      contarIndividuaisV071(
        tipo
      );


    const faltam =
      Math.max(
        0,
        quantidade - existentes
      );


    for (
      let i = 0;
      i < faltam;
      i++
    ) {

      criarObjetoColheitaV071(
        tipo,
        {
          migrado:
            true,

          origem:
            "SAVE_ANTERIOR"
        }
      );

    }

  }


  estado
    .colheitaIdentificada
    .inicializada =
      true;


  salvar();

}


/*
==========================================================
OBSERVAR UMA TRANSAÇÃO
==========================================================

Executa a ação antiga e compara os contadores antes/depois.
*/


function observarTransacaoV071(
  acao
) {

  garantirColheitaV071();


  const antes = {

    FRUTO:
      estado.inventario?.FRUTO || 0,

    FLOR:
      estado.inventario?.FLOR || 0,

    CASCA:
      estado.inventario?.CASCA || 0,

    PETALA:
      estado.inventario?.PETALA || 0

  };


  acao();


  const depois = {

    FRUTO:
      estado.inventario?.FRUTO || 0,

    FLOR:
      estado.inventario?.FLOR || 0,

    CASCA:
      estado.inventario?.CASCA || 0,

    PETALA:
      estado.inventario?.PETALA || 0

  };


  /*
  ========================================================
  NOVA COLHEITA
  ========================================================
  */


  const novosFrutos =
    depois.FRUTO
    -
    antes.FRUTO;


  const novasFlores =
    depois.FLOR
    -
    antes.FLOR;


  if (
    novosFrutos > 0
  ) {

    registrarNovosItensV071(
      "FRUTO",
      novosFrutos
    );

  }


  if (
    novasFlores > 0
  ) {

    registrarNovosItensV071(
      "FLOR",
      novasFlores
    );

  }


  /*
  ========================================================
  VENDA / CONSUMO DE FRUTO
  ========================================================
  */


  const frutosConsumidos =
    Math.max(
      0,
      antes.FRUTO
      -
      depois.FRUTO
    );


  const cascasCriadas =
    Math.max(
      0,
      depois.CASCA
      -
      antes.CASCA
    );


  for (
    let i = 0;
    i < frutosConsumidos;
    i++
  ) {

    const fruto =
      primeiroItemV071(
        "FRUTO"
      );


    if (!fruto) {
      break;
    }


    removerItemV071(
      fruto.id
    );


    /*
    Se a ação antiga produziu casca,
    criamos a casca vinculada ao fruto.
    */

    if (
      i < cascasCriadas
    ) {

      criarObjetoColheitaV071(
        "CASCA",
        {
          frutoOrigem:
            fruto.id,

          plantaOrigem:
            fruto.procedencia
              ?.plantaBase,

          geracaoOrigem:
            fruto.procedencia
              ?.plantaGeracao
        }
      );

    }

  }


  /*
  ========================================================
  VENDA / CONSUMO DE FLOR
  ========================================================
  */


  const floresConsumidas =
    Math.max(
      0,
      antes.FLOR
      -
      depois.FLOR
    );


  const petalasCriadas =
    Math.max(
      0,
      depois.PETALA
      -
      antes.PETALA
    );


  for (
    let i = 0;
    i < floresConsumidas;
    i++
  ) {

    const flor =
      primeiroItemV071(
        "FLOR"
      );


    if (!flor) {
      break;
    }


    removerItemV071(
      flor.id
    );


    if (
      i < petalasCriadas
    ) {

      criarObjetoColheitaV071(
        "PETALA",
        {
          florOrigem:
            flor.id,

          plantaOrigem:
            flor.procedencia
              ?.plantaBase,

          geracaoOrigem:
            flor.procedencia
              ?.plantaGeracao
        }
      );

    }

  }


  /*
  ========================================================
  CASCA/PÉTALA USADA EM SOLO
  ========================================================
  */


  const cascasConsumidas =
    Math.max(
      0,
      antes.CASCA
      -
      depois.CASCA
    );


  /*
  Não remover novamente se a diferença veio
  da própria criação de casca na venda.
  */

  if (
    cascasConsumidas > 0
    &&
    frutosConsumidos === 0
  ) {

    for (
      let i = 0;
      i < cascasConsumidas;
      i++
    ) {

      const casca =
        primeiroItemV071(
          "CASCA"
        );


      if (casca) {

        removerItemV071(
          casca.id
        );

      }

    }

  }


  const petalasConsumidas =
    Math.max(
      0,
      antes.PETALA
      -
      depois.PETALA
    );


  if (
    petalasConsumidas > 0
    &&
    floresConsumidas === 0
  ) {

    for (
      let i = 0;
      i < petalasConsumidas;
      i++
    ) {

      const petala =
        primeiroItemV071(
          "PETALA"
        );


      if (petala) {

        removerItemV071(
          petala.id
        );

      }

    }

  }


  salvar();

}


/*
==========================================================
ESCONDER PILHAS ANTIGAS
==========================================================

Os contadores continuam existindo no motor,
mas FRUTO/FLOR/CASCA/PETALA não aparecem mais
como pilhas no novo inventário.
*/


const pilhasDaAbaAnteriorV071 =
  pilhasDaAbaV070;


pilhasDaAbaV070 =
  function(
    categoria
  ) {

    return pilhasDaAbaAnteriorV071(
      categoria
    )
    .filter(
      ([chave]) =>
        ![
          "FRUTO",
          "FLOR",
          "CASCA",
          "PETALA"
        ].includes(
          chave
        )
    );

  };


/*
==========================================================
FICHAS
==========================================================
*/


const abrirFichaItemAnteriorV071 =
  abrirFichaItemV070;


abrirFichaItemV070 =
  function(
    id
  ) {

    const item =
      estado
        .inventarioEstruturado
        .itens
        .find(
          x =>
            x.id === id
        );


    if (!item) {

      return;

    }


    if (
      [
        "FRUTO",
        "FLOR",
        "CASCA",
        "PETALA"
      ].includes(
        item.tipo
      )
    ) {

      abrirFichaColheitaV071(
        item
      );

      return;

    }


    abrirFichaItemAnteriorV071(
      id
    );

  };


function abrirFichaColheitaV071(
  item
) {

  const origem =
    item.origemPlanta || {};


  const qualidade =
    item.qualidade || {
      nome: "—",
      nivel: 0
    };


  const estrelas =
    "★".repeat(
      qualidade.nivel || 0
    )
    +
    "☆".repeat(
      Math.max(
        0,
        3
        -
        (
          qualidade.nivel || 0
        )
      )
    );


  let origemSecundaria = "";


  if (
    item.tipo === "CASCA"
    &&
    item.procedencia
      ?.frutoOrigem
  ) {

    origemSecundaria = `

      <div class="ficha-linha-v070">

        <span>
          Veio do fruto
        </span>

        <strong>
          ${item.procedencia.frutoOrigem}
        </strong>

      </div>

    `;

  }


  if (
    item.tipo === "PETALA"
    &&
    item.procedencia
      ?.florOrigem
  ) {

    origemSecundaria = `

      <div class="ficha-linha-v070">

        <span>
          Veio da flor
        </span>

        <strong>
          ${item.procedencia.florOrigem}
        </strong>

      </div>

    `;

  }


  abrirFichaGenericaV070({

    icone:
      item.icone,

    titulo:
      item.nome,

    subtitulo:
      item.id,

    corpo: `

      <div class="ficha-secao-v070">

        <h4>
          Qualidade
        </h4>

        <div class="qualidade-v071">

          <strong>
            ${estrelas}
          </strong>

          <span>
            ${qualidade.nome}
          </span>

        </div>

      </div>


      <div class="ficha-secao-v070">

        <h4>
          Planta de origem
        </h4>


        <div class="ficha-linha-v070">

          <span>
            Linhagem
          </span>

          <strong>
            ${origem.cor || "—"}
          </strong>

        </div>


        <div class="ficha-linha-v070">

          <span>
            Geração
          </span>

          <strong>
            ${origem.geracao ?? "—"}
          </strong>

        </div>


        <div class="ficha-linha-v070">

          <span>
            Saúde
          </span>

          <strong>
            ${
              origem.saude !== undefined
              ? origem.saude + "%"
              : "—"
            }
          </strong>

        </div>


        <div class="ficha-linha-v070">

          <span>
            Solo
          </span>

          <strong>
            ${origem.solo || "—"}
          </strong>

        </div>


        <div class="ficha-linha-v070">

          <span>
            Luz
          </span>

          <strong>
            ${origem.luz || "—"}
          </strong>

        </div>


        ${origemSecundaria}

      </div>


      <div class="ficha-secao-v070">

        <h4>
          Quando surgiu
        </h4>


        <div class="ficha-linha-v070">

          <span>
            Dia
          </span>

          <strong>
            ${origem.dia ?? "—"}
          </strong>

        </div>


        <div class="ficha-linha-v070">

          <span>
            Idade da planta
          </span>

          <strong>
            ${origem.idade ?? "—"}
          </strong>

        </div>

      </div>

    `

  });

}


/*
==========================================================
HOOK NOS BOTÕES
==========================================================

Como diferentes versões do projeto podem ter nomes
ligeiramente diferentes, tentamos alguns IDs conhecidos.
*/


function envolverBotaoV071(
  seletor
) {

  const botao =
    document.querySelector(
      seletor
    );


  if (
    !botao
    ||
    botao.dataset
      .colheitaV071 === "1"
  ) {

    return;

  }


  const acaoAnterior =
    botao.onclick;


  if (
    typeof acaoAnterior
    !== "function"
  ) {

    return;

  }


  botao.dataset
    .colheitaV071 =
      "1";


  botao.onclick =
    function(
      evento
    ) {

      observarTransacaoV071(
        () =>
          acaoAnterior.call(
            botao,
            evento
          )
      );


      if (
        typeof render
        === "function"
      ) {

        render();

      }

    };

}


/*
==========================================================
INSTALAR HOOKS
==========================================================
*/


function instalarHooksV071() {

  const seletores = [

    "#btnColher",

    "#btnVenderFruto",

    "#btnVenderFlor",

    "#btnSoloCasca",

    "#btnSoloPetala",

    "#btnProduzirSoloCasca",

    "#btnProduzirSoloPetala"

  ];


  for (
    const seletor
    of seletores
  ) {

    envolverBotaoV071(
      seletor
    );

  }

}


/*
==========================================================
RENDER
==========================================================
*/


const renderAnteriorV071 =
  render;


render =
  function() {

    garantirColheitaV071();

    renderAnteriorV071();

    instalarHooksV071();

  };


/*
==========================================================
INICIALIZAÇÃO
==========================================================
*/


garantirColheitaV071();

migrarColheitaAntigaV071();

instalarHooksV071();

salvar();

render();
