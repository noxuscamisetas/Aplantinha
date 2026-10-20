/*
==========================================================
A PLANTINHA — V0.8.6.1
INVENTÁRIO OPERACIONAL
==========================================================

🎒 Inventário:
- acessível sempre
- itens disponíveis para uso
- frutos/flores agrupados visualmente
- objetos continuam individuais
- permite venda
- permite enviar ao armário

🗄️ Armário:
- armazenamento separado V0.8.6
==========================================================
*/


function garantirInventarioOperacionalV0861() {

  if (
    typeof garantirArmazenamentoV086
    === "function"
  ) {

    garantirArmazenamentoV086();

  }

}


/* ======================================================
   OBJETOS DISPONÍVEIS
   ====================================================== */

function objetosInventarioV0861() {

  garantirInventarioOperacionalV0861();


  return (
    estado
      .inventarioEstruturado
      ?.itens
      ?.filter(
        item =>
          (
            item.localizacao
            ||
            "INVENTARIO"
          )
          ===
          "INVENTARIO"
      )
    ||
    []
  );

}


function objetosTipoV0861(
  tipo
) {

  return objetosInventarioV0861()
    .filter(
      item =>
        item.tipo === tipo
    );

}


/* ======================================================
   AGRUPAMENTO
   ====================================================== */

function assinaturaObjetoV0861(
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


  return null;

}


function categoriaObjetoV0861(
  item
) {

  if (
    item.tipo === "SEMENTE_DNA"
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
    item.tipo === "MATERIA_VEGETAL"
  ) {

    return "MATERIAIS";

  }


  return (
    item.categoria
    ||
    "ITENS"
  );

}


function separarObjetosV0861(
  categoria
) {

  const mapa =
    new Map();


  const individuais =
    [];


  for (
    const item
    of objetosInventarioV0861()
  ) {

    if (
      categoriaObjetoV0861(
        item
      )
      !==
      categoria
    ) {

      continue;

    }


    const assinatura =
      assinaturaObjetoV0861(
        item
      );


    if (
      !assinatura
    ) {

      individuais.push(
        item
      );

      continue;

    }


    if (
      !mapa.has(
        assinatura
      )
    ) {

      mapa.set(
        assinatura,
        []
      );

    }


    mapa
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
        mapa.entries()
      ),

    individuais

  };

}


/* ======================================================
   PILHAS SIMPLES
   ====================================================== */

function pilhasOperacionaisV0861(
  categoria
) {

  const resultado = [];


  for (
    const [
      chave,
      dados
    ]
    of Object.entries(
      CATALOGO_INVENTARIO_V070
      ||
      {}
    )
  ) {

    /*
    Estes quatro já são indivíduos.
    */

    if (
      [
        "FRUTO",
        "FLOR",
        "CASCA",
        "PETALA"
      ].includes(
        chave
      )
    ) {

      continue;

    }


    if (
      dados.categoria
      !== categoria
    ) {

      continue;

    }


    const quantidade =
      typeof quantidadeDisponivelV086
      === "function"
      ?
      quantidadeDisponivelV086(
        chave
      )
      :
      Number(
        estado.inventario?.[
          chave
        ]
        ||
        0
      );


    if (
      quantidade <= 0
    ) {

      continue;

    }


    resultado.push({

      chave,

      nome:
        dados.nome,

      icone:
        dados.icone,

      quantidade

    });

  }


  return resultado;

}


/* ======================================================
   HTML PILHA
   ====================================================== */

function htmlPilhaOperacionalV0861(
  item
) {

  return `

    <div class="item-op-v0861">

      <span class="icone-op-v0861">
        ${item.icone}
      </span>


      <div class="dados-op-v0861">

        <strong>
          ${item.nome}
        </strong>

        <small>
          Quantidade ${item.quantidade}
        </small>

      </div>


      <button
        type="button"
        data-guardar-pilha-v0861="${item.chave}"
        title="Guardar uma unidade"
      >
        🗄️
      </button>

    </div>

  `;

}


