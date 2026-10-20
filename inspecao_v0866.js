/*
==========================================================
A PLANTINHA — V0.8.6.6
INSPEÇÃO DE ITENS
==========================================================

Restaura/garante:

STACK:
🔎 abre unidades do stack

UNIDADE:
🔎 abre ficha completa do objeto

OBJETO ÚNICO:
🔎 abre ficha diretamente

Compatível com:
- Inventário
- Armário
- transferência V0865
==========================================================
*/


function abrirFichaSeguraV0866(
  id
) {

  if (
    typeof abrirFichaItemV070
    === "function"
  ) {

    abrirFichaItemV070(
      id
    );

    /*
    A V0863 já eleva fichas acima do inventário.
    */

    if (
      typeof elevarFichasV0863
      === "function"
    ) {

      requestAnimationFrame(
        elevarFichasV0863
      );

    }

  }

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

  const htmlGrupoAnteriorV0866 =
    htmlGrupoTaxonomicoV0862;


  htmlGrupoTaxonomicoV0862 =
    function(
      assinatura,
      itens,
      local
    ) {

      let html =
        htmlGrupoAnteriorV0866(
          assinatura,
          itens,
          local
        );


      /*
      Se a luneta original ainda existir,
      não duplicamos.
      */

      if (
        html.includes(
          "data-abrir-stack-v0862"
        )
      ) {

        return html;

      }


      const botao = `

        <button
          type="button"
          class="inspecionar-stack-v0866"
          data-inspecionar-stack-v0866="${
            encodeURIComponent(
              assinatura
            )
          }"
          data-local-inspecao-v0866="${local}"
          title="Ver unidades e propriedades"
        >
          🔎
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

  const htmlIndividualAnteriorV0866 =
    htmlIndividualTaxonomicoV0862;


  htmlIndividualTaxonomicoV0862 =
    function(
      item,
      local
    ) {

      let html =
        htmlIndividualAnteriorV0866(
          item,
          local
        );


      if (
        html.includes(
          "data-ficha-tax-v0862"
        )
      ) {

        return html;

      }


      const botao = `

        <button
          type="button"
          class="inspecionar-unico-v0866"
          data-inspecionar-unico-v0866="${item.id}"
          title="Ver propriedades"
        >
          🔎
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
        "[data-inspecionar-stack-v0866]"
      );


    if (stack) {

      evento.preventDefault();
      evento.stopPropagation();


      const assinatura =
        decodeURIComponent(
          stack.dataset
            .inspecionarStackV0866
        );


      const local =
        stack.dataset
          .localInspecaoV0866;


      if (
        typeof abrirStackV0862
        === "function"
      ) {

        abrirStackV0862(
          encodeURIComponent(
            assinatura
          ),
          local
        );

      }


      return;

    }


    const unico =
      evento.target.closest(
        "[data-inspecionar-unico-v0866]"
      );


    if (unico) {

      evento.preventDefault();
      evento.stopPropagation();


      abrirFichaSeguraV0866(
        unico.dataset
          .inspecionarUnicoV0866
      );

    }

  },
  true
);


console.log(
  "[A Plantinha] V0.8.6.6 — inspeção de itens carregada."
);
