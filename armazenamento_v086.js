/*
==========================================================
A PLANTINHA — V0.8.6
ARMAZENAMENTO DO LABORATÓRIO
==========================================================

Dois espaços:

INVENTARIO
- materiais carregados / disponíveis
- podem ser usados pelo motor

ARMARIO
- armazenamento da bancada
- preserva objetos
- não representa consumo

IMPORTANTE:

estado.inventario continua contendo os totais físicos
legados necessários para compatibilidade.

estado.armazenamentoV086.armarioPilhas registra apenas
quantos desses totais estão guardados.

Logo:

disponível = total legado - guardado
==========================================================
*/


function garantirArmazenamentoV086() {

  estado.armazenamentoV086 ??= {
    versao: 1,
    armarioPilhas: {}
  };

  estado.armazenamentoV086.armarioPilhas ??= {};

  garantirInventarioV070?.();


  /*
  Objetos antigos passam a pertencer ao inventário
  pessoal por padrão.
  */

  const itens =
    estado.inventarioEstruturado?.itens
    || [];

  for (const item of itens) {

    item.localizacao ??=
      "INVENTARIO";

  }

}


/*
==========================================================
PILHAS
==========================================================
*/


function quantidadeTotalV086(
  chave
) {

  return Math.max(
    0,
    Number(
      estado.inventario?.[chave]
      || 0
    )
  );

}


function quantidadeArmarioV086(
  chave
) {

  garantirArmazenamentoV086();

  return Math.max(
    0,
    Number(
      estado
        .armazenamentoV086
        .armarioPilhas[chave]
      || 0
    )
  );

}


function quantidadeDisponivelV086(
  chave
) {

  return Math.max(
    0,
    quantidadeTotalV086(chave)
    -
    quantidadeArmarioV086(chave)
  );

}


/*
==========================================================
TRANSFERÊNCIA DE PILHA
==========================================================
*/


function guardarPilhaV086(
  chave,
  quantidade = 1
) {

  garantirArmazenamentoV086();

  quantidade =
    Math.max(
      1,
      Number(quantidade || 1)
    );


  const disponivel =
    quantidadeDisponivelV086(
      chave
    );


  if (disponivel <= 0) {

    return false;

  }


  const mover =
    Math.min(
      quantidade,
      disponivel
    );


  estado
    .armazenamentoV086
    .armarioPilhas[chave] =
      quantidadeArmarioV086(chave)
      +
      mover;


  salvar();

  return true;

}


function retirarPilhaV086(
  chave,
  quantidade = 1
) {

  garantirArmazenamentoV086();

  quantidade =
    Math.max(
      1,
      Number(quantidade || 1)
    );


  const guardado =
    quantidadeArmarioV086(
      chave
    );


  if (guardado <= 0) {

    return false;

  }


  estado
    .armazenamentoV086
    .armarioPilhas[chave] =
      Math.max(
        0,
        guardado
        -
        Math.min(
          quantidade,
          guardado
        )
      );


  salvar();

  return true;

}


/*
==========================================================
OBJETOS INDIVIDUAIS
==========================================================
*/


function guardarObjetoV086(
  id
) {

  garantirArmazenamentoV086();


  const item =
    estado
      .inventarioEstruturado
      ?.itens
      ?.find(
        x =>
          x.id === id
      );


  if (!item) {

    return false;

  }


  item.localizacao =
    "ARMARIO";


  salvar();

  return true;

}


function retirarObjetoV086(
  id
) {

  garantirArmazenamentoV086();


  const item =
    estado
      .inventarioEstruturado
      ?.itens
      ?.find(
        x =>
          x.id === id
      );


  if (!item) {

    return false;

  }


  item.localizacao =
    "INVENTARIO";


  salvar();

  return true;

}


/*
==========================================================
PROTEÇÃO DOS OBJETOS INDIVIDUAIS
==========================================================

As buscas antigas não podem pegar algo guardado.
==========================================================
*/


if (
  typeof primeiroItemV071
  === "function"
) {

  primeiroItemV071 =
    function(
      tipo
    ) {

      garantirColheitaV071();
      garantirArmazenamentoV086();


      return (
        estado
          .inventarioEstruturado
          .itens
          .find(
            item =>
              item.tipo === tipo
              &&
              (
                item.localizacao
                ||
                "INVENTARIO"
              )
              ===
              "INVENTARIO"
          )
        ||
        null
      );

    };

}


/*
==========================================================
SEMENTES DISPONÍVEIS
==========================================================
*/


