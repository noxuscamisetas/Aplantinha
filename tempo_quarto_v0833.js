/*
================================================================
A PLANTINHA — V0.8.3.3
TEMPO GLOBAL → TODOS OS CULTIVOS
================================================================

Correção arquitetural:

ANTES:
ciclo atual
→ relógio avançava
→ render
→ vasos recebiam o período seguinte

AGORA:
ciclo atual
→ planta antiga processa
→ todos os vasos processam O MESMO período
→ plantaV083 sincroniza
→ relógio avança
→ render mostra o próximo período

Além disso:

render() NÃO processa mais biologia.
Render apenas desenha.

================================================================
*/


/* ============================================================
   PROCESSAR TODOS OS VASOS NO PERÍODO ATUAL
   ============================================================ */

function processarVasosPeriodoAtualV0833(
  contexto
) {

  if (
    typeof garantirQuartoV080 ===
    "function"
  ) {

    garantirQuartoV080();

  }


  const vasos =
    estado
      ?.quartoV080
      ?.vasos
    ||
    [];


  for (
    const vaso
    of vasos
  ) {

    if (
      !vaso?.cultivo
    ) {

      continue;

    }


    /*
    A física é processada uma única vez por período.
    Os perfis de DNA e ambiente são verificados em perfis_web.cjs.
    */

    const estagioAntes = vaso.cultivo.estagio;

    processarCultivoV080(
      vaso.cultivo,
      contexto
    );

    if (typeof registrarMudancaCultivo === "function") {
      registrarMudancaCultivo(vaso, estagioAntes, contexto);
    }


    /*
    Registro diagnóstico.

    Isso NÃO interfere na biologia.
    Serve para provar em qual período
    aquele vaso realmente foi processado.
    */

    vaso.cultivo
      .ultimoPeriodoProcessadoV0833 =
        {
          dia:
            contexto.dia,

          hora:
            contexto.hora,

          luz:
            contexto.luz
        };

  }

}


/* ============================================================
   PROCESSAMENTO VIA RENDER DESATIVADO
   ============================================================ */

/*
A partir daqui, desenhar a interface
não pode envelhecer uma planta.

Podemos renderizar 100 vezes no mesmo horário
sem executar nenhum ciclo biológico.
*/

const processarTempoQuartoAnteriorV0833 =
  typeof processarTempoQuartoV080 ===
  "function"
  ?
  processarTempoQuartoV080
  :
  null;


processarTempoQuartoV080 =
  function() {

    garantirQuartoV080?.();


    const tempo =
      tempoGlobalV080();


    /*
    Apenas sincronizamos a assinatura visual.

    Nenhuma planta é processada aqui.
    */

    estado
      .quartoV080
      .ultimoTempoProcessado =
        tempo.assinatura;

  };


/* ============================================================
   GUARDA CICLO ANTIGO PARA DIAGNÓSTICO
   ============================================================ */

const cicloTempoAnteriorV0833 =
  cicloTempoV050;


/* ============================================================
   NOVO CICLO CENTRAL DO UNIVERSO
   ============================================================ */

cicloTempoV050 =
  function() {

    garantirTempoV050();


    /*
    ------------------------------------------------------------
    1. CAPTURA O MOMENTO ATUAL

    Ainda NÃO avançamos o relógio.
    ------------------------------------------------------------
    */

    const tempoAtual =
      tempoGlobalV080();


    /*
    A V0.5 pode possuir modos de iluminação
    adicionais.

    Mantemos sua determinação original
    para a planta legada.
    */

    const luzDoCiclo =
      luzRealV050();


    estado.luz =
      luzDoCiclo;


    /*
    ------------------------------------------------------------
    2. REPOUSO DO UNIVERSO ANTIGO
    ------------------------------------------------------------
    */

    if (!estado.quartoV080) {
      registrarRepousoV050(luzDoCiclo);
    }


    /*
    ------------------------------------------------------------
    3. PLANTA LEGADA VIVE O PERÍODO ATUAL
    ------------------------------------------------------------
    */

    // No universo de vasos, os metadados antigos não são outra planta.
    if (!estado.quartoV080) {
      cicloBaseV050();
    }


    /*
    ------------------------------------------------------------
    4. TODOS OS NOVOS VASOS VIVEM
       EXATAMENTE O MESMO MOMENTO
    ------------------------------------------------------------

    Exemplo:

    mundo = Dia 9, 12h, SOL

    Vaso 1 x1 → Dia 9, 12h
    Vaso 2 x2 → Dia 9, 12h
    Vaso 3 x3 → Dia 9, 12h

    x2/x3 alteram metabolismo.
    Não criam horários adicionais.
    ------------------------------------------------------------
    */

    processarVasosPeriodoAtualV0833(
      {
        dia:
          tempoAtual.dia,

        hora:
          tempoAtual.hora,

        luz:
          tempoAtual.luz,

        assinatura:
          tempoAtual.assinatura
      }
    );


    /*
    ------------------------------------------------------------
    5. SINCRONIZA PLANTA COMPLETA POR VASO
    ------------------------------------------------------------
    */

    if (
      typeof sincronizarTodasV083 ===
      "function"
    ) {

      sincronizarTodasV083();

    }


    /*
    ------------------------------------------------------------
    6. SÓ AGORA O UNIVERSO AVANÇA
    ------------------------------------------------------------
    */

    avancarTempoV050();


    /*
    ------------------------------------------------------------
    7. PREPARA A LUZ DO PRÓXIMO PERÍODO
    ------------------------------------------------------------
    */

    estado.luz =
      luzRealV050();


    /*
    ------------------------------------------------------------
    8. O RENDER NÃO DEVE PROCESSAR O NOVO PERÍODO

    Apenas registra que a interface já está sincronizada
    com o horário que passará a mostrar.
    ------------------------------------------------------------
    */

    if (
      estado.quartoV080
    ) {

      estado
        .quartoV080
        .ultimoTempoProcessado =
          tempoGlobalV080()
            .assinatura;

    }


    /*
    ------------------------------------------------------------
    9. SAVE + INTERFACE
    ------------------------------------------------------------
    */

    salvar();

    render();

  };


