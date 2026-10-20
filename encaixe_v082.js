/*
================================================================
A PLANTINHA — V0.8.2
ENCAIXE DE INTERFACES
================================================================

Corrige:

1. Novo cultivo abre DENTRO do laboratório.
2. Armário abre Inventário do Laboratório contextual.
3. Interfaces contextuais pertencem ao ambiente atual.

Não altera biologia.
*/


/* ============================================================
   OVERLAY INTERNO
   ============================================================ */

function criarOverlayInternoV082() {

  let overlay =
    document.querySelector(
      "#overlayInternoV082"
    );


  if (overlay) {
    return overlay;
  }


  const raiz =
    document.querySelector(
      "#universoLaboratorioV081"
    );


  if (!raiz) {
    return null;
  }


  overlay =
    document.createElement(
      "div"
    );


  overlay.id =
    "overlayInternoV082";


  overlay.className =
    "overlay-interno-v082";


  raiz.appendChild(
    overlay
  );


  return overlay;

}


function fecharOverlayInternoV082() {

  document
    .querySelector(
      "#overlayInternoV082"
    )
    ?.remove();

}


/* ============================================================
   NOVO CULTIVO — INTERNO
   ============================================================ */

function abrirMontagemInternaV082(
  vasoId
) {

  const sementePreSelecionadaV0869 =
    estado.sementeSelecionadaV0867 || null;


  const sementesDisponiveisAgoraV0869 =
    sementesDisponiveisV080();


  const sementeValidaV0869 =
    sementesDisponiveisAgoraV0869
      .some(
        item =>
          item.id ===
          sementePreSelecionadaV0869
      );


  montagemV080 = {

    vaso:
      vasoId,

    semente:
      sementeValidaV0869
        ?
        sementePreSelecionadaV0869
        :
        null,

    solo:
      null

  };


  renderMontagemInternaV082();

}


function renderMontagemInternaV082() {

  const overlay =
    criarOverlayInternoV082();


  if (!overlay) {
    return;
  }


  const sementes =
    sementesDisponiveisV080();


  const solos =
    solosDisponiveisV080();


  const atualSemente =
    sementes.find(
      item =>
        item.id ===
        montagemV080.semente
    );


  const atualSolo =
    solos.find(
      item =>
        item.chave ===
        montagemV080.solo
    );


  const pronto =
    Boolean(
      montagemV080.vaso
      &&
      montagemV080.semente
      &&
      montagemV080.solo
    );


  overlay.innerHTML = `

    <div class="janela-contextual-v082">

      <button
        type="button"
        id="fecharMontagemInternaV082"
        class="fechar-contextual-v082"
      >
        ✕
      </button>


      <div class="titulo-contextual-v082">

        <span>
          🌱 NOVO CULTIVO
        </span>

        <strong>
          Módulo ${montagemV080.vaso}
        </strong>

      </div>


      <section class="etapa-contextual-v082">

        <h3>
          1. Escolha uma semente
        </h3>


        <div class="grid-contextual-v082">

          ${
            sementes.length
            ?
            sementes
              .map(
                semente => `

                  <button
                    type="button"
                    data-semente-v082="${semente.id}"
                    data-base-semente="${semente.base}"
                    class="
                      opcao-contextual-v082
                      ${
                        montagemV080.semente
                        ===
                        semente.id
                        ?
                        "selecionada"
                        :
                        ""
                      }
                    "
                  >

                    <span class="icone-opcao-v082">
                      🌱
                    </span>

                    <strong>
                      ${semente.nome}
                    </strong>

                    <small>
                      ${
                        semente.geracao
                        ?
                        `G${semente.geracao}`
                        :
                        `×${semente.quantidade}`
                      }
                    </small>

                  </button>

                `
              )
              .join("")
            :
            `
              <div class="vazio-contextual-v082">
                Nenhuma semente disponível.
              </div>
            `
          }

        </div>

      </section>


      <section class="etapa-contextual-v082">

        <h3>
          2. Escolha o solo
        </h3>


        <div class="grid-contextual-v082">

          ${
            solos.length
            ?
            solos
              .map(
                solo => `

                  <button
                    type="button"
                    data-solo-v082="${solo.chave}"
                    class="
                      opcao-contextual-v082
                      ${
                        montagemV080.solo
                        ===
                        solo.chave
                        ?
                        "selecionada"
                        :
                        ""
                      }
                    "
                  >

                    <span class="icone-opcao-v082">
                      🪴
                    </span>

                    <strong>
                      ${solo.nome}
                    </strong>

                    <small>
                      ×${solo.quantidade}
                    </small>

                  </button>

                `
              )
              .join("")
            :
            `
              <div class="vazio-contextual-v082">
                Nenhum solo disponível.
              </div>
            `
          }

        </div>

      </section>


      <div class="resumo-contextual-v082">

        <span>
          🌱 ${atualSemente?.nome || "Semente"}
        </span>

        <b>
          +
        </b>

        <span>
          🪴 ${atualSolo?.nome || "Solo"}
        </span>

        <b>
          →
        </b>

        <span>
          Módulo ${montagemV080.vaso}
        </span>

      </div>


      <button
        type="button"
        id="confirmarCultivoV082"
        class="play-contextual-v082"
        ${pronto ? "" : "disabled"}
      >
        ▶ Iniciar cultivo
      </button>

    </div>

  `;


  overlay
    .querySelector(
      "#fecharMontagemInternaV082"
    )
    .onclick =
      fecharOverlayInternoV082;


  overlay
    .querySelectorAll(
      "[data-semente-v082]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            montagemV080.semente =
              botao.dataset
                .sementeV082;


            renderMontagemInternaV082();

          };

      }
    );


  overlay
    .querySelectorAll(
      "[data-solo-v082]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            montagemV080.solo =
              botao.dataset
                .soloV082;


            renderMontagemInternaV082();

          };

      }
    );


  overlay
    .querySelector(
      "#confirmarCultivoV082"
    )
    ?.addEventListener(
      "click",
      () => {

        confirmarPlantioV080();

        fecharOverlayInternoV082();

        renderLaboratorioV081();

      }
    );

}


