/*
==========================================================
A PLANTINHA — V0.8.6.8
AÇÕES INTEGRADAS À FICHA REAL
==========================================================

A ficha real é:

#fichaItemV070

Não usamos mais tentativa de anexar ações depois.

Interceptamos abrirFichaGenericaV070(dados)
e inserimos a barra de ações diretamente em dados.corpo.
==========================================================
*/


/* ======================================================
   ITEM DA FICHA
   ====================================================== */

function descobrirItemFichaV0868(
  dados
) {

  const itens =
    estado
      .inventarioEstruturado
      ?.itens
    ||
    [];


  const subtitulo =
    String(
      dados?.subtitulo
      ||
      ""
    );


  /*
  Para fruto/flor/casca/pétala:
  subtitulo === ID.

  Para Semente-DNA:
  "SD-00004 • origem ..."
  */

  return (
    itens.find(
      item =>
        subtitulo === item.id
    )
    ||
    itens.find(
      item =>
        subtitulo.includes(
          item.id
        )
    )
    ||
    null
  );

}


/* ======================================================
   FECHAR FICHA REAL
   ====================================================== */

function fecharFichaV0868() {

  document
    .querySelector(
      "#fichaItemV070"
    )
    ?.remove();

}


/*
Corrige também a função antiga da V0867,
caso outra camada a utilize.
*/

if (
  typeof fecharFichaV0867
  === "function"
) {

  fecharFichaV0867 =
    fecharFichaV0868;

}


/* ======================================================
   AÇÕES DISPONÍVEIS
   ====================================================== */

function acoesFichaV0868(
  item
) {

  if (!item) {

    return [];

  }


  const local =
    item.localizacao
    ||
    "INVENTARIO";


  const acoes = [];


  /*
  No armário, o item não oferece ações de uso/venda.
  Apenas retirar.
  */

  if (
    local === "ARMARIO"
  ) {

    acoes.push({
      id: "RETIRAR",
      icone: "🎒",
      texto: "Retirar"
    });


    return acoes;

  }


  /*
  INVENTÁRIO
  */

  acoes.push({
    id: "GUARDAR",
    icone: "🗄️",
    texto: "Guardar"
  });


  if (
    item.tipo === "FRUTO"
  ) {

    acoes.push({
      id: "VENDER",
      icone: "🪙",
      texto: "Vender"
    });


    acoes.push({
      id: "COMER",
      icone: "🍽️",
      texto: "Comer"
    });

  }


  if (
    item.tipo === "FLOR"
  ) {

    acoes.push({
      id: "VENDER",
      icone: "🪙",
      texto: "Vender"
    });


    acoes.push({
      id: "USAR_SOLO",
      icone: "🪴",
      texto: "Usar"
    });

  }


  if (
    item.tipo === "CASCA"
    ||
    item.tipo === "PETALA"
  ) {

    /*
    Mantemos Vender visível porque essa é a interface
    desejada, mas preço ainda não foi definido.
    */

    acoes.push({
      id: "VENDER",
      icone: "🪙",
      texto: "Vender"
    });


    acoes.push({
      id: "USAR_SOLO",
      icone: "🪴",
      texto: "Usar"
    });

  }


  if (
    item.tipo === "SEMENTE_DNA"
  ) {

    acoes.push({
      id: "USAR_SEMENTE",
      icone: "🌱",
      texto: "Usar"
    });

  }


  return acoes;

}


/* ======================================================
   HTML DAS AÇÕES
   ====================================================== */

function htmlAcoesFichaV0868(
  item
) {

  const acoes =
    acoesFichaV0868(
      item
    );


  if (!acoes.length) {

    return "";

  }


  return `

    <div
      class="acoes-ficha-v0868"
      data-item-acoes-v0868="${item.id}"
    >

      <span class="titulo-acoes-ficha-v0868">
        AÇÕES
      </span>


      <div class="botoes-acoes-ficha-v0868">

        ${acoes
          .map(
            acao => `

              <button
                type="button"
                data-acao-v0868="${acao.id}"
                data-item-v0868="${item.id}"
              >

                <span>
                  ${acao.icone}
                </span>

                <strong>
                  ${acao.texto}
                </strong>

              </button>

            `
          )
          .join("")}

      </div>

    </div>

  `;

}


/* ======================================================
   INTERCEPTAR FICHA GENÉRICA
   ====================================================== */

if (
  typeof abrirFichaGenericaV070
  === "function"
) {

  const abrirFichaGenericaAnteriorV0868 =
    abrirFichaGenericaV070;


  abrirFichaGenericaV070 =
    function(
      dados
    ) {

      const item =
        descobrirItemFichaV0868(
          dados
        );


      if (!item) {

        return abrirFichaGenericaAnteriorV0868(
          dados
        );

      }


      const dadosNovos = {
        ...dados,

        corpo:
          (
            dados.corpo
            ||
            ""
          )
          +
          htmlAcoesFichaV0868(
            item
          )
      };


      const resultado =
        abrirFichaGenericaAnteriorV0868(
          dadosNovos
        );


      /*
      A camada V0863 mantém a ficha acima
      dos demais modais.
      */

      if (
        typeof elevarFichasV0863
        === "function"
      ) {

        requestAnimationFrame(
          elevarFichasV0863
        );

      }


      return resultado;

    };

}


/* ======================================================
   GUARDAR
   ====================================================== */

function guardarFichaV0868(
  item
) {

  if (!item) {

    return;

  }


  if (
    typeof guardarObjetoV086
    === "function"
  ) {

    guardarObjetoV086(
      item.id
    );

  }
  else {

    item.localizacao =
      "ARMARIO";

    salvar();

  }


  fecharFichaV0868();


  if (
    document.querySelector(
      "#inventarioOperacionalV0861"
    )
  ) {

    renderInventarioOperacionalV0861?.();

  }

}


