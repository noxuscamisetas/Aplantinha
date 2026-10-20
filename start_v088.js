/*
==========================================================
A PLANTINHA — V0.8.8 START CANDIDATE
==========================================================

JARDIM
- 3 slots.
- recebe o objeto cultivo inteiro.
- não cria cópia da planta.
- cultivo no Jardim não participa do ciclo V0833.
- pode retornar para qualquer vaso livre.

BANCADA
- permanece acessível.
- Armário continua acessível.
- experimentação bloqueada nesta fase.

RESET
- confirmação obrigatória.
- apaga o SAVE_KEY.
- recarrega a aplicação inteira.

IMPORTANTE:
O Jardim congelado é condição TEMPORÁRIA desta versão.
No futuro ele receberá ambiente externo/clima.
==========================================================
*/


/* ======================================================
   ESTADO DO JARDIM
   ====================================================== */

function garantirJardimV088() {

  estado.jardimV088 ??= {

    versao: 1,

    slots: [

      {
        id: 1,
        cultivo: null,
        congeladoEm: null,
        origemVaso: null
      },

      {
        id: 2,
        cultivo: null,
        congeladoEm: null,
        origemVaso: null
      },

      {
        id: 3,
        cultivo: null,
        congeladoEm: null,
        origemVaso: null
      }

    ]

  };


  if (
    !Array.isArray(
      estado.jardimV088.slots
    )
  ) {

    estado.jardimV088.slots = [];

  }


  while (
    estado.jardimV088.slots.length < 3
  ) {

    estado.jardimV088.slots.push({

      id:
        estado.jardimV088.slots.length
        +
        1,

      cultivo:
        null,

      congeladoEm:
        null,

      origemVaso:
        null

    });

  }

}


/* ======================================================
   NOMES / DADOS
   ====================================================== */

function nomeCultivoJardimV088(
  cultivo
) {

  if (!cultivo) {

    return "Cultivo";

  }


  if (
    typeof nomeSementeV081
    === "function"
  ) {

    return nomeSementeV081(
      cultivo
    );

  }


  return (
    cultivo.nomeSemente
    ||
    cultivo.base
    ||
    "Planta"
  );

}


function iconeCultivoJardimV088(
  cultivo
) {

  const estagio =
    cultivo?.estagio
    ||
    "SEMENTE";


  if (
    estagio === "MADURA"
  ) {

    return "🌳";

  }


  if (
    estagio === "JOVEM"
  ) {

    return "🌿";

  }


  if (
    estagio === "BROTO"
  ) {

    return "🌱";

  }


  if (
    estagio === "GERMINACAO"
  ) {

    return "🌱";

  }


  return "🫘";

}


/* ======================================================
   VASOS LIVRES
   ====================================================== */

function vasosLivresV088() {

  garantirQuartoV080?.();


  return (
    estado
      ?.quartoV080
      ?.vasos
      ?.filter(
        vaso =>
          vaso.desbloqueado
          &&
          !vaso.cultivo
      )
    ||
    []
  );

}


/* ======================================================
   TRANSFERIR VASO -> JARDIM
   ====================================================== */

function moverVasoParaJardimV088(
  vasoId,
  slotId
) {

  garantirJardimV088();

  garantirQuartoV080?.();


  const vaso =
    estado
      .quartoV080
      .vasos
      .find(
        item =>
          item.id === vasoId
      );


  const slot =
    estado
      .jardimV088
      .slots
      .find(
        item =>
          item.id === slotId
      );


  if (
    !vaso?.cultivo
    ||
    !slot
    ||
    slot.cultivo
  ) {

    return false;

  }


  /*
  Antes de sair do ambiente ativo,
  garantimos cultivo/plantaV083 sincronizados.
  */

  if (
    typeof sincronizarCultivoParaPlantaV083
    === "function"
  ) {

    sincronizarCultivoParaPlantaV083(
      vaso
    );

  }


  pararRegaV080?.();


  /*
  MOVE O OBJETO.

  Não usamos structuredClone.
  Não recriamos planta.
  */

  slot.cultivo =
    vaso.cultivo;


  slot.origemVaso =
    vaso.id;


  slot.congeladoEm =
    Date.now();


  vaso.cultivo =
    null;


  /*
  Saímos da estação.
  */

  if (
    typeof ambienteAtualV081
    !== "undefined"
  ) {

    ambienteAtualV081 =
      "LABORATORIO";

  }


  if (
    typeof vasoSelecionadoV081
    !== "undefined"
  ) {

    vasoSelecionadoV081 =
      null;

  }


  if (
    typeof log ===
    "function"
  ) {

    log(
      `Cultivo transferido do Vaso ${vasoId} para o Jardim ${slotId}.`
    );

  }


  salvar();

  render();


  return true;

}


