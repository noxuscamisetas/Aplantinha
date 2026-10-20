/*
==========================================================
A PLANTINHA — V0.7.2
PILHAS INTELIGENTES
==========================================================

Objetos individuais continuam individuais.

A interface apenas agrupa objetos semelhantes para
evitar inventário gigante.

Assinatura visual atual:

TIPO
+ COR / LINHAGEM DE ORIGEM
+ QUALIDADE

Futuramente poderá incluir:
+ aparência
+ tamanho
+ variedade

Sem usar DNA completo na assinatura.
*/


/*
==========================================================
ASSINATURA VISUAL
==========================================================
*/


function assinaturaPilhaV072(
  item
) {

  if (
    ![
      "FRUTO",
      "FLOR",
      "CASCA",
      "PETALA"
    ].includes(
      item.tipo
    )
  ) {

    return null;

  }


  const cor =
    item.origemPlanta?.cor
    ||
    item.procedencia?.cor
    ||
    "SEM_ORIGEM";


  const qualidade =
    item.qualidade?.nivel
    || 0;


  return [
    item.tipo,
    cor,
    qualidade
  ].join(
    "|"
  );

}


/*
==========================================================
AGRUPAR
==========================================================
*/


function gruposIndividuaisV072(
  categoria
) {

  garantirInventarioV070();


  const individuais =
    estado
      .inventarioEstruturado
      .itens
      .filter(
        item =>
          item.categoria
          === categoria
      );


  const grupos =
    new Map();


  const soltos = [];


  for (
    const item
    of individuais
  ) {

    const assinatura =
      assinaturaPilhaV072(
        item
      );


    /*
    Semente-DNA e outros objetos únicos continuam
    aparecendo individualmente.
    */

    if (!assinatura) {

      soltos.push(
        item
      );

      continue;

    }


    if (
      !grupos.has(
        assinatura
      )
    ) {

      grupos.set(
        assinatura,
        []
      );

    }


    grupos
      .get(
        assinatura
      )
      .push(
        item
      );

  }


  return {

    grupos:
      Array.from(
        grupos.entries()
      ),

    soltos

  };

}


/*
==========================================================
ESTRELAS
==========================================================
*/


function estrelasV072(
  nivel
) {

  const n =
    Math.max(
      0,
      Math.min(
        3,
        Number(
          nivel || 0
        )
      )
    );


  return (
    "★".repeat(n)
    +
    "☆".repeat(
      3 - n
    )
  );

}


/*
==========================================================
HTML DO GRUPO
==========================================================
*/


function htmlGrupoV072(
  assinatura,
  itens
) {

  const primeiro =
    itens[0];


  const cor =
    primeiro.origemPlanta?.cor
    ||
    primeiro.procedencia?.cor
    ||
    "—";


  const qualidade =
    primeiro.qualidade
    || {
      nivel: 0,
      nome: "—"
    };


  return `

    <button
      class="
        item-inventario-v070
        grupo-inventario-v072
      "
      data-grupo-v072="${encodeURIComponent(
        assinatura
      )}"
    >

      <div class="item-icone-v070">
        ${primeiro.icone || "📦"}
      </div>


      <div class="item-info-v070">

        <strong>
          ${primeiro.nome}
        </strong>

        <span>
          ${cor}
          •
          ${estrelasV072(
            qualidade.nivel
          )}
          ${qualidade.nome}
        </span>

      </div>


      <div class="grupo-quantidade-v072">
        ×${itens.length}
      </div>

    </button>

  `;

}


/*
==========================================================
SUBSTITUI APENAS A VISUALIZAÇÃO DOS INDIVIDUAIS
==========================================================
*/


const renderConteudoAnteriorV072 =
  renderConteudoInventarioV070;


renderConteudoInventarioV070 =
  function() {

    const area =
      document.querySelector(
        "#conteudoInventarioV070"
      );


    if (!area) {
      return;
    }


    const pilhas =
      pilhasDaAbaV070(
        abaInventarioV070
      );


    const agrupamento =
      gruposIndividuaisV072(
        abaInventarioV070
      );


    const grupos =
      agrupamento.grupos;


    const soltos =
      agrupamento.soltos;


    if (
      pilhas.length === 0
      &&
      grupos.length === 0
      &&
      soltos.length === 0
    ) {

      area.innerHTML = `

        <div class="inventario-vazio-v070">

          <div>
            📦
          </div>

          <strong>
            Nada aqui ainda
          </strong>

          <p>
            Conforme você cuida da planta,
            novos itens aparecem por aqui.
          </p>

        </div>

      `;

      return;

    }


    area.innerHTML = `

      <div class="lista-inventario-v070">

        ${soltos
          .map(
            htmlIndividualV070
          )
          .join("")}

        ${grupos
          .map(
            ([assinatura, itens]) =>
              htmlGrupoV072(
                assinatura,
                itens
              )
          )
          .join("")}

        ${pilhas
          .map(
            ([chave, dados]) =>
              htmlPilhaV070(
                chave,
                dados
              )
          )
          .join("")}

      </div>

    `;


    /*
    Itens individuais normais.
    */

    area
      .querySelectorAll(
        "[data-item-v070]"
      )
      .forEach(
        botao => {

          botao.onclick =
            () => {

              abrirFichaItemV070(
                botao.dataset
                  .itemV070
              );

            };

        }
      );


    /*
    Grupos inteligentes.
    */

    area
      .querySelectorAll(
        "[data-grupo-v072]"
      )
      .forEach(
        botao => {

          botao.onclick =
            () => {

              abrirGrupoV072(
                decodeURIComponent(
                  botao.dataset
                    .grupoV072
                )
              );

            };

        }
      );


    /*
    Pilhas tradicionais.
    */

    area
      .querySelectorAll(
        "[data-pilha-v070]"
      )
      .forEach(
        botao => {

          botao.onclick =
            () => {

              abrirFichaPilhaV070(
                botao.dataset
                  .pilhaV070
              );

            };

        }
      );

  };


