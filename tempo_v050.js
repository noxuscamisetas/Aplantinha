/*
==========================================================
A PLANTINHA — V0.5
TEMPO, DIA, NOITE E REPOUSO
==========================================================

1 ciclo = 6 horas.

00h = MADRUGADA
06h = MANHÃ
12h = TARDE
18h = NOITE

LUA ≠ SOMBRA.

Repouso afeta saúde atual.
Não altera DNA.
*/


function garantirTempoV050() {

  estado.tempo ??= {

    dia: 1,

    hora: 0,

    deficitRepouso: 0,

    escuroNoDia: 0,

    noitesSemEscuro: 0
  };


  /*
  Modo escolhido pelo jogador.

  AUTO:
  dia   -> luz natural
  noite -> lua

  SOMBRA:
  sombra apenas durante o dia;
  à noite continua sendo lua.

  LAMPADA_*:
  durante o dia continua natural;
  à noite usa a lâmpada.
  */

  estado.modoLuz ??= "AUTO";

}


function periodoAtualV050() {

  const hora =
    estado.tempo.hora;


  if (hora === 0) {
    return "MADRUGADA";
  }

  if (hora === 6) {
    return "MANHÃ";
  }

  if (hora === 12) {
    return "TARDE";
  }

  return "NOITE";

}


function ehNoiteV050() {

  return (
    estado.tempo.hora === 0
    ||
    estado.tempo.hora === 18
  );

}


function luzRealV050() {

  garantirTempoV050();


  const noite =
    ehNoiteV050();


  /*
  ========================================================
  NOITE
  ========================================================
  */

  if (noite) {

    if (
      estado.modoLuz ===
      "LAMPADA_FRACA"
      &&
      estado.inventario.LAMPADA_FRACA > 0
    ) {

      return "ARTIFICIAL_FRACA";

    }


    if (
      estado.modoLuz ===
      "LAMPADA_FORTE"
      &&
      estado.inventario.LAMPADA_FORTE > 0
    ) {

      return "ARTIFICIAL_FORTE";

    }


    return "LUA";

  }


  /*
  ========================================================
  DIA
  ========================================================
  */

  if (
    estado.modoLuz ===
    "SOMBRA"
  ) {

    return "SOMBRA";

  }


  /*
  Lâmpada não substitui o sol durante o dia
  nesta primeira implementação.
  */

  return "NATURAL";

}


/*
==========================================================
SELEÇÃO DE ILUMINAÇÃO
==========================================================
*/


function modosDisponiveisV050() {

  const modos = [
    "AUTO",
    "SOMBRA"
  ];


  if (
    estado.inventario.LAMPADA_FRACA > 0
  ) {

    modos.push(
      "LAMPADA_FRACA"
    );

  }


  if (
    estado.inventario.LAMPADA_FORTE > 0
  ) {

    modos.push(
      "LAMPADA_FORTE"
    );

  }


  return modos;

}


function mudarModoLuzV050() {

  const modos =
    modosDisponiveisV050();


  let indice =
    modos.indexOf(
      estado.modoLuz
    );


  if (indice === -1) {
    indice = 0;
  }


  estado.modoLuz =
    modos[
      (indice + 1)
      %
      modos.length
    ];


  log(
    `Iluminação configurada: ${nomeModoLuzV050()}.`
  );


  /*
  A luz exibida imediatamente acompanha
  o horário atual.
  */

  estado.luz =
    luzRealV050();


  salvar();

  render();

}


function nomeModoLuzV050() {

  const nomes = {

    AUTO:
      "Ciclo natural",

    SOMBRA:
      "Sombra durante o dia",

    LAMPADA_FRACA:
      "Lâmpada fraca à noite",

    LAMPADA_FORTE:
      "Lâmpada forte à noite"

  };


  return nomes[
    estado.modoLuz
  ];

}


/*
==========================================================
REPOUSO
==========================================================
*/


function registrarRepousoV050(
  luzUsada
) {

  if (
    !ehNoiteV050()
  ) {

    return;

  }


  if (
    luzUsada === "LUA"
  ) {

    estado.tempo.escuroNoDia++;

  }

}


/*
Avalia o dia depois que o ciclo das 18h termina.
*/

function fecharDiaV050() {

  const escuro =
    estado.tempo.escuroNoDia;


  /*
  ========================================================
  NOITE TOTALMENTE ILUMINADA
  ========================================================
  */

  if (
    escuro === 0
  ) {

    estado.tempo
      .noitesSemEscuro++;


    estado.tempo
      .deficitRepouso++;


    /*
    Primeiro dia sem escuro ainda não gera dano.
    Persistência começa a cobrar saúde.
    */

    if (
      estado.tempo.deficitRepouso >= 2
    ) {

      const dano =
        Math.min(
          1
          +
          estado.tempo.deficitRepouso,
          6
        );


      const antes =
        estado.saude;


      estado.saude =
        Math.max(
          0,
          estado.saude - dano
        );


      if (
        estado.saude !== antes
      ) {

        log(
          `Pouco repouso noturno: saúde ${antes}% → ${estado.saude}%.`
        );

      }

    }

  }


  /*
  ========================================================
  HOUVE ESCURO
  ========================================================
  */

  else {

    estado.tempo.deficitRepouso =
      Math.max(
        0,
        estado.tempo.deficitRepouso
        -
        escuro
      );

  }


  estado.tempo.escuroNoDia = 0;

}