/* ======================================================
   TRANSFERIR JARDIM -> VASO
   ====================================================== */

function moverJardimParaVasoV088(
  slotId,
  vasoId
) {

  garantirJardimV088();

  garantirQuartoV080?.();


  const slot =
    estado
      .jardimV088
      .slots
      .find(
        item =>
          item.id === slotId
      );


  const vaso =
    estado
      .quartoV080
      .vasos
      .find(
        item =>
          item.id === vasoId
      );


  if (
    !slot?.cultivo
    ||
    !vaso
    ||
    !vaso.desbloqueado
    ||
    vaso.cultivo
  ) {

    return false;

  }


  /*
  O mesmo cultivo retorna ao ambiente ativo.
  */

  vaso.cultivo =
    slot.cultivo;


  slot.cultivo =
    null;


  slot.congeladoEm =
    null;


  slot.origemVaso =
    null;


  /*
  Agora que voltou ao quarto, sincronizamos
  novamente a representação completa.
  */

  if (
    typeof sincronizarCultivoParaPlantaV083
    === "function"
  ) {

    sincronizarCultivoParaPlantaV083(
      vaso
    );

  }


  if (
    typeof log ===
    "function"
  ) {

    log(
      `Cultivo do Jardim ${slotId} transferido para o Vaso ${vasoId}.`
    );

  }


  salvar();

  render();


  return true;

}


/* ======================================================
   MODAL — ESCOLHER SLOT DO JARDIM
   ====================================================== */

function abrirEscolhaJardimV088(
  vasoId
) {

  garantirJardimV088();


  const vaso =
    estado
      ?.quartoV080
      ?.vasos
      ?.find(
        item =>
          item.id === vasoId
      );


  if (!vaso?.cultivo) {

    return;

  }


  const livres =
    estado
      .jardimV088
      .slots
      .filter(
        slot =>
          !slot.cultivo
      );


  document
    .querySelector(
      "#modalJardimV088"
    )
    ?.remove();


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "modalJardimV088";


  modal.className =
    "modal-jardim-v088";


  modal.innerHTML = `

    <div class="caixa-modal-jardim-v088">

      <header>

        <div>

          <span>
            🌿 JARDIM
          </span>

          <h3>
            Levar planta ao Jardim
          </h3>

          <p>
            Escolha um espaço disponível.
          </p>

        </div>


        <button
          type="button"
          id="fecharModalJardimV088"
        >
          ✕
        </button>

      </header>


      <div class="aviso-congelamento-v088">

        <span>
          🧊
        </span>

        <p>
          Nesta versão, plantas no Jardim ficam
          <strong>em espera</strong>.
          Elas preservam exatamente seu estado,
          mas não recebem ciclos ambientais.
        </p>

      </div>


      ${
        livres.length
        ?
        `

          <div class="slots-escolha-jardim-v088">

            ${estado.jardimV088.slots
              .map(
                slot => {

                  if (
                    slot.cultivo
                  ) {

                    return `

                      <div class="
                        slot-escolha-jardim-v088
                        ocupado
                      ">

                        <span>
                          🌿
                        </span>

                        <strong>
                          Jardim ${slot.id}
                        </strong>

                        <small>
                          Ocupado
                        </small>

                      </div>

                    `;

                  }


                  return `

                    <button
                      type="button"
                      class="slot-escolha-jardim-v088"
                      data-destino-jardim-v088="${slot.id}"
                    >

                      <span>
                        ＋
                      </span>

                      <strong>
                        Jardim ${slot.id}
                      </strong>

                      <small>
                        Livre
                      </small>

                    </button>

                  `;

                }
              )
              .join("")}

          </div>

        `
        :
        `

          <div class="jardim-cheio-v088">

            <span>
              🌿
            </span>

            <strong>
              Jardim cheio
            </strong>

            <p>
              Retire uma planta antes de transferir outra.
            </p>

          </div>

        `
      }

    </div>

  `;


  document.body.appendChild(
    modal
  );


  modal
    .querySelector(
      "#fecharModalJardimV088"
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
      "[data-destino-jardim-v088]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            const slotId =
              Number(
                botao.dataset
                  .destinoJardimV088
              );


            const ok =
              moverVasoParaJardimV088(
                vasoId,
                slotId
              );


            if (ok) {

              modal.remove();

            }

          };

      }
    );

}


