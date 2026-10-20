/*
==========================================================
A PLANTINHA — V0.8.9 GENESIS
==========================================================

REGRA:

O estado global legado ainda conserva metadados técnicos
necessários aos motores antigos.

MAS:

isso NÃO significa que existe uma planta no universo.

Existência física de planta:
    vaso.cultivo
    ou
    jardimV088.slots[].cultivo

Genesis físico:
- 5 sementes ancestrais
- 1 solo comum
- 30 moedas
- 3 vasos livres
- 2 vasos bloqueados
- 3 jardins vazios
- nenhuma planta
- nenhuma Semente-DNA descendente
==========================================================
*/


const GENESIS_V089 = {

  versao:
    1,

  moedas:
    30,

  sementes: {

    S1: 1,
    S2: 1,
    S3: 1,
    S4: 1,
    S5: 1

  },

  soloComum:
    1

};


/* ======================================================
   DETECTAR SE EXISTE VIDA FÍSICA
   ====================================================== */

function existeCultivoFisicoV089() {

  const vasos =
    estado
      ?.quartoV080
      ?.vasos
    ||
    [];


  const jardim =
    estado
      ?.jardimV088
      ?.slots
    ||
    [];


  return (

    vasos.some(
      vaso =>
        !!vaso.cultivo
    )

    ||

    jardim.some(
      slot =>
        !!slot.cultivo
    )

  );

}


/* ======================================================
   GENESIS JÁ ENTREGUE?
   ====================================================== */

function genesisJaAplicadoV089() {

  return (
    estado
      ?.genesisV089
      ?.concluido
    === true
  );

}


/* ======================================================
   GARANTIR PILHAS ANCESTRAIS
   ====================================================== */

function aplicarSementesGenesisV089() {

  estado.inventario ??= {};


  for (
    const [id, quantidade]
    of Object.entries(
      GENESIS_V089.sementes
    )
  ) {

    const chave =
      `SEMENTE_${id}`;


    estado.inventario[chave] =
      quantidade;

  }


  estado.inventario.SOLO_COMUM =
    GENESIS_V089.soloComum;

}


/* ======================================================
   LIMPAR RESÍDUOS FÍSICOS DE UM GENESIS NOVO
   ====================================================== */

function limparCultivosGenesisV089() {

  if (
    estado?.quartoV080?.vasos
  ) {

    for (
      const vaso
      of estado.quartoV080.vasos
    ) {

      vaso.cultivo =
        null;

    }

  }


  if (
    estado?.jardimV088?.slots
  ) {

    for (
      const slot
      of estado.jardimV088.slots
    ) {

      slot.cultivo =
        null;

      slot.congeladoEm =
        null;

      slot.origemVaso =
        null;

    }

  }

}


/* ======================================================
   APLICAR GENESIS
   ====================================================== */

function aplicarGenesisV089() {

  if (
    genesisJaAplicadoV089()
  ) {

    return false;

  }


  /*
  Esta camada é carregada depois do reset completo.

  Só consideramos Genesis quando ainda não existe
  nenhum cultivo físico.

  Assim um save real jamais recebe novamente
  cinco sementes por carregar a página.
  */

  if (
    existeCultivoFisicoV089()
  ) {

    estado.genesisV089 = {

      versao:
        GENESIS_V089.versao,

      concluido:
        true,

      migradoDeSave:
        true,

      criadoEm:
        Date.now()

    };


    salvar();

    return false;

  }


  /*
  Recursos iniciais.
  */

  estado.moedas =
    GENESIS_V089.moedas;


  aplicarSementesGenesisV089();


  /*
  Nenhuma Semente-DNA descendente existe.
  */

  estado.sementeDNA =
    null;


  estado.sementeDnaGerada =
    false;


  /*
  Nenhuma intenção de plantio anterior.
  */

  estado.sementeSelecionadaV0867 =
    null;


  estado.soloSelecionadoV0872 =
    null;


  /*
  Garantimos ausência física de plantas.
  */

  limparCultivosGenesisV089();


  /*
  O S1 global permanece SOMENTE como compatibilidade
  com os motores V04/V05/V06.

  Ele não constitui um organismo físico.

  A autoridade física desde V080 é vaso.cultivo.
  */

  estado.genesisV089 = {

    versao:
      GENESIS_V089.versao,

    concluido:
      true,

    estado:
      "UNIVERSO_VIRGEM",

    plantaGlobalLegada:
      false,

    sementesAncestraisEntregues:
      true,

    criadoEm:
      Date.now()

  };


  salvar();


  return true;

}