/* ============================================================
   SUBSTITUI ABERTURA DO VASO LIVRE
   ============================================================ */

const irEstacaoAnteriorV082 =
  irEstacaoV081;


irEstacaoV081 =
  function(
    vasoId
  ) {

    garantirQuartoV080?.();


    const vaso =
      estado
        .quartoV080
        ?.vasos
        ?.find(
          item =>
            item.id === vasoId
        );


    if (!vaso) {
      return;
    }


    if (
      vaso.desbloqueado
      &&
      !vaso.cultivo
    ) {

      abrirMontagemInternaV082(
        vasoId
      );

      return;

    }


    irEstacaoAnteriorV082(
      vasoId
    );

  };


/* ============================================================
   INVENTÁRIO DO LABORATÓRIO
   ============================================================ */

function itensLaboratorioV082() {

  const resultado = {

    sementes: [],

    solos: [],

    colheitas: [],

    materiais: [],

    ferramentas: []

  };


  /*
  ------------------------------------------------------------
  SEMENTES
  ------------------------------------------------------------
  */

  for (
    const semente
    of sementesDisponiveisV080()
  ) {

    resultado
      .sementes
      .push({

        icone:
          "🌱",

        nome:
          semente.nome,

        detalhe:
          semente.geracao
          ?
          `Geração ${semente.geracao}`
          :
          `Quantidade ${semente.quantidade}`

      });

  }


  /*
  ------------------------------------------------------------
  SOLOS
  ------------------------------------------------------------
  */

  for (
    const solo
    of solosDisponiveisV080()
  ) {

    resultado
      .solos
      .push({

        icone:
          "🪴",

        nome:
          solo.nome,

        detalhe:
          `Quantidade ${solo.quantidade}`

      });

  }


  /*
  ------------------------------------------------------------
  PILHAS BÁSICAS
  ------------------------------------------------------------
  */

  const inventario =
    estado.inventario
    ||
    {};


  const pilhas = [

    [
      "FRUTO",
      "🍎",
      "Frutos",
      "colheitas"
    ],

    [
      "FLOR",
      "🌸",
      "Flores",
      "colheitas"
    ],

    [
      "CASCA",
      "🟤",
      "Cascas",
      "materiais"
    ],

    [
      "PETALA",
      "🌺",
      "Pétalas",
      "materiais"
    ],

    [
      "LAMPADA_FRACA",
      "💡",
      "Lâmpada fraca",
      "ferramentas"
    ],

    [
      "LAMPADA_FORTE",
      "🔆",
      "Lâmpada forte",
      "ferramentas"
    ]

  ];


  for (
    const [
      chave,
      icone,
      nome,
      grupo
    ]
    of pilhas
  ) {

    const quantidade =
      Number(
        inventario[chave]
        ||
        0
      );


    if (
      quantidade > 0
    ) {

      resultado[
        grupo
      ].push({

        icone,

        nome,

        detalhe:
          `Quantidade ${quantidade}`

      });

    }

  }


  /*
  ------------------------------------------------------------
  OBJETOS INDIVIDUAIS
  ------------------------------------------------------------
  */

  const estruturados =
    estado
      .inventarioEstruturado
      ?.itens
    ||
    [];


  for (
    const item
    of estruturados
  ) {

    if (
      item.tipo ===
      "SEMENTE_DNA"
    ) {

      continue;

    }


    const destino =
      (
        item.tipo === "FRUTO"
        ||
        item.tipo === "FLOR"
      )
      ?
      "colheitas"
      :
      "materiais";


    resultado[
      destino
    ].push({

      icone:
        item.icone
        ||
        "📦",

      nome:
        item.nome
        ||
        item.tipo
        ||
        "Item",

      detalhe:
        item.id
        ||
        "Objeto individual"

    });

  }


  return resultado;

}