/* ======================================================
   HTML INDIVIDUAL
   ====================================================== */

function htmlIndividualOperacionalV0861(
  item
) {

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
      `${item.estadoMateria || "Matéria"} • ${item.massa || 1} BIO`;

  }


  return `

    <div class="item-op-v0861">

      <span class="icone-op-v0861">
        ${item.icone || "📦"}
      </span>


      <div class="dados-op-v0861">

        <strong>
          ${item.nome || item.tipo}
        </strong>

        <small>
          ${detalhe}
        </small>

      </div>


      <button
        type="button"
        data-ficha-v0861="${item.id}"
        title="Examinar"
      >
        🔎
      </button>


      <button
        type="button"
        data-guardar-objeto-v0861="${item.id}"
        title="Guardar"
      >
        🗄️
      </button>

    </div>

  `;

}


/* ======================================================
   HTML GRUPO
   ====================================================== */

function htmlGrupoOperacionalV0861(
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
    "Sem origem";


  const qualidade =
    primeiro.qualidade?.nome
    ||
    "—";


  const vendavel =
    primeiro.tipo === "FRUTO"
    ||
    primeiro.tipo === "FLOR";


  const preco =
    primeiro.tipo === "FRUTO"
    ?
    5
    :
    4;


  return `

    <div class="item-op-v0861 grupo-op-v0861">

      <span class="icone-op-v0861">
        ${primeiro.icone || "📦"}
      </span>


      <div class="dados-op-v0861">

        <strong>
          ${primeiro.nome}
          ×${itens.length}
        </strong>

        <small>
          ${cor}
          •
          ${qualidade}
        </small>

      </div>


      <button
        type="button"
        data-grupo-v0861="${encodeURIComponent(
          assinatura
        )}"
        title="Ver unidades"
      >
        🔎
      </button>


      ${
        vendavel
        ?
        `
        <button
          type="button"
          class="vender-op-v0861"
          data-vender-v0861="${primeiro.tipo}"
        >
          🪙 +${preco}
        </button>
        `
        :
        ""
      }


      <button
        type="button"
        data-guardar-objeto-v0861="${primeiro.id}"
        title="Guardar uma unidade"
      >
        🗄️
      </button>

    </div>

  `;

}


/* ======================================================
   GRUPO → UNIDADES
   ====================================================== */

function abrirGrupoOperacionalV0861(
  codigo
) {

  const assinatura =
    decodeURIComponent(
      codigo
    );


  const itens =
    objetosInventarioV0861()
      .filter(
        item =>
          assinaturaObjetoV0861(
            item
          )
          ===
          assinatura
      );


  if (
    itens.length === 0
  ) {

    return;

  }


  let modal =
    document.querySelector(
      "#modalGrupoV0861"
    );


  if (!modal) {

    modal =
      document.createElement(
        "div"
      );


    modal.id =
      "modalGrupoV0861";


    modal.className =
      "modal-grupo-v0861";


    document.body.appendChild(
      modal
    );

  }


  modal.innerHTML = `

    <div class="caixa-grupo-v0861">

      <header>

        <div>

          <span>
            UNIDADES
          </span>

          <strong>
            ${itens[0].nome}
            ×${itens.length}
          </strong>

        </div>


        <button
          type="button"
          id="fecharGrupoV0861"
        >
          ✕
        </button>

      </header>


      <div class="lista-grupo-v0861">

        ${itens
          .map(
            item => `

              <button
                type="button"
                data-unidade-v0861="${item.id}"
              >

                <span>
                  ${item.icone || "📦"}
                </span>

                <div>

                  <strong>
                    ${item.id}
                  </strong>

                  <small>
                    G${item.origemPlanta?.geracao ?? "—"}
                    •
                    Dia ${item.origemPlanta?.dia ?? "—"}
                  </small>

                </div>

              </button>

            `
          )
          .join("")}

      </div>

    </div>

  `;


  modal
    .querySelector(
      "#fecharGrupoV0861"
    )
    .onclick =
      () =>
        modal.remove();


  modal
    .querySelectorAll(
      "[data-unidade-v0861]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            if (
              typeof abrirFichaItemV070
              === "function"
            ) {

              abrirFichaItemV070(
                botao.dataset
                  .unidadeV0861
              );

            }

          };

      }
    );


  modal.onclick =
    evento => {

      if (
        evento.target
        ===
        modal
      ) {

        modal.remove();

      }

    };

}


