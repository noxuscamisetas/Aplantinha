/*
==========================================================
A PLANTINHA — V0.8.7.0
PROCESSOS DE OBJETO
==========================================================

FRUTO
Comer:
FRUTO -> CASCA

Nenhum efeito nutricional é inventado ainda.

CASCA
Usar:
CASCA + SOLO_COMUM -> SOLO_ADITIVADO_CASCA

PETALA
Usar:
PETALA + SOLO_COMUM -> SOLO_ADITIVADO_PETALA

USAR apenas abre/prepara o processo.
CONFIRMAR executa a transformação.
==========================================================
*/


/* ======================================================
   UTILIDADES
   ====================================================== */

function itemV0870(id) {

  return (
    estado
      .inventarioEstruturado
      ?.itens
      ?.find(
        item => item.id === id
      )
    ||
    null
  );

}


function fecharFichaV0870() {

  document
    .querySelector(
      "#fichaItemV070"
    )
    ?.remove();

}


function atualizarInventarioV0870() {

  if (
    document.querySelector(
      ".storage-taxonomico-v0862"
    )
  ) {

    renderArmazenamentoV086?.();

    return;

  }


  if (
    document.querySelector(
      "#inventarioOperacionalV0861"
    )
  ) {

    renderInventarioOperacionalV0861?.();

  }

}


/* ======================================================
   FEEDBACK
   ====================================================== */

function feedbackV0870(
  icone,
  titulo,
  texto
) {

  document
    .querySelector(
      "#feedbackV0870"
    )
    ?.remove();


  const aviso =
    document.createElement(
      "div"
    );


  aviso.id =
    "feedbackV0870";


  aviso.className =
    "feedback-v0870";


  aviso.innerHTML = `

    <div class="feedback-caixa-v0870">

      <span>
        ${icone}
      </span>

      <div>

        <strong>
          ${titulo}
        </strong>

        <small>
          ${texto}
        </small>

      </div>

    </div>

  `;


  document.body.appendChild(
    aviso
  );


  setTimeout(
    () => {

      aviso.remove();

    },
    2300
  );

}


/* ======================================================
   COMER FRUTO
   ====================================================== */

function consumirFrutoEspecificoV0870(
  item
) {

  if (
    !item
    ||
    item.tipo !== "FRUTO"
  ) {

    return false;

  }


  const local =
    item.localizacao
    ||
    "INVENTARIO";


  if (
    local !== "INVENTARIO"
  ) {

    return false;

  }


  /*
  Remove exatamente o fruto escolhido.
  */

  const removido =
    removerItemV071(
      item.id
    );


  if (!removido) {

    return false;

  }


  estado.inventario.FRUTO =
    Math.max(
      0,
      Number(
        estado.inventario.FRUTO
        ||
        0
      )
      -
      1
    );


  /*
  O processo deixa uma casca.
  */

  estado.inventario.CASCA =
    Number(
      estado.inventario.CASCA
      ||
      0
    )
    +
    1;


  const casca =
    criarObjetoColheitaV071(
      "CASCA",
      {

        frutoOrigem:
          item.id,

        plantaOrigem:
          item.procedencia
            ?.plantaBase,

        geracaoOrigem:
          item.procedencia
            ?.plantaGeracao,

        origemTransformacao:
          "CONSUMO",

        qualidadeOrigem:
          structuredClone(
            item.qualidade
            ||
            {}
          )

      },
      item.origemPlanta
    );


  if (casca) {

    casca.localizacao =
      "INVENTARIO";

  }


  /*
  Registramos o fato sem inventar
  energia, fome ou status do jogador.
  */

  estado.eventosJogadorV0867 ??= [];


  estado.eventosJogadorV0867.push({

    tipo:
      "COMEU_FRUTO",

    itemConsumido:
      item.id,

    residuoGerado:
      casca?.id
      ||
      null,

    qualidade:
      structuredClone(
        item.qualidade
        ||
        {}
      ),

    instante:
      Date.now()

  });


  salvar();


  return true;

}


/*
Sobrescreve a ação que a ficha V0868
já chama.
*/