/* ============================================================
   ABRIR ARMÁRIO
   ============================================================ */

function abrirInventarioLaboratorioV082() {

  const overlay =
    criarOverlayInternoV082();


  if (!overlay) {
    return;
  }


  const itens =
    itensLaboratorioV082();


  const abas = [

    [
      "sementes",
      "🌱",
      "Sementes"
    ],

    [
      "solos",
      "🪴",
      "Solos"
    ],

    [
      "colheitas",
      "🍎",
      "Colheitas"
    ],

    [
      "materiais",
      "🧩",
      "Materiais"
    ],

    [
      "ferramentas",
      "🛠️",
      "Ferramentas"
    ]

  ];


  overlay.innerHTML = `

    <div class="
      janela-contextual-v082
      inventario-lab-v082
    ">

      <button
        type="button"
        id="fecharInventarioLabV082"
        class="fechar-contextual-v082"
      >
        ✕
      </button>


      <div class="titulo-contextual-v082">

        <span>
          🗄️ ARMÁRIO
        </span>

        <strong>
          Inventário do Laboratório
        </strong>

      </div>


      <div class="abas-inventario-lab-v082">

        ${abas
          .map(
            (
              [
                chave,
                icone,
                nome
              ],
              indice
            ) => `

              <button
                type="button"
                data-aba-lab-v082="${chave}"
                class="
                  ${
                    indice === 0
                    ?
                    "ativa"
                    :
                    ""
                  }
                "
              >

                ${icone}

                <span>
                  ${nome}
                </span>

              </button>

            `
          )
          .join("")}

      </div>


      <div
        id="conteudoInventarioLabV082"
        class="conteudo-inventario-lab-v082"
      ></div>

    </div>

  `;


  overlay
    .querySelector(
      "#fecharInventarioLabV082"
    )
    .onclick =
      fecharOverlayInternoV082;


  const renderAba =
    aba => {

      const area =
        overlay.querySelector(
          "#conteudoInventarioLabV082"
        );


      const lista =
        itens[aba]
        ||
        [];


      if (
        lista.length === 0
      ) {

        area.innerHTML = `

          <div class="inventario-lab-vazio-v082">

            <span>
              📭
            </span>

            <strong>
              Nada guardado aqui
            </strong>

            <small>
              Este compartimento ainda está vazio.
            </small>

          </div>

        `;

        return;

      }


      area.innerHTML = `

        <div class="lista-inventario-lab-v082">

          ${lista
            .map(
              item => `

                <div class="item-inventario-lab-v082">

                  <span class="icone-item-lab-v082">
                    ${item.icone}
                  </span>

                  <div>

                    <strong>
                      ${item.nome}
                    </strong>

                    <small>
                      ${item.detalhe}
                    </small>

                  </div>

                </div>

              `
            )
            .join("")}

        </div>

      `;

    };


  overlay
    .querySelectorAll(
      "[data-aba-lab-v082]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            overlay
              .querySelectorAll(
                "[data-aba-lab-v082]"
              )
              .forEach(
                outro =>
                  outro.classList.remove(
                    "ativa"
                  )
              );


            botao.classList.add(
              "ativa"
            );


            renderAba(
              botao.dataset
                .abaLabV082
            );

          };

      }
    );


  renderAba(
    "sementes"
  );

}


/* ============================================================
   SUBSTITUI BOTÃO DO ARMÁRIO
   ============================================================ */

abrirArmarioV081 =
  abrirInventarioLaboratorioV082;


/* ============================================================
   FECHAR AO TROCAR DE AMBIENTE
   ============================================================ */

const irLabAnteriorV082 =
  irLaboratorioV081;


irLaboratorioV081 =
  function() {

    fecharOverlayInternoV082();

    irLabAnteriorV082();

  };


const irBancadaAnteriorV082 =
  irBancadaV081;


irBancadaV081 =
  function() {

    fecharOverlayInternoV082();

    irBancadaAnteriorV082();

  };


/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

fecharOverlayInternoV082();


