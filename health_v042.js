/*
==========================================================
A PLANTINHA — V0.4.2
SAÚDE, COLAPSO E PRODUÇÃO
==========================================================

Mudanças principais:

1. Excesso de água causa dano mais suave.
2. Saúde 0 não significa morte.
3. Saúde muito baixa = COLAPSO.
4. Planta em colapso não cresce.
5. Planta muito debilitada não produz.
6. Semente-DNA exige saúde mínima.
7. Quantidade de frutos/flores depende também da saúde.
*/


function garantirSaudeV042() {

  if (
    estado.saude === undefined
    ||
    estado.saude === null
  ) {
    estado.saude = 100;
  }


  estado.estresseAtual ??= {
    secaConsecutiva: 0,
    excessoConsecutivo: 0,
    adequadoConsecutivo: 0
  };


  estado.estadoSaudeAnterior ??=
    classificarSaudeV042(
      estado.saude
    );

}


function classificarSaudeV042(
  saude
) {

  if (
    saude >= 80
  ) {
    return "SAUDAVEL";
  }


  if (
    saude >= 55
  ) {
    return "ATENCAO";
  }


  if (
    saude >= 30
  ) {
    return "FRAGIL";
  }


  if (
    saude > 0
  ) {
    return "CRITICA";
  }


  return "COLAPSO";

}


function limitarV042(
  valor,
  minimo,
  maximo
) {

  return Math.max(
    minimo,
    Math.min(
      maximo,
      valor
    )
  );

}


function atualizarSaudeV042(
  regime,
  solo
) {

  garantirSaudeV042();


  let dano = 0;
  let recuperacao = 0;


  /*
  ========================================================
  CONDIÇÃO ADEQUADA
  ========================================================
  */

  if (
    regime === "ADEQUADA"
  ) {

    estado.estresseAtual
      .secaConsecutiva = 0;

    estado.estresseAtual
      .excessoConsecutivo = 0;

    estado.estresseAtual
      .adequadoConsecutivo++;


    recuperacao =
      2
      +
      solo.nutricao;


    if (
      estado.estresseAtual
        .adequadoConsecutivo >= 3
    ) {

      recuperacao += 1;

    }


    /*
    Planta em colapso consegue se recuperar,
    mas lentamente.
    */

    if (
      estado.saude === 0
    ) {

      recuperacao =
        Math.max(
          1,
          recuperacao - 2
        );

    }

  }


  /*
  ========================================================
  SECA
  ========================================================
  */

  if (
    regime === "SECA"
  ) {

    estado.estresseAtual
      .secaConsecutiva++;

    estado.estresseAtual
      .excessoConsecutivo = 0;

    estado.estresseAtual
      .adequadoConsecutivo = 0;


    const sequencia =
      estado.estresseAtual
        .secaConsecutiva;


    dano =
      2
      +
      Math.max(
        0,
        sequencia - 1
      ) * 3;


    if (
      estado.umidade === 0
    ) {

      dano += 2;

    }

  }


  /*
  ========================================================
  EXCESSO DE ÁGUA
  ========================================================

  Mais suave que na V0.4.1.

  O primeiro ciclo encharcado praticamente
  não machuca.

  Persistência é que passa a causar problema.
  */

  if (
    regime === "EXCESSO"
  ) {

    estado.estresseAtual
      .excessoConsecutivo++;

    estado.estresseAtual
      .secaConsecutiva = 0;

    estado.estresseAtual
      .adequadoConsecutivo = 0;


    const sequencia =
      estado.estresseAtual
        .excessoConsecutivo;


    if (
      sequencia === 1
    ) {

      dano = 0;

    }

    else {

      dano =
        1
        +
        Math.floor(
          (sequencia - 2) / 2
        );

    }

  }


  const saudeAntes =
    estado.saude;


  estado.saude =
    limitarV042(
      estado.saude
      - dano
      + recuperacao,
      0,
      100
    );


  const classificacao =
    classificarSaudeV042(
      estado.saude
    );


  if (
    dano >= 4
  ) {

    log(
      `Estresse ambiental: saúde ${saudeAntes}% → ${estado.saude}%.`
    );

  }


  if (
    classificacao !==
    estado.estadoSaudeAnterior
  ) {

    log(
      `Condição da planta: ${classificacao}.`
    );

    estado.estadoSaudeAnterior =
      classificacao;

  }


  return {
    dano,
    recuperacao,
    classificacao
  };

}


/*
==========================================================
CICLO V0.4.2
==========================================================
*/