/* ======================================================
   ABAS
   ====================================================== */

const ABAS_V0861 = {

  SEMENTES: {
    nome: "Sementes",
    icone: "🌱"
  },

  SOLOS: {
    nome: "Solos",
    icone: "🪴"
  },

  COLHEITA: {
    nome: "Colheita",
    icone: "🍎"
  },

  MATERIAIS: {
    nome: "Materiais",
    icone: "🧩"
  },

  ITENS: {
    nome: "Itens",
    icone: "🛠️"
  }

};


let abaV0861 =
  "SEMENTES";


/* ======================================================
   CONTEÚDO
   ====================================================== */

function renderConteudoV0861() {

  const area =
    document.querySelector(
      "#conteudoV0861"
    );


  if (!area) {

    return;

  }


  const pilhas =
    pilhasOperacionaisV0861(
      abaV0861
    );


  const separacao =
    separarObjetosV0861(
      abaV0861
    );


  if (
    pilhas.length === 0
    &&
    separacao.grupos.length === 0
    &&
    separacao.individuais.length === 0
  ) {

    area.innerHTML = `

      <div class="vazio-op-v0861">

        <span>
          📭
        </span>

        <strong>
          Nada disponível
        </strong>

        <small>
          Itens guardados no armário
          não aparecem aqui.
        </small>

      </div>

    `;

    return;

  }


  area.innerHTML = `

    <div class="lista-op-v0861">

      ${pilhas
        .map(
          htmlPilhaOperacionalV0861
        )
        .join("")}


      ${separacao.individuais
        .map(
          htmlIndividualOperacionalV0861
        )
        .join("")}


      ${separacao.grupos
        .map(
          ([assinatura, itens]) =>
            htmlGrupoOperacionalV0861(
              assinatura,
              itens
            )
        )
        .join("")}

    </div>

  `;


  /*
  Guardar pilha.
  */

  area
    .querySelectorAll(
      "[data-guardar-pilha-v0861]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            guardarPilhaV086(
              botao.dataset
                .guardarPilhaV0861
            );


            renderInventarioOperacionalV0861();

          };

      }
    );


  /*
  Guardar objeto.
  */

  area
    .querySelectorAll(
      "[data-guardar-objeto-v0861]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            guardarObjetoV086(
              botao.dataset
                .guardarObjetoV0861
            );


            renderInventarioOperacionalV0861();

          };

      }
    );


  /*
  Abrir ficha.
  */

  area
    .querySelectorAll(
      "[data-ficha-v0861]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            if (
              typeof abrirFichaItemV070
              === "function"
            ) {

              abrirFichaItemV070(
                botao.dataset
                  .fichaV0861
              );

            }

          };

      }
    );


  /*
  Abrir grupo.
  */

  area
    .querySelectorAll(
      "[data-grupo-v0861]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () =>
            abrirGrupoOperacionalV0861(
              botao.dataset
                .grupoV0861
            );

      }
    );


  /*
  Venda.
  */

  area
    .querySelectorAll(
      "[data-vender-v0861]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            const tipo =
              botao.dataset
                .venderV0861;


            /*
            Só permite vender objetos que estejam
            realmente no inventário operacional.
            */

            if (
              objetosTipoV0861(
                tipo
              ).length <= 0
            ) {

              return;

            }


            /*
            O vender() antigo altera os contadores.

            observarTransacaoV071() então:
            - remove exatamente um objeto;
            - cria casca/pétala individual;
            - preserva procedência.
            */

            if (
              typeof observarTransacaoV071
              === "function"
            ) {

              observarTransacaoV071(
                () =>
                  vender(
                    tipo
                  )
              );

            }

            else {

              vender(
                tipo
              );

            }


            renderInventarioOperacionalV0861();

          };

      }
    );

}


