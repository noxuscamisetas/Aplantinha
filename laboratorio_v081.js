/*
================================================================
A PLANTINHA — V0.8.1
NAVEGAÇÃO DO LABORATÓRIO
================================================================

Ambientes:

LABORATÓRIO
    ↓
ESTAÇÃO DE CULTIVO
    ↓
VASO SELECIONADO

LABORATÓRIO
    ↓
BANCADA
    ↓
ARMÁRIO
    ↓
INVENTÁRIO DO LABORATÓRIO

Nesta versão:

- o laboratório vira a tela principal;
- cinco módulos de cultivo aparecem no ambiente;
- vaso vazio continua abrindo a montagem V0.8;
- vaso ocupado abre sua estação;
- estação usa o cultivo real de quartoV080;
- bancada já existe fisicamente;
- armário existe fisicamente;
- botão do armário abre o inventário existente;
- bancada ainda não possui instrumentos.

Não altera as leis biológicas.
*/


/* ============================================================
   ESTADO DE NAVEGAÇÃO
   ============================================================ */

let ambienteAtualV081 = "LABORATORIO";

let vasoSelecionadoV081 = null;


/* ============================================================
   CRIAÇÃO DA RAIZ
   ============================================================ */

function garantirLaboratorioV081() {

  let raiz =
    document.querySelector(
      "#universoLaboratorioV081"
    );


  if (raiz) {

    return raiz;

  }


  raiz =
    document.createElement(
      "div"
    );


  raiz.id =
    "universoLaboratorioV081";


  raiz.className =
    "universo-laboratorio-v081";


  const painelAntigo =
    document.querySelector(
      ".painel-jogo"
    );


  if (
    painelAntigo
    &&
    painelAntigo.parentNode
  ) {

    painelAntigo.parentNode.insertBefore(
      raiz,
      painelAntigo
    );

  }

  else {

    document
      .querySelector(".app")
      ?.appendChild(
        raiz
      );

  }


  return raiz;

}


/* ============================================================
   ESCONDER INTERFACES ANTIGAS DA ÁREA PRINCIPAL
   ============================================================ */

function aplicarModoMundoV081() {

  const painelAntigo =
    document.querySelector(
      ".painel-jogo"
    );


  if (painelAntigo) {

    painelAntigo.classList.add(
      "painel-legado-v081"
    );

  }


  const quartoAntigo =
    document.querySelector(
      "#quartoV080"
    );


  if (quartoAntigo) {

    quartoAntigo.classList.add(
      "quarto-legado-v081"
    );

  }

}


/* ============================================================
   TEMPO
   ============================================================ */

function dadosTempoV081() {

  if (
    typeof tempoGlobalV080
    === "function"
  ) {

    return tempoGlobalV080();

  }


  return {

    dia:
      estado.tempo?.dia
      ?? 1,

    hora:
      estado.tempo?.hora
      ?? 0,

    luz:
      "LUA"

  };

}


function classePeriodoV081() {

  const tempo =
    dadosTempoV081();


  if (
    tempo.hora === 6
  ) {

    return "manha";

  }


  if (
    tempo.hora === 12
  ) {

    return "tarde";

  }


  if (
    tempo.hora === 18
  ) {

    return "noite";

  }


  return "madrugada";

}


/* ============================================================
   NAVEGAÇÃO
   ============================================================ */

function irLaboratorioV081() {

  pararRegaV080?.();


  ambienteAtualV081 =
    "LABORATORIO";


  vasoSelecionadoV081 =
    null;


  renderLaboratorioV081();

}


function irBancadaV081() {

  pararRegaV080?.();


  ambienteAtualV081 =
    "BANCADA";


  vasoSelecionadoV081 =
    null;


  renderLaboratorioV081();

}


function irEstacaoV081(
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


  /*
  Vaso livre ainda usa a montagem
  já criada na V0.8.
  */

  if (
    vaso.desbloqueado
    &&
    !vaso.cultivo
  ) {

    abrirMontagemV080?.(
      vasoId
    );

    return;

  }


  if (
    !vaso.desbloqueado
    ||
    !vaso.cultivo
  ) {

    return;

  }


  ambienteAtualV081 =
    "ESTACAO";


  vasoSelecionadoV081 =
    vasoId;


  renderLaboratorioV081();

}


/* ============================================================
   NOME DA SEMENTE
   ============================================================ */

function nomeSementeV081(
  cultivo
) {

  if (!cultivo) {

    return "—";

  }


  return (
    NOMES_SEMENTES_V080?.[
      cultivo.base
    ]
    ||
    cultivo.nomeSemente
    ||
    cultivo.base
    ||
    "Planta"
  );

}


/* ============================================================
   RESUMO DE VASO — LABORATÓRIO
   ============================================================ */