comerFichaV0868 =
  function(
    item
  ) {

    const ok =
      consumirFrutoEspecificoV0870(
        item
      );


    if (!ok) {

      return;

    }


    fecharFichaV0870();

    atualizarInventarioV0870();


    feedbackV0870(
      "🍎",
      "Fruto consumido",
      "Uma casca foi recuperada."
    );


    if (
      typeof log ===
      "function"
    ) {

      log(
        "Fruto consumido. Uma casca permaneceu."
      );

    }

  };


/* ======================================================
   QUANTIDADE DISPONÍVEL DE SOLO
   ====================================================== */

function soloComumDisponivelV0870() {

  if (
    typeof quantidadeDisponivelV086
    === "function"
  ) {

    return quantidadeDisponivelV086(
      "SOLO_COMUM"
    );

  }


  return Math.max(
    0,
    Number(
      estado.inventario
        ?.SOLO_COMUM
      ||
      0
    )
  );

}


/* ======================================================
   EXECUTAR SOLO — OBJETO ESPECÍFICO
   ====================================================== */

function produzirSoloEspecificoV0870(
  item
) {

  if (!item) {

    return false;

  }


  if (
    item.tipo !== "CASCA"
    &&
    item.tipo !== "PETALA"
  ) {

    return false;

  }


  const local =
    item.localizacao
    ||
    "INVENTARIO";


  if (
    local !== "INVENTARIO"
  ) {

    return false;

  }


  if (
    soloComumDisponivelV0870()
    < 1
  ) {

    return false;

  }


  const contadorResiduo =
    item.tipo;


  if (
    Number(
      estado.inventario[
        contadorResiduo
      ]
      ||
      0
    )
    < 1
  ) {

    return false;

  }


  const destino =
    item.tipo === "CASCA"
    ?
    "SOLO_ADITIVADO_CASCA"
    :
    "SOLO_ADITIVADO_PETALA";


  /*
  Remove exatamente o resíduo selecionado.
  */

  const removido =
    removerItemV071(
      item.id
    );


  if (!removido) {

    return false;

  }


  estado.inventario[
    contadorResiduo
  ] =
    Math.max(
      0,
      Number(
        estado.inventario[
          contadorResiduo
        ]
        ||
        0
      )
      -
      1
    );


  /*
  SOLO_COMUM é uma pilha legada.

  O total físico diminui.
  Como já verificamos quantidadeDisponivelV086,
  não consumimos solo guardado no Armário.
  */

  estado.inventario.SOLO_COMUM =
    Math.max(
      0,
      Number(
        estado.inventario
          .SOLO_COMUM
        ||
        0
      )
      -
      1
    );


  estado.inventario[
    destino
  ] =
    Number(
      estado.inventario[
        destino
      ]
      ||
      0
    )
    +
    1;


  /*
  Registro de procedência do novo solo.
  O solo ainda é pilha no motor atual,
  então registramos a receita separadamente.
  */

  estado.receitasProduzidasV0870 ??= [];


  estado.receitasProduzidasV0870.push({

    tipo:
      "PREPARO_SOLO",

    entradaResiduo: {

      id:
        item.id,

      tipo:
        item.tipo,

      origem:
        structuredClone(
          item.procedencia
          ||
          {}
        )

    },

    entradaSolo:
      "SOLO_COMUM",

    resultado:
      destino,

    instante:
      Date.now()

  });


  salvar();


  return {
    sucesso: true,
    destino
  };

}


/* ======================================================
   MODAL DE PREPARO
   ====================================================== */

