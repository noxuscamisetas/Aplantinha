/*
==========================================================
A PLANTINHA — V0.8.6.9.1
USAR SEMENTE -> LABORATÓRIO
==========================================================

Corrige apenas navegação visual.

Depois de USAR uma Semente-DNA:

1. semente continua selecionada;
2. ficha fecha;
3. inventário fecha;
4. detalhes de stack fecham;
5. jogador volta ao Laboratório;
6. jogador escolhe o vaso;
7. Novo Cultivo abre com a semente pré-selecionada.

Nenhum item é consumido aqui.
==========================================================
*/


function fecharCamadasInventarioV08691() {

  /*
  Ficha individual.
  */

  document
    .querySelector(
      "#fichaItemV070"
    )
    ?.remove();


  /*
  Inventário operacional atual.
  */

  document
    .querySelector(
      "#inventarioOperacionalV0861"
    )
    ?.remove();


  /*
  Detalhe de stack taxonômico.
  */

  document
    .querySelector(
      "#stackDetalhesV0862"
    )
    ?.remove();


  /*
  Grupo da camada operacional antiga.
  */

  document
    .querySelector(
      "#modalGrupoV0861"
    )
    ?.remove();


  /*
  Inventário antigo, caso esteja visível.
  Não destruímos o elemento porque algumas versões
  o reutilizam; apenas escondemos.
  */

  const inventarioAntigo =
    document.querySelector(
      "#modalInventarioV070"
    );


  if (inventarioAntigo) {

    inventarioAntigo
      .classList
      .add(
        "escondido"
      );

  }

}


/* ======================================================
   SUBSTITUIR SOMENTE A AÇÃO DE USAR SEMENTE
   ====================================================== */

if (
  typeof usarSementeFichaV0868
  === "function"
) {

  usarSementeFichaV0868 =
    function(
      item
    ) {

      if (
        !item
        ||
        item.tipo !== "SEMENTE_DNA"
      ) {

        return;

      }


      /*
      Pré-seleção.
      A semente ainda NÃO é consumida.
      */

      estado.sementeSelecionadaV0867 =
        item.id;


      salvar();


      /*
      Fecha toda a pilha visual do inventário.
      */

      fecharCamadasInventarioV08691();


      /*
      Volta pelo fluxo oficial do Laboratório.
      */

      if (
        typeof irLaboratorioV081
        === "function"
      ) {

        irLaboratorioV081();

      }

      else {

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


        renderLaboratorioV081?.();

      }


      console.log(
        `[V08691] ${item.id} selecionada. Escolha um vaso livre.`
      );

    };

}


/*
A camada V0868 encaminha o botão USAR_SEMENTE para
usarSementeFichaV0868(), portanto não precisamos criar
outro listener.
*/


console.log(
  "[A Plantinha] V0.8.6.9.1 — fluxo Semente -> Laboratório carregado."
);
