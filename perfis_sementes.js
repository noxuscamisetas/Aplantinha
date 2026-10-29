/* Perfis v1: diferenças ambientais por DNA, sem depender da cor ancestral. */
function geneCultivo(cultivo, chave) {
  const valor = Number(cultivo.dna?.[chave]);
  return Number.isFinite(valor) ? Math.max(0, Math.min(3, valor)) : 0;
}

function luzEfetivaCultivo(cultivo, tempo) {
  if (tempo.luz !== 'SOL') return 'LUA';
  return cultivo.luzAmbiente === 'SOMBRA' ? 'SOMBRA' : 'NATURAL';
}

function desenvolvimentoDoPerfil(cultivo, tempo, solo) {
  if (cultivo.saude <= 0) return 0;
  const luz = luzEfetivaCultivo(cultivo, tempo);
  const vigor = .8 + .2 * geneCultivo(cultivo, 'vigor');
  const iluminacao = luz === 'SOMBRA' ? .4 + .4 * geneCultivo(cultivo, 'sombra') : luz === 'LUA' ? .75 : 1;
  const agua = cultivo.umidade < 20 ? .25 + .15 * geneCultivo(cultivo, 'seca') : cultivo.umidade < 30 || cultivo.umidade > 85 ? .7 : 1;
  const saude = cultivo.saude < 30 ? .35 : cultivo.saude < 60 ? .7 : 1;
  return vigor * iluminacao * agua * saude * (solo.crescimento / 2);
}

function exposicoesParaAdaptar(cultivo) {
  return geneCultivo(cultivo, 'plasticidade') > 0 ? 2 : 3;
}

function descricaoPerfilSemente(base) {
  return {
    S1: 'Equilibrada: vigor moderado, pede regas regulares.',
    S2: 'Vigorosa: cresce mais rápido com boa luz e água, mas bebe mais.',
    S3: 'Afinidade com sombra: aproveita melhor a pouca luz durante o dia.',
    S4: 'Resistente à seca: perde menos saúde e cresce melhor quando falta água.',
    S5: 'Adaptável: responde a mudanças de luz e transmite adaptações com menos exposições.'
  }[base] || '';
}
