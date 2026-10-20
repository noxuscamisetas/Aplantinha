/*
==========================================================
A PLANTINHA — V0.8.6.3.1
CORREÇÃO DE VENDA NAS PILHAS TAXONÔMICAS
==========================================================

Não altera:
- objetos;
- agrupamento;
- qualidade;
- linhagem;
- armário;
- biologia.

Apenas acrescenta a ação de venda ao HTML produzido
pela V0.8.6.2 quando:

local === INVENTARIO
e
tipo === FRUTO ou FLOR
==========================================================
*/


if (
  typeof htmlGrupoTaxonomicoV0862
  !== "function"
) {

  console.error(
    "[V0.8.6.3.1] htmlGrupoTaxonomicoV0862 não encontrada."
  );

}
else {

  const htmlGrupoTaxonomicoAnteriorV08631 =
    htmlGrupoTaxonomicoV0862;


  htmlGrupoTaxonomicoV0862 =
    function(
      assinatura,
      itens,
      local
    ) {

      let html =
        htmlGrupoTaxonomicoAnteriorV08631(
          assinatura,
          itens,
          local
        );


      const primeiro =
        itens?.[0];


      if (
        !primeiro
        ||
        local !== "INVENTARIO"
        ||
        (
          primeiro.tipo !== "FRUTO"
          &&
          primeiro.tipo !== "FLOR"
        )
      ) {

        return html;

      }


      const preco =
        primeiro.tipo === "FRUTO"
        ?
        5
        :
        4;


      const titulo =
        primeiro.tipo === "FRUTO"
        ?
        "Vender um fruto por 5 moedas"
        :
        "Vender uma flor por 4 moedas";


      const botaoVenda = `

        <button
          type="button"
          class="vender-stack-v0863 vender-stack-v08631"
          data-vender-v0863="${primeiro.tipo}"
          title="${titulo}"
        >
          🪙 +${preco}
        </button>

      `;


      /*
      A V0862 sempre coloca primeiro o botão de inspeção
      e depois o botão data-mover-stack-v0862.

      Inserimos a venda imediatamente antes do botão mover.

      Regex tolera espaços e quebras de linha.
      */

      const marcador =
        /(<button\s+type="button"\s+data-mover-stack-v0862=)/;


      if (
        !marcador.test(
          html
        )
      ) {

        console.warn(
          "[V0.8.6.3.1] Card encontrado, mas ponto de inserção não foi localizado.",
          {
            tipo:
              primeiro.tipo,

            assinatura,

            local
          }
        );


        return html;

      }


      html =
        html.replace(
          marcador,
          botaoVenda + "$1"
        );


      return html;

    };


  console.log(
    "[A Plantinha] V0.8.6.3.1 — botão de venda conectado diretamente às pilhas V0862."
  );

}


/*
==========================================================
GARANTIA DO HANDLER
==========================================================

A V0863 já possui venderTipoV0863().
Este fallback cobre inclusive mudanças de ordem dos scripts.
==========================================================
*/

document.addEventListener(
  "click",
  function(
    evento
  ) {

    const botao =
      evento.target.closest(
        ".vender-stack-v08631"
      );


    if (!botao) {

      return;

    }


    evento.preventDefault();

    evento.stopPropagation();


    const tipo =
      botao.dataset
        .venderV0863;


    if (
      tipo !== "FRUTO"
      &&
      tipo !== "FLOR"
    ) {

      return;

    }


    if (
      typeof venderTipoV0863
      === "function"
    ) {

      venderTipoV0863(
        tipo
      );

      return;

    }


    /*
    Fallback caso a V0863 não tenha carregado.
    */

    if (
      typeof observarTransacaoV071
      === "function"
    ) {

      observarTransacaoV071(
        () => {

          vender(
            tipo
          );

        }
      );

    }
    else {

      vender(
        tipo
      );

    }


    if (
      typeof renderInventarioOperacionalV0861
      === "function"
    ) {

      renderInventarioOperacionalV0861();

    }

  },
  true
);


console.log(
  "[A Plantinha] V0.8.6.3.1 carregada."
);