if (
  typeof sementesDisponiveisV080
  === "function"
) {

  const sementesAnteriorV086 =
    sementesDisponiveisV080;


  sementesDisponiveisV080 =
    function() {

      garantirArmazenamentoV086();


      const resultado =
        sementesAnteriorV086();


      return resultado
        .filter(
          semente => {

            /*
            Pilhas ancestrais
            */

            if (
              semente.origem
              === "PILHA"
            ) {

              const disponivel =
                quantidadeDisponivelV086(
                  semente.chave
                );


              semente.quantidade =
                disponivel;


              return (
                disponivel > 0
              );

            }


            /*
            Semente-DNA individual
            */

            const item =
              estado
                .inventarioEstruturado
                ?.itens
                ?.find(
                  x =>
                    x.id
                    ===
                    semente.id
                );


            return (
              !item
              ||
              (
                item.localizacao
                ||
                "INVENTARIO"
              )
              ===
              "INVENTARIO"
            );

          }
        );

    };

}


/*
==========================================================
SOLOS DISPONÍVEIS
==========================================================
*/


if (
  typeof solosDisponiveisV080
  === "function"
) {

  solosDisponiveisV080 =
    function() {

      garantirArmazenamentoV086();


      const resultado = [];


      for (
        const [
          chave,
          dados
        ]
        of Object.entries(
          QUARTO_V080.solos
        )
      ) {

        const quantidade =
          quantidadeDisponivelV086(
            chave
          );


        if (
          quantidade > 0
        ) {

          resultado.push({

            chave,

            nome:
              dados.nome,

            quantidade

          });

        }

      }


      return resultado;

    };

}


/*
==========================================================
CONSUMO DE SEMENTE PROTEGIDO
==========================================================
*/


if (
  typeof consumirSementeV080
  === "function"
) {

  const consumirSementeAnteriorV086 =
    consumirSementeV080;


  consumirSementeV080 =
    function(
      semente
    ) {

      garantirArmazenamentoV086();


      if (
        semente.origem
        === "PILHA"
      ) {

        if (
          quantidadeDisponivelV086(
            semente.chave
          )
          <= 0
        ) {

          return false;

        }

      }

      else {

        const item =
          estado
            .inventarioEstruturado
            ?.itens
            ?.find(
              x =>
                x.id
                ===
                semente.id
            );


        if (
          item
          &&
          (
            item.localizacao
            ||
            "INVENTARIO"
          )
          ===
          "ARMARIO"
        ) {

          return false;

        }

      }


      return consumirSementeAnteriorV086(
        semente
      );

    };

}


/*
==========================================================
CONSUMO DE SOLO PROTEGIDO
==========================================================
*/


if (
  typeof consumirSoloV080
  === "function"
) {

  const consumirSoloAnteriorV086 =
    consumirSoloV080;


  consumirSoloV080 =
    function(
      chave
    ) {

      garantirArmazenamentoV086();


      if (
        quantidadeDisponivelV086(
          chave
        )
        <= 0
      ) {

        return false;

      }


      return consumirSoloAnteriorV086(
        chave
      );

    };

}


/*
==========================================================
CATÁLOGO VISUAL
==========================================================
*/


function nomeItemV086(
  chave
) {

  return (
    CATALOGO_INVENTARIO_V070?.[
      chave
    ]?.nome
    ||
    chave
  );

}


function iconeItemV086(
  chave
) {

  return (
    CATALOGO_INVENTARIO_V070?.[
      chave
    ]?.icone
    ||
    "📦"
  );

}


/*
==========================================================
INTERFACE
==========================================================
*/


function htmlPilhaV086(
  chave,
  local
) {

  const quantidade =
    local === "ARMARIO"
    ?
    quantidadeArmarioV086(chave)
    :
    quantidadeDisponivelV086(chave);


  if (
    quantidade <= 0
  ) {

    return "";

  }


  const acao =
    local === "ARMARIO"
    ?
    "retirar"
    :
    "guardar";


  const texto =
    local === "ARMARIO"
    ?
    "← Retirar"
    :
    "Guardar →";


  return `
    <div class="item-storage-v086">

      <div class="icone-storage-v086">
        ${iconeItemV086(chave)}
      </div>

      <div class="dados-storage-v086">

        <strong>
          ${nomeItemV086(chave)}
        </strong>

        <small>
          ×${quantidade}
        </small>

      </div>

      <button
        type="button"
        data-storage-acao="${acao}"
        data-storage-chave="${chave}"
      >
        ${texto}
      </button>

    </div>
  `;

}


function htmlObjetoV086(
  item,
  local
) {

  const acao =
    local === "ARMARIO"
    ?
    "retirarObjeto"
    :
    "guardarObjeto";


  const texto =
    local === "ARMARIO"
    ?
    "← Retirar"
    :
    "Guardar →";


  return `
    <div class="item-storage-v086">

      <div class="icone-storage-v086">
        ${item.icone || "📦"}
      </div>

      <div class="dados-storage-v086">

        <strong>
          ${item.nome || item.tipo}
        </strong>

        <small>
          ${item.id}
        </small>

      </div>

      <button
        type="button"
        data-storage-acao="${acao}"
        data-storage-id="${item.id}"
      >
        ${texto}
      </button>

    </div>
  `;

}


/*
==========================================================
LISTAS
==========================================================
*/