/* ======================================================
   MODAL — PLANTA DO JARDIM
   ====================================================== */

function abrirPlantaJardimV088(
  slotId
) {

  garantirJardimV088();


  const slot =
    estado
      .jardimV088
      .slots
      .find(
        item =>
          item.id === slotId
      );


  if (!slot?.cultivo) {

    return;

  }


  const c =
    slot.cultivo;


  document
    .querySelector(
      "#modalPlantaJardimV088"
    )
    ?.remove();


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "modalPlantaJardimV088";


  modal.className =
    "modal-jardim-v088";


  modal.innerHTML = `

    <div class="caixa-modal-jardim-v088">

      <header>

        <div>

          <span>
            🌿 JARDIM ${slot.id}
          </span>

          <h3>
            ${iconeCultivoJardimV088(c)}
            ${nomeCultivoJardimV088(c)}
          </h3>

          <p>
            Geração ${c.geracao || 0}
            •
            ${c.estagio || "SEMENTE"}
          </p>

        </div>


        <button
          type="button"
          id="fecharPlantaJardimV088"
        >
          ✕
        </button>

      </header>


      <div class="estado-jardim-v088">

        <div>
          <span>
            ❤️ Saúde
          </span>

          <strong>
            ${Math.round(c.saude ?? 100)}%
          </strong>
        </div>


        <div>
          <span>
            💧 Umidade
          </span>

          <strong>
            ${Math.round(c.umidade ?? 0)}%
          </strong>
        </div>


        <div>
          <span>
            ⚡ Energia
          </span>

          <strong>
            ${Math.round(c.energia ?? 0)}
          </strong>
        </div>


        <div>
          <span>
            🌱 Desenvolvimento
          </span>

          <strong>
            ${Math.round(c.desenvolvimento ?? 0)}
          </strong>
        </div>

      </div>


      <div class="aviso-congelamento-v088">

        <span>
          🧊
        </span>

        <p>
          Cultivo em espera.
          O estado da planta permanece congelado
          enquanto estiver no Jardim nesta versão.
        </p>

      </div>


      <button
        type="button"
        id="trazerLaboratorioV088"
        class="trazer-laboratorio-v088"
      >
        🪴 Trazer para o laboratório
      </button>

    </div>

  `;


  document.body.appendChild(
    modal
  );


  modal
    .querySelector(
      "#fecharPlantaJardimV088"
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
    .querySelector(
      "#trazerLaboratorioV088"
    )
    .onclick =
      () => {

        modal.remove();

        abrirEscolhaVasoRetornoV088(
          slotId
        );

      };

}


/* ======================================================
   MODAL — ESCOLHER VASO PARA RETORNO
   ====================================================== */

function abrirEscolhaVasoRetornoV088(
  slotId
) {

  const livres =
    vasosLivresV088();


  document
    .querySelector(
      "#modalRetornoJardimV088"
    )
    ?.remove();


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "modalRetornoJardimV088";


  modal.className =
    "modal-jardim-v088";


  modal.innerHTML = `

    <div class="caixa-modal-jardim-v088">

      <header>

        <div>

          <span>
            🪴 LABORATÓRIO
          </span>

          <h3>
            Escolha um vaso
          </h3>

          <p>
            O cultivo voltará a viver assim que
            retornar ao laboratório.
          </p>

        </div>


        <button
          type="button"
          id="fecharRetornoJardimV088"
        >
          ✕
        </button>

      </header>


      ${
        livres.length
        ?
        `

          <div class="vasos-retorno-v088">

            ${livres
              .map(
                vaso => `

                  <button
                    type="button"
                    data-vaso-retorno-v088="${vaso.id}"
                  >

                    <span>
                      🪴
                    </span>

                    <strong>
                      Vaso ${vaso.id}
                    </strong>

                    <small>
                      Livre
                    </small>

                  </button>

                `
              )
              .join("")}

          </div>

        `
        :
        `

          <div class="jardim-cheio-v088">

            <span>
              🪴
            </span>

            <strong>
              Nenhum vaso livre
            </strong>

            <p>
              Libere um vaso no laboratório antes de trazer a planta.
            </p>

          </div>

        `
      }

    </div>

  `;


  document.body.appendChild(
    modal
  );


  modal
    .querySelector(
      "#fecharRetornoJardimV088"
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
      "[data-vaso-retorno-v088]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            const vasoId =
              Number(
                botao.dataset
                  .vasoRetornoV088
              );


            const ok =
              moverJardimParaVasoV088(
                slotId,
                vasoId
              );


            if (ok) {

              modal.remove();

            }

          };

      }
    );

}


