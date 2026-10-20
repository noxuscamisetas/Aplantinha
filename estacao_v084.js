/*
================================================================
A PLANTINHA — V0.8.4
ESTAÇÃO VIVA
================================================================

Objetivos:

- nenhuma sobreposição de cards;
- planta como protagonista;
- fluxo responsivo real;
- fontes legíveis;
- indicadores compactos;
- alertas integrados ao layout;
- preservar todos os contratos V081/V083/V0833.

NÃO altera biologia.
================================================================
*/


/* ============================================================
   UTILIDADES VISUAIS
   ============================================================ */

function statusSaudeV084(saude) {

  if (saude <= 20) {
    return {
      classe: "critica",
      texto: "Crítica",
      icone: "🩹"
    };
  }

  if (saude <= 45) {
    return {
      classe: "fragil",
      texto: "Frágil",
      icone: "❤️"
    };
  }

  if (saude <= 75) {
    return {
      classe: "recuperando",
      texto: "Estável",
      icone: "❤️"
    };
  }

  return {
    classe: "saudavel",
    texto: "Saudável",
    icone: "💚"
  };

}


function statusAguaV084(umidade) {

  if (umidade <= 20) {
    return {
      classe: "seca",
      texto: "Baixa"
    };
  }

  if (umidade >= 85) {
    return {
      classe: "excesso",
      texto: "Alta"
    };
  }

  return {
    classe: "boa",
    texto: "Adequada"
  };

}


function soloAmigavelV084(cultivo) {

  return (
    QUARTO_V080
      ?.solos
      ?.[cultivo.solo]
      ?.nome
    ||
    cultivo.solo
    ||
    "Solo"
  );

}


function nomePeriodoV084() {

  const tempo =
    tempoGlobalV080();

  if (tempo.hora === 0) {
    return "Madrugada";
  }

  if (tempo.hora === 6) {
    return "Manhã";
  }

  if (tempo.hora === 12) {
    return "Tarde";
  }

  return "Noite";

}


/* ============================================================
   NOVO HTML DA ESTAÇÃO
   ============================================================ */