function cicloSaudeV042() {

  garantirSaudeV042();


  estado.idade++;


  consumirAgua();


  const solo =
    solos[
      estado.solo
    ];


  const agua =
    regimeAgua();


  atualizarSaudeV042(
    agua,
    solo
  );


  let ganho =
    solo.crescimento;


  /*
  ========================================================
  SOLO
  ========================================================
  */

  if (
    solo.nutricao >= 2
  ) {

    estado.contadoresVida
      .soloRico++;

    log(
      "Solo rico influenciando a planta."
    );

  }


  /*
  ========================================================
  ÁGUA
  ========================================================
  */

  if (
    agua === "ADEQUADA"
  ) {

    ganho += 2;

  }


  if (
    agua === "EXCESSO"
  ) {

    ganho +=
      solo.retencao - 1;


    estado.contadoresVida
      .excessoAgua++;


    log(
      "O solo está encharcado."
    );

  }


  if (
    agua === "SECA"
  ) {

    ganho -= 4;


    estado.contadoresVida
      .seca++;


    log(
      "A planta passou por seca."
    );


    ganho +=
      estado.dna.seca;

  }


  /*
  ========================================================
  LUZ
  ========================================================
  */

  ganho +=
    luzValor[
      estado.luz
    ];


  if (
    estado.luz === "SOMBRA"
  ) {

    ganho +=
      estado.dna.sombra;


    estado.contadoresVida
      .sombra++;

  }


  if (
    estado.luz ===
    "ARTIFICIAL_FORTE"
  ) {

    estado.contadoresVida
      .luzForte++;

  }


  /*
  ========================================================
  DNA
  ========================================================
  */

  ganho +=
    estado.dna.vigor;


  /*
  ========================================================
  SAÚDE MODULA CRESCIMENTO
  ========================================================
  */

  if (
    estado.saude < 60
  ) {

    ganho -= 2;

  }


  if (
    estado.saude < 30
  ) {

    ganho -= 2;

  }


  /*
  ========================================================
  COLAPSO
  ========================================================
  */

  if (
    estado.saude === 0
  ) {

    ganho = 0;


    if (
      estado.producaoPronta
    ) {

      estado.producaoPronta =
        false;

    }

  }


  estado.energia +=
    Math.max(
      0,
      ganho
    );


  atualizarEstagio();


  /*
  ========================================================
  VIDA ADULTA
  ========================================================
  */

  if (
    estado.estagio === "MADURA"
  ) {

    /*
    Saúde abaixo de 30 impede produção.
    */

    if (
      estado.saude < 30
    ) {

      estado.producaoPronta =
        false;

      estado.ciclosDesdeColheita =
        0;

    }


    else if (
      !estado.producaoPronta
    ) {

      estado.ciclosDesdeColheita++;


      if (
        estado.ciclosDesdeColheita
        >= 3
      ) {

        estado.producaoPronta =
          true;


        estado.ciclosDesdeColheita =
          0;


        log(
          "A planta produziu novamente."
        );

      }

    }

  }


  log(
    `Ciclo ${estado.idade} — ${estado.luz}, umidade ${estado.umidade}%, saúde ${estado.saude}%`
  );


  salvar();

  render();

}


/*
==========================================================
COLHEITA V0.4.2
==========================================================
*/


function colherSaudeV042() {

  garantirSaudeV042();


  if (
    estado.estagio !==
    "MADURA"
  ) {

    log(
      "A planta ainda não está madura."
    );

    render();

    return;

  }


  if (
    estado.saude < 30
  ) {

    log(
      "A planta está debilitada demais para produzir."
    );

    render();

    return;

  }


  if (
    !estado.producaoPronta
  ) {

    log(
      "Ainda não há nova produção."
    );

    render();

    return;

  }


  let frutos = 0;
  let flores = 0;


  /*
  ========================================================
  PRODUÇÃO BASE
  ========================================================
  */

  if (
    regimeAgua() === "ADEQUADA"
  ) {

    frutos++;

  }


  if (
    estado.dna.vigor >= 2
  ) {

    frutos++;

  }


  if (
    estado.luz === "NATURAL"
    ||
    estado.luz ===
    "ARTIFICIAL_FORTE"
  ) {

    flores++;

  }


  if (
    estado.luz === "SOMBRA"
    &&
    estado.dna.sombra >= 2
  ) {

    flores++;

  }


  /*
  ========================================================
  SAÚDE MODIFICA PRODUTIVIDADE
  ========================================================
  */

  if (
    estado.saude < 55
  ) {

    frutos =
      Math.max(
        0,
        frutos - 1
      );

  }


  if (
    estado.saude < 45
  ) {

    flores =
      Math.max(
        0,
        flores - 1
      );

  }


  estado.inventario.FRUTO +=
    frutos;


  estado.inventario.FLOR +=
    flores;


  estado.producaoPronta =
    false;


  estado.ciclosDesdeColheita =
    0;


  log(
    `Colheita: ${frutos} fruto(s), ${flores} flor(es). Saúde: ${estado.saude}%.`
  );


  salvar();

  render();

}


/*
==========================================================
SEMENTE-DNA V0.4.2
==========================================================
*/


