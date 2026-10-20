/*
==========================================================
A PLANTINHA — V0.8.6.3
CAMADAS DE FICHA + ECONOMIA DAS PILHAS
==========================================================

Objetivos:

1. Fichas de item sempre acima de:
   - inventário operacional;
   - armário;
   - modal de grupo;
   - modal de pilha V0862.

2. Fechar a ficha não fecha o inventário que estava atrás.

3. Restaurar venda de:
   - FRUTO = +5 moedas
   - FLOR  = +4 moedas

4. Venda apenas de item realmente disponível
   no INVENTÁRIO.

5. ARMÁRIO continua sendo armazenamento:
   item guardado não pode ser vendido diretamente.

Nenhuma regra biológica é alterada.
==========================================================
*/


/* ======================================================
   CAMADAS
   ====================================================== */

function elevarFichasV0863() {

  const ignorar =
    new Set([
      "inventarioOperacionalV0861",
      "modalGrupoV0861",
      "stackDetalhesV0862",
      "modalInventarioV070"
    ]);


  const elementos =
    Array.from(
      document.body.children
    );


  for (
    const elemento
    of elementos
  ) {

    if (
      !elemento
      ||
      ignorar.has(
        elemento.id
      )
    ) {

      continue;

    }


    const idClasse =
      (
        (elemento.id || "")
        +
        " "
        +
        (elemento.className || "")
      )
      .toLowerCase();


    /*
    A ficha antiga é criada dinamicamente.

    Em vez de depender de um único nome de classe,
    reconhecemos o contrato visual da V070/V071.
    */

    const pareceFicha =
      idClasse.includes(
        "ficha"
      )
      ||
      (
        elemento.querySelector
        &&
        (
          elemento.querySelector(
            ".ficha-linha-v070"
          )
          ||
          elemento.querySelector(
            ".ficha-secao-v070"
          )
          ||
          elemento.querySelector(
            ".qualidade-v071"
          )
        )
      );


    if (!pareceFicha) {

      continue;

    }


    /*
    Só mexemos em elementos atualmente visíveis.
    */

    const estilo =
      window.getComputedStyle(
        elemento
      );


    if (
      estilo.display === "none"
      ||
      estilo.visibility === "hidden"
    ) {

      continue;

    }


    elemento.classList.add(
      "ficha-elevada-v0863"
    );


    elemento.style.zIndex =
      "15000";

  }

}


/*
A ficha é criada depois do clique.
Observamos o body para elevá-la assim que surgir.
*/

const observadorFichasV0863 =
  new MutationObserver(
    () => {

      elevarFichasV0863();

    }
  );


observadorFichasV0863.observe(
  document.body,
  {
    childList: true,
    subtree: false
  }
);


/*
Também elevamos depois das funções antigas.
Isso cobre fichas cujo elemento já existia
e apenas recebeu novo conteúdo.
*/

if (
  typeof abrirFichaGenericaV070
  === "function"
) {

  const abrirFichaGenericaAnteriorV0863 =
    abrirFichaGenericaV070;


  abrirFichaGenericaV070 =
    function(
      dados
    ) {

      const resultado =
        abrirFichaGenericaAnteriorV0863(
          dados
        );


      requestAnimationFrame(
        elevarFichasV0863
      );


      setTimeout(
        elevarFichasV0863,
        0
      );


      return resultado;

    };

}


/* ======================================================
   VENDA
   ====================================================== */

function podeVenderTipoV0863(
  tipo
) {

  if (
    tipo !== "FRUTO"
    &&
    tipo !== "FLOR"
  ) {

    return false;

  }


  /*
  Regra importante:

  quantidade legada pode conter objetos no armário.
  Portanto verificamos os objetos realmente disponíveis.
  */

  if (
    typeof objetosTipoV0861
    === "function"
  ) {

    return (
      objetosTipoV0861(
        tipo
      ).length > 0
    );

  }


  return false;

}