function abrirPreparoSoloV0870(
  item
) {

  if (!item) {

    return;

  }


  if (
    item.tipo !== "CASCA"
    &&
    item.tipo !== "PETALA"
  ) {

    return;

  }


  const qtdSolo =
    soloComumDisponivelV0870();


  const destino =
    item.tipo === "CASCA"
    ?
    "Solo aditivado com casca"
    :
    "Solo aditivado com pétala";


  const iconeResiduo =
    item.tipo === "CASCA"
    ?
    "🍂"
    :
    "🌸";


  document
    .querySelector(
      "#preparoSoloV0870"
    )
    ?.remove();


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "preparoSoloV0870";


  modal.className =
    "modal-preparo-solo-v0870";


  modal.innerHTML = `

    <div class="caixa-preparo-solo-v0870">

      <header>

        <div>

          <span>
            🪴 PREPARO DE SOLO
          </span>

          <h3>
            Usar ${item.nome || item.tipo}
          </h3>

          <p>
            Escolha a base e confirme a transformação.
          </p>

        </div>


        <button
          type="button"
          id="fecharPreparoSoloV0870"
        >
          ✕
        </button>

      </header>


      <div class="formula-solo-v0870">

        <div class="ingrediente-solo-v0870">

          <span>
            ${iconeResiduo}
          </span>

          <strong>
            ${item.nome || item.tipo}
          </strong>

          <small>
            ${item.id}
          </small>

        </div>


        <b>
          +
        </b>


        <button
          type="button"
          class="
            ingrediente-solo-v0870
            base-solo-v0870
            selecionada
          "
        >

          <span>
            🪴
          </span>

          <strong>
            Solo comum
          </strong>

          <small>
            ×${qtdSolo}
          </small>

        </button>


        <b>
          →
        </b>


        <div class="resultado-solo-v0870">

          <span>
            🌱
          </span>

          <strong>
            ${destino}
          </strong>

        </div>

      </div>


      ${
        qtdSolo > 0
        ?
        `

          <div class="nota-preparo-v0870">

            <span>
              ℹ️
            </span>

            <p>
              Confirmar consumirá
              <strong>1 ${item.nome || item.tipo}</strong>
              e
              <strong>1 Solo comum</strong>.
            </p>

          </div>


          <button
            type="button"
            id="confirmarPreparoSoloV0870"
            class="confirmar-preparo-solo-v0870"
          >
            🧪 Produzir solo
          </button>

        `
        :
        `

          <div class="
            nota-preparo-v0870
            alerta-preparo-v0870
          ">

            <span>
              ⚠️
            </span>

            <p>
              Você não possui Solo comum disponível
              no inventário.
            </p>

          </div>


          <button
            type="button"
            class="confirmar-preparo-solo-v0870"
            disabled
          >
            🧪 Produzir solo
          </button>

        `
      }

    </div>

  `;


  document.body.appendChild(
    modal
  );


  modal
    .querySelector(
      "#fecharPreparoSoloV0870"
    )
    .onclick =
      () =>
        modal.remove();


  modal.onclick =
    evento => {

      if (
        evento.target === modal
      ) {

        modal.remove();

      }

    };


  modal
    .querySelector(
      "#confirmarPreparoSoloV0870"
    )
    ?.addEventListener(
      "click",
      () => {

        const itemAtual =
          itemV0870(
            item.id
          );


        const resultado =
          produzirSoloEspecificoV0870(
            itemAtual
          );


        if (!resultado) {

          feedbackV0870(
            "⚠️",
            "Não foi possível produzir",
            "Confira os materiais disponíveis."
          );

          return;

        }


        modal.remove();

        fecharFichaV0870();

        atualizarInventarioV0870();


        feedbackV0870(
          "🪴",
          "Novo solo produzido",
          destino
        );


        if (
          typeof log ===
          "function"
        ) {

          log(
            `${resultado.destino} produzido.`
          );

        }

      }
    );

}


/*
A ficha V0868 já encaminha USAR_SOLO
para esta função.
*/

usarSoloFichaV0868 =
  function(
    item
  ) {

    if (!item) {

      return;

    }


    /*
    Somente CASCA e PÉTALA possuem
    transformação definida atualmente.

    FLOR continuará sem processo direto.
    */

    if (
      item.tipo === "CASCA"
      ||
      item.tipo === "PETALA"
    ) {

      abrirPreparoSoloV0870(
        item
      );

      return;

    }


    if (
      item.tipo === "FLOR"
    ) {

      feedbackV0870(
        "🌸",
        "Uso ainda não definido",
        "A flor ainda não possui um processo direto."
      );

    }

  };


console.log(
  "[A Plantinha] V0.8.7.0 — comer e preparo de solo carregados."
);
