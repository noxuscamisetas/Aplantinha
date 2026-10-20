/*
============================================================
A PLANTINHA — V0.8.3.2
TESTE DE SINCRONIZAÇÃO CULTIVO ↔ PLANTAV083
============================================================
*/

(function instalarTesteSyncV0832() {

  window.testarSyncV0832 =
    function() {

      if (
        typeof estado === "undefined"
        ||
        !estado?.quartoV080?.vasos
      ) {

        console.error(
          "[V0.8.3.2] quartoV080 indisponível."
        );

        return;
      }


      /*
      Sincroniza antes de medir.
      */

      if (
        typeof sincronizarTodasV083 ===
        "function"
      ) {

        sincronizarTodasV083();

      }


      const antes =
        estado.quartoV080.vasos.map(
          vaso => {

            const cultivo =
              vaso?.cultivo;

            const planta =
              cultivo?.plantaV083;


            return {

              vaso:
                vaso.id,

              ativo:
                !!cultivo,

              cultivo:
                cultivo
                ?
                {
                  umidade:
                    cultivo.umidade,

                  saude:
                    cultivo.saude,

                  energia:
                    cultivo.energia,

                  desenvolvimento:
                    cultivo.desenvolvimento
                }
                :
                null,

              planta:
                planta
                ?
                {
                  umidade:
                    planta.umidade,

                  saude:
                    planta.saude,

                  energia:
                    planta.energia,

                  desenvolvimento:
                    planta.desenvolvimento
                }
                :
                null

            };

          }
        );


      console.log(
        "===== ANTES DO PASSO ====="
      );

      console.table(
        antes
          .filter(
            item =>
              item.ativo
          )
          .map(
            item => ({

              vaso:
                item.vaso,

              cultivo_um:
                item.cultivo.umidade,

              planta_um:
                item.planta?.umidade,

              cultivo_saude:
                item.cultivo.saude,

              planta_saude:
                item.planta?.saude,

              cultivo_energia:
                item.cultivo.energia,

              planta_energia:
                item.planta?.energia,

              cultivo_dev:
                item.cultivo.desenvolvimento,

              planta_dev:
                item.planta?.desenvolvimento

            })
          )
      );


      /*
      --------------------------------------------------------
      AVANÇA EXATAMENTE UM PASSO GLOBAL
      --------------------------------------------------------

      Preferimos usar a função já existente do quarto.
      */

      let avancou =
        false;


      if (
        typeof processarTempoQuartoV080 ===
        "function"
      ) {

        /*
        Essa função só processa se a assinatura
        temporal do mundo tiver mudado.

        Então, se o seu botão antigo "Passar ciclo"
        estiver disponível, usamos a função ciclo()
        para mudar o relógio primeiro.
        */

        if (
          typeof ciclo ===
          "function"
        ) {

          ciclo();

          avancou =
            true;

        }

      }


      if (!avancou) {

        console.warn(
          "[V0.8.3.2] Não encontrei uma rotina segura para avançar o relógio."
        );

        console.warn(
          "Use o botão ⏩ Passar ciclo uma vez e depois rode testarSyncDepoisV0832()."
        );

        return;

      }


      /*
      Após o avanço, sincronizamos novamente.
      */

      if (
        typeof sincronizarTodasV083 ===
        "function"
      ) {

        sincronizarTodasV083();

      }


      if (
        typeof salvar ===
        "function"
      ) {

        salvar();

      }


      const depois =
        estado.quartoV080.vasos.map(
          vaso => {

            const cultivo =
              vaso?.cultivo;

            const planta =
              cultivo?.plantaV083;


            return {

              vaso:
                vaso.id,

              ativo:
                !!cultivo,

              cultivo:
                cultivo
                ?
                {
                  umidade:
                    cultivo.umidade,

                  saude:
                    cultivo.saude,

                  energia:
                    cultivo.energia,

                  desenvolvimento:
                    cultivo.desenvolvimento
                }
                :
                null,

              planta:
                planta
                ?
                {
                  umidade:
                    planta.umidade,

                  saude:
                    planta.saude,

                  energia:
                    planta.energia,

                  desenvolvimento:
                    planta.desenvolvimento
                }
                :
                null

            };

          }
        );


      console.log(
        "===== DEPOIS DO PASSO ====="
      );

      console.table(
        depois
          .filter(
            item =>
              item.ativo
          )
          .map(
            item => ({

              vaso:
                item.vaso,

              cultivo_um:
                item.cultivo.umidade,

              planta_um:
                item.planta?.umidade,

              cultivo_saude:
                item.cultivo.saude,

              planta_saude:
                item.planta?.saude,

              cultivo_energia:
                item.cultivo.energia,

              planta_energia:
                item.planta?.energia,

              cultivo_dev:
                item.cultivo.desenvolvimento,

              planta_dev:
                item.planta?.desenvolvimento

            })
          )
      );


      /*
      --------------------------------------------------------
      TESTES
      --------------------------------------------------------
      */

      const resultados =
        depois
          .filter(
            item =>
              item.ativo
          )
          .map(
            item => {

              const c =
                item.cultivo;

              const p =
                item.planta;


              return {

                vaso:
                  item.vaso,

                umidade:
                  !!p
                  &&
                  c.umidade ===
                  p.umidade,

                saude:
                  !!p
                  &&
                  c.saude ===
                  p.saude,

                energia:
                  !!p
                  &&
                  c.energia ===
                  p.energia,

                desenvolvimento:
                  !!p
                  &&
                  c.desenvolvimento ===
                  p.desenvolvimento

              };

            }
          );


      console.log(
        "===== RESULTADO ====="
      );


      console.table(
        resultados
      );


      const passou =
        resultados.every(
          item =>
            item.umidade
            &&
            item.saude
            &&
            item.energia
            &&
            item.desenvolvimento
        );


      console.log(
        passou
        ?
        "[OK] V0.8.3.2 — cultivo e plantaV083 continuam sincronizados."
        :
        "[FALHA] V0.8.3.2 — existe divergência entre cultivo e plantaV083."
      );


      return {
        antes,
        depois,
        resultados,
        passou
      };

    };


  /*
  ----------------------------------------------------------
  Teste manual pós-ciclo, caso necessário.
  ----------------------------------------------------------
  */

  window.testarSyncDepoisV0832 =
    function() {

      if (
        typeof sincronizarTodasV083 ===
        "function"
      ) {

        sincronizarTodasV083();

      }


      const resultados =
        estado.quartoV080.vasos
          .filter(
            vaso =>
              !!vaso.cultivo
          )
          .map(
            vaso => {

              const c =
                vaso.cultivo;

              const p =
                c.plantaV083;


              return {

                vaso:
                  vaso.id,

                umidade:
                  c.umidade ===
                  p?.umidade,

                saude:
                  c.saude ===
                  p?.saude,

                energia:
                  c.energia ===
                  p?.energia,

                desenvolvimento:
                  c.desenvolvimento ===
                  p?.desenvolvimento,

                cultivo_um:
                  c.umidade,

                planta_um:
                  p?.umidade,

                cultivo_saude:
                  c.saude,

                planta_saude:
                  p?.saude,

                cultivo_energia:
                  c.energia,

                planta_energia:
                  p?.energia,

                cultivo_dev:
                  c.desenvolvimento,

                planta_dev:
                  p?.desenvolvimento

              };

            }
          );


      console.table(
        resultados
      );


      const passou =
        resultados.every(
          item =>
            item.umidade
            &&
            item.saude
            &&
            item.energia
            &&
            item.desenvolvimento
        );


      console.log(
        passou
        ?
        "[OK] Sincronização confirmada."
        :
        "[FALHA] Sincronização divergente."
      );


      return resultados;

    };


  console.log(
    "[A Plantinha] teste_sync_v0832 carregado."
  );

})();