function htmlModuloVasoV081(
  vaso
) {

  if (
    !vaso.desbloqueado
  ) {

    return `

      <div class="
        modulo-cultivo-v081
        modulo-bloqueado-v081
      ">

        <div class="numero-modulo-v081">
          MÓDULO ${vaso.id}
        </div>

        <div class="icone-modulo-v081">
          🔒
        </div>

        <strong>
          Indisponível
        </strong>

        <span>
          Módulo fechado
        </span>

      </div>

    `;

  }


  if (
    !vaso.cultivo
  ) {

    return `

      <button
        type="button"
        class="
          modulo-cultivo-v081
          modulo-livre-v081
        "
        data-modulo-v081="${vaso.id}"
      >

        <div class="numero-modulo-v081">
          MÓDULO ${vaso.id}
        </div>

        <div class="icone-modulo-v081">
          🪴
        </div>

        <strong>
          Vaso livre
        </strong>

        <span>
          Toque para plantar
        </span>

      </button>

    `;

  }


  const c =
    vaso.cultivo;


  return `

    <button
      type="button"
      class="
        modulo-cultivo-v081
        modulo-ativo-v081
      "
      data-modulo-v081="${vaso.id}"
      data-base-semente="${c.base}"
    >

      <div class="numero-modulo-v081">

        MÓDULO ${vaso.id}

        <span class="luz-status-v081">
          ●
        </span>

      </div>


      <div class="icone-planta-modulo-v081">

        ${
          c.estagio === "MADURA"
          ? "🌿"
          :
          c.estagio === "JOVEM"
          ? "🌱"
          :
          "🌱"
        }

      </div>


      <strong>
        ${nomeSementeV081(c)}
      </strong>


      <span>
        ${c.estagio}
        •
        ×${c.velocidade}
      </span>


      <div class="mini-agua-v081">

        <div
          style="
            width:
            ${Math.max(
              0,
              Math.min(
                100,
                c.umidade
              )
            )}%;
          "
        ></div>

      </div>

    </button>

  `;

}


/* ============================================================
   LABORATÓRIO
   ============================================================ */

function htmlLaboratorioV081() {

  garantirQuartoV080?.();


  const tempo =
    dadosTempoV081();


  const vasos =
    estado.quartoV080?.vasos
    || [];


  return `

    <section
      class="
        ambiente-mundo-v081
        laboratorio-v081
        periodo-${classePeriodoV081()}
      "
    >

      <div class="parede-lab-v081"></div>


      <div class="janela-lab-v081">

        <div class="ceu-lab-v081">

          ${
            tempo.luz === "SOL"
            ? "☀️"
            : "🌙"
          }

        </div>

        <div class="janela-grade-v081"></div>

      </div>


      <div class="luz-teto-v081">
        ▬
      </div>


      <div class="placa-lab-v081">

        <span>
          UNIDADE DE CULTIVO
        </span>

        <strong>
          Laboratório
        </strong>

      </div>


      <div class="relogio-mundo-v081">

        <strong>
          Dia ${tempo.dia}
        </strong>

        <span>
          ${String(
            tempo.hora
          ).padStart(
            2,
            "0"
          )}:00
        </span>

      </div>


      <div class="modulos-laboratorio-v081">

        ${vasos
          .map(
            htmlModuloVasoV081
          )
          .join("")}

      </div>


      <button
        type="button"
        class="porta-bancada-v081"
        id="irBancadaV081"
      >

        <span>
          🧪
        </span>

        <strong>
          Bancada
        </strong>

        <small>
          Área de estudo
        </small>

      </button>


      <div class="piso-lab-v081"></div>


      <div class="dica-mundo-v081">

        Toque em um módulo para se aproximar.

      </div>

    </section>

  `;

}


/* ============================================================
   ESTAÇÃO DE CULTIVO
   ============================================================ */

