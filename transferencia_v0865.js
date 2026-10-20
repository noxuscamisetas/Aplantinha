/*
==========================================================
A PLANTINHA — V0.8.6.5
TRANSFERÊNCIA POR QUANTIDADE
==========================================================

Inventário <-> Armário

Stacks:
- 1
- 5
- Tudo
- quantidade manual

Objetos únicos:
- Guardar / Retirar

Apenas muda localização.
Nenhum item é criado ou destruído.
==========================================================
*/


function destinoTransferenciaV0865(origem) {
  return origem === "INVENTARIO"
    ? "ARMARIO"
    : "INVENTARIO";
}


function itensStackV0865(assinatura, origem) {

  return objetosPorLocalV0862(origem)
    .filter(item =>
      assinaturaTaxonomicaV0862(item) === assinatura
    );

}


function transferirStackV0865(
  assinatura,
  origem,
  quantidade
) {

  const itens =
    itensStackV0865(
      assinatura,
      origem
    );

  if (!itens.length) {
    return false;
  }


  quantidade =
    Math.max(
      1,
      Math.min(
        itens.length,
        Math.floor(
          Number(quantidade || 1)
        )
      )
    );


  const destino =
    destinoTransferenciaV0865(
      origem
    );


  itens
    .slice(0, quantidade)
    .forEach(item => {
      item.localizacao = destino;
    });


  salvar();

  return true;

}


function transferirObjetoV0865(
  id,
  origem
) {

  const item =
    estado.inventarioEstruturado
      ?.itens
      ?.find(x => x.id === id);


  if (!item) {
    return false;
  }


  const atual =
    item.localizacao || "INVENTARIO";


  if (atual !== origem) {
    return false;
  }


  item.localizacao =
    destinoTransferenciaV0865(
      origem
    );


  salvar();

  return true;

}


function transferirPilhaV0865(
  chave,
  origem,
  quantidade
) {

  garantirArmazenamentoV086();


  const disponivel =
    quantidadeDisponivelV086(
      chave
    );


  const guardado =
    quantidadeArmarioV086(
      chave
    );


  const maximo =
    origem === "INVENTARIO"
      ? disponivel
      : guardado;


  if (maximo <= 0) {
    return false;
  }


  quantidade =
    Math.max(
      1,
      Math.min(
        maximo,
        Math.floor(
          Number(quantidade || 1)
        )
      )
    );


  const atual =
    quantidadeArmarioV086(
      chave
    );


  if (origem === "INVENTARIO") {

    estado.armazenamentoV086
      .armarioPilhas[chave] =
        atual + quantidade;

  }
  else {

    estado.armazenamentoV086
      .armarioPilhas[chave] =
        Math.max(
          0,
          atual - quantidade
        );

  }


  salvar();

  return true;

}


function atualizarTransferenciaV0865() {

  if (
    document.querySelector(
      ".storage-taxonomico-v0862"
    )
  ) {

    renderArmazenamentoV086();
    return;

  }


  if (
    document.querySelector(
      "#inventarioOperacionalV0861"
    )
  ) {

    renderInventarioOperacionalV0861();

  }

}


