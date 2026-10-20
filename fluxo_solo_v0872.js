/*
==========================================================
A PLANTINHA — V0.8.7.2
USAR SOLO -> NOVO CULTIVO
==========================================================

Permite:

SOLO_ADITIVADO_CASCA -> USAR
SOLO_ADITIVADO_PETALA -> USAR

e também deixa a infraestrutura pronta para outros solos.

Fluxo:

Ficha do solo
    ↓
Usar
    ↓
pré-selecionar solo
    ↓
Laboratório
    ↓
escolher vaso livre
    ↓
Novo Cultivo
    ↓
solo já selecionado

O solo NÃO é consumido em USAR.
==========================================================
*/


/* ======================================================
   SOLOS QUE PODEM SER USADOS NO CULTIVO
   ====================================================== */

const SOLOS_CULTIVO_V0872 = new Set([

  "SOLO_COMUM",

  "SOLO_MINERAL",

  "SOLO_ORGANICO",

  "SOLO_ADITIVADO_CASCA",

  "SOLO_ADITIVADO_PETALA"

]);


/* ======================================================
   FECHAR CAMADAS E VOLTAR AO LABORATÓRIO
   ====================================================== */

function irLaboratorioComSoloV0872(
  chave
) {

  if (
    !SOLOS_CULTIVO_V0872.has(
      chave
    )
  ) {

    return;

  }


  /*
  Apenas registra intenção.
  */

  estado.soloSelecionadoV0872 =
    chave;


  salvar();


  /*
  Fecha ficha específica do solo.
  */

  document
    .querySelector(
      "#fichaSoloV0871"
    )
    ?.remove();


  /*
  Fecha inventário operacional.
  */

  document
    .querySelector(
      "#inventarioOperacionalV0861"
    )
    ?.remove();


  /*
  Fecha possíveis camadas intermediárias.
  */

  document
    .querySelector(
      "#stackDetalhesV0862"
    )
    ?.remove();


  document
    .querySelector(
      "#modalGrupoV0861"
    )
    ?.remove();


  /*
  Retorna ao laboratório pelo fluxo existente.
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
    `[V0872] ${chave} selecionado. Escolha um vaso livre.`
  );

}


/* ======================================================
   NOVA FICHA DE SOLO

   Aproveitamos a ficha V0871 e acrescentamos USAR
   aos solos de cultivo.
   ====================================================== */

if (
  typeof abrirFichaSoloV0871
  === "function"
) {

  const abrirFichaSoloAnteriorV0872 =
    abrirFichaSoloV0871;


  abrirFichaSoloV0871 =
    function(
      chave,
      local
    ) {

      /*
      Solo comum continua com a mecânica especial
      de preparo/aditivação da V0871.

      Os demais solos de cultivo recebem o uso
      para plantio depois que a ficha original abrir.
      */

      const resultado =
        abrirFichaSoloAnteriorV0872(
          chave,
          local
        );


      if (
        local !== "INVENTARIO"
      ) {

        return resultado;

      }


      if (
        !SOLOS_CULTIVO_V0872.has(
          chave
        )
      ) {

        return resultado;

      }


      const ficha =
        document.querySelector(
          "#fichaSoloV0871"
        );


      if (!ficha) {

        return resultado;

      }


      const area =
        ficha.querySelector(
          ".acoes-solo-v0871 > div"
        );


      if (!area) {

        return resultado;

      }


      /*
      Solo comum já possui "Usar" para ADITIVAR.
      Não duplicamos esse botão nesta versão.

      A entrada para cultivo será colocada
      nos solos já preparados/mineral/orgânico.
      */

      if (
        chave === "SOLO_COMUM"
      ) {

        return resultado;

      }


      if (
        area.querySelector(
          "[data-usar-cultivo-v0872]"
        )
      ) {

        return resultado;

      }


      const botao =
        document.createElement(
          "button"
        );


      botao.type =
        "button";


      botao.dataset.usarCultivoV0872 =
        chave;


      botao.innerHTML =
        "🌱 Usar no cultivo";


      botao.onclick =
        () => {

          irLaboratorioComSoloV0872(
            chave
          );

        };


      area.appendChild(
        botao
      );


      return resultado;

    };

}


/* ======================================================
   PRÉ-SELEÇÃO DO SOLO NO NOVO CULTIVO
   ====================================================== */

if (
  typeof abrirMontagemInternaV082
  === "function"
) {

  const abrirMontagemAnteriorV0872 =
    abrirMontagemInternaV082;


  abrirMontagemInternaV082 =
    function(
      vasoId
    ) {

      /*
      Primeiro deixamos a função atual criar montagemV080
      e aplicar a pré-seleção de semente V0869.
      */

      abrirMontagemAnteriorV0872(
        vasoId
      );


      const soloPreSelecionado =
        estado.soloSelecionadoV0872
        ||
        null;


      if (!soloPreSelecionado) {

        return;

      }


      /*
      Segurança:
      só pré-selecionamos se o solo realmente
      estiver disponível no inventário.
      */

      const solos =
        solosDisponiveisV080();


      const valido =
        solos.some(
          item =>
            item.chave ===
            soloPreSelecionado
        );


      if (!valido) {

        return;

      }


      montagemV080.solo =
        soloPreSelecionado;


      /*
      Rerender necessário porque a função anterior
      já desenhou a montagem antes de aplicarmos o solo.
      */

      renderMontagemInternaV082();

    };

}


/* ======================================================
   LIMPAR INTENÇÃO DEPOIS DO PLANTIO
   ====================================================== */

/*
Não limpamos antes da confirmação.

Depois que confirmarPlantioV080() realmente executar,
a intenção deixa de ser necessária.
*/

if (
  typeof confirmarPlantioV080
  === "function"
) {

  const confirmarPlantioAnteriorV0872 =
    confirmarPlantioV080;


  confirmarPlantioV080 =
    function() {

      const resultado =
        confirmarPlantioAnteriorV0872();


      /*
      Só limpamos depois de deixar o motor antigo
      executar o plantio.
      */

      estado.soloSelecionadoV0872 =
        null;


      /*
      A semente pré-selecionada também deixa de ser
      intenção depois da tentativa real de plantio.
      */

      if (
        estado.sementeSelecionadaV0867
      ) {

        estado.sementeSelecionadaV0867 =
          null;

      }


      salvar();


      return resultado;

    };

}


console.log(
  "[A Plantinha] V0.8.7.2 — solos conectados ao Novo Cultivo."
);