/* ======================================================
   HTML DO JARDIM
   ====================================================== */

function htmlSlotJardimV088(
  slot
) {

  if (
    !slot.cultivo
  ) {

    return `

      <div class="
        slot-jardim-v088
        slot-jardim-vazio-v088
      ">

        <span class="icone-jardim-v088">
          ＋
        </span>

        <strong>
          Espaço ${slot.id}
        </strong>

        <small>
          Vazio
        </small>

      </div>

    `;

  }


  const c =
    slot.cultivo;


  return `

    <button
      type="button"
      class="
        slot-jardim-v088
        slot-jardim-ocupado-v088
      "
      data-planta-jardim-v088="${slot.id}"
    >

      <span class="status-congelado-jardim-v088">
        🧊
      </span>


      <span class="icone-jardim-v088">
        ${iconeCultivoJardimV088(c)}
      </span>


      <strong>
        ${nomeCultivoJardimV088(c)}
      </strong>


      <small>
        G${c.geracao || 0}
        •
        ${c.estagio || "SEMENTE"}
      </small>


      <span class="texto-espera-jardim-v088">
        Em espera
      </span>

    </button>

  `;

}


/* ======================================================
   RENDER DO JARDIM NO LABORATÓRIO
   ====================================================== */

function renderJardimV088() {

  garantirJardimV088();


  if (
    typeof ambienteAtualV081
    !== "undefined"
    &&
    ambienteAtualV081 !== "LABORATORIO"
  ) {

    return;

  }


  const raiz =
    document.querySelector(
      "#universoLaboratorioV081"
    );


  if (!raiz) {

    return;

  }


  raiz
    .querySelector(
      "#jardimV088"
    )
    ?.remove();


  const jardim =
    document.createElement(
      "section"
    );


  jardim.id =
    "jardimV088";


  jardim.className =
    "jardim-v088";


  jardim.innerHTML = `

    <header class="cabecalho-jardim-v088">

      <div>

        <span>
          ÁREA EXTERNA
        </span>

        <strong>
          🌿 Jardim
        </strong>

      </div>


      <div class="status-jardim-v088">

        🧊 ambiente em espera

      </div>

    </header>


    <p class="descricao-jardim-v088">

      Transfira plantas para liberar vasos.
      Nesta fase, o ambiente externo ainda não processa clima.

    </p>


    <div class="slots-jardim-v088">

      ${estado
        .jardimV088
        .slots
        .map(
          htmlSlotJardimV088
        )
        .join("")}

    </div>

  `;


  raiz.appendChild(
    jardim
  );


  jardim
    .querySelectorAll(
      "[data-planta-jardim-v088]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            abrirPlantaJardimV088(
              Number(
                botao.dataset
                  .plantaJardimV088
              )
            );

          };

      }
    );

}


/* ======================================================
   BOTÃO NA ESTAÇÃO — LEVAR AO JARDIM
   ====================================================== */

function instalarTransferenciaEstacaoV088() {

  if (
    typeof ambienteAtualV081
    !== "undefined"
    &&
    ambienteAtualV081 !== "ESTACAO"
  ) {

    return;

  }


  const vaso =
    estado
      ?.quartoV080
      ?.vasos
      ?.find(
        item =>
          item.id === vasoSelecionadoV081
      );


  if (!vaso?.cultivo) {

    return;

  }


  if (
    document.querySelector(
      "#levarJardimV088"
    )
  ) {

    return;

  }


  const controles =
    document.querySelector(
      ".controles-estacao-v084"
    )
    ||
    document.querySelector(
      ".estacao-v081"
    );


  if (!controles) {

    return;

  }


  const botao =
    document.createElement(
      "button"
    );


  botao.type =
    "button";


  botao.id =
    "levarJardimV088";


  botao.className =
    "levar-jardim-v088";


  botao.innerHTML = `

    🌿

    <span>

      <strong>
        Levar ao Jardim
      </strong>

      <small>
        Libera este vaso e preserva o cultivo
      </small>

    </span>

  `;


  botao.onclick =
    () => {

      abrirEscolhaJardimV088(
        vaso.id
      );

    };


  controles.appendChild(
    botao
  );

}


/* ======================================================
   WRAPPER DO RENDER DO LABORATÓRIO
   ====================================================== */