/* ======================================================
   REMOVER SELETOR ANTIGO
   ====================================================== */

function removerSeletorGenesisAntigoV089() {

  document
    .querySelector(
      "#seletorSementesV060"
    )
    ?.remove();

}


/*
O seletor V060 era necessário quando uma única semente
representava a planta global.

No universo multi-vasos ele não deve mais escolher
a identidade do universo inteiro.
*/

if (
  typeof criarSeletorV060
  === "function"
) {

  criarSeletorV060 =
    function() {

      removerSeletorGenesisAntigoV089();

    };

}


/* ======================================================
   INVENTÁRIO ESTRUTURADO
   ====================================================== */

function sincronizarGenesisInventarioV089() {

  /*
  A V086 já possui a sincronização física das pilhas.
  Não criamos uma segunda fonte de verdade.

  Apenas chamamos as garantias/renders existentes
  depois de alterar estado.inventario.
  */

  if (
    typeof garantirInventarioV070
    === "function"
  ) {

    garantirInventarioV070();

  }


  if (
    typeof garantirArmazenamentoV086
    === "function"
  ) {

    garantirArmazenamentoV086();

  }

}


/* ======================================================
   TESTE DO GENESIS
   ====================================================== */

window.testarGenesisV089 =
  function() {

    garantirJardimV088?.();

    garantirQuartoV080?.();


    const vasos =
      estado
        ?.quartoV080
        ?.vasos
      ||
      [];


    const jardim =
      estado
        ?.jardimV088
        ?.slots
      ||
      [];


    const resultado = {

      moedas:
        estado.moedas === 30,

      S1:
        estado.inventario
          ?.SEMENTE_S1 === 1,

      S2:
        estado.inventario
          ?.SEMENTE_S2 === 1,

      S3:
        estado.inventario
          ?.SEMENTE_S3 === 1,

      S4:
        estado.inventario
          ?.SEMENTE_S4 === 1,

      S5:
        estado.inventario
          ?.SEMENTE_S5 === 1,

      soloComum:
        estado.inventario
          ?.SOLO_COMUM === 1,

      nenhumCultivoVasos:
        vasos.every(
          vaso =>
            !vaso.cultivo
        ),

      jardimVazio:
        jardim.every(
          slot =>
            !slot.cultivo
        ),

      nenhumaSementeDNA:
        !estado.sementeDNA,

      genesisRegistrado:
        estado.genesisV089
          ?.concluido === true

    };


    console.log(
      "=== GENESIS V0.8.9 ==="
    );


    console.table(
      resultado
    );


    console.log(
      "LEGADO TÉCNICO:",
      {
        sementeBase:
          estado.sementeBase,

        dna:
          estado.dna,

        plantaFisica:
          existeCultivoFisicoV089()
      }
    );


    console.table(
      vasos.map(
        vaso => ({

          vaso:
            vaso.id,

          desbloqueado:
            vaso.desbloqueado,

          ocupado:
            !!vaso.cultivo

        })
      )
    );


    console.table(
      jardim.map(
        slot => ({

          jardim:
            slot.id,

          ocupado:
            !!slot.cultivo

        })
      )
    );


    const passou =
      Object
        .values(resultado)
        .every(Boolean);


    if (passou) {

      console.log(
        "[OK] GENESIS V0.8.9 VALIDADO."
      );

    }

    else {

      console.error(
        "[FALHA] Genesis possui divergências.",
        resultado
      );

    }


    return {

      passou,
      resultado

    };

  };


/* ======================================================
   INICIALIZAÇÃO
   ====================================================== */

removerSeletorGenesisAntigoV089();

const genesisAplicadoV089 =
  aplicarGenesisV089();

sincronizarGenesisInventarioV089();

removerSeletorGenesisAntigoV089();


if (
  genesisAplicadoV089
) {

  /*
  Re-render somente visual.
  A V0833 garante que render não processa biologia.
  */

  render?.();

}


console.log(
  "[A Plantinha] V0.8.9 — Genesis carregado."
);