/*
==========================================================
ABRIR GRUPO
==========================================================
*/


function abrirGrupoV072(
  assinatura
) {

  const itens =
    estado
      .inventarioEstruturado
      .itens
      .filter(
        item =>
          assinaturaPilhaV072(
            item
          )
          === assinatura
      );


  if (
    itens.length === 0
  ) {

    return;

  }


  const primeiro =
    itens[0];


  const cor =
    primeiro.origemPlanta?.cor
    ||
    primeiro.procedencia?.cor
    ||
    "—";


  const qualidade =
    primeiro.qualidade
    || {
      nivel: 0,
      nome: "—"
    };


  let modal =
    document.querySelector(
      "#grupoInventarioV072"
    );


  if (!modal) {

    modal =
      document.createElement(
        "div"
      );


    modal.id =
      "grupoInventarioV072";


    modal.className =
      "grupo-modal-v072";


    document.body.appendChild(
      modal
    );

  }


  modal.innerHTML = `

    <div class="grupo-caixa-v072">

      <button
        id="fecharGrupoV072"
        class="fechar-grupo-v072"
      >
        ✕
      </button>


      <div class="grupo-topo-v072">

        <div class="grupo-icone-v072">
          ${primeiro.icone || "📦"}
        </div>


        <div>

          <span class="grupo-eyebrow-v072">
            GRUPO
          </span>

          <h3>
            ${primeiro.nome}
          </h3>

          <p>
            ${cor}
            •
            ${estrelasV072(
              qualidade.nivel
            )}
            ${qualidade.nome}
            •
            ${itens.length} unidade(s)
          </p>

        </div>

      </div>


      <div class="grupo-acoes-v072">

        <button
          id="verIndividuosV072"
        >
          Ver unidades
        </button>

      </div>


      <div
        id="listaIndividuosV072"
        class="lista-individuos-v072 escondida"
      ></div>

    </div>

  `;


  modal
    .querySelector(
      "#fecharGrupoV072"
    )
    .onclick =
      () => {

        modal.remove();

      };


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
      "#verIndividuosV072"
    )
    .onclick =
      () => {

        renderIndividuosGrupoV072(
          assinatura
        );

      };

}


/*
==========================================================
LISTA DOS INDIVÍDUOS
==========================================================
*/


function renderIndividuosGrupoV072(
  assinatura
) {

  const area =
    document.querySelector(
      "#listaIndividuosV072"
    );


  if (!area) {
    return;
  }


  const itens =
    estado
      .inventarioEstruturado
      .itens
      .filter(
        item =>
          assinaturaPilhaV072(
            item
          )
          === assinatura
      );


  area.innerHTML =
    itens
      .map(
        item => `

          <button
            class="individuo-v072"
            data-individuo-v072="${item.id}"
          >

            <div>

              <strong>
                ${item.id}
              </strong>

              <span>
                G${item.origemPlanta?.geracao ?? "—"}
                •
                Dia ${item.origemPlanta?.dia ?? "—"}
              </span>

            </div>

            <b>
              ›
            </b>

          </button>

        `
      )
      .join("");


  area
    .classList
    .remove(
      "escondida"
    );


  area
    .querySelectorAll(
      "[data-individuo-v072]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            abrirFichaItemV070(
              botao.dataset
                .individuoV072
            );

          };

      }
    );

}


/*
==========================================================
ATUALIZA INVENTÁRIO
==========================================================
*/


const renderAnteriorV072 =
  render;


render =
  function() {

    renderAnteriorV072();

    /*
    Se o inventário estiver aberto, atualizamos
    a visualização agrupada.
    */

    const modal =
      document.querySelector(
        "#modalInventarioV070"
      );


    if (
      modal
      &&
      !modal.classList.contains(
        "escondido"
      )
    ) {

      renderInventarioV070();

    }

  };


render();