htmlEstacaoV081 =
  function() {

    const vaso =
      estado
        .quartoV080
        ?.vasos
        ?.find(
          item =>
            item.id ===
            vasoSelecionadoV081
        );


    if (!vaso?.cultivo) {

      ambienteAtualV081 =
        "LABORATORIO";

      return htmlLaboratorioV081();

    }


    const c =
      vaso.cultivo;


    const planta =
      c.plantaV083
      ||
      null;


    const saude =
      statusSaudeV084(
        c.saude
      );


    const agua =
      statusAguaV084(
        c.umidade
      );


    const tempo =
      tempoGlobalV080();


    const alertas =
      planta
      &&
      typeof alertasPlantaV083
      === "function"
      ?
      alertasPlantaV083(
        planta
      )
      :
      [];


    return `

      <section
        class="
          ambiente-mundo-v081
          estacao-v081
          estacao-v084
          periodo-${classePeriodoV081()}
          saude-${saude.classe}
        "
      >

        <!-- ==================================================
             CABEÇALHO
             ================================================== -->

        <header class="cabecalho-estacao-v084">

          <button
            type="button"
            class="voltar-estacao-v084"
            id="voltarLaboratorioV081"
          >
            ←
            <span>Laboratório</span>
          </button>


          <div class="titulo-estacao-v084">

            <span>
              ESTAÇÃO DE CULTIVO
            </span>

            <strong>
              Vaso ${vaso.id}
            </strong>

          </div>


          <div class="tempo-estacao-v084">

            <span>
              ${
                tempo.luz === "SOL"
                ? "☀️"
                : "🌙"
              }
            </span>

            <div>

              <strong>
                ${nomePeriodoV084()}
              </strong>

              <small>
                Dia ${tempo.dia}
                •
                ${String(
                  tempo.hora
                ).padStart(2,"0")}:00
              </small>

            </div>

          </div>

        </header>


        <!-- ==================================================
             ALERTAS
             ================================================== -->

        <div
          id="alertasEstacaoV083"
          class="alertas-estacao-v084"
        >

          ${alertas
            .map(
              alerta => `

                <span
                  class="
                    chip-alerta-v084
                    chip-${alerta.tipo}
                  "
                >
                  ${alerta.icone}
                  ${alerta.texto}
                </span>

              `
            )
            .join("")}

        </div>


        <!-- ==================================================
             CORPO
             ================================================== -->

        <div class="corpo-estacao-v084">


          <!-- ================================================
               CENA DA PLANTA
               ================================================ -->

          <div class="cena-planta-v084">

            <div class="luz-cultivo-v084">
            </div>


            <div class="estagio-planta-v084">

              ${c.estagio}

            </div>


            <div class="identidade-planta-v084">

              <strong>
                🌱 ${nomeSementeV081(c)}
              </strong>

              <span>
                Geração ${c.geracao || 0}
              </span>

            </div>


            <div class="planta-palco-v084">

              <div
                class="
                  planta-estacao-v081
                  planta-v084
                "
              >

                ${
                  planta
                  &&
                  typeof htmlPlantaProceduralV083
                  === "function"
                  ?
                  htmlPlantaProceduralV083(
                    planta
                  )
                  :
                  "🌱"
                }

              </div>


              <div class="vaso-estacao-v084">

                <div
                  class="
                    terra-estacao-v084
                    terra-${agua.classe}
                  "
                ></div>

              </div>

            </div>


            <div class="rodape-cena-v084">

              <span>
                🪴 ${soloAmigavelV084(c)}
              </span>

              <span>
                ${saude.icone} ${saude.texto}
              </span>

            </div>

          </div>


          <!-- ================================================
               CONTROLES
               ================================================ -->

          <div class="controles-estacao-v084">


            <!-- MÉTRICAS -->

            <div class="metricas-estacao-v084">

              <div class="metrica-v084">

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


              <div class="metrica-v084">

                <span>
                  ❤️ Saúde
                </span>

                <strong>
                  ${Math.round(
                    c.saude
                  )}%
                </strong>

              </div>


              <div class="metrica-v084">

                <span>
                  ⚡ Energia
                </span>

                <strong>
                  ${Math.round(
                    c.energia
                  )}
                </strong>

              </div>


              <div class="metrica-v084">

                <span>
                  🌱 Desenvolvimento
                </span>

                <strong>
                  ${Math.round(
                    c.desenvolvimento
                  )}
                </strong>

              </div>

            </div>


            <!-- ÁGUA -->

            <section class="controle-bloco-v084">

              <div class="controle-titulo-v084">

                <div>

                  <strong>
                    💧 Umidade do solo
                  </strong>

                  <span>
                    ${agua.texto}
                  </span>

                </div>

                <small>
                  ${
                    c.umidade <= 20
                    ?
                    "A planta precisa de água."
                    :
                    c.umidade >= 85
                    ?
                    "Evite regar agora."
                    :
                    "Nível confortável."
                  }
                </small>

              </div>


              <div class="barra-agua-v084">

                <div
                  data-estacao-agua-v081
                  class="
                    preenchimento-agua-v084
                    agua-${agua.classe}
                  "
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


              <button
                type="button"
                class="regar-v084"
                id="regarEstacaoV081"
              >

                <span class="gota-v084">
                  💧
                </span>

                <span>

                  <strong>
                    Segure para regar
                  </strong>

                  <small>
                    Solte quando desejar parar
                  </small>

                </span>

              </button>

            </section>


            <!-- VELOCIDADE -->

            <section class="controle-bloco-v084">

              <div class="controle-titulo-v084">

                <div>

                  <strong>
                    ⏱️ Ritmo do cultivo
                  </strong>

                </div>

                <small>
                  Mais rápido exige mais água.
                </small>

              </div>


              <div class="velocidades-v084">

                ${[1,2,3]
                  .map(
                    velocidade => `

                      <button
                        type="button"
                        data-estacao-vel-v081="${velocidade}"
                        class="
                          ${
                            c.velocidade
                            ===
                            velocidade
                            ?
                            "ativa"
                            :
                            ""
                          }
                        "
                      >

                        <strong>
                          ×${velocidade}
                        </strong>

                        <small>
                          ${
                            velocidade === 1
                            ?
                            "Calmo"
                            :
                            velocidade === 2
                            ?
                            "Rápido"
                            :
                            "Acelerado"
                          }
                        </small>

                      </button>

                    `
                  )
                  .join("")}

              </div>

            </section>


            <!-- TEMPO -->

            <button
              type="button"
              id="avancarPeriodoV084"
              class="avancar-periodo-v084"
            >

              ⏩

              <span>

                <strong>
                  Avançar período
                </strong>

                <small>
                  O mundo inteiro avança 6 horas
                </small>

              </span>

            </button>


            <!-- ESTADO COMPLETO V083 -->

            <div
              id="estadoEstacaoV083"
              class="estado-completo-v084"
            ></div>


          </div>

        </div>


        <div class="piso-estacao-v084">
        </div>

      </section>

    `;

  };


