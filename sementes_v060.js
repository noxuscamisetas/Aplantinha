/*
==========================================================
A PLANTINHA — V0.6
AS CINCO SEMENTES
==========================================================

IDs internos permanecem S1...S5.

Nomes mostrados ao jogador:
S1 = VERDE
S2 = VERMELHA
S3 = AZUL
S4 = MARROM
S5 = AMARELA

A escolha não altera um save existente até
o jogador confirmar uma nova semente.
*/


const SEMENTES_V060 = {

  S1: {
    cor: "VERDE",

    classe: "semente-verde",

    descricao:
      "Uma semente equilibrada e tranquila para começar.",

    dna: {
      vigor: 2,
      sombra: 1,
      seca: 0,
      plasticidade: 0
    }
  },


  S2: {
    cor: "VERMELHA",

    classe: "semente-vermelha",

    descricao:
      "Cresce depressa quando recebe bastante cuidado.",

    dna: {
      vigor: 3,
      sombra: 0,
      seca: 0,
      plasticidade: 0
    }
  },


  S3: {
    cor: "AZUL",

    classe: "semente-azul",

    descricao:
      "Parece se sentir bem em lugares com menos luz.",

    dna: {
      vigor: 1,
      sombra: 2,
      seca: 0,
      plasticidade: 0
    }
  },


  S4: {
    cor: "MARROM",

    classe: "semente-marrom",

    descricao:
      "Tem um jeitinho resistente quando a água fica curta.",

    dna: {
      vigor: 1,
      sombra: 0,
      seca: 2,
      plasticidade: 0
    }
  },


  S5: {
    cor: "AMARELA",

    classe: "semente-amarela",

    descricao:
      "Uma semente curiosa que começa com características bem misturadas.",

    dna: {
      vigor: 1,
      sombra: 1,
      seca: 1,
      plasticidade: 1
    }
  }

};


/*
==========================================================
METADADOS DO SAVE
==========================================================
*/


function garantirSementeV060() {

  if (
    !estado.sementeBase
    ||
    !SEMENTES_V060[estado.sementeBase]
  ) {

    estado.sementeBase = "S1";

  }


  estado.corSemente ??=
    SEMENTES_V060[
      estado.sementeBase
    ].cor;

}


/*
Detecta apenas um universo recém-criado pelo motor antigo.

Isso impede que o seletor apareça por cima do save
que já está sendo jogado.
*/

function universoPareceNovoV060() {

  return (

    estado.geracao === 0

    &&

    estado.idade === 0

    &&

    estado.energia === 0

    &&

    estado.estagio === "SEMENTE"

    &&

    estado.linhagem?.length === 1

    &&

    estado.historico?.length === 1

    &&

    estado.historico[0]
      ?.includes(
        "Uma nova semente"
      )

  );

}


/*
==========================================================
CRIA O SELETOR
==========================================================
*/


function criarSeletorV060() {

  if (
    document.querySelector(
      "#seletorSementesV060"
    )
  ) {

    return;

  }


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "seletorSementesV060";


  modal.className =
    "seletor-sementes-v060 escondido";


  modal.innerHTML = `

    <div class="caixa-sementes-v060">

      <div class="titulo-sementes-v060">

        <div>

          <span>
            NOVA LINHAGEM
          </span>

          <h2>
            Escolha uma semente
          </h2>

        </div>

        <button
          id="fecharSementesV060"
          class="fechar-sementes-v060"
        >
          ✕
        </button>

      </div>


      <p class="introducao-sementes-v060">
        Todas podem dar origem a plantas muito diferentes.
        O jeito de cuidar também muda o que acontece com elas.
      </p>


      <div
        id="gradeSementesV060"
        class="grade-sementes-v060"
      ></div>


      <div class="rodape-sementes-v060">

        <span>
          A escolha inicia uma nova linhagem.
        </span>

      </div>

    </div>

  `;


  document.body.appendChild(
    modal
  );


  montarSementesV060();


  document
    .querySelector(
      "#fecharSementesV060"
    )
    .onclick =
      fecharSeletorV060;

}


/*
==========================================================
CARTÕES
==========================================================
*/


function montarSementesV060() {

  const grade =
    document.querySelector(
      "#gradeSementesV060"
    );


  if (!grade) {
    return;
  }


  grade.innerHTML =
    Object.entries(
      SEMENTES_V060
    )
    .map(
      ([id, semente]) => `

        <button
          class="cartao-semente-v060"
          data-semente-v060="${id}"
        >

          <div
            class="
              visual-semente-v060
              ${semente.classe}
            "
          >

            <div class="casca-semente-v060"></div>

          </div>


          <strong>
            ${semente.cor}
          </strong>


          <p>
            ${semente.descricao}
          </p>


          <span>
            Escolher
          </span>

        </button>

      `
    )
    .join("");


  grade
    .querySelectorAll(
      "[data-semente-v060]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            escolherSementeV060(
              botao.dataset
                .sementeV060
            );

          };

      }
    );

}