if (
  typeof renderLaboratorioV081
  === "function"
) {

  const renderLaboratorioAnteriorV088 =
    renderLaboratorioV081;


  renderLaboratorioV081 =
    function(
      ...args
    ) {

      const resultado =
        renderLaboratorioAnteriorV088(
          ...args
        );


      if (
        ambienteAtualV081 ===
        "LABORATORIO"
      ) {

        renderJardimV088();

      }


      if (
        ambienteAtualV081 ===
        "ESTACAO"
      ) {

        instalarTransferenciaEstacaoV088();

      }


      return resultado;

    };

}


/* ======================================================
   BANCADA BLOQUEADA
   ====================================================== */

if (
  typeof htmlBancadaV081
  === "function"
) {

  htmlBancadaV081 =
    function() {

      return `

        <section class="
          ambiente-mundo-v081
          bancada-v081
          bancada-bloqueada-v088
        ">

          <header class="cabecalho-bancada-v088">

            <button
              type="button"
              id="voltarLaboratorioV081"
            >
              ← Laboratório
            </button>


            <div>

              <span>
                LABORATÓRIO
              </span>

              <strong>
                🧪 Bancada experimental
              </strong>

            </div>

          </header>


          <div class="corpo-bancada-bloqueada-v088">

            <div class="mesa-bancada-v088">

              <div class="slots-experimento-bloqueados-v088">

                <div>
                  🔒
                </div>

                <div>
                  🔒
                </div>

                <div>
                  🔒
                </div>

              </div>


              <strong>
                Equipamento ainda indisponível
              </strong>


              <p>
                Continue cultivando e descobrindo materiais.
                A bancada será liberada quando houver recursos
                suficientes para iniciar experimentos.
              </p>

            </div>


            <div class="armario-bancada-v088">

              <span>
                🗄️
              </span>

              <div>

                <strong>
                  Armário
                </strong>

                <small>
                  O armazenamento continua disponível.
                </small>

              </div>


              <button
                type="button"
                id="abrirArmarioV081"
              >
                Abrir armário
              </button>

            </div>

          </div>

        </section>

      `;

    };

}


/* ======================================================
   RESET SEGURO
   ====================================================== */

function reiniciarUniversoV088() {

  const confirmar =
    window.confirm(
      "Deseja mesmo resetar seu universo?\n\n" +
      "Todo o progresso será apagado: cultivos, Jardim, linhagens, " +
      "materiais, moedas, inventário e descobertas.\n\n" +
      "Esta ação não pode ser desfeita."
    );


  if (!confirmar) {

    return;

  }


  /*
  Apaga somente o universo A Plantinha.
  Depois recarrega tudo para todas as camadas
  executarem suas inicializações desde o início.
  */

  localStorage.removeItem(
    SAVE_KEY
  );


  window.location.reload();

}


/*
Substitui também a função global antiga.
*/

reiniciar =
  reiniciarUniversoV088;


/*
O onclick antigo já foi instalado pelo app.js.
Como este arquivo carrega por último,
substituímos explicitamente.
*/

const botaoResetV088 =
  document.querySelector(
    "#btnNovoJogo"
  );


if (botaoResetV088) {

  botaoResetV088.onclick =
    reiniciarUniversoV088;

}


/* ======================================================
   TESTE DE CONSERVAÇÃO
   ====================================================== */

window.testarJardimV088 =
  function() {

    garantirJardimV088();


    const vasos =
      estado
        ?.quartoV080
        ?.vasos
      ||
      [];


    const jardim =
      estado
        .jardimV088
        .slots;


    const resumo = {

      cultivosNosVasos:
        vasos.filter(
          vaso =>
            !!vaso.cultivo
        ).length,

      cultivosNoJardim:
        jardim.filter(
          slot =>
            !!slot.cultivo
        ).length,

      slotsJardim:
        jardim.length,

      jardimCongelado:
        true

    };


    console.table(
      resumo
    );


    console.table(
      jardim.map(
        slot => ({

          slot:
            slot.id,

          ocupado:
            !!slot.cultivo,

          base:
            slot.cultivo?.base
            ||
            null,

          estagio:
            slot.cultivo?.estagio
            ||
            null,

          saude:
            slot.cultivo?.saude
            ??
            null,

          umidade:
            slot.cultivo?.umidade
            ??
            null,

          desenvolvimento:
            slot.cultivo
              ?.desenvolvimento
            ??
            null

        })
      )
    );


    return resumo;

  };


/* ======================================================
   INICIALIZAÇÃO
   ====================================================== */

garantirJardimV088();

salvar();


/*
Como o wrapper foi instalado depois do último render
das versões anteriores, redesenhamos uma vez.
*/

renderLaboratorioV081?.();


console.log(
  "[A Plantinha] V0.8.8 START — Jardim e consolidação carregados."
);