/* ============================================================
   TESTE DE UM CICLO
   ============================================================ */

window.testarTempoCorretoV0833 =
  function() {

    const antes =
      {

        mundo:
          structuredClone(
            tempoGlobalV080()
          ),

        vasos:
          estado
            .quartoV080
            .vasos
            .filter(
              vaso =>
                !!vaso.cultivo
            )
            .map(
              vaso => ({

                vaso:
                  vaso.id,

                velocidade:
                  vaso.cultivo
                    .velocidade,

                umidade:
                  vaso.cultivo
                    .umidade,

                saude:
                  vaso.cultivo
                    .saude,

                energia:
                  vaso.cultivo
                    .energia,

                desenvolvimento:
                  vaso.cultivo
                    .desenvolvimento

              })
            )

      };


    console.log(
      "===== ANTES ====="
    );

    console.log(
      structuredClone(
        antes
      )
    );


    /*
    Executa exatamente UM ciclo real.
    */

    cicloTempoV050();


    const depois =
      {

        mundo:
          structuredClone(
            tempoGlobalV080()
          ),

        vasos:
          estado
            .quartoV080
            .vasos
            .filter(
              vaso =>
                !!vaso.cultivo
            )
            .map(
              vaso => ({

                vaso:
                  vaso.id,

                velocidade:
                  vaso.cultivo
                    .velocidade,

                umidade:
                  vaso.cultivo
                    .umidade,

                saude:
                  vaso.cultivo
                    .saude,

                energia:
                  vaso.cultivo
                    .energia,

                desenvolvimento:
                  vaso.cultivo
                    .desenvolvimento,

                periodoProcessado:
                  vaso.cultivo
                    .ultimoPeriodoProcessadoV0833,

                plantaV083Umidade:
                  vaso.cultivo
                    .plantaV083
                    ?.umidade,

                plantaV083Saude:
                  vaso.cultivo
                    .plantaV083
                    ?.saude,

                plantaV083Energia:
                  vaso.cultivo
                    .plantaV083
                    ?.energia,

                plantaV083Dev:
                  vaso.cultivo
                    .plantaV083
                    ?.desenvolvimento

              })
            )

      };


    console.log(
      "===== DEPOIS ====="
    );

    console.log(
      structuredClone(
        depois
      )
    );


    console.table(
      depois.vasos.map(
        vaso => ({

          vaso:
            vaso.vaso,

          velocidade:
            vaso.velocidade,

          periodo:
            vaso
              .periodoProcessado
              ?
              (
                "D"
                +
                vaso
                  .periodoProcessado
                  .dia
                +
                " "
                +
                vaso
                  .periodoProcessado
                  .hora
                +
                "h "
                +
                vaso
                  .periodoProcessado
                  .luz
              )
              :
              "—",

          umidade:
            vaso.umidade,

          saude:
            vaso.saude,

          energia:
            vaso.energia,

          dev:
            vaso.desenvolvimento,

          sync_umidade:
            vaso.umidade
            ===
            vaso.plantaV083Umidade,

          sync_saude:
            vaso.saude
            ===
            vaso.plantaV083Saude,

          sync_energia:
            vaso.energia
            ===
            vaso.plantaV083Energia,

          sync_dev:
            vaso.desenvolvimento
            ===
            vaso.plantaV083Dev

        })
      )
    );


    /*
    ------------------------------------------------------------
    VERIFICAÇÃO DO PERÍODO
    ------------------------------------------------------------
    */

    const periodoCorreto =
      depois.vasos.every(
        vaso =>
          vaso
            .periodoProcessado
            ?.dia
          ===
          antes.mundo.dia

          &&

          vaso
            .periodoProcessado
            ?.hora
          ===
          antes.mundo.hora

          &&

          vaso
            .periodoProcessado
            ?.luz
          ===
          antes.mundo.luz
      );


    /*
    ------------------------------------------------------------
    VERIFICAÇÃO DA SINCRONIZAÇÃO
    ------------------------------------------------------------
    */

    const sincronizado =
      depois.vasos.every(
        vaso =>
          vaso.umidade
          ===
          vaso.plantaV083Umidade

          &&

          vaso.saude
          ===
          vaso.plantaV083Saude

          &&

          vaso.energia
          ===
          vaso.plantaV083Energia

          &&

          vaso.desenvolvimento
          ===
          vaso.plantaV083Dev
      );


    /*
    ------------------------------------------------------------
    RELÓGIO DEVE TER MUDADO
    ------------------------------------------------------------
    */

    const mundoAvancou =
      antes
        .mundo
        .assinatura
      !==
      depois
        .mundo
        .assinatura;


    console.log(
      periodoCorreto
      ?
      "[OK] Vasos viveram o período ANTES do avanço do relógio."
      :
      "[FALHA] Vasos receberam período incorreto."
    );


    console.log(
      sincronizado
      ?
      "[OK] cultivo ↔ plantaV083 sincronizados."
      :
      "[FALHA] plantaV083 divergiu do cultivo."
    );


    console.log(
      mundoAvancou
      ?
      "[OK] Relógio avançou somente depois do processamento."
      :
      "[FALHA] Relógio não avançou."
    );


    return {

      antes,

      depois,

      periodoCorreto,

      sincronizado,

      mundoAvancou

    };

  };


console.log(
  "[A Plantinha] V0.8.3.3 — fluxo temporal global corrigido."
);