/* ======================================================
   MODAL
   ====================================================== */

function renderInventarioOperacionalV0861() {

  garantirInventarioOperacionalV0861();


  let modal =
    document.querySelector(
      "#inventarioOperacionalV0861"
    );


  if (!modal) {

    modal =
      document.createElement(
        "div"
      );


    modal.id =
      "inventarioOperacionalV0861";


    modal.className =
      "modal-op-v0861";


    document.body.appendChild(
      modal
    );

  }


  modal.innerHTML = `

    <div class="caixa-op-v0861">

      <header class="topo-op-v0861">

        <div>

          <span>
            🎒 LABORATÓRIO
          </span>

          <h2>
            Inventário
          </h2>

          <small>
            Itens disponíveis para uso
          </small>

        </div>


        <div class="direita-op-v0861">

          <div class="moedas-op-v0861">

            🪙

            <strong>
              ${estado.moedas}
            </strong>

          </div>


          <button
            type="button"
            id="fecharOpV0861"
          >
            ✕
          </button>

        </div>

      </header>


      <nav class="abas-op-v0861">

        ${Object
          .entries(
            ABAS_V0861
          )
          .map(
            ([id, aba]) => `

              <button
                type="button"
                data-aba-v0861="${id}"
                class="${
                  abaV0861 === id
                  ?
                  "ativa"
                  :
                  ""
                }"
              >

                ${aba.icone}

                <span>
                  ${aba.nome}
                </span>

              </button>

            `
          )
          .join("")}

      </nav>


      <div
        id="conteudoV0861"
        class="conteudo-op-v0861"
      ></div>


      <footer>
        🗄️ O armário da Bancada guarda itens fora do inventário ativo.
      </footer>

    </div>

  `;


  modal
    .querySelector(
      "#fecharOpV0861"
    )
    .onclick =
      fecharInventarioOperacionalV0861;


  modal
    .querySelectorAll(
      "[data-aba-v0861]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            abaV0861 =
              botao.dataset
                .abaV0861;


            renderInventarioOperacionalV0861();

          };

      }
    );


  modal.onclick =
    evento => {

      if (
        evento.target === modal
      ) {

        fecharInventarioOperacionalV0861();

      }

    };


  renderConteudoV0861();

}


function abrirInventarioOperacionalV0861() {

  renderInventarioOperacionalV0861();

}


function fecharInventarioOperacionalV0861() {

  document
    .querySelector(
      "#inventarioOperacionalV0861"
    )
    ?.remove();

}


/* ======================================================
   BOTÃO GLOBAL
   ====================================================== */

function instalarBotaoV0861() {

  if (
    document.querySelector(
      "#botaoInventarioV0861"
    )
  ) {

    return;

  }


  const botao =
    document.createElement(
      "button"
    );


  botao.id =
    "botaoInventarioV0861";


  botao.className =
    "botao-global-v0861";


  botao.innerHTML = `

    <span>
      🎒
    </span>

    <strong>
      Inventário
    </strong>

  `;


  botao.onclick =
    abrirInventarioOperacionalV0861;


  document.body.appendChild(
    botao
  );

}


/* ======================================================
   INICIAR
   ====================================================== */

setTimeout(
  () => {

    garantirInventarioOperacionalV0861();

    instalarBotaoV0861();

    salvar();

  },
  0
);


console.log(
  "[A Plantinha] V0.8.6.1 — Inventário Operacional carregado."
);
