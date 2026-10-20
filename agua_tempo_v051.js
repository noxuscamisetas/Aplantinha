/*
==========================================================
A PLANTINHA — V0.5.1
ÁGUA × CICLO DIA/NOITE
==========================================================

Corrige a evaporação para o universo com tempo.

LUA reduz perda de água.
Lâmpada forte aumenta perda.
*/


consumirAgua = function() {

  const solo =
    solos[
      estado.solo
    ];


  let consumo =
    solo.consumoAgua;


  /*
  DNA de vigor alto tem metabolismo maior.
  Custo moderado.
  */

  consumo +=
    Math.max(
      0,
      estado.dna.vigor - 1
    )
    * 1.5;


  /*
  ========================================================
  LUZ / HORÁRIO
  ========================================================
  */


  if (
    estado.luz === "LUA"
  ) {

    consumo -= 4;

  }


  if (
    estado.luz === "SOMBRA"
  ) {

    consumo -= 2;

  }


  if (
    estado.luz ===
    "ARTIFICIAL_FRACA"
  ) {

    consumo += 0;

  }


  if (
    estado.luz ===
    "ARTIFICIAL_FORTE"
  ) {

    consumo += 2;

  }


  consumo =
    Math.max(
      2,
      Math.round(consumo)
    );


  estado.umidade =
    Math.max(
      0,
      estado.umidade - consumo
    );

};
