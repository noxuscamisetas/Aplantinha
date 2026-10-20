/*
==========================================================
A PLANTINHA — V0.8.6.2
PILHAS INTELIGENTES POR LOCALIZAÇÃO
==========================================================

Recupera a filosofia da V0.7.2:

OBJETOS continuam individuais.

A PILHA existe apenas visualmente.

Assinatura:

TIPO
+
COR / LINHAGEM
+
QUALIDADE

Agora respeitando:

INVENTARIO
ou
ARMARIO
==========================================================
*/


/* ======================================================
   LOCALIZAÇÃO
   ====================================================== */

function localItemV0862(
  item
) {

  return (
    item?.localizacao
    ||
    "INVENTARIO"
  );

}


/* ======================================================
   ESTRELAS
   ====================================================== */

function estrelasV0862(
  nivel
) {

  if (
    typeof estrelasV072
    === "function"
  ) {

    return estrelasV072(
      nivel
    );

  }


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


/* ======================================================
   ASSINATURA

   Mantemos EXATAMENTE o critério conceitual da V0.7.2.
   ====================================================== */

function assinaturaTaxonomicaV0862(
  item
) {

  if (
    typeof assinaturaPilhaV072
    === "function"
  ) {

    return assinaturaPilhaV072(
      item
    );

  }


  if (
    ![
      "FRUTO",
      "FLOR",
      "CASCA",
      "PETALA"
    ].includes(
      item?.tipo
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
    ||
    0;


  return [
    item.tipo,
    cor,
    qualidade
  ].join(
    "|"
  );

}


/* ======================================================
   CATEGORIA
   ====================================================== */

function categoriaTaxonomicaV0862(
  item
) {

  if (
    item.tipo ===
    "SEMENTE_DNA"
  ) {

    return "SEMENTES";

  }


  if (
    item.tipo === "FRUTO"
    ||
    item.tipo === "FLOR"
  ) {

    return "COLHEITA";

  }


  if (
    item.tipo === "CASCA"
    ||
    item.tipo === "PETALA"
    ||
    item.tipo ===
      "MATERIA_VEGETAL"
  ) {

    return "MATERIAIS";

  }


  return (
    item.categoria
    ||
    "ITENS"
  );

}


/* ======================================================
   OBJETOS POR LOCAL
   ====================================================== */

function objetosPorLocalV0862(
  local
) {

  garantirArmazenamentoV086?.();


  return (
    estado
      .inventarioEstruturado
      ?.itens
      ?.filter(
        item =>
          localItemV0862(
            item
          )
          === local
      )
    ||
    []
  );

}


/* ======================================================
   AGRUPAMENTO POR LOCAL + CATEGORIA
   ====================================================== */

function agrupamentoV0862(
  local,
  categoria
) {

  const grupos =
    new Map();


  const soltos =
    [];


  const itens =
    objetosPorLocalV0862(
      local
    )
    .filter(
      item =>
        categoriaTaxonomicaV0862(
          item
        )
        === categoria
    );


  for (
    const item
    of itens
  ) {

    const assinatura =
      assinaturaTaxonomicaV0862(
        item
      );


    /*
    Semente-DNA,
    matéria vegetal
    e objetos únicos
    permanecem soltos.
    */

    if (
      !assinatura
    ) {

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


/* ======================================================
   METADADOS DO GRUPO
   ====================================================== */

function dadosGrupoV0862(
  itens
) {

  const primeiro =
    itens[0];


  const cor =
    primeiro
      ?.origemPlanta
      ?.cor
    ||
    primeiro
      ?.procedencia
      ?.cor
    ||
    "—";


  const geracao =
    primeiro
      ?.origemPlanta
      ?.geracao
    ??
    primeiro
      ?.procedencia
      ?.plantaGeracao
    ??
    "—";


  const qualidade =
    primeiro.qualidade
    ||
    {
      nivel: 0,
      nome: "—"
    };


  const dna =
    primeiro
      ?.origemPlanta
      ?.dna
    ||
    {};


  return {

    primeiro,

    cor,

    geracao,

    qualidade,

    dna

  };

}


/* ======================================================
   CARD DE GRUPO
   ====================================================== */

function htmlGrupoTaxonomicoV0862(
  assinatura,
  itens,
  local
) {

  const dados =
    dadosGrupoV0862(
      itens
    );


  const primeiro =
    dados.primeiro;


  const guardar =
    local ===
    "INVENTARIO";


  return `

    <div class="
      stack-taxonomico-v0862
    ">

      <div class="
        stack-icone-v0862
      ">
        ${primeiro.icone || "📦"}
      </div>


      <div class="
        stack-info-v0862
      ">

        <div class="
          stack-titulo-v0862
        ">

          <strong>
            ${primeiro.nome}
          </strong>

          <b>
            ×${itens.length}
          </b>

        </div>


        <div class="
          stack-linhagem-v0862
        ">

          <span>
            ${dados.cor}
          </span>

          <span>
            •
          </span>

          <span>
            G${dados.geracao}
          </span>

        </div>


        <div class="
          stack-qualidade-v0862
        ">

          <span class="
            estrelas-stack-v0862
          ">
            ${estrelasV0862(
              dados.qualidade.nivel
            )}
          </span>

          <span>
            ${dados.qualidade.nome}
          </span>

        </div>


        ${
          (
            dados.dna.vigor
            !== undefined
            ||
            dados.dna.sombra
            !== undefined
            ||
            dados.dna.seca
            !== undefined
          )
          ?
          `

          <div class="
            stack-propriedades-v0862
          ">

            ${
              dados.dna.vigor
              !== undefined
              ?
              `
              <span>
                Vigor ${dados.dna.vigor}
              </span>
              `
              :
              ""
            }

            ${
              dados.dna.sombra
              !== undefined
              ?
              `
              <span>
                Sombra ${dados.dna.sombra}
              </span>
              `
              :
              ""
            }

            ${
              dados.dna.seca
              !== undefined
              ?
              `
              <span>
                Seca ${dados.dna.seca}
              </span>
              `
              :
              ""
            }

          </div>

          `
          :
          ""
        }

      </div>


      <div class="
        stack-acoes-v0862
      ">

        <button
          type="button"
          data-abrir-stack-v0862="${
            encodeURIComponent(
              assinatura
            )
          }"
          data-local-stack-v0862="${
            local
          }"
          title="Ver unidades"
        >
          🔎
        </button>


        <button
          type="button"
          data-mover-stack-v0862="${
            primeiro.id
          }"
          data-destino-stack-v0862="${
            guardar
            ?
            "ARMARIO"
            :
            "INVENTARIO"
          }"
          title="${
            guardar
            ?
            "Guardar uma unidade"
            :
            "Retirar uma unidade"
          }"
        >
          ${
            guardar
            ?
            "🗄️"
            :
            "🎒"
          }
        </button>

      </div>

    </div>

  `;

}


/* ======================================================
   CARD INDIVIDUAL
   ====================================================== */

function htmlIndividualTaxonomicoV0862(
  item,
  local
) {

  const guardar =
    local ===
    "INVENTARIO";


  let detalhe =
    item.id;


  if (
    item.tipo ===
    "SEMENTE_DNA"
  ) {

    detalhe =
      `G${item.geracao ?? "—"} • ${item.id}`;

  }


  if (
    item.tipo ===
    "MATERIA_VEGETAL"
  ) {

    detalhe =
      `${
        item.estadoMateria
        ||
        "Matéria"
      } • ${
        item.massa
        ||
        1
      } BIO`;

  }


  return `

    <div class="
      stack-taxonomico-v0862
      stack-individual-v0862
    ">

      <div class="
        stack-icone-v0862
      ">
        ${item.icone || "📦"}
      </div>


      <div class="
        stack-info-v0862
      ">

        <div class="
          stack-titulo-v0862
        ">

          <strong>
            ${item.nome || item.tipo}
          </strong>

        </div>


        <div class="
          stack-linhagem-v0862
        ">
          ${detalhe}
        </div>

      </div>


      <div class="
        stack-acoes-v0862
      ">

        <button
          type="button"
          data-ficha-tax-v0862="${
            item.id
          }"
          title="Examinar"
        >
          🔎
        </button>


        <button
          type="button"
          data-mover-stack-v0862="${
            item.id
          }"
          data-destino-stack-v0862="${
            guardar
            ?
            "ARMARIO"
            :
            "INVENTARIO"
          }"
        >
          ${
            guardar
            ?
            "🗄️"
            :
            "🎒"
          }
        </button>

      </div>

    </div>

  `;

}


/* ======================================================
   PILHA TRADICIONAL
   ====================================================== */

function htmlPilhaTradicionalV0862(
  chave,
  local
) {

  const dados =
    CATALOGO_INVENTARIO_V070?.[
      chave
    ];


  if (!dados) {

    return "";

  }


  const qtd =
    local ===
    "ARMARIO"
    ?
    quantidadeArmarioV086(
      chave
    )
    :
    quantidadeDisponivelV086(
      chave
    );


  if (
    qtd <= 0
  ) {

    return "";

  }


  const guardar =
    local ===
    "INVENTARIO";


  return `

    <div class="
      stack-taxonomico-v0862
      stack-recurso-v0862
    ">

      <div class="
        stack-icone-v0862
      ">
        ${dados.icone || "📦"}
      </div>


      <div class="
        stack-info-v0862
      ">

        <div class="
          stack-titulo-v0862
        ">

          <strong>
            ${dados.nome}
          </strong>

          <b>
            ×${qtd}
          </b>

        </div>


        <div class="
          stack-linhagem-v0862
        ">
          Recurso
        </div>

      </div>


      <div class="
        stack-acoes-v0862
      ">

        <button
          type="button"
          data-mover-pilha-v0862="${
            chave
          }"
          data-destino-pilha-v0862="${
            guardar
            ?
            "ARMARIO"
            :
            "INVENTARIO"
          }"
        >
          ${
            guardar
            ?
            "🗄️"
            :
            "🎒"
          }
        </button>

      </div>

    </div>

  `;

}


/* ======================================================
   RECURSOS TRADICIONAIS POR CATEGORIA
   ====================================================== */

function recursosCategoriaV0862(
  local,
  categoria
) {

  const ignorar =
    new Set([
      "FRUTO",
      "FLOR",
      "CASCA",
      "PETALA"
    ]);


  return Object
    .entries(
      CATALOGO_INVENTARIO_V070
      ||
      {}
    )
    .filter(
      ([chave, dados]) => {

        if (
          ignorar.has(
            chave
          )
        ) {

          return false;

        }


        if (
          dados.categoria
          !== categoria
        ) {

          return false;

        }


        const qtd =
          local ===
          "ARMARIO"
          ?
          quantidadeArmarioV086(
            chave
          )
          :
          quantidadeDisponivelV086(
            chave
          );


        return (
          qtd > 0
        );

      }
    );

}


/* ======================================================
   CONTEÚDO DE UM LOCAL
   ====================================================== */

function htmlConteudoLocalV0862(
  local,
  categoria
) {

  const agrupamento =
    agrupamentoV0862(
      local,
      categoria
    );


  const recursos =
    recursosCategoriaV0862(
      local,
      categoria
    );


  const partes = [];


  for (
    const item
    of agrupamento.soltos
  ) {

    partes.push(
      htmlIndividualTaxonomicoV0862(
        item,
        local
      )
    );

  }


  for (
    const [
      assinatura,
      itens
    ]
    of agrupamento.grupos
  ) {

    partes.push(
      htmlGrupoTaxonomicoV0862(
        assinatura,
        itens,
        local
      )
    );

  }


  for (
    const [
      chave
    ]
    of recursos
  ) {

    partes.push(
      htmlPilhaTradicionalV0862(
        chave,
        local
      )
    );

  }


  if (
    partes.length === 0
  ) {

    return `

      <div class="
        taxonomia-vazia-v0862
      ">

        <span>
          📭
        </span>

        <small>
          Nada nesta categoria.
        </small>

      </div>

    `;

  }


  return `

    <div class="
      lista-taxonomica-v0862
    ">
      ${partes.join("")}
    </div>

  `;

}


/* ======================================================
   MODAL DO STACK
   ====================================================== */

function abrirStackV0862(
  codigo,
  local
) {

  const assinatura =
    decodeURIComponent(
      codigo
    );


  const itens =
    objetosPorLocalV0862(
      local
    )
    .filter(
      item =>
        assinaturaTaxonomicaV0862(
          item
        )
        === assinatura
    );


  if (
    itens.length === 0
  ) {

    return;

  }


  const dados =
    dadosGrupoV0862(
      itens
    );


  let modal =
    document.querySelector(
      "#stackDetalhesV0862"
    );


  if (!modal) {

    modal =
      document.createElement(
        "div"
      );


    modal.id =
      "stackDetalhesV0862";


    modal.className =
      "modal-stack-v0862";


    document.body.appendChild(
      modal
    );

  }


  modal.innerHTML = `

    <div class="
      caixa-stack-v0862
    ">

      <header>

        <div>

          <span>
            GRUPO
          </span>

          <h3>
            ${dados.primeiro.nome}
          </h3>

          <p>
            ${dados.cor}
            •
            G${dados.geracao}
            •
            ${estrelasV0862(
              dados.qualidade.nivel
            )}
            ${dados.qualidade.nome}
            •
            ${itens.length} unidade(s)
          </p>

        </div>


        <button
          type="button"
          id="fecharStackV0862"
        >
          ✕
        </button>

      </header>


      <div class="
        propriedades-stack-modal-v0862
      ">

        ${
          dados.dna.vigor
          !== undefined
          ?
          `
          <span>
            Vigor
            <strong>
              ${dados.dna.vigor}
            </strong>
          </span>
          `
          :
          ""
        }


        ${
          dados.dna.sombra
          !== undefined
          ?
          `
          <span>
            Sombra
            <strong>
              ${dados.dna.sombra}
            </strong>
          </span>
          `
          :
          ""
        }


        ${
          dados.dna.seca
          !== undefined
          ?
          `
          <span>
            Seca
            <strong>
              ${dados.dna.seca}
            </strong>
          </span>
          `
          :
          ""
        }

      </div>


      <div class="
        unidades-stack-v0862
      ">

        ${itens
          .map(
            item => `

              <button
                type="button"
                data-unidade-stack-v0862="${
                  item.id
                }"
              >

                <span>
                  ${item.icone || "📦"}
                </span>


                <div>

                  <strong>
                    ${item.id}
                  </strong>

                  <small>
                    G${
                      item
                        .origemPlanta
                        ?.geracao
                      ??
                      "—"
                    }
                    •
                    Dia ${
                      item
                        .origemPlanta
                        ?.dia
                      ??
                      "—"
                    }
                  </small>

                </div>


                <b>
                  ›
                </b>

              </button>

            `
          )
          .join("")}

      </div>

    </div>

  `;


  modal
    .querySelector(
      "#fecharStackV0862"
    )
    .onclick =
      () =>
        modal.remove();


  modal.onclick =
    evento => {

      if (
        evento.target ===
        modal
      ) {

        modal.remove();

      }

    };


  modal
    .querySelectorAll(
      "[data-unidade-stack-v0862]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            abrirFichaItemV070?.(
              botao
                .dataset
                .unidadeStackV0862
            );

          };

      }
    );

}


/* ======================================================
   EVENTOS COMUNS
   ====================================================== */

function instalarEventosTaxonomicosV0862(
  raiz,
  rerender
) {

  raiz
    .querySelectorAll(
      "[data-abrir-stack-v0862]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            abrirStackV0862(
              botao
                .dataset
                .abrirStackV0862,

              botao
                .dataset
                .localStackV0862
            );

          };

      }
    );


  raiz
    .querySelectorAll(
      "[data-ficha-tax-v0862]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            abrirFichaItemV070?.(
              botao
                .dataset
                .fichaTaxV0862
            );

          };

      }
    );


  raiz
    .querySelectorAll(
      "[data-mover-stack-v0862]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            const id =
              botao
                .dataset
                .moverStackV0862;


            const destino =
              botao
                .dataset
                .destinoStackV0862;


            if (
              destino ===
              "ARMARIO"
            ) {

              guardarObjetoV086(
                id
              );

            }
            else {

              retirarObjetoV086(
                id
              );

            }


            rerender();

          };

      }
    );


  raiz
    .querySelectorAll(
      "[data-mover-pilha-v0862]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            const chave =
              botao
                .dataset
                .moverPilhaV0862;


            const destino =
              botao
                .dataset
                .destinoPilhaV0862;


            if (
              destino ===
              "ARMARIO"
            ) {

              guardarPilhaV086(
                chave
              );

            }
            else {

              retirarPilhaV086(
                chave
              );

            }


            rerender();

          };

      }
    );

}