function htmlEstacaoV081() {

  const vaso =
    estado
      .quartoV080
      ?.vasos
      ?.find(
        item =>
          item.id
          === vasoSelecionadoV081
      );


  if (
    !vaso?.cultivo
  ) {

    ambienteAtualV081 =
      "LABORATORIO";


    return htmlLaboratorioV081();

  }


  const c =
    vaso.cultivo;


  const solo =
    QUARTO_V080
      ?.solos
      ?.[c.solo]
      ?.nome
    ||
    c.solo;


  return `

    <section
      class="
        ambiente-mundo-v081
        estacao-v081
        periodo-${classePeriodoV081()}
      "
    >

      <button
        type="button"
        class="voltar-ambiente-v081"
        id="voltarLaboratorioV081"
      >
        ← Laboratório
      </button>


      <div class="placa-estacao-v081">

        <span>
          ESTAÇÃO DE CULTIVO
        </span>

        <strong>
          Vaso ${vaso.id}
        </strong>

      </div>


      <div class="painel-estacao-lateral-v081">

        <div>
          <span>🌱 Planta</span>
          <strong>
            ${nomeSementeV081(c)}
          </strong>
        </div>

        <div>
          <span>🪴 Solo</span>
          <strong>
            ${solo}
          </strong>
        </div>

        <div>
          <span>❤️ Saúde</span>
          <strong>
            ${Math.round(
              c.saude
            )}%
          </strong>
        </div>

      </div>


      <div class="nicho-cultivo-v081">

        <div class="luz-nicho-v081"></div>


        <div class="status-flutuante-v081">
          ${c.estagio}
        </div>


        <div class="
          planta-estacao-v081
          estagio-${c.estagio.toLowerCase()}
        ">

          ${
            c.estagio === "MADURA"
            ? "🌿"
            :
            "🌱"
          }

        </div>


        <div class="vaso-estacao-v081">

          <div class="terra-estacao-v081">
          </div>

        </div>

      </div>


      <div class="console-cultivo-v081">

        <div class="linha-agua-estacao-v081">

          <span>
            💧 Água
          </span>

          <strong
            data-estacao-agua-texto-v081
          >
            ${Math.round(
              c.umidade
            )}%
          </strong>

        </div>


        <div class="barra-estacao-v081">

          <div
            data-estacao-agua-v081
            style="
              width:
              ${Math.max(
                0,
                Math.min(
                  100,
                  c.umidade
                )
              )}%;
            "
          ></div>

        </div>


        <div class="velocidade-estacao-v081">

          <span>
            Velocidade do cultivo
          </span>


          <div>

            ${[1,2,3]
              .map(
                vel => `

                  <button
                    type="button"
                    data-estacao-vel-v081="${vel}"
                    class="
                      ${
                        c.velocidade === vel
                        ?
                        "ativa"
                        :
                        ""
                      }
                    "
                  >
                    ×${vel}
                  </button>

                `
              )
              .join("")}

          </div>

        </div>


        <button
          type="button"
          class="botao-regar-estacao-v081"
          id="regarEstacaoV081"
        >

          💧

          <span>
            Segure para regar
          </span>

        </button>


        <div class="indicadores-estacao-v081">

          <span>
            ⚡ ${Math.round(
              c.energia
            )}
          </span>

          <span>
            🌱 ${Math.round(
              c.desenvolvimento
            )}
          </span>

        </div>

      </div>


      <div class="piso-lab-v081"></div>

    </section>

  `;

}


/* ============================================================
   BANCADA
   ============================================================ */

function htmlBancadaV081() {

  return `

    <section
      class="
        ambiente-mundo-v081
        bancada-v081
        periodo-${classePeriodoV081()}
      "
    >

      <button
        type="button"
        class="voltar-ambiente-v081"
        id="voltarLaboratorioV081"
      >
        ← Laboratório
      </button>


      <div class="placa-estacao-v081">

        <span>
          ÁREA DE ESTUDO
        </span>

        <strong>
          Bancada
        </strong>

      </div>


      <div class="armario-v081">

        <div class="topo-armario-v081">

          <span>
            🗄️
          </span>

          <strong>
            Armário
          </strong>

        </div>


        <div class="slots-armario-v081">

          ${Array
            .from(
              { length: 8 }
            )
            .map(
              () => `

                <div class="slot-armario-v081">

                  <span>
                    ＋
                  </span>

                </div>

              `
            )
            .join("")}

        </div>


        <button
          type="button"
          id="abrirArmarioV081"
          class="abrir-armario-v081"
        >
          🗄️ Abrir armário
        </button>

      </div>


      <div class="area-bancada-v081">

        <div class="luz-bancada-v081">
          ▬
        </div>


        <div class="parede-ferramentas-v081">

          <div></div>
          <div></div>
          <div></div>

        </div>


        <div class="tampo-bancada-v081">

          <span>
            Bancada livre
          </span>

        </div>


        <div class="gavetas-bancada-v081">

          <div></div>
          <div></div>
          <div></div>

        </div>

      </div>


      <div class="legenda-bancada-v081">

        Novos instrumentos poderão ocupar este espaço.

      </div>


      <div class="piso-lab-v081"></div>

    </section>

  `;

}


/* ============================================================
   INVENTÁRIO DO ARMÁRIO
   ============================================================ */