/*
==========================================================
ABRIR / FECHAR
==========================================================
*/


let seletorObrigatorioV060 =
  false;


function abrirSeletorV060(
  obrigatorio = false
) {

  criarSeletorV060();


  seletorObrigatorioV060 =
    obrigatorio;


  const modal =
    document.querySelector(
      "#seletorSementesV060"
    );


  const fechar =
    document.querySelector(
      "#fecharSementesV060"
    );


  if (fechar) {

    fechar.style.display =
      obrigatorio
      ? "none"
      : "";

  }


  modal
    ?.classList
    .remove(
      "escondido"
    );

}


function fecharSeletorV060() {

  if (
    seletorObrigatorioV060
  ) {

    return;

  }


  document
    .querySelector(
      "#seletorSementesV060"
    )
    ?.classList
    .add(
      "escondido"
    );

}


/*
==========================================================
NOVA LINHAGEM
==========================================================
*/


function escolherSementeV060(
  id
) {

  const escolhida =
    SEMENTES_V060[id];


  if (!escolhida) {
    return;
  }


  /*
  Estado limpo usando a constituição já existente.
  */

  const novo =
    estadoInicial();


  novo.versao =
    "0.6";


  novo.sementeBase =
    id;


  novo.corSemente =
    escolhida.cor;


  novo.dna =
    structuredClone(
      escolhida.dna
    );


  novo.linhagem = [

    {
      geracao: 0,

      dna:
        structuredClone(
          escolhida.dna
        ),

      origem:
        id,

      cor:
        escolhida.cor
    }

  ];


  novo.historico = [

    `A Semente ${escolhida.cor} foi plantada.`

  ];


  /*
  Estado inicial hídrico continua saudável.
  */

  novo.umidade = 55;


  /*
  Substitui o universo apenas AGORA,
  depois da escolha.
  */

  estado =
    novo;


  /*
  Camadas posteriores completam seus estados.
  */

  if (
    typeof garantirSaudeV042
    === "function"
  ) {

    garantirSaudeV042();

  }


  if (
    typeof garantirTempoV050
    === "function"
  ) {

    garantirTempoV050();

    estado.tempo = {

      dia: 1,

      hora: 0,

      deficitRepouso: 0,

      escuroNoDia: 0,

      noitesSemEscuro: 0

    };

    estado.modoLuz =
      "AUTO";

    estado.luz =
      luzRealV050();

  }


  salvar();


  document
    .querySelector(
      "#seletorSementesV060"
    )
    ?.classList
    .add(
      "escondido"
    );


  seletorObrigatorioV060 =
    false;


  render();

}


/*
==========================================================
NOVO UNIVERSO
==========================================================
*/


function pedirNovoUniversoV060() {

  const confirmar =
    confirm(
      "Começar uma nova linhagem? A planta atual será substituída somente depois que você escolher outra semente."
    );


  if (!confirmar) {
    return;
  }


  abrirSeletorV060(
    false
  );

}


/*
==========================================================
MOSTRA A COR DA LINHAGEM
==========================================================
*/


function renderSementeV060() {

  garantirSementeV060();


  const topo =
    document.querySelector(
      "#linhagemTopo"
    );


  if (topo) {

    topo.textContent =
      `${estado.corSemente} • geração ${estado.geracao}`;

  }


  /*
  Enquanto ainda é semente, a casca também
  recebe a cor da origem.
  */

  if (
    estado.estagio === "SEMENTE"
  ) {

    const sementeVisual =
      document.querySelector(
        "#plantaVisual .semente-v3"
      );


    if (sementeVisual) {

      const perfil =
        SEMENTES_V060[
          estado.sementeBase
        ];


      sementeVisual.classList.add(
        perfil.classe
      );

    }

  }

}


/*
==========================================================
RENDER
==========================================================
*/


const renderBaseV060 =
  render;


render =
  function() {

    garantirSementeV060();

    renderBaseV060();

    renderSementeV060();

  };


/*
==========================================================
BOTÃO NOVO UNIVERSO
==========================================================
*/


const botaoNovoV060 =
  document.querySelector(
    "#btnNovoJogo"
  );


if (
  botaoNovoV060
) {

  botaoNovoV060.textContent =
    "Novo universo";


  botaoNovoV060.onclick =
    pedirNovoUniversoV060;

}


/*
==========================================================
INICIALIZAÇÃO
==========================================================
*/


criarSeletorV060();

garantirSementeV060();

salvar();

render();


/*
Se for literalmente o primeiro estado do jogo,
a escolha é obrigatória.

Um save em andamento não é tocado.
*/

if (
  universoPareceNovoV060()
) {

  abrirSeletorV060(
    true
  );

}