function pilhasConhecidasV086() {

  const chaves =
    new Set([
      ...Object.keys(
        CATALOGO_INVENTARIO_V070
        || {}
      ),
      ...Object.keys(
        estado.inventario
        || {}
      )
    ]);


  /*
  Fruto/flor/casca/pétala são objetos individualizados.
  Não mostramos a representação legada para evitar duplicação.
  */

  return Array
    .from(chaves)
    .filter(
      chave =>
        ![
          "FRUTO",
          "FLOR",
          "CASCA",
          "PETALA"
        ].includes(
          chave
        )
    );

}


function objetosLocalV086(
  local
) {

  garantirArmazenamentoV086();


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
          === local
      )
    ||
    []
  );

}


/*
==========================================================
RENDER DO PAINEL
==========================================================
*/


function renderArmazenamentoV086() {

  garantirArmazenamentoV086();


  const overlay =
    criarOverlayInternoV082();


  if (!overlay) {

    return;

  }


  const chaves =
    pilhasConhecidasV086();


  const pilhasInventario =
    chaves
      .map(
        chave =>
          htmlPilhaV086(
            chave,
            "INVENTARIO"
          )
      )
      .join("");


  const pilhasArmario =
    chaves
      .map(
        chave =>
          htmlPilhaV086(
            chave,
            "ARMARIO"
          )
      )
      .join("");


  const objetosInventario =
    objetosLocalV086(
      "INVENTARIO"
    )
    .map(
      item =>
        htmlObjetoV086(
          item,
          "INVENTARIO"
        )
    )
    .join("");


  const objetosArmario =
    objetosLocalV086(
      "ARMARIO"
    )
    .map(
      item =>
        htmlObjetoV086(
          item,
          "ARMARIO"
        )
    )
    .join("");


  overlay.innerHTML = `

    <div class="storage-v086">

      <div class="storage-topo-v086">

        <div>

          <span>
            🧪 BANCADA
          </span>

          <h2>
            Armazenamento
          </h2>

          <p>
            Organize materiais entre seu inventário
            e o armário do laboratório.
          </p>

        </div>

        <button
          type="button"
          id="fecharStorageV086"
          class="fechar-contextual-v082"
        >
          ✕
        </button>

      </div>


      <div class="storage-colunas-v086">


        <section class="storage-coluna-v086">

          <header>

            <span class="storage-icone-grande-v086">
              🎒
            </span>

            <div>
              <strong>
                Inventário
              </strong>

              <small>
                Disponível para uso
              </small>
            </div>

          </header>


          <div class="storage-lista-v086">

            ${
              pilhasInventario
              ||
              objetosInventario
              ?
              pilhasInventario
              +
              objetosInventario
              :
              `
              <div class="storage-vazio-v086">
                Inventário vazio.
              </div>
              `
            }

          </div>

        </section>


        <div class="storage-setas-v086">
          ⇄
        </div>


        <section class="storage-coluna-v086">

          <header>

            <span class="storage-icone-grande-v086">
              🗄️
            </span>

            <div>
              <strong>
                Armário
              </strong>

              <small>
                Armazenamento da bancada
              </small>
            </div>

          </header>


          <div class="storage-lista-v086">

            ${
              pilhasArmario
              ||
              objetosArmario
              ?
              pilhasArmario
              +
              objetosArmario
              :
              `
              <div class="storage-vazio-v086">
                O armário está vazio.
              </div>
              `
            }

          </div>

        </section>


      </div>

    </div>

  `;


  overlay
    .querySelector(
      "#fecharStorageV086"
    )
    .onclick =
      fecharOverlayInternoV082;


  overlay
    .querySelectorAll(
      "[data-storage-acao]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            const acao =
              botao.dataset
                .storageAcao;


            const chave =
              botao.dataset
                .storageChave;


            const id =
              botao.dataset
                .storageId;


            if (
              acao ===
              "guardar"
            ) {

              guardarPilhaV086(
                chave
              );

            }


            if (
              acao ===
              "retirar"
            ) {

              retirarPilhaV086(
                chave
              );

            }


            if (
              acao ===
              "guardarObjeto"
            ) {

              guardarObjetoV086(
                id
              );

            }


            if (
              acao ===
              "retirarObjeto"
            ) {

              retirarObjetoV086(
                id
              );

            }


            renderArmazenamentoV086();

          };

      }
    );

}


/*
==========================================================
ARMÁRIO DA BANCADA
==========================================================
*/


if (
  typeof abrirInventarioLaboratorioV082
  === "function"
) {

  abrirInventarioLaboratorioV082 =
    function() {

      renderArmazenamentoV086();

    };

}


/*
==========================================================
INICIALIZAÇÃO
==========================================================
*/


function iniciarArmazenamentoV086() {

  garantirArmazenamentoV086();

  salvar();

}


setTimeout(
  iniciarArmazenamentoV086,
  0
);
