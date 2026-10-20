/*
============================================================
A PLANTINHA — V0.8.3.1
MIGRAÇÃO DE IDENTIDADE DAS PLANTAS
============================================================

A identidade interna canônica é:

S1 / S2 / S3 / S4 / S5

VERDE / VERMELHA / AZUL / MARROM / AMARELA
são nomes amigáveis de interface.
*/

(function migrarIdentidadesV0831() {

  if (
    typeof estado === "undefined"
    ||
    !estado?.quartoV080?.vasos
  ) {

    console.warn(
      "[V0.8.3.1] Quarto ainda não disponível."
    );

    return;

  }


  let alteracoes = 0;


  for (
    const vaso
    of estado.quartoV080.vasos
  ) {

    const cultivo =
      vaso?.cultivo;


    const planta =
      cultivo?.plantaV083;


    if (
      !cultivo
      ||
      !planta
    ) {

      continue;

    }


    const baseCorreta =
      cultivo.base
      ||
      cultivo.sementeBase
      ||
      cultivo.semente;


    if (!baseCorreta) {

      continue;

    }


    if (
      planta.sementeBase
      !==
      baseCorreta
    ) {

      console.log(
        `[V0.8.3.1] Vaso ${vaso.id}: `
        +
        `${planta.sementeBase} → ${baseCorreta}`
      );


      planta.sementeBase =
        baseCorreta;


      alteracoes++;

    }


    if (
      Array.isArray(
        planta.linhagem
      )
      &&
      planta.linhagem.length > 0
    ) {

      const ancestral =
        planta.linhagem[0];


      if (
        ancestral.origem
        !==
        baseCorreta
      ) {

        ancestral.origem =
          baseCorreta;

        alteracoes++;

      }

    }

  }


  if (
    alteracoes > 0
    &&
    typeof salvar === "function"
  ) {

    salvar();

  }


  console.log(
    `[A Plantinha] V0.8.3.1 — migração concluída. `
    +
    `${alteracoes} ajuste(s).`
  );

})();
