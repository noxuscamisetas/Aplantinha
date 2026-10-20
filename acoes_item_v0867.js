/*
==========================================================
A PLANTINHA — V0.8.6.7
AÇÕES CONTEXTUAIS DO OBJETO
==========================================================

A ficha individual passa a ser:

VER → DECIDIR → AGIR

FRUTO
- guardar
- vender
- comer

FLOR
- guardar
- vender
- usar

CASCA
- guardar
- vender
- usar

PETALA
- guardar
- vender
- usar

SEMENTE_DNA
- guardar
- usar

O efeito nutricional do fruto NÃO é inventado nesta versão.
==========================================================
*/


/* ======================================================
   ITEM
   ====================================================== */

function itemPorIdV0867(id) {

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


/* ======================================================
   FECHAR FICHA
   ====================================================== */

function fecharFichaV0867() {

  /*
  A ficha V070 é modalInventarioV070.
  */

  document
    .querySelector(
      "#modalInventarioV070"
    )
    ?.remove();

}


/* ======================================================
   GUARDAR ITEM ÚNICO
   ====================================================== */

function guardarItemFichaV0867(item) {

  if (!item) return;


  if (
    typeof guardarObjetoV086 ===
    "function"
  ) {

    guardarObjetoV086(
      item.id
    );

  }


  fecharFichaV0867();


  if (
    document.querySelector(
      "#inventarioOperacionalV0861"
    )
  ) {

    renderInventarioOperacionalV0861?.();

  }

}


/* ======================================================
   VENDA ESPECÍFICA
   ====================================================== */

function venderItemFichaV0867(item) {

  if (!item) return;


  if (
    item.tipo !== "FRUTO"
    &&
    item.tipo !== "FLOR"
  ) {

    /*
    Casca e pétala terão preço próprio futuramente.
    Não inventamos preço nesta etapa.
    */

    console.log(
      `[V0867] ${item.tipo} ainda não possui preço definido.`
    );

    return;

  }


  /*
  Vendemos exatamente o objeto selecionado.
  */

  const removido =
    removerItemV071?.(
      item.id
    );


  if (!removido) {

    return;

  }


  if (
    item.tipo === "FRUTO"
  ) {

    estado.inventario.FRUTO =
      Math.max(
        0,
        Number(
          estado.inventario.FRUTO || 0
        ) - 1
      );


    estado.moedas += 5;


    estado.inventario.CASCA =
      Number(
        estado.inventario.CASCA || 0
      ) + 1;


    const casca =
      criarObjetoColheitaV071?.(
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


  if (
    item.tipo === "FLOR"
  ) {

    estado.inventario.FLOR =
      Math.max(
        0,
        Number(
          estado.inventario.FLOR || 0
        ) - 1
      );


    estado.moedas += 4;


    estado.inventario.PETALA =
      Number(
        estado.inventario.PETALA || 0
      ) + 1;


    const petala =
      criarObjetoColheitaV071?.(
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


  salvar();

  fecharFichaV0867();

  renderInventarioOperacionalV0861?.();

}


/* ======================================================
   COMER
   ====================================================== */

function comerFrutoV0867(item) {

  if (
    !item
    ||
    item.tipo !== "FRUTO"
  ) {

    return;

  }


  /*
  Consome o fruto específico.
  */

  const removido =
    removerItemV071?.(
      item.id
    );


  if (!removido) {

    return;

  }


  estado.inventario.FRUTO =
    Math.max(
      0,
      Number(
        estado.inventario.FRUTO || 0
      ) - 1
    );


  /*
  Comer também deixa casca.

  Ainda NÃO atribuímos energia ao jogador.
  */

  estado.inventario.CASCA =
    Number(
      estado.inventario.CASCA || 0
    ) + 1;


  const casca =
    criarObjetoColheitaV071?.(
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
          "CONSUMO"
      }
    );


  if (casca) {

    casca.localizacao =
      "INVENTARIO";

  }


  estado.eventosJogadorV0867 ??= [];


  estado.eventosJogadorV0867.push({

    tipo:
      "COMEU_FRUTO",

    item:
      item.id,

    qualidade:
      item.qualidade
      ||
      null,

    origem:
      structuredClone(
        item.procedencia
        ||
        {}
      ),

    tempo:
      Date.now()

  });


  salvar();


  console.log(
    "[V0867] Fruto consumido. Efeito nutricional ainda não definido."
  );


  fecharFichaV0867();

  renderInventarioOperacionalV0861?.();

}


/* ======================================================
   USAR CASCA / PÉTALA
   ====================================================== */

function usarMaterialSoloV0867(item) {

  if (!item) return;


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


  fecharFichaV0867();


  /*
  Hoje a criação de solo ainda existe no sistema legado.
  Não consumimos o item aqui.
  Apenas abrimos/encaminhamos para a ação existente.
  */


  if (
    typeof abrirInventarioOperacionalV0861
    === "function"
  ) {

    abrirInventarioOperacionalV0861();

  }


  if (
    tipo === "CASCA"
  ) {

    console.log(
      "[V0867] Casca selecionada para criação de solo."
    );

  }


  if (
    tipo === "PETALA"
    ||
    tipo === "FLOR"
  ) {

    console.log(
      "[V0867] Pétala/flor selecionada para criação de solo."
    );

  }

}


/* ======================================================
   USAR SEMENTE
   ====================================================== */

function usarSementeV0867(item) {

  if (
    !item
    ||
    item.tipo !== "SEMENTE_DNA"
  ) {

    return;

  }


  /*
  Guardamos a escolha para o fluxo de novo cultivo.
  Não consumimos a semente aqui.
  */

  estado.sementeSelecionadaV0867 =
    item.id;


  fecharFichaV0867();


  if (
    typeof abrirNovoCultivoV082
    === "function"
  ) {

    abrirNovoCultivoV082();

    return;

  }


  /*
  Fallback:
  volta ao laboratório e deixa a seleção registrada.
  */

  if (
    typeof ambienteAtualV081 !==
    "undefined"
  ) {

    ambienteAtualV081 =
      "LABORATORIO";

  }


  renderLaboratorioV081?.();


  console.log(
    `[V0867] Semente ${item.id} selecionada para novo cultivo.`
  );

}


/* ======================================================
   AÇÕES DE ACORDO COM O ITEM
   ====================================================== */

function acoesItemV0867(item) {

  const acoes = [];


  if (!item) {

    return acoes;

  }


  const local =
    item.localizacao
    ||
    "INVENTARIO";


  /*
  Guardar só faz sentido se está carregado.
  */

  if (
    local === "INVENTARIO"
  ) {

    acoes.push({

      id:
        "GUARDAR",

      texto:
        "Guardar",

      icone:
        "🗄️"

    });

  }


  /*
  Fruto.
  */

  if (
    item.tipo === "FRUTO"
  ) {

    acoes.push({

      id:
        "VENDER",

      texto:
        "Vender",

      icone:
        "🪙"

    });


    acoes.push({

      id:
        "COMER",

      texto:
        "Comer",

      icone:
        "🍽️"

    });

  }


  /*
  Flor.
  */

  if (
    item.tipo === "FLOR"
  ) {

    acoes.push({

      id:
        "VENDER",

      texto:
        "Vender",

      icone:
        "🪙"

    });


    acoes.push({

      id:
        "USAR_SOLO",

      texto:
        "Usar",

      icone:
        "🧪"

    });

  }


  /*
  Casca / pétala.
  */

  if (
    item.tipo === "CASCA"
    ||
    item.tipo === "PETALA"
  ) {

    /*
    Mantemos Vender visível como intenção,
    mas só ficará funcional quando existir preço.
    */

    acoes.push({

      id:
        "VENDER",

      texto:
        "Vender",

      icone:
        "🪙"

    });


    acoes.push({

      id:
        "USAR_SOLO",

      texto:
        "Usar",

      icone:
        "🪴"

    });

  }


  /*
  Semente DNA.
  */

  if (
    item.tipo ===
    "SEMENTE_DNA"
  ) {

    acoes.push({

      id:
        "USAR_SEMENTE",

      texto:
        "Usar",

      icone:
        "🌱"

    });

  }


  return acoes;

}


/* ======================================================
   INSTALAR BARRA NA FICHA
   ====================================================== */

function instalarAcoesFichaV0867(
  id
) {

  const item =
    itemPorIdV0867(
      id
    );


  if (!item) {

    return;

  }


  const modal =
    document.querySelector(
      "#modalInventarioV070"
    );


  if (!modal) {

    return;

  }


  if (
    modal.querySelector(
      "#acoesFichaV0867"
    )
  ) {

    return;

  }


  const caixa =
    modal.firstElementChild;


  if (!caixa) {

    return;

  }


  const acoes =
    acoesItemV0867(
      item
    );


  if (!acoes.length) {

    return;

  }


  const area =
    document.createElement(
      "div"
    );


  area.id =
    "acoesFichaV0867";


  area.className =
    "acoes-ficha-v0867";


  area.innerHTML = `

    <span class="acoes-titulo-v0867">
      AÇÕES
    </span>


    <div class="acoes-botoes-v0867">

      ${acoes
        .map(
          acao => `

            <button
              type="button"
              data-acao-ficha-v0867="${acao.id}"
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

  `;


  caixa.appendChild(
    area
  );


  area
    .querySelectorAll(
      "[data-acao-ficha-v0867]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            const acao =
              botao.dataset
                .acaoFichaV0867;


            if (
              acao === "GUARDAR"
            ) {

              guardarItemFichaV0867(
                item
              );

            }


            if (
              acao === "VENDER"
            ) {

              venderItemFichaV0867(
                item
              );

            }


            if (
              acao === "COMER"
            ) {

              comerFrutoV0867(
                item
              );

            }


            if (
              acao === "USAR_SOLO"
            ) {

              usarMaterialSoloV0867(
                item
              );

            }


            if (
              acao ===
              "USAR_SEMENTE"
            ) {

              usarSementeV0867(
                item
              );

            }

          };

      }
    );

}


/* ======================================================
   WRAPPER DA FICHA
   ====================================================== */

if (
  typeof abrirFichaItemV070
  === "function"
) {

  const abrirFichaAnteriorV0867 =
    abrirFichaItemV070;


  abrirFichaItemV070 =
    function(id) {

      const resultado =
        abrirFichaAnteriorV0867(
          id
        );


      requestAnimationFrame(
        () => {

          instalarAcoesFichaV0867(
            id
          );


          if (
            typeof elevarFichasV0863 ===
            "function"
          ) {

            elevarFichasV0863();

          }

        }
      );


      return resultado;

    };

}


console.log(
  "[A Plantinha] V0.8.6.7 — ações contextuais carregadas."
);
