/*
==========================================================
A PLANTINHA — V0.8.7.1
SOLO COMO PONTO DE ENTRADA
==========================================================

Agora o mesmo processo pode começar de dois lados:

CASCA/PETALA -> USAR -> SOLO COMUM

ou

SOLO COMUM -> USAR -> CASCA/PETALA

A transformação final continua exatamente:

CASCA + SOLO_COMUM
    -> SOLO_ADITIVADO_CASCA

PETALA + SOLO_COMUM
    -> SOLO_ADITIVADO_PETALA
==========================================================
*/


const SOLOS_V0871 = new Set([
  "SOLO_COMUM",
  "SOLO_MINERAL",
  "SOLO_ORGANICO",
  "SOLO_ADITIVADO_CASCA",
  "SOLO_ADITIVADO_PETALA"
]);


/* ======================================================
   DADOS DO SOLO
   ====================================================== */

function dadosSoloV0871(
  chave
) {

  const dadosCatalogo =
    CATALOGO_INVENTARIO_V070?.[
      chave
    ]
    ||
    {};


  const mapaInterno = {

    SOLO_COMUM:
      "COMUM",

    SOLO_MINERAL:
      "MINERAL",

    SOLO_ORGANICO:
      "ORGANICO",

    SOLO_ADITIVADO_CASCA:
      "ADITIVADO_CASCA",

    SOLO_ADITIVADO_PETALA:
      "ADITIVADO_PETALA"

  };


  const interno =
    mapaInterno[chave];


  const propriedades =
    (
      typeof QUARTO_V080
      !== "undefined"
      ?
      QUARTO_V080
        ?.solos
        ?.[chave]
      :
      null
    )
    ||
    (
      typeof solos
      !== "undefined"
      ?
      solos?.[interno]
      :
      null
    )
    ||
    {};


  return {

    chave,

    nome:
      dadosCatalogo.nome
      ||
      chave,

    icone:
      dadosCatalogo.icone
      ||
      "🪴",

    crescimento:
      propriedades.crescimento
      ??
      "—",

    retencao:
      propriedades.retencao
      ??
      "—",

    nutricao:
      propriedades.nutricao
      ??
      "—",

    consumoAgua:
      propriedades.consumoAgua
      ??
      "—"

  };

}


/* ======================================================
   RESÍDUOS DISPONÍVEIS
   ====================================================== */

function residuosSoloV0871() {

  const itens =
    estado
      .inventarioEstruturado
      ?.itens
    ||
    [];


  return itens.filter(
    item => {

      const local =
        item.localizacao
        ||
        "INVENTARIO";


      return (
        local === "INVENTARIO"
        &&
        (
          item.tipo === "CASCA"
          ||
          item.tipo === "PETALA"
        )
      );

    }
  );

}


/* ======================================================
   FICHA DO SOLO
   ====================================================== */

function abrirFichaSoloV0871(
  chave,
  local
) {

  const dados =
    dadosSoloV0871(
      chave
    );


  const qtd =
    local === "ARMARIO"
    ?
    quantidadeArmarioV086(
      chave
    )
    :
    quantidadeDisponivelV086(
      chave
    );


  document
    .querySelector(
      "#fichaSoloV0871"
    )
    ?.remove();


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "fichaSoloV0871";


  modal.className =
    "modal-solo-v0871";


  const noInventario =
    local ===
    "INVENTARIO";


  modal.innerHTML = `

    <div class="ficha-solo-v0871">

      <header>

        <div>

          <span>
            SOLO
          </span>

          <h3>
            ${dados.icone}
            ${dados.nome}
          </h3>

          <p>
            ${qtd} unidade(s)
            •
            ${
              noInventario
              ?
              "Inventário"
              :
              "Armário"
            }
          </p>

        </div>


        <button
          type="button"
          id="fecharFichaSoloV0871"
        >
          ✕
        </button>

      </header>


      <section class="propriedades-solo-v0871">

        <div>
          <span>
            Crescimento
          </span>

          <strong>
            ${dados.crescimento}
          </strong>
        </div>


        <div>
          <span>
            Retenção
          </span>

          <strong>
            ${dados.retencao}
          </strong>
        </div>


        <div>
          <span>
            Nutrição
          </span>

          <strong>
            ${dados.nutricao}
          </strong>
        </div>


        <div>
          <span>
            Água
          </span>

          <strong>
            ${dados.consumoAgua}
          </strong>
        </div>

      </section>


      <section class="acoes-solo-v0871">

        <span>
          AÇÕES
        </span>


        <div>

          <button
            type="button"
            id="moverSoloV0871"
          >
            ${
              noInventario
              ?
              "🗄️ Guardar"
              :
              "🎒 Retirar"
            }
          </button>


          ${
            noInventario
            &&
            chave === "SOLO_COMUM"
            ?
            `

              <button
                type="button"
                id="usarSoloV0871"
              >
                🧪 Usar
              </button>

            `
            :
            ""
          }

        </div>

      </section>

    </div>

  `;


  document.body.appendChild(
    modal
  );


  modal
    .querySelector(
      "#fecharFichaSoloV0871"
    )
    .onclick =
      () =>
        modal.remove();


  modal.onclick =
    evento => {

      if (
        evento.target === modal
      ) {

        modal.remove();

      }

    };


  /*
  Guardar / retirar usa a tela de quantidade
  que já criamos.
  */

  modal
    .querySelector(
      "#moverSoloV0871"
    )
    .onclick =
      () => {

        modal.remove();


        if (
          typeof abrirModalTransferenciaV0865
          === "function"
        ) {

          abrirModalTransferenciaV0865({

            tipo:
              "PILHA",

            chave,

            origem:
              local,

            nome:
              dados.nome,

            icone:
              dados.icone

          });

        }

      };


  modal
    .querySelector(
      "#usarSoloV0871"
    )
    ?.addEventListener(
      "click",
      () => {

        modal.remove();

        abrirPreparoPartindoSoloV0871(
          chave
        );

      }
    );

}