function venderTipoV0863(
  tipo
) {

  if (
    !podeVenderTipoV0863(
      tipo
    )
  ) {

    return false;

  }


  /*
  Reutiliza a transação já validada da V071.

  Ela mantém sincronizados:
  contador legado
  + objeto individual
  + casca/pétala resultante
  + procedência.
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


  /*
  Atualiza apenas interfaces abertas.
  */

  if (
    document.querySelector(
      "#inventarioOperacionalV0861"
    )
    &&
    typeof renderInventarioOperacionalV0861
    === "function"
  ) {

    renderInventarioOperacionalV0861();

  }


  if (
    document.querySelector(
      ".storage-v086"
    )
    &&
    typeof renderArmazenamentoV086
    === "function"
  ) {

    renderArmazenamentoV086();

  }


  return true;

}


/* ======================================================
   INJETAR BOTÕES DE VENDA NAS PILHAS V0862
   ====================================================== */

function instalarVendaNasPilhasV0863() {

  /*
  Só no Inventário operacional.
  Nunca no lado ARMÁRIO.
  */

  const inventario =
    document.querySelector(
      "#inventarioOperacionalV0861"
    );


  if (!inventario) {

    return;

  }


  /*
  Procuramos cards taxonômicos da V0862.
  A pilha já contém dados do primeiro item.
  */

  const cards =
    inventario.querySelectorAll(
      "[data-stack-v0862], .stack-v0862, .pilha-v0862"
    );


  cards.forEach(
    card => {

      if (
        card.querySelector(
          "[data-vender-v0863]"
        )
      ) {

        return;

      }


      /*
      Descobrir tipo sem alterar a taxonomia.

      Primeiro tentamos atributos da própria V0862.
      Depois usamos assinatura codificada quando disponível.
      */

      let tipo =
        card.dataset.tipoV0862
        ||
        card.dataset.tipo
        ||
        "";


      if (!tipo) {

        const assinatura =
          card.dataset.stackV0862
          ||
          card.dataset.assinaturaV0862
          ||
          "";


        if (assinatura) {

          try {

            tipo =
              decodeURIComponent(
                assinatura
              )
              .split("|")[0];

          }

          catch {

            tipo =
              assinatura
                .split("|")[0];

          }

        }

      }


      if (
        tipo !== "FRUTO"
        &&
        tipo !== "FLOR"
      ) {

        return;

      }


      const preco =
        tipo === "FRUTO"
        ?
        5
        :
        4;


      const botao =
        document.createElement(
          "button"
        );


      botao.type =
        "button";


      botao.className =
        "vender-stack-v0863";


      botao.dataset.venderV0863 =
        tipo;


      botao.innerHTML =
        `🪙 +${preco}`;


      botao.title =
        tipo === "FRUTO"
        ?
        "Vender um fruto"
        :
        "Vender uma flor";


      botao.onclick =
        evento => {

          evento.preventDefault();

          evento.stopPropagation();


          venderTipoV0863(
            tipo
          );

      };


      card.appendChild(
        botao
      );

    }
  );

}


/*
O inventário é rerenderizado com frequência,
então reinstalamos os botões após cada render.
*/

if (
  typeof renderInventarioOperacionalV0861
  === "function"
) {

  const renderInventarioAnteriorV0863 =
    renderInventarioOperacionalV0861;


  renderInventarioOperacionalV0861 =
    function() {

      const resultado =
        renderInventarioAnteriorV0863();


      requestAnimationFrame(
        () => {

          instalarVendaNasPilhasV0863();

          elevarFichasV0863();

        }
      );


      return resultado;

    };

}


/* ======================================================
   FALLBACK DE VENDA

   Caso a V0862 use uma estrutura diferente de classes,
   também tratamos cliques em qualquer botão V0863
   eventualmente produzido pela interface.
   ====================================================== */

document.addEventListener(
  "click",
  evento => {

    const botao =
      evento.target.closest(
        "[data-vender-v0863]"
      );


    if (!botao) {

      return;

    }


    const tipo =
      botao.dataset
        .venderV0863;


    if (
      tipo === "FRUTO"
      ||
      tipo === "FLOR"
    ) {

      evento.preventDefault();

      evento.stopPropagation();

      venderTipoV0863(
        tipo
      );

    }

  },
  true
);


/* ======================================================
   INICIALIZAÇÃO
   ====================================================== */

setTimeout(
  () => {

    elevarFichasV0863();

    instalarVendaNasPilhasV0863();

  },
  0
);


console.log(
  "[A Plantinha] V0.8.6.3 — fichas acima das camadas e economia restaurada."
);