/* ======================================================
   RETIRAR DO ARMÁRIO
   ====================================================== */

function retirarFichaV0868(
  item
) {

  if (!item) {

    return;

  }


  if (
    typeof retirarObjetoV086
    === "function"
  ) {

    retirarObjetoV086(
      item.id
    );

  }
  else {

    item.localizacao =
      "INVENTARIO";

    salvar();

  }


  fecharFichaV0868();


  if (
    document.querySelector(
      ".storage-taxonomico-v0862"
    )
  ) {

    renderArmazenamentoV086?.();

  }

}


/* ======================================================
   VENDER
   ====================================================== */

function venderFichaV0868(
  item
) {

  if (!item) {

    return;

  }


  /*
  FRUTO e FLOR já têm preço definido.
  */

  if (
    item.tipo === "FRUTO"
    ||
    item.tipo === "FLOR"
  ) {

    if (
      typeof venderItemFichaV0867
      === "function"
    ) {

      venderItemFichaV0867(
        item
      );

      return;

    }

  }


  /*
  Casca/pétala ainda sem preço definido.
  */

  console.log(
    `[V0868] ${item.tipo} ainda não possui preço definido.`
  );

}


/* ======================================================
   COMER
   ====================================================== */

function comerFichaV0868(
  item
) {

  if (
    !item
    ||
    item.tipo !== "FRUTO"
  ) {

    return;

  }


  if (
    typeof comerFrutoV0867
    === "function"
  ) {

    comerFrutoV0867(
      item
    );

    return;

  }


  console.warn(
    "[V0868] comerFrutoV0867 não encontrada."
  );

}


/* ======================================================
   USAR CASCA / PÉTALA / FLOR
   ====================================================== */

function usarSoloFichaV0868(
  item
) {

  if (!item) {

    return;

  }


  const tipo =
    item.tipo;


  if (
    tipo !== "CASCA"
    &&
    tipo !== "PETALA"
    &&
    tipo !== "FLOR"
  ) {

    return;

  }


  /*
  A função legada produzirSolo(tipo)
  já implementa:

  CASCA + SOLO_COMUM -> SOLO_ADITIVADO_CASCA
  PETALA + SOLO_COMUM -> SOLO_ADITIVADO_PETALA

  e a V071 observa o consumo de casca/pétala
  para remover o indivíduo correspondente.
  */


  fecharFichaV0868();


  if (
    tipo === "CASCA"
  ) {

    if (
      typeof observarTransacaoV071
      === "function"
    ) {

      observarTransacaoV071(
        () =>
          produzirSolo(
            "CASCA"
          )
      );

    }
    else {

      produzirSolo(
        "CASCA"
      );

    }

  }


  if (
    tipo === "PETALA"
  ) {

    if (
      typeof observarTransacaoV071
      === "function"
    ) {

      observarTransacaoV071(
        () =>
          produzirSolo(
            "PETALA"
          )
      );

    }
    else {

      produzirSolo(
        "PETALA"
      );

    }

  }


  /*
  FLOR não é matéria de solo diretamente no motor atual.
  O uso dela continuará reservado até definirmos
  a consequência correta.
  */

  if (
    tipo === "FLOR"
  ) {

    console.log(
      "[V0868] Uso direto da flor ainda não definido."
    );

  }


  renderInventarioOperacionalV0861?.();

}


/* ======================================================
   USAR SEMENTE
   ====================================================== */

function usarSementeFichaV0868(
  item
) {

  if (
    !item
    ||
    item.tipo !== "SEMENTE_DNA"
  ) {

    return;

  }


  estado.sementeSelecionadaV0867 =
    item.id;


  fecharFichaV0868();


  /*
  Tentamos primeiro o fluxo de novo cultivo já existente.
  */

  if (
    typeof abrirNovoCultivoV082
    === "function"
  ) {

    abrirNovoCultivoV082();

    return;

  }


  /*
  Se a função específica não existir,
  deixamos a semente marcada e voltamos ao laboratório.
  */

  if (
    typeof ambienteAtualV081
    !== "undefined"
  ) {

    ambienteAtualV081 =
      "LABORATORIO";

  }


  renderLaboratorioV081?.();


  console.log(
    `[V0868] ${item.id} selecionada para novo cultivo.`
  );

}


/* ======================================================
   EVENTOS
   ====================================================== */

document.addEventListener(
  "click",
  evento => {

    const botao =
      evento.target.closest(
        "[data-acao-v0868]"
      );


    if (!botao) {

      return;

    }


    evento.preventDefault();
    evento.stopPropagation();


    const item =
      estado
        .inventarioEstruturado
        ?.itens
        ?.find(
          x =>
            x.id
            ===
            botao.dataset
              .itemV0868
        );


    if (!item) {

      return;

    }


    const acao =
      botao.dataset
        .acaoV0868;


    if (
      acao === "GUARDAR"
    ) {

      guardarFichaV0868(
        item
      );

      return;

    }


    if (
      acao === "RETIRAR"
    ) {

      retirarFichaV0868(
        item
      );

      return;

    }


    if (
      acao === "VENDER"
    ) {

      venderFichaV0868(
        item
      );

      return;

    }


    if (
      acao === "COMER"
    ) {

      comerFichaV0868(
        item
      );

      return;

    }


    if (
      acao === "USAR_SOLO"
    ) {

      usarSoloFichaV0868(
        item
      );

      return;

    }


    if (
      acao === "USAR_SEMENTE"
    ) {

      usarSementeFichaV0868(
        item
      );

    }

  },
  true
);


console.log(
  "[A Plantinha] V0.8.6.8 — ações integradas à ficha real."
);
