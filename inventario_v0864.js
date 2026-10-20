/*
==========================================================
A PLANTINHA — V0.8.6.4
OPERAÇÕES DE STACK
==========================================================

- Venda direcionada ao stack selecionado.
- Quantidade escolhida pelo jogador.
- Venda de 1 / 5 / quantidade personalizada / tudo.
- Armário recebe botão explícito Retirar 1.
- Inventário recebe botão explícito Guardar 1.

IMPORTANTE:

A pilha continua sendo apenas visual.
Os objetos continuam individuais.
==========================================================
*/


/* ======================================================
   OBJETOS REAIS DE UM STACK
   ====================================================== */

function itensStackV0864(
  assinatura,
  local = "INVENTARIO"
) {

  return objetosPorLocalV0862(
    local
  )
  .filter(
    item =>
      assinaturaTaxonomicaV0862(
        item
      )
      === assinatura
  );

}


/* ======================================================
   VENDA DIRECIONADA

   Diferente de vender("FRUTO"), aqui sabemos exatamente
   quais objetos individuais pertencem ao stack escolhido.
   ====================================================== */

function venderStackV0864(
  assinatura,
  quantidade
) {

  let itens =
    itensStackV0864(
      assinatura,
      "INVENTARIO"
    );


  if (
    itens.length === 0
  ) {

    return {
      sucesso: false,
      vendidos: 0
    };

  }


  const tipo =
    itens[0].tipo;


  if (
    tipo !== "FRUTO"
    &&
    tipo !== "FLOR"
  ) {

    return {
      sucesso: false,
      vendidos: 0
    };

  }


  quantidade =
    Math.max(
      1,
      Math.floor(
        Number(
          quantidade || 1
        )
      )
    );


  quantidade =
    Math.min(
      quantidade,
      itens.length
    );


  /*
  Selecionamos exatamente os IDs deste stack.
  */

  itens =
    itens.slice(
      0,
      quantidade
    );


  let vendidos =
    0;


  for (
    const item
    of itens
  ) {

    /*
    Segurança:
    o contador legado precisa continuar compatível.
    */

    if (
      Number(
        estado.inventario?.[
          tipo
        ]
        ||
        0
      )
      <= 0
    ) {

      break;

    }


    /*
    Remove a unidade física específica.
    */

    const removido =
      typeof removerItemV071
      === "function"
      ?
      removerItemV071(
        item.id
      )
      :
      null;


    if (!removido) {

      continue;

    }


    estado.inventario[
      tipo
    ]--;


    if (
      tipo === "FRUTO"
    ) {

      estado.moedas += 5;

      estado.inventario.CASCA =
        Number(
          estado.inventario.CASCA
          ||
          0
        )
        +
        1;


      if (
        typeof criarObjetoColheitaV071
        === "function"
      ) {

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
                  ?.plantaGeracao
            },
            item.origemPlanta
          );


        if (casca) {

          casca.localizacao =
            "INVENTARIO";

        }

      }

    }


    if (
      tipo === "FLOR"
    ) {

      estado.moedas += 4;

      estado.inventario.PETALA =
        Number(
          estado.inventario.PETALA
          ||
          0
        )
        +
        1;


      if (
        typeof criarObjetoColheitaV071
        === "function"
      ) {

        const petala =
          criarObjetoColheitaV071(
            "PETALA",
            {
              florOrigem:
                item.id,

              plantaOrigem:
                item.procedencia
                  ?.plantaBase,

              geracaoOrigem:
                item.procedencia
                  ?.plantaGeracao
            },
            item.origemPlanta
          );


        if (petala) {

          petala.localizacao =
            "INVENTARIO";

        }

      }

    }


    vendidos++;

  }


  salvar();


  return {

    sucesso:
      vendidos > 0,

    vendidos,

    tipo,

    moedasRecebidas:
      vendidos
      *
      (
        tipo === "FRUTO"
        ?
        5
        :
        4
      )

  };

}


/* ======================================================
   MODAL DE QUANTIDADE
   ====================================================== */

