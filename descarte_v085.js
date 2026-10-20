/*
================================================================
A PLANTINHA — V0.8.5
DESCARTE E MATÉRIA VEGETAL
================================================================

Primeiro fechamento do ciclo material do cultivo.

planta
  ↓
descarte
  ↓
matéria vegetal
  ↓
inventário
  ↓
vaso livre

IMPORTANTE:

- não altera a biologia;
- não devolve a semente;
- não devolve o solo;
- não cria decomposição ainda;
- não cria jardim ainda;
- preserva os dados históricos da planta no resíduo.
================================================================
*/


/* ============================================================
   GARANTIA DE INFRAESTRUTURA
   ============================================================ */

function garantirDescarteV085() {

  if (
    typeof garantirInventarioV070
    === "function"
  ) {

    garantirInventarioV070();

  }


  /*
  Prefixo MV = Matéria Vegetal.

  O sistema V070 aceita sequências novas,
  então não precisamos alterar seu núcleo.
  */

  if (
    estado
      ?.inventarioEstruturado
      ?.sequencias
  ) {

    estado
      .inventarioEstruturado
      .sequencias
      .MV ??= 0;

  }

}


/* ============================================================
   ENCONTRAR VASO
   ============================================================ */

function vasoDoDescarteV085(
  vasoId
) {

  garantirQuartoV080();

  return (
    estado
      .quartoV080
      .vasos
      .find(
        vaso =>
          vaso.id === vasoId
      )
    ||
    null
  );

}


/* ============================================================
   CLASSIFICAÇÃO DA MATÉRIA
   ============================================================ */

function estadoMateriaV085(
  cultivo
) {

  const saude =
    Number(
      cultivo?.saude ?? 0
    );


  if (saude <= 0) {

    return "SECA";

  }


  if (saude <= 20) {

    return "DEGRADADA";

  }


  if (saude <= 60) {

    return "FRAGIL";

  }


  return "FRESCA";

}


/* ============================================================
   QUANTIDADE DE MATÉRIA

   Ainda NÃO é uma mecânica econômica.

   É somente uma propriedade física inicial do objeto,
   baseada no quanto a planta chegou a se desenvolver.

   Poderemos recalibrar quando existir decomposição.
   ============================================================ */

function massaMateriaV085(
  cultivo
) {

  const desenvolvimento =
    Math.max(
      0,
      Number(
        cultivo?.desenvolvimento || 0
      )
    );


  /*
  Uma semente recém-plantada ainda deixa matéria,
  mas uma planta desenvolvida deixa mais biomassa.
  */

  return Math.max(
    1,
    Math.round(
      1
      +
      desenvolvimento / 10
    )
  );

}


/* ============================================================
   CRIAR OBJETO DE MATÉRIA VEGETAL
   ============================================================ */

function criarMateriaVegetalV085(
  vaso
) {

  garantirDescarteV085();


  const cultivo =
    vaso?.cultivo;


  if (!cultivo) {

    return null;

  }


  const planta =
    cultivo.plantaV083
    ||
    null;


  const id =
    novoIdInventarioV070(
      "MV"
    );


  const tempo =
    typeof tempoGlobalV080
    === "function"
    ?
    tempoGlobalV080()
    :
    null;


  const materia = {

    id,

    tipo:
      "MATERIA_VEGETAL",

    categoria:
      "MATERIAIS",

    nome:
      "Matéria vegetal",

    icone:
      "🍂",

    origem:
      "DESCARTE_PLANTA",

    vasoOrigem:
      vaso.id,

    plantaOrigem:
      cultivo.id
      ||
      null,

    sementeBase:
      cultivo.base
      ||
      null,

    nomeSemente:
      cultivo.nomeSemente
      ||
      null,

    geracao:
      cultivo.geracao
      ||
      0,

    dna:
      structuredClone(
        cultivo.dna
        ||
        planta?.dna
        ||
        {}
      ),

    soloOrigem:
      cultivo.solo
      ||
      null,

    estagioOrigem:
      cultivo.estagio
      ||
      planta?.estagio
      ||
      "DESCONHECIDO",

    saudeOrigem:
      Number(
        cultivo.saude ?? 0
      ),

    umidadeOrigem:
      Number(
        cultivo.umidade ?? 0
      ),

    energiaOrigem:
      Number(
        cultivo.energia ?? 0
      ),

    desenvolvimentoOrigem:
      Number(
        cultivo.desenvolvimento ?? 0
      ),

    estadoMateria:
      estadoMateriaV085(
        cultivo
      ),

    massa:
      massaMateriaV085(
        cultivo
      ),

    unidadeMassa:
      "BIO",

    tempoOrigem:
      tempo
      ?
      {
        dia:
          tempo.dia,

        hora:
          tempo.hora,

        luz:
          tempo.luz
      }
      :
      null

  };


  return adicionarItemIndividualV070(
    materia
  );

}


/* ============================================================
   DESCARTAR CULTIVO
   ============================================================ */