/* ============================================================
   PLANTA V083 — ADAPTAÇÃO PARA A NOVA INTERFACE
   ============================================================ */

aplicarPlantaNaEstacaoV083 =
  function(
    vasoId
  ) {

    const planta =
      plantaDoVasoV083(
        vasoId
      );


    if (!planta) {
      return;
    }


    const alvo =
      document.querySelector(
        ".planta-estacao-v081"
      );


    if (alvo) {

      alvo.innerHTML =
        htmlPlantaProceduralV083(
          planta
        );

    }


    const alertas =
      document.querySelector(
        "#alertasEstacaoV083"
      );


    if (alertas) {

      alertas.innerHTML =
        alertasPlantaV083(
          planta
        )
        .map(
          alerta => `

            <span
              class="
                chip-alerta-v084
                chip-${alerta.tipo}
              "
            >
              ${alerta.icone}
              ${alerta.texto}
            </span>

          `
        )
        .join("");

    }


    const estadoArea =
      document.querySelector(
        "#estadoEstacaoV083"
      );


    if (estadoArea) {

      const dna =
        planta.dna
        ||
        {};


      estadoArea.innerHTML = `

        <details class="detalhes-planta-v084">

          <summary>
            🧬 Detalhes da planta
          </summary>


          <div class="detalhes-grid-v084">

            <div>
              <span>Geração</span>
              <strong>
                G${planta.geracao || 0}
              </strong>
            </div>

            <div>
              <span>Solo</span>
              <strong>
                ${planta.solo}
              </strong>
            </div>

            <div>
              <span>Vigor</span>
              <strong>
                ${dna.vigor ?? "—"}
              </strong>
            </div>

            <div>
              <span>Sombra</span>
              <strong>
                ${dna.sombra ?? "—"}
              </strong>
            </div>

            <div>
              <span>Seca</span>
              <strong>
                ${dna.seca ?? "—"}
              </strong>
            </div>

            <div>
              <span>Estágio</span>
              <strong>
                ${planta.estagio}
              </strong>
            </div>

          </div>

        </details>

      `;

    }

  };


/* ============================================================
   EVENTOS EXTRAS
   ============================================================ */

const instalarEventosAnteriorV084 =
  instalarEventosV081;


instalarEventosV081 =
  function() {

    instalarEventosAnteriorV084();


    const avancar =
      document.querySelector(
        "#avancarPeriodoV084"
      );


    if (avancar) {

      avancar.onclick =
        () => {

          if (
            typeof cicloTempoV050
            === "function"
          ) {

            cicloTempoV050();

          }

        };

    }

  };


/* ============================================================
   REGA — ATUALIZA STATUS VISUAL AO VIVO
   ============================================================ */

const atualizarAguaAnteriorV084 =
  atualizarAguaEstacaoV081;


atualizarAguaEstacaoV081 =
  function() {

    atualizarAguaAnteriorV084();


    const vaso =
      estado
        ?.quartoV080
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


    const agua =
      statusAguaV084(
        c.umidade
      );


    const preenchimento =
      document.querySelector(
        ".preenchimento-agua-v084"
      );


    if (preenchimento) {

      preenchimento.classList.remove(
        "agua-seca",
        "agua-boa",
        "agua-excesso"
      );


      preenchimento.classList.add(
        `agua-${agua.classe}`
      );

    }

  };


/* ============================================================
   RENDER INICIAL
   ============================================================ */

if (
  ambienteAtualV081 ===
  "ESTACAO"
) {

  renderLaboratorioV081();

}


console.log(
  "[A Plantinha] V0.8.4 — Estação Viva carregada."
);