function abrirVendaStackV0864(
  codigoAssinatura
) {

  const assinatura =
    decodeURIComponent(
      codigoAssinatura
    );


  const itens =
    itensStackV0864(
      assinatura,
      "INVENTARIO"
    );


  if (
    itens.length === 0
  ) {

    return;

  }


  const primeiro =
    itens[0];


  if (
    primeiro.tipo !== "FRUTO"
    &&
    primeiro.tipo !== "FLOR"
  ) {

    return;

  }


  const preco =
    primeiro.tipo === "FRUTO"
    ?
    5
    :
    4;


  let quantidade =
    1;


  let modal =
    document.querySelector(
      "#modalVendaStackV0864"
    );


  if (!modal) {

    modal =
      document.createElement(
        "div"
      );


    modal.id =
      "modalVendaStackV0864";


    modal.className =
      "modal-venda-v0864";


    document.body.appendChild(
      modal
    );

  }


  function renderModal() {

    quantidade =
      Math.max(
        1,
        Math.min(
          itens.length,
          quantidade
        )
      );


    modal.innerHTML = `

      <div class="caixa-venda-v0864">

        <header>

          <div>

            <span>
              VENDA
            </span>

            <h3>
              ${primeiro.icone || "📦"}
              ${primeiro.nome}
            </h3>

            <p>
              Stack com ${itens.length} unidade(s)
            </p>

          </div>


          <button
            type="button"
            id="fecharVendaV0864"
          >
            ✕
          </button>

        </header>


        <div class="preco-venda-v0864">

          <span>
            Valor por unidade
          </span>

          <strong>
            🪙 ${preco}
          </strong>

        </div>


        <div class="atalhos-venda-v0864">

          <button
            type="button"
            data-qtd-v0864="1"
          >
            1
          </button>


          ${
            itens.length >= 5
            ?
            `
            <button
              type="button"
              data-qtd-v0864="5"
            >
              5
            </button>
            `
            :
            ""
          }


          <button
            type="button"
            data-qtd-v0864="${itens.length}"
          >
            Tudo
          </button>

        </div>


        <div class="controle-qtd-v0864">

          <button
            type="button"
            id="menosVendaV0864"
          >
            −
          </button>


          <input
            id="quantidadeVendaV0864"
            type="number"
            min="1"
            max="${itens.length}"
            value="${quantidade}"
          />


          <button
            type="button"
            id="maisVendaV0864"
          >
            +
          </button>

        </div>


        <div class="resumo-venda-v0864">

          <span>
            ${quantidade}
            unidade(s)
          </span>

          <strong>
            🪙 ${quantidade * preco}
          </strong>

        </div>


        <button
          type="button"
          id="confirmarVendaV0864"
          class="confirmar-venda-v0864"
        >
          Vender
        </button>

      </div>

    `;


    modal
      .querySelector(
        "#fecharVendaV0864"
      )
      .onclick =
        () =>
          modal.remove();


    modal
      .querySelectorAll(
        "[data-qtd-v0864]"
      )
      .forEach(
        botao => {

          botao.onclick =
            () => {

              quantidade =
                Number(
                  botao.dataset
                    .qtdV0864
                );


              renderModal();

            };

        }
      );


    modal
      .querySelector(
        "#menosVendaV0864"
      )
      .onclick =
        () => {

          quantidade--;

          renderModal();

        };


    modal
      .querySelector(
        "#maisVendaV0864"
      )
      .onclick =
        () => {

          quantidade++;

          renderModal();

        };


    modal
      .querySelector(
        "#quantidadeVendaV0864"
      )
      .onchange =
        evento => {

          quantidade =
            Number(
              evento.target.value
            );


          renderModal();

        };


    modal
      .querySelector(
        "#confirmarVendaV0864"
      )
      .onclick =
        () => {

          const resultado =
            venderStackV0864(
              assinatura,
              quantidade
            );


          modal.remove();


          if (
            resultado.sucesso
          ) {

            if (
              typeof log ===
              "function"
            ) {

              log(
                `${resultado.vendidos} ${resultado.tipo}(s) vendidos por ${resultado.moedasRecebidas} moedas.`
              );

            }

          }


          if (
            typeof renderInventarioOperacionalV0861
            === "function"
          ) {

            renderInventarioOperacionalV0861();

          }

        };

  }


  renderModal();


  modal.onclick =
    evento => {

      if (
        evento.target === modal
      ) {

        modal.remove();

      }

    };

}


/* ======================================================
   NOVO CARD DE GRUPO
   ====================================================== */