function descartarCultivoV085(
  vasoId
) {

  const vaso =
    vasoDoDescarteV085(
      vasoId
    );


  if (!vaso?.cultivo) {

    return {
      sucesso: false,
      motivo: "SEM_CULTIVO"
    };

  }


  /*
  Primeiro criamos o resíduo.

  Só depois destruímos a referência da planta.
  Assim evitamos perder a planta se alguma etapa falhar.
  */

  const materia =
    criarMateriaVegetalV085(
      vaso
    );


  if (!materia) {

    console.error(
      "[V0.8.5] Falha ao gerar matéria vegetal."
    );

    return {
      sucesso: false,
      motivo: "FALHA_RESIDUO"
    };

  }


  const cultivoDescartado =
    vaso.cultivo;


  /*
  Aqui acontece a destruição real do cultivo.

  O vaso volta ao estado livre.
  */

  vaso.cultivo = null;


  /*
  Se o jogador estava olhando justamente
  para esse vaso, voltamos ao laboratório.
  */

  if (
    typeof vasoSelecionadoV081
    !== "undefined"
    &&
    vasoSelecionadoV081
    === vasoId
  ) {

    vasoSelecionadoV081 =
      null;

    ambienteAtualV081 =
      "LABORATORIO";

  }


  if (
    typeof log ===
    "function"
  ) {

    log(
      `A planta do Vaso ${vasoId} foi descartada. ` +
      `${materia.massa} unidade(s) de matéria vegetal foram recuperadas.`
    );

  }


  salvar();


  return {

    sucesso: true,

    vaso:
      vasoId,

    cultivo:
      cultivoDescartado,

    materia

  };

}


/* ============================================================
   CONFIRMAÇÃO DO JOGADOR
   ============================================================ */

function solicitarDescarteV085(
  vasoId
) {

  const vaso =
    vasoDoDescarteV085(
      vasoId
    );


  if (!vaso?.cultivo) {

    return;

  }


  const cultivo =
    vaso.cultivo;


  const nome =
    cultivo.nomeSemente
    ||
    cultivo.base
    ||
    "esta planta";


  const confirmar =
    window.confirm(
      `Descartar ${nome}?\n\n` +
      `A planta será destruída e o vaso ficará livre.\n` +
      `A matéria vegetal restante será armazenada no laboratório.`
    );


  if (!confirmar) {

    return;

  }


  const resultado =
    descartarCultivoV085(
      vasoId
    );


  if (!resultado.sucesso) {

    alert(
      "Não foi possível descartar a planta."
    );

    return;

  }


  render();

}


/* ============================================================
   BOTÃO NA ESTAÇÃO

   Não reescrevemos o HTML V084 inteiro.

   Inserimos a ação depois que a estação é renderizada.
   ============================================================ */

function instalarBotaoDescarteV085() {

  if (
    ambienteAtualV081
    !== "ESTACAO"
  ) {

    return;

  }


  const vaso =
    vasoDoDescarteV085(
      vasoSelecionadoV081
    );


  if (!vaso?.cultivo) {

    return;

  }


  const controles =
    document.querySelector(
      ".controles-estacao-v084"
    );


  if (!controles) {

    return;

  }


  if (
    document.querySelector(
      "#descartarPlantaV085"
    )
  ) {

    return;

  }


  const area =
    document.createElement(
      "section"
    );


  area.className =
    "descarte-planta-v085";


  area.innerHTML = `

    <div class="descarte-info-v085">

      <div>

        <strong>
          ♻️ Encerrar cultivo
        </strong>

        <span>
          Libera o vaso e recupera a matéria vegetal.
        </span>

      </div>

      <button
        type="button"
        id="descartarPlantaV085"
      >
        🗑️ Descartar planta
      </button>

    </div>

  `;


  controles.appendChild(
    area
  );


  const botao =
    area.querySelector(
      "#descartarPlantaV085"
    );


  botao.onclick =
    () => {

      solicitarDescarteV085(
        vasoSelecionadoV081
      );

    };

}


/* ============================================================
   CSS ISOLADO
   ============================================================ */

function instalarCssDescarteV085() {

  if (
    document.querySelector(
      "#cssDescarteV085"
    )
  ) {

    return;

  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "cssDescarteV085";


  style.textContent = `

    .descarte-planta-v085 {
      margin-top: 12px;
      padding-top: 12px;
      border-top:
        1px solid
        rgba(255,255,255,.08);
    }


    .descarte-info-v085 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;

      padding: 12px;

      border:
        1px solid
        rgba(255,255,255,.08);

      border-radius: 14px;

      background:
        rgba(8,14,20,.38);
    }


    .descarte-info-v085 > div {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }


    .descarte-info-v085 strong {
      font-size: .86rem;
      line-height: 1.2;
    }


    .descarte-info-v085 span {
      font-size: .72rem;
      line-height: 1.35;
      opacity: .68;
    }


    #descartarPlantaV085 {
      flex: 0 0 auto;

      min-height: 38px;

      padding:
        8px 12px;

      border:
        1px solid
        rgba(255,130,110,.25);

      border-radius:
        10px;

      background:
        rgba(110,35,30,.18);

      color:
        inherit;

      font-size:
        .74rem;

      font-weight:
        700;

      cursor:
        pointer;

      transition:
        transform .15s ease,
        background .15s ease;
    }


    #descartarPlantaV085:hover {
      transform:
        translateY(-1px);

      background:
        rgba(140,45,35,.28);
    }


    #descartarPlantaV085:active {
      transform:
        translateY(0);
    }


    @media (
      max-width: 640px
    ) {

      .descarte-info-v085 {
        align-items:
          stretch;

        flex-direction:
          column;
      }


      #descartarPlantaV085 {
        width:
          100%;
      }

    }

  `;


  document.head.appendChild(
    style
  );

}


/* ============================================================
   HOOK DOS EVENTOS
   ============================================================ */

const instalarEventosAnteriorV085 =
  instalarEventosV081;


instalarEventosV081 =
  function() {

    instalarEventosAnteriorV085();

    instalarBotaoDescarteV085();

  };


/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

garantirDescarteV085();

instalarCssDescarteV085();


if (
  ambienteAtualV081
  === "ESTACAO"
) {

  instalarBotaoDescarteV085();

}


console.log(
  "[A Plantinha] V0.8.5 — Descarte e Matéria Vegetal carregado."
);