/*
==========================================================
AVANÇO DO RELÓGIO
==========================================================
*/


function avancarTempoV050() {

  const horaAnterior =
    estado.tempo.hora;


  /*
  18h foi o último período do dia.
  */

  if (
    horaAnterior === 18
  ) {

    if (!estado.quartoV080) {
      fecharDiaV050();
    }

    estado.tempo.dia++;

    estado.tempo.hora = 0;

  }

  else {

    estado.tempo.hora += 6;

  }

}


/*
==========================================================
CICLO
==========================================================

Usamos o motor fisiológico V0.4.2 já validado.
*/


const cicloBaseV050 =
  document
    .querySelector(
      "#btnCiclo"
    )
    .onclick;


function cicloTempoV050() {

  garantirTempoV050();


  /*
  Determina a luz deste período.
  */

  const luzDoCiclo =
    luzRealV050();


  estado.luz =
    luzDoCiclo;


  /*
  Registra se este período noturno
  ofereceu escuridão.
  */

  registrarRepousoV050(
    luzDoCiclo
  );


  /*
  Executa exatamente o ciclo fisiológico
  já existente.
  */

  cicloBaseV050();


  /*
  Depois do ciclo, o relógio avança.
  */

  avancarTempoV050();


  /*
  Prepara a iluminação visual
  do próximo período.
  */

  estado.luz =
    luzRealV050();


  salvar();

  render();

}


/*
==========================================================
UI DO RELÓGIO
==========================================================
*/


function criarRelogioV050() {

  if (
    document.querySelector(
      "#relogioV050"
    )
  ) {

    return;

  }


  const ambiente =
    document.querySelector(
      "#ambiente"
    );


  if (!ambiente) {
    return;
  }


  const relogio =
    document.createElement(
      "div"
    );


  relogio.id =
    "relogioV050";


  relogio.className =
    "relogio-v050";


  relogio.innerHTML = `

    <div class="icone-tempo-v050">
      ☀️
    </div>

    <div>

      <strong id="horaV050">
        00:00
      </strong>

      <span id="periodoV050">
        MADRUGADA
      </span>

    </div>

    <div class="dia-v050">
      Dia
      <strong id="diaV050">
        1
      </strong>
    </div>

  `;


  ambiente.appendChild(
    relogio
  );

}


/*
==========================================================
CÉU
==========================================================
*/


function renderCeuV050() {

  const ambiente =
    document.querySelector(
      "#ambiente"
    );


  if (!ambiente) {
    return;
  }


  ambiente.classList.remove(
    "tempo-madrugada",
    "tempo-manha",
    "tempo-tarde",
    "tempo-noite"
  );


  const periodo =
    periodoAtualV050();


  if (
    periodo === "MADRUGADA"
  ) {

    ambiente.classList.add(
      "tempo-madrugada"
    );

  }


  if (
    periodo === "MANHÃ"
    ||
    periodo === "MANHA"
  ) {

    ambiente.classList.add(
      "tempo-manha"
    );

  }


  if (
    periodo === "TARDE"
  ) {

    ambiente.classList.add(
      "tempo-tarde"
    );

  }


  if (
    periodo === "NOITE"
  ) {

    ambiente.classList.add(
      "tempo-noite"
    );

  }

}


/*
==========================================================
RENDER
==========================================================
*/


function renderTempoV050() {

  garantirTempoV050();

  criarRelogioV050();


  const hora =
    document.querySelector(
      "#horaV050"
    );


  const periodo =
    document.querySelector(
      "#periodoV050"
    );


  const dia =
    document.querySelector(
      "#diaV050"
    );


  const icone =
    document.querySelector(
      ".icone-tempo-v050"
    );


  if (hora) {

    hora.textContent =
      `${String(
        estado.tempo.hora
      ).padStart(2, "0")}:00`;

  }


  if (periodo) {

    periodo.textContent =
      periodoAtualV050();

  }


  if (dia) {

    dia.textContent =
      estado.tempo.dia;

  }


  if (icone) {

    icone.textContent =
      ehNoiteV050()
      ? "🌙"
      : "☀️";

  }


  /*
  Botão mostra a configuração,
  e não apenas a luz instantânea.
  */

  const botaoLuz =
    document.querySelector(
      "#btnLuz"
    );


  if (botaoLuz) {

    botaoLuz.textContent =
      `💡 ${nomeModoLuzV050()}`;

  }


  renderCeuV050();

}


/*
==========================================================
ENVOLVE RENDER
==========================================================
*/


const renderBaseTempoV050 =
  render;


render =
  function() {

    garantirTempoV050();

    renderBaseTempoV050();

    renderTempoV050();

  };


/*
==========================================================
SUBSTITUI CONTROLES
==========================================================
*/


document
  .querySelector(
    "#btnCiclo"
  )
  .onclick =
    cicloTempoV050;


document
  .querySelector(
    "#btnLuz"
  )
  .onclick =
    mudarModoLuzV050;


/*
==========================================================
LUA NO MOTOR ANTIGO
==========================================================

O app.js original conhece NATURAL,
SOMBRA e luzes artificiais.

Adicionamos LUA com energia zero.
*/

luzValor.LUA = 0;


/*
Inicialização.
*/

garantirTempoV050();

estado.luz =
  luzRealV050();

salvar();

render();