if (
  typeof htmlGrupoTaxonomicoV0862
  === "function"
) {

  const htmlGrupoAnteriorV0864 =
    htmlGrupoTaxonomicoV0862;


  htmlGrupoTaxonomicoV0862 =
    function(
      assinatura,
      itens,
      local
    ) {

      let html =
        htmlGrupoAnteriorV0864(
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
      Remove visualmente os botões de venda
      das versões V0863/V08631.
      */

      html =
        html.replace(
          /<button[\s\S]*?data-vender-v0863="[^"]+"[\s\S]*?<\/button>/g,
          ""
        );


      const destino =
        local === "INVENTARIO"
        ?
        "ARMARIO"
        :
        "INVENTARIO";


      const textoMover =
        local === "INVENTARIO"
        ?
        "Guardar 1"
        :
        "Retirar 1";


      /*
      O botão antigo de movimentação continua existindo
      internamente, mas fica oculto.
      */

      html =
        html.replace(
          /data-mover-stack-v0862=/g,
          "data-mover-stack-v0862-legado="
        );


      const extras = `

        ${
          local === "INVENTARIO"
          &&
          (
            primeiro.tipo === "FRUTO"
            ||
            primeiro.tipo === "FLOR"
          )
          ?
          `
          <button
            type="button"
            class="vender-qtd-v0864"
            data-vender-stack-v0864="${encodeURIComponent(
              assinatura
            )}"
          >
            🪙 Vender
          </button>
          `
          :
          ""
        }


        <button
          type="button"
          class="mover-explicito-v0864"
          data-mover-stack-v0862="${primeiro.id}"
          data-destino-stack-v0862="${destino}"
        >
          ${textoMover}
        </button>

      `;


      /*
      Injeta dentro da área de ações.
      */

      html =
        html.replace(
          /(<div class="\s*stack-acoes-v0862\s*">)/,
          "$1" + extras
        );


      return html;

    };

}


/* ======================================================
   OBJETO INDIVIDUAL
   ====================================================== */

if (
  typeof htmlIndividualTaxonomicoV0862
  === "function"
) {

  const htmlIndividualAnteriorV0864 =
    htmlIndividualTaxonomicoV0862;


  htmlIndividualTaxonomicoV0862 =
    function(
      item,
      local
    ) {

      let html =
        htmlIndividualAnteriorV0864(
          item,
          local
        );


      html =
        html.replace(
          /data-mover-stack-v0862=/g,
          "data-mover-stack-v0862-legado="
        );


      const destino =
        local === "INVENTARIO"
        ?
        "ARMARIO"
        :
        "INVENTARIO";


      const texto =
        local === "INVENTARIO"
        ?
        "Guardar"
        :
        "Retirar";


      const extra = `

        <button
          type="button"
          class="mover-explicito-v0864"
          data-mover-stack-v0862="${item.id}"
          data-destino-stack-v0862="${destino}"
        >
          ${texto}
        </button>

      `;


      html =
        html.replace(
          /(<div class="\s*stack-acoes-v0862\s*">)/,
          "$1" + extra
        );


      return html;

    };

}


/* ======================================================
   PILHAS TRADICIONAIS
   ====================================================== */

if (
  typeof htmlPilhaTradicionalV0862
  === "function"
) {

  const htmlPilhaAnteriorV0864 =
    htmlPilhaTradicionalV0862;


  htmlPilhaTradicionalV0862 =
    function(
      chave,
      local
    ) {

      let html =
        htmlPilhaAnteriorV0864(
          chave,
          local
        );


      html =
        html.replace(
          /data-mover-pilha-v0862=/g,
          "data-mover-pilha-v0862-legado="
        );


      const destino =
        local === "INVENTARIO"
        ?
        "ARMARIO"
        :
        "INVENTARIO";


      const texto =
        local === "INVENTARIO"
        ?
        "Guardar 1"
        :
        "Retirar 1";


      const extra = `

        <button
          type="button"
          class="mover-explicito-v0864"
          data-mover-pilha-v0862="${chave}"
          data-destino-pilha-v0862="${destino}"
        >
          ${texto}
        </button>

      `;


      html =
        html.replace(
          /(<div class="\s*stack-acoes-v0862\s*">)/,
          "$1" + extra
        );


      return html;

    };

}


/* ======================================================
   ABRIR VENDA
   ====================================================== */

document.addEventListener(
  "click",
  evento => {

    const botao =
      evento.target.closest(
        "[data-vender-stack-v0864]"
      );


    if (!botao) {

      return;

    }


    evento.preventDefault();

    evento.stopPropagation();


    abrirVendaStackV0864(
      botao.dataset
        .venderStackV0864
    );

  },
  true
);


console.log(
  "[A Plantinha] V0.8.6.4 — operações de stack carregadas."
);