/* ======================================================
   INVENTÁRIO OPERACIONAL
   ====================================================== */

function renderConteudoTaxonomicoInventarioV0862() {

  const area =
    document.querySelector(
      "#conteudoV0861"
    );


  if (!area) {

    return;

  }


  area.innerHTML =
    htmlConteudoLocalV0862(
      "INVENTARIO",
      abaV0861
    );


  instalarEventosTaxonomicosV0862(
    area,
    renderInventarioOperacionalV0861
  );

}


/*
Sobrescreve SOMENTE o conteúdo da V0.8.6.1.
O modal, botão global e abas continuam funcionando.
*/

renderConteudoV0861 =
  renderConteudoTaxonomicoInventarioV0862;


/* ======================================================
   ARMÁRIO TAXONÔMICO
   ====================================================== */

const ABAS_ARMARIO_V0862 = {

  SEMENTES: "🌱 Sementes",

  SOLOS: "🪴 Solos",

  COLHEITA: "🍎 Colheita",

  MATERIAIS: "🧩 Materiais",

  FERRAMENTAS: "🛠️ Ferramentas"

};


let abaArmarioV0862 =
  "SEMENTES";


function renderArmazenamentoV086() {

  garantirArmazenamentoV086();


  const overlay =
    criarOverlayInternoV082();


  if (!overlay) {

    return;

  }


  overlay.innerHTML = `

    <div class="
      storage-taxonomico-v0862
    ">

      <header class="
        topo-storage-tax-v0862
      ">

        <div>

          <span>
            🧪 BANCADA
          </span>

          <h2>
            Armário do laboratório
          </h2>

          <p>
            Armazenamento separado do inventário ativo.
          </p>

        </div>


        <button
          type="button"
          id="fecharStorageTaxV0862"
          class="fechar-contextual-v082"
        >
          ✕
        </button>

      </header>


      <nav class="
        abas-storage-tax-v0862
      ">

        ${Object
          .entries(
            ABAS_ARMARIO_V0862
          )
          .map(
            ([id, nome]) => `

              <button
                type="button"
                data-aba-armario-v0862="${
                  id
                }"
                class="${
                  abaArmarioV0862
                  === id
                  ?
                  "ativa"
                  :
                  ""
                }"
              >
                ${nome}
              </button>

            `
          )
          .join("")}

      </nav>


      <div class="
        comparacao-storage-v0862
      ">

        <section>

          <header>
            <strong>
              🎒 Inventário
            </strong>

            <small>
              Disponível para uso
            </small>
          </header>


          <div
            id="inventarioStorageV0862"
          >

            ${
              htmlConteudoLocalV0862(
                "INVENTARIO",
                abaArmarioV0862
              )
            }

          </div>

        </section>


        <div class="
          seta-storage-tax-v0862
        ">
          ⇄
        </div>


        <section>

          <header>
            <strong>
              🗄️ Armário
            </strong>

            <small>
              Guardado na bancada
            </small>
          </header>


          <div
            id="armarioStorageV0862"
          >

            ${
              htmlConteudoLocalV0862(
                "ARMARIO",
                abaArmarioV0862
              )
            }

          </div>

        </section>

      </div>

    </div>

  `;


  overlay
    .querySelector(
      "#fecharStorageTaxV0862"
    )
    .onclick =
      fecharOverlayInternoV082;


  overlay
    .querySelectorAll(
      "[data-aba-armario-v0862]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            abaArmarioV0862 =
              botao
                .dataset
                .abaArmarioV0862;


            renderArmazenamentoV086();

          };

      }
    );


  instalarEventosTaxonomicosV0862(
    overlay,
    renderArmazenamentoV086
  );

}


/* ======================================================
   INICIALIZAÇÃO
   ====================================================== */

console.log(
  "[A Plantinha] V0.8.6.2 — Pilhas inteligentes por localização carregadas."
);