function abrirModalTransferenciaV0865(
  config
) {

  const origem =
    config.origem;


  let maximo = 0;


  if (config.tipo === "STACK") {

    maximo =
      itensStackV0865(
        config.assinatura,
        origem
      ).length;

  }


  if (config.tipo === "PILHA") {

    maximo =
      origem === "INVENTARIO"
        ? quantidadeDisponivelV086(config.chave)
        : quantidadeArmarioV086(config.chave);

  }


  if (maximo <= 0) {
    return;
  }


  let quantidade = 1;


  let modal =
    document.querySelector(
      "#modalTransferenciaV0865"
    );


  if (!modal) {

    modal =
      document.createElement(
        "div"
      );

    modal.id =
      "modalTransferenciaV0865";

    modal.className =
      "modal-transferencia-v0865";

    document.body.appendChild(
      modal
    );

  }


  function renderModal() {

    quantidade =
      Math.max(
        1,
        Math.min(
          maximo,
          Number(quantidade || 1)
        )
      );


    const acao =
      origem === "INVENTARIO"
        ? "Guardar"
        : "Retirar";


    modal.innerHTML = `

      <div class="caixa-transferencia-v0865">

        <header>

          <div>

            <span>
              ${
                origem === "INVENTARIO"
                  ? "INVENTÁRIO → ARMÁRIO"
                  : "ARMÁRIO → INVENTÁRIO"
              }
            </span>

            <h3>
              ${config.icone || "📦"}
              ${config.nome || "Item"}
            </h3>

            <p>
              ${maximo} unidade(s) disponíveis
            </p>

          </div>

          <button
            id="fecharTransferenciaV0865"
            type="button"
          >
            ✕
          </button>

        </header>


        <div class="atalhos-transferencia-v0865">

          <button
            type="button"
            data-qtd-v0865="1"
          >
            1
          </button>

          ${
            maximo >= 5
              ? `
                <button
                  type="button"
                  data-qtd-v0865="5"
                >
                  5
                </button>
              `
              : ""
          }

          <button
            type="button"
            data-qtd-v0865="${maximo}"
          >
            Tudo
          </button>

        </div>


        <div class="controle-transferencia-v0865">

          <button
            type="button"
            id="menosTransferenciaV0865"
          >
            −
          </button>

          <input
            id="qtdTransferenciaV0865"
            type="number"
            min="1"
            max="${maximo}"
            value="${quantidade}"
          />

          <button
            type="button"
            id="maisTransferenciaV0865"
          >
            +
          </button>

        </div>


        <div class="resumo-transferencia-v0865">

          <span>
            ${acao}
          </span>

          <strong>
            ${quantidade} unidade(s)
          </strong>

        </div>


        <button
          type="button"
          id="confirmarTransferenciaV0865"
          class="confirmar-transferencia-v0865"
        >
          ${
            origem === "INVENTARIO"
              ? "🗄️ Guardar"
              : "🎒 Retirar"
          }
        </button>

      </div>

    `;


    modal.querySelector(
      "#fecharTransferenciaV0865"
    ).onclick =
      () => modal.remove();


    modal.querySelectorAll(
      "[data-qtd-v0865]"
    ).forEach(botao => {

      botao.onclick = () => {

        quantidade =
          Number(
            botao.dataset.qtdV0865
          );

        renderModal();

      };

    });


    modal.querySelector(
      "#menosTransferenciaV0865"
    ).onclick = () => {

      quantidade--;
      renderModal();

    };


    modal.querySelector(
      "#maisTransferenciaV0865"
    ).onclick = () => {

      quantidade++;
      renderModal();

    };


    modal.querySelector(
      "#qtdTransferenciaV0865"
    ).onchange = evento => {

      quantidade =
        Number(
          evento.target.value
        );

      renderModal();

    };


    modal.querySelector(
      "#confirmarTransferenciaV0865"
    ).onclick = () => {

      let ok = false;


      if (config.tipo === "STACK") {

        ok =
          transferirStackV0865(
            config.assinatura,
            origem,
            quantidade
          );

      }


      if (config.tipo === "PILHA") {

        ok =
          transferirPilhaV0865(
            config.chave,
            origem,
            quantidade
          );

      }


      modal.remove();


      if (ok) {
        atualizarTransferenciaV0865();
      }

    };

  }


  renderModal();


  modal.onclick = evento => {

    if (evento.target === modal) {
      modal.remove();
    }

  };

}


/*
==========================================================
STACKS
==========================================================
*/

if (
  typeof htmlGrupoTaxonomicoV0862
  === "function"
) {

  const htmlGrupoAnteriorV0865 =
    htmlGrupoTaxonomicoV0862;


  htmlGrupoTaxonomicoV0862 =
    function(
      assinatura,
      itens,
      local
    ) {

      let html =
        htmlGrupoAnteriorV0865(
          assinatura,
          itens,
          local
        );


      const primeiro =
        itens?.[0];


      if (!primeiro) {
        return html;
      }


      /*
      Neutraliza movimentação antiga.
      */

      html =
        html.replace(
          /data-mover-stack-v0862=/g,
          "data-mover-stack-v0862-antigo="
        );


      html =
        html.replace(
          /data-mover-stack-v0862-legado=/g,
          "data-mover-stack-v0862-antigo="
        );


      const texto =
        local === "INVENTARIO"
          ? "Guardar"
          : "Retirar";


      const botao = `

        <button
          type="button"
          class="transferir-stack-v0865"
          data-transfer-stack-v0865="${
            encodeURIComponent(
              assinatura
            )
          }"
          data-origem-v0865="${local}"
          data-nome-v0865="${
            primeiro.nome || primeiro.tipo
          }"
          data-icone-v0865="${
            primeiro.icone || "📦"
          }"
        >
          ${
            local === "INVENTARIO"
              ? "🗄️"
              : "🎒"
          }
          ${texto}
        </button>

      `;


      return html.replace(
        /(<div class="\s*stack-acoes-v0862\s*">)/,
        "$1" + botao
      );

    };

}