/* ======================================================
   PREPARO PARTINDO DO SOLO
   ====================================================== */

function abrirPreparoPartindoSoloV0871(
  chaveSolo
) {

  if (
    chaveSolo !==
    "SOLO_COMUM"
  ) {

    return;

  }


  const residuos =
    residuosSoloV0871();


  document
    .querySelector(
      "#preparoPartindoSoloV0871"
    )
    ?.remove();


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "preparoPartindoSoloV0871";


  modal.className =
    "modal-preparo-solo-v0870";


  modal.innerHTML = `

    <div class="caixa-preparo-solo-v0870">

      <header>

        <div>

          <span>
            🪴 PREPARO DE SOLO
          </span>

          <h3>
            Solo comum
          </h3>

          <p>
            Escolha um material para adicionar.
          </p>

        </div>


        <button
          type="button"
          id="fecharPreparoPartindoSoloV0871"
        >
          ✕
        </button>

      </header>


      <div class="solo-base-v0871">

        <span>
          🪴
        </span>

        <div>

          <strong>
            Solo comum
          </strong>

          <small>
            Base selecionada
          </small>

        </div>

      </div>


      <section class="materiais-preparo-v0871">

        <span class="titulo-materiais-v0871">
          ESCOLHA UM MATERIAL
        </span>


        ${
          residuos.length
          ?
          `

            <div class="lista-materiais-v0871">

              ${residuos
                .map(
                  item => `

                    <button
                      type="button"
                      data-material-solo-v0871="${item.id}"
                    >

                      <span>
                        ${
                          item.tipo === "CASCA"
                          ?
                          "🍂"
                          :
                          "🌸"
                        }
                      </span>


                      <div>

                        <strong>
                          ${item.nome || item.tipo}
                        </strong>

                        <small>
                          ${item.id}
                          •
                          ${
                            item.qualidade?.nome
                            ||
                            "material"
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

          `
          :
          `

            <div class="sem-material-v0871">

              <span>
                📭
              </span>

              <p>
                Nenhuma casca ou pétala disponível
                no inventário.
              </p>

            </div>

          `
        }

      </section>

    </div>

  `;


  document.body.appendChild(
    modal
  );


  modal
    .querySelector(
      "#fecharPreparoPartindoSoloV0871"
    )
    .onclick =
      () =>
        modal.remove();


  modal.onclick =
    evento => {

      if (
        evento.target === modal
      ) {

        modal.remove();

      }

    };


  modal
    .querySelectorAll(
      "[data-material-solo-v0871]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            const item =
              estado
                .inventarioEstruturado
                ?.itens
                ?.find(
                  x =>
                    x.id
                    ===
                    botao.dataset
                      .materialSoloV0871
                );


            if (!item) {

              return;

            }


            /*
            Fecha a seleção da base e abre a MESMA
            confirmação que já funcionou quando o
            processo começou pela casca/pétala.
            */

            modal.remove();


            abrirPreparoSoloV0870(
              item
            );

          };

      }
    );

}


/* ======================================================
   ADICIONAR LUNETA AOS SOLOS
   ====================================================== */

if (
  typeof htmlPilhaTradicionalV0862
  === "function"
) {

  const htmlPilhaAnteriorV0871 =
    htmlPilhaTradicionalV0862;


  htmlPilhaTradicionalV0862 =
    function(
      chave,
      local
    ) {

      let html =
        htmlPilhaAnteriorV0871(
          chave,
          local
        );


      if (
        !SOLOS_V0871.has(
          chave
        )
      ) {

        return html;

      }


      if (
        html.includes(
          "data-ficha-solo-v0871"
        )
      ) {

        return html;

      }


      const botao = `

        <button
          type="button"
          class="inspecionar-solo-v0871"
          data-ficha-solo-v0871="${chave}"
          data-local-solo-v0871="${local}"
          title="Examinar solo"
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


/* ======================================================
   EVENTO DA LUNETA
   ====================================================== */

document.addEventListener(
  "click",
  evento => {

    const botao =
      evento.target.closest(
        "[data-ficha-solo-v0871]"
      );


    if (!botao) {

      return;

    }


    evento.preventDefault();

    evento.stopPropagation();


    abrirFichaSoloV0871(
      botao.dataset
        .fichaSoloV0871,

      botao.dataset
        .localSoloV0871
    );

  },
  true
);


console.log(
  "[A Plantinha] V0.8.7.1 — solo conectado ao preparo."
);