function gerarSementeDNASaudeV042() {

  garantirSaudeV042();


  if (
    estado.estagio !==
    "MADURA"
  ) {

    log(
      "A planta ainda não está madura."
    );

    render();

    return;

  }


  /*
  Uma planta precisa estar razoavelmente
  recuperada para fornecer Semente-DNA.
  */

  if (
    estado.saude < 40
  ) {

    log(
      "A planta precisa recuperar saúde antes de fornecer Semente-DNA."
    );

    render();

    return;

  }


  if (
    estado.sementeDnaGerada
  ) {

    log(
      "Esta planta já forneceu sua Semente-DNA."
    );

    render();

    return;

  }


  const novoDNA =
    structuredClone(
      estado.dna
    );


  const alteracoes = [];


  if (
    estado.contadoresVida.sombra >= 3
    &&
    novoDNA.sombra < 3
  ) {

    novoDNA.sombra++;

    alteracoes.push(
      "ADAPTACAO_SOMBRA"
    );

  }


  if (
    estado.contadoresVida.seca >= 3
    &&
    novoDNA.seca < 3
  ) {

    novoDNA.seca++;

    alteracoes.push(
      "ADAPTACAO_SECA"
    );

  }


  estado.sementeDNA = {

    sementeBase:
      estado.sementeBase,

    geracao:
      estado.geracao + 1,

    dna:
      novoDNA,

    alteracoes,

    historiaMae: {

      idade:
        estado.idade,

      saudeFinal:
        estado.saude,

      sombra:
        estado.contadoresVida.sombra,

      seca:
        estado.contadoresVida.seca,

      soloRico:
        estado.contadoresVida.soloRico,

      excessoAgua:
        estado.contadoresVida.excessoAgua,

      luzForte:
        estado.contadoresVida.luzForte

    }

  };


  estado.sementeDnaGerada =
    true;


  if (
    alteracoes.length
  ) {

    log(
      "Semente-DNA produzida: "
      +
      alteracoes.join(", ")
    );

  }

  else {

    log(
      "Semente-DNA produzida sem alteração hereditária."
    );

  }


  salvar();

  render();

}


/*
==========================================================
UI
==========================================================
*/


function criarUISaudeV042() {

  if (
    document.querySelector(
      "#saudeValor"
    )
  ) {

    return;

  }


  const grid =
    document.querySelector(
      ".grid-info"
    );


  if (!grid) {

    return;

  }


  const saude =
    document.createElement(
      "div"
    );


  saude.className =
    "celula-saude-v042";


  saude.innerHTML = `
    <span>Saúde</span>

    <strong id="saudeValor">
      100%
    </strong>

    <div class="barra-saude-v041">

      <div
        id="barraSaudeV042"
        class="barra-saude-preenchimento-v041"
      ></div>

    </div>
  `;


  const condicao =
    document.createElement(
      "div"
    );


  condicao.innerHTML = `
    <span>Condição</span>

    <strong id="condicaoSaudeV042">
      SAUDÁVEL
    </strong>
  `;


  grid.appendChild(
    saude
  );


  grid.appendChild(
    condicao
  );

}


function renderSaudeV042() {

  garantirSaudeV042();


  criarUISaudeV042();


  const valor =
    document.querySelector(
      "#saudeValor"
    );


  const barra =
    document.querySelector(
      "#barraSaudeV042"
    );


  const condicao =
    document.querySelector(
      "#condicaoSaudeV042"
    );


  if (
    valor
  ) {

    valor.textContent =
      `${estado.saude}%`;

  }


  if (
    barra
  ) {

    barra.style.width =
      `${estado.saude}%`;

  }


  const classe =
    classificarSaudeV042(
      estado.saude
    );


  if (
    condicao
  ) {

    condicao.textContent =
      classe;

  }


  const visual =
    document.querySelector(
      "#plantaVisual"
    );


  if (
    visual
  ) {

    visual.classList.remove(
      "saude-atencao",
      "saude-fragil",
      "saude-critica",
      "saude-colapso"
    );


    if (
      classe === "ATENCAO"
    ) {

      visual.classList.add(
        "saude-atencao"
      );

    }


    if (
      classe === "FRAGIL"
    ) {

      visual.classList.add(
        "saude-fragil"
      );

    }


    if (
      classe === "CRITICA"
    ) {

      visual.classList.add(
        "saude-critica"
      );

    }


    if (
      classe === "COLAPSO"
    ) {

      visual.classList.add(
        "saude-colapso"
      );

    }

  }


  const card =
    document.querySelector(
      ".celula-saude-v042"
    );


  if (
    card
  ) {

    card.dataset.saude =
      classe;

  }

}


/*
==========================================================
ENVOLVE O RENDER EXISTENTE
==========================================================
*/


const renderBaseV042 =
  render;


render =
  function() {

    garantirSaudeV042();

    renderBaseV042();

    renderSaudeV042();

  };


/*
==========================================================
SUBSTITUI AÇÕES ANTIGAS
==========================================================
*/


document
  .querySelector(
    "#btnCiclo"
  )
  .onclick =
    cicloSaudeV042;


document
  .querySelector(
    "#btnColher"
  )
  .onclick =
    colherSaudeV042;


document
  .querySelector(
    "#btnSementeDNA"
  )
  .onclick =
    gerarSementeDNASaudeV042;


/*
==========================================================
INICIALIZA
==========================================================
*/


garantirSaudeV042();

salvar();

render();