/*
==========================================================
OBJETOS ÚNICOS
==========================================================
*/

if (
  typeof htmlIndividualTaxonomicoV0862
  === "function"
) {

  const htmlIndividualAnteriorV0865 =
    htmlIndividualTaxonomicoV0862;


  htmlIndividualTaxonomicoV0862 =
    function(
      item,
      local
    ) {

      let html =
        htmlIndividualAnteriorV0865(
          item,
          local
        );


      html =
        html.replace(
          /data-mover-stack-v0862=/g,
          "data-mover-stack-v0862-antigo="
        );


      const texto =
        local === "INVENTARIO"
          ? "Guardar"
          : "Retirar";


      const botao = `

        <button
          type="button"
          class="transferir-unico-v0865"
          data-transfer-unico-v0865="${item.id}"
          data-origem-v0865="${local}"
        >
          ${
            local === "INVENTARIO"
              ? "🗄️"
              : "🎒"
          }
          ${texto}
        </button>

      `;


      return html.replace(
        /(<div class="\s*stack-acoes-v0862\s*">)/,
        "$1" + botao
      );

    };

}


/*
==========================================================
PILHAS SIMPLES
==========================================================
*/

if (
  typeof htmlPilhaTradicionalV0862
  === "function"
) {

  const htmlPilhaAnteriorV0865 =
    htmlPilhaTradicionalV0862;


  htmlPilhaTradicionalV0862 =
    function(
      chave,
      local
    ) {

      let html =
        htmlPilhaAnteriorV0865(
          chave,
          local
        );


      html =
        html.replace(
          /data-mover-pilha-v0862=/g,
          "data-mover-pilha-v0862-antigo="
        );


      const dados =
        CATALOGO_INVENTARIO_V070?.[
          chave
        ] || {};


      const texto =
        local === "INVENTARIO"
          ? "Guardar"
          : "Retirar";


      const botao = `

        <button
          type="button"
          class="transferir-pilha-v0865"
          data-transfer-pilha-v0865="${chave}"
          data-origem-v0865="${local}"
          data-nome-v0865="${
            dados.nome || chave
          }"
          data-icone-v0865="${
            dados.icone || "📦"
          }"
        >
          ${
            local === "INVENTARIO"
              ? "🗄️"
              : "🎒"
          }
          ${texto}
        </button>

      `;


      return html.replace(
        /(<div class="\s*stack-acoes-v0862\s*">)/,
        "$1" + botao
      );

    };

}


/*
==========================================================
EVENTOS
==========================================================
*/

document.addEventListener(
  "click",
  evento => {

    const stack =
      evento.target.closest(
        "[data-transfer-stack-v0865]"
      );


    if (stack) {

      evento.preventDefault();
      evento.stopPropagation();


      abrirModalTransferenciaV0865({

        tipo:
          "STACK",

        assinatura:
          decodeURIComponent(
            stack.dataset
              .transferStackV0865
          ),

        origem:
          stack.dataset
            .origemV0865,

        nome:
          stack.dataset
            .nomeV0865,

        icone:
          stack.dataset
            .iconeV0865

      });


      return;

    }


    const pilha =
      evento.target.closest(
        "[data-transfer-pilha-v0865]"
      );


    if (pilha) {

      evento.preventDefault();
      evento.stopPropagation();


      abrirModalTransferenciaV0865({

        tipo:
          "PILHA",

        chave:
          pilha.dataset
            .transferPilhaV0865,

        origem:
          pilha.dataset
            .origemV0865,

        nome:
          pilha.dataset
            .nomeV0865,

        icone:
          pilha.dataset
            .iconeV0865

      });


      return;

    }


    const unico =
      evento.target.closest(
        "[data-transfer-unico-v0865]"
      );


    if (unico) {

      evento.preventDefault();
      evento.stopPropagation();


      const ok =
        transferirObjetoV0865(
          unico.dataset
            .transferUnicoV0865,

          unico.dataset
            .origemV0865
        );


      if (ok) {
        atualizarTransferenciaV0865();
      }

    }

  },
  true
);


console.log(
  "[A Plantinha] V0.8.6.5 — transferência por quantidade carregada."
);