function abrirArmarioV081() {

  /*
  Preferência pelo inventário estruturado V0.7.
  */

  if (
    typeof abrirInventarioV070
    === "function"
  ) {

    abrirInventarioV070();

    return;

  }


  /*
  Fallback: procura algum botão já existente
  que abra o inventário.
  */

  const possiveis = [

    "#btnInventario",

    "#abrirInventario",

    "[data-abrir-inventario]"

  ];


  for (
    const seletor
    of possiveis
  ) {

    const botao =
      document.querySelector(
        seletor
      );


    if (botao) {

      botao.click();

      return;

    }

  }


  /*
  Último fallback.
  Não quebra o jogo.
  */

  alert(
    "O armário já existe, mas o acesso ao inventário ainda não foi encontrado."
  );

}


/* ============================================================
   SINCRONIZAR BARRA DE ÁGUA DA ESTAÇÃO
   ============================================================ */

function atualizarAguaEstacaoV081() {

  if (
    ambienteAtualV081
    !==
    "ESTACAO"
  ) {

    return;

  }


  const vaso =
    estado
      .quartoV080
      ?.vasos
      ?.find(
        item =>
          item.id ===
          vasoSelecionadoV081
      );


  const c =
    vaso?.cultivo;


  if (!c) {

    return;

  }


  const barra =
    document.querySelector(
      "[data-estacao-agua-v081]"
    );


  const texto =
    document.querySelector(
      "[data-estacao-agua-texto-v081]"
    );


  if (barra) {

    barra.style.width =
      `${Math.max(
        0,
        Math.min(
          100,
          c.umidade
        )
      )}%`;

  }


  if (texto) {

    texto.textContent =
      `${Math.round(
        c.umidade
      )}%`;

  }

}


/* ============================================================
   EVENTOS
   ============================================================ */

function instalarEventosV081() {

  const raiz =
    document.querySelector(
      "#universoLaboratorioV081"
    );


  if (!raiz) {

    return;

  }


  raiz
    .querySelectorAll(
      "[data-modulo-v081]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            irEstacaoV081(
              Number(
                botao.dataset
                  .moduloV081
              )
            );

          };

      }
    );


  raiz
    .querySelector(
      "#irBancadaV081"
    )
    ?.addEventListener(
      "click",
      irBancadaV081
    );


  raiz
    .querySelector(
      "#voltarLaboratorioV081"
    )
    ?.addEventListener(
      "click",
      irLaboratorioV081
    );


  raiz
    .querySelector(
      "#abrirArmarioV081"
    )
    ?.addEventListener(
      "click",
      abrirArmarioV081
    );


  /*
  ------------------------------------------------------------
  VELOCIDADE NA ESTAÇÃO
  ------------------------------------------------------------
  */

  raiz
    .querySelectorAll(
      "[data-estacao-vel-v081]"
    )
    .forEach(
      botao => {

        botao.onclick =
          () => {

            mudarVelocidadeV080(
              vasoSelecionadoV081,
              Number(
                botao.dataset
                  .estacaoVelV081
              )
            );


            renderLaboratorioV081();

          };

      }
    );


  /*
  ------------------------------------------------------------
  REGA POR PRESSIONAR
  ------------------------------------------------------------
  */

  const regar =
    raiz.querySelector(
      "#regarEstacaoV081"
    );


  if (regar) {

    const iniciar =
      evento => {

        evento.preventDefault();


        iniciarRegaV080(
          vasoSelecionadoV081
        );


        const atualizador =
          setInterval(
            atualizarAguaEstacaoV081,
            80
          );


        const finalizar =
          () => {

            clearInterval(
              atualizador
            );

            pararRegaV080();

            atualizarAguaEstacaoV081();

            window.removeEventListener(
              "pointerup",
              finalizar
            );

            window.removeEventListener(
              "pointercancel",
              finalizar
            );

          };


        window.addEventListener(
          "pointerup",
          finalizar
        );


        window.addEventListener(
          "pointercancel",
          finalizar
        );

      };


    regar.addEventListener(
      "pointerdown",
      iniciar
    );

  }

}


/* ============================================================
   RENDER PRINCIPAL
   ============================================================ */

function renderLaboratorioV081() {

  garantirQuartoV080?.();

  aplicarModoMundoV081();


  const raiz =
    garantirLaboratorioV081();


  if (
    ambienteAtualV081
    === "ESTACAO"
  ) {

    raiz.innerHTML =
      htmlEstacaoV081();

  }

  else if (
    ambienteAtualV081
    === "BANCADA"
  ) {

    raiz.innerHTML =
      htmlBancadaV081();

  }

  else {

    raiz.innerHTML =
      htmlLaboratorioV081();

  }


  instalarEventosV081();

}


/* ============================================================
   HOOK NO RENDER
   ============================================================ */

const renderAnteriorV081 =
  render;


render =
  function() {

    renderAnteriorV081();

    renderLaboratorioV081();

  };


/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

garantirLaboratorioV081();

aplicarModoMundoV081();

renderLaboratorioV081();

