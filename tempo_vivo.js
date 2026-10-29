/* Um relógio para o mundo; impulso local apenas enquanto o jogador segura. */
const PERIODO_REAL_VIVO = 30000;
const IMPULSO_LOCAL_VIVO = 1;
const tempoVivo = { andando: false, timer: null, proximo: 0, impulso: null, vaso: null, planta: null, ultimoPulso: 0 };

function progressoDoCultivo(c) {
  const limites = [0, 2, 6, 12, 18];
  const fase = Math.max(0, estagios.indexOf(c.estagio));
  if (fase === 4) return { valor: c.producaoPronta ? 100 : Math.min(100, (c.ciclosDesdeColheita || 0) / 3 * 100), texto: c.producaoPronta ? 'Colheita pronta' : 'Até a próxima colheita' };
  return { valor: Math.max(0, Math.min(100, (c.desenvolvimento - limites[fase]) / (limites[fase + 1] - limites[fase]) * 100)), texto: `Até ${NOMES_ESTAGIOS_CULTIVO[estagios[fase + 1]]}` };
}

function atualizarProgressoVivo(alvo, c) {
  let bloco = alvo.querySelector('.progresso-cultivo-vivo');
  if (!bloco) {
    bloco = document.createElement('div'); bloco.className = 'progresso-cultivo-vivo';
    bloco.innerHTML = '<span></span><progress max="100"></progress>';
    alvo.append(bloco);
  }
  const p = progressoDoCultivo(c);
  bloco.querySelector('span').textContent = `${p.texto} · ${Math.round(p.valor)}%`;
  const barra = bloco.querySelector('progress'); barra.value = p.valor; barra.setAttribute('aria-label', p.texto);
}

function pararAceleracaoViva() {
  clearInterval(tempoVivo.impulso); tempoVivo.impulso = null;
  tempoVivo.vaso = null; tempoVivo.planta = null;
  document.querySelector('.cena-planta-v084')?.classList.remove('planta-acelerando');
  document.querySelector('#segurarAceleracao')?.setAttribute('aria-pressed', 'false');
}

function pausarTempoVivo() {
  tempoVivo.andando = false; clearTimeout(tempoVivo.timer); tempoVivo.timer = null;
  sessionStorage.setItem('aplantinha_pausa_tempo', '1');
  pararAceleracaoViva(); pararRegaV080(); atualizarPainelTempoVivo();
}

function agendarPeriodoVivo() {
  clearTimeout(tempoVivo.timer);
  if (!tempoVivo.andando || document.hidden) return;
  tempoVivo.proximo = Date.now() + PERIODO_REAL_VIVO;
  tempoVivo.timer = setTimeout(() => {
    tempoVivo.timer = null;
    if (!tempoVivo.andando || document.hidden) { pausarTempoVivo(); return; }
    cicloTempoV050();
    agendarPeriodoVivo(); atualizarPainelTempoVivo();
  }, PERIODO_REAL_VIVO);
}

function iniciarTempoVivo() {
  if (tempoVivo.andando || document.hidden) return;
  sessionStorage.removeItem('aplantinha_pausa_tempo');
  tempoVivo.andando = true; agendarPeriodoVivo(); atualizarPainelTempoVivo();
}

function iniciarAceleracaoViva(vasoId) {
  if (tempoVivo.impulso || !cultivoDoVaso(vasoId) || !tempoVivo.andando) return;
  tempoVivo.vaso = vasoId; tempoVivo.planta = cultivoDoVaso(vasoId); tempoVivo.ultimoPulso = performance.now();
  tempoVivo.impulso = setInterval(() => {
    const c = cultivoDoVaso(vasoId);
    if (document.hidden || !tempoVivo.andando || ambienteAtualV081 !== 'ESTACAO' || vasoSelecionadoV081 !== vasoId || c !== tempoVivo.planta) { pararAceleracaoViva(); return; }
    const agora = performance.now();
    // Sem compensação de atrasos: conta somente o tempo efetivamente segurado.
    const fracao = Math.min(1000, Math.max(0, agora - tempoVivo.ultimoPulso)) * IMPULSO_LOCAL_VIVO / PERIODO_REAL_VIVO;
    tempoVivo.ultimoPulso = agora;
    const fase = c.estagio; const pronta = c.producaoPronta;
    const aguaAntes = classeAguaV080(c.umidade);
    const saudeAntes = c.saude >= 60 ? 2 : c.saude >= 30 ? 1 : 0;
    c.velocidade = 1;
    processarCultivoV080(c, tempoGlobalV080(), { fracao, local: true });
    c.tempoAcelerado = (c.tempoAcelerado || 0) + fracao;
    if (c.estagio !== fase) registrarMudancaCultivo({id:vasoId,cultivo:c}, fase, tempoGlobalV080());
    sincronizarTodasV083(); salvar();
    if (c.estagio !== fase || pronta !== c.producaoPronta || aguaAntes !== classeAguaV080(c.umidade)
      || saudeAntes !== (c.saude >= 60 ? 2 : c.saude >= 30 ? 1 : 0)) render();
    else atualizarInterfaceTempoVivo();
  }, 500);
  atualizarInterfaceTempoVivo();
}

function ligarBotaoSegurar(botao, iniciar, parar) {
  botao.onpointerdown = e => { if (e.button !== 0) return; e.preventDefault(); iniciar(); };
  botao.onkeydown = e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); iniciar(); } };
  botao.onkeyup = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); parar(); } };
  botao.onclick = e => e.preventDefault();
}

function atualizarPainelTempoVivo() {
  let painel = document.querySelector('#painelTempoVivo');
  if (!painel) {
    painel = document.createElement('section'); painel.id = 'painelTempoVivo';
    painel.innerHTML = '<div><strong>🕰️ Tempo do mundo</strong><span id="estadoTempoVivo" role="status"></span></div><button type="button" id="alternarTempoVivo"></button><button type="button" id="avancarPeriodoV084">Avançar um período</button><div class="trilha-tempo-vivo" aria-hidden="true"><i></i></div>';
    document.querySelector('#atalhoCaderno').after(painel);
  }
  const tempo = tempoGlobalV080();
  painel.querySelector('#estadoTempoVivo').textContent = `Dia ${tempo.dia} · ${String(tempo.hora).padStart(2,'0')}h · ${tempoVivo.andando ? 'O mundo está vivendo' : 'Tempo pausado'}`;
  const botao = painel.querySelector('#alternarTempoVivo');
  botao.textContent = tempoVivo.andando ? '⏸ Pausar mundo' : '▶ Continuar mundo';
  botao.onclick = () => tempoVivo.andando ? pausarTempoVivo() : iniciarTempoVivo();
  painel.querySelector('#avancarPeriodoV084').onclick = () => { pausarTempoVivo(); cicloTempoV050(); };
  painel.classList.toggle('tempo-andando', tempoVivo.andando);
  const barra = painel.querySelector('.trilha-tempo-vivo i');
  const agenda = String(tempoVivo.andando ? tempoVivo.proximo : 0);
  if (barra.dataset.agenda !== agenda) {
    const nova = barra.cloneNode(false); nova.dataset.agenda = agenda;
    nova.style.animationDuration = `${PERIODO_REAL_VIVO}ms`;
    nova.style.animationDelay = `${-Math.max(0, PERIODO_REAL_VIVO - (tempoVivo.proximo - Date.now()))}ms`;
    barra.replaceWith(nova);
  }
}

function atualizarInterfaceTempoVivo() {
  // A barra manual antiga e as velocidades fixas dão lugar à ação de segurar.
  document.querySelector('.controles-estacao-v084 #avancarPeriodoV084')?.remove();
  document.querySelector('.velocidades-v084')?.closest('.controle-bloco-v084')?.remove();
  const c = ambienteAtualV081 === 'ESTACAO' ? cultivoDoVaso(vasoSelecionadoV081) : null;
  if (c) {
    const cena = document.querySelector('.cena-planta-v084');
    let marcador = cena.querySelector('.relogio-planta-vivo');
    if (!marcador) { marcador = document.createElement('span'); marcador.className = 'relogio-planta-vivo'; marcador.setAttribute('aria-hidden','true'); marcador.textContent = '◷'; cena.append(marcador); }
    cena.classList.toggle('planta-acelerando', tempoVivo.vaso === vasoSelecionadoV081);
    atualizarProgressoVivo(cena, c);
    let area = document.querySelector('#aceleracaoLocalViva');
    if (!area) {
      area = document.createElement('section'); area.id = 'aceleracaoLocalViva'; area.className = 'controle-bloco-v084';
      area.innerHTML = '<button type="button" id="segurarAceleracao" aria-pressed="false">⏩ Segure para acelerar</button><p>Acelera só esta planta e seu consumo de água. Solte para voltar ao ritmo normal.</p>';
      cena.append(area);
    }
    const botao = area.querySelector('button');
    botao.disabled = !tempoVivo.andando;
    botao.setAttribute('aria-pressed', String(tempoVivo.vaso === vasoSelecionadoV081));
    ligarBotaoSegurar(botao, () => iniciarAceleracaoViva(vasoSelecionadoV081), pararAceleracaoViva);
    const valores = [c.umidade, c.saude, c.energia, c.desenvolvimento];
    document.querySelectorAll('.metricas-estacao-v084 strong').forEach((el,i) => { if (i < 4) el.textContent = `${Math.round(valores[i] * 10) / 10}${i < 2 ? '%' : ''}`; });
    atualizarAguaEstacaoV081();
  }
  for (const el of document.querySelectorAll('[data-modulo-v081].modulo-ativo-v081')) {
    const planta = cultivoDoVaso(Number(el.dataset.moduloV081));
    if (planta) atualizarProgressoVivo(el, planta);
  }
  for (const el of document.querySelectorAll('[data-planta-jardim-v088]')) {
    const planta = cultivoDoVaso(-Number(el.dataset.plantaJardimV088));
    if (planta) atualizarProgressoVivo(el, planta);
  }
  atualizarModalJardimVivo(); atualizarPainelTempoVivo();
}

abrirPlantaJardimV088 = function(slotId) {
  const c = cultivoDoVaso(-slotId); if (!c) return;
  document.querySelector('#modalPlantaJardimV088')?.remove();
  const modal = document.createElement('dialog'); modal.id = 'modalPlantaJardimV088'; modal.className = 'jardim-vivo-modal'; modal.dataset.slot = slotId;
  modal.innerHTML = '<header><h2></h2><button type="button" id="fecharPlantaJardimV088" aria-label="Fechar planta do Jardim">✕</button></header><p>Área externa · a planta acompanha o dia e a noite.</p><div class="palco-jardim-vivo"><div class="planta-v084"></div><div class="vaso-estacao-v084"><div class="terra-estacao-v084"></div></div></div><p class="estado-planta-jardim"></p><div class="progresso-jardim-vivo"></div><div class="acoes-jardim-vivo"><button type="button" id="regarJardimVivo">💧 Segure para regar</button><button type="button" id="colherJardimVivo">🌼 Colher</button><button type="button" id="sementeJardimVivo">🧬 Gerar Semente-DNA</button><button type="button" id="trazerLaboratorioV088">🪴 Trazer para o laboratório</button></div>';
  modal.querySelector('h2').textContent = `Jardim ${slotId} · ${nomeCultivoJardimV088(c)}`;
  modal.querySelector('#fecharPlantaJardimV088').onclick = () => { pararRegaV080(); modal.remove(); };
  modal.addEventListener('cancel', pararRegaV080);
  ligarBotaoSegurar(modal.querySelector('#regarJardimVivo'), () => iniciarRegaV080(-slotId), pararRegaV080);
  modal.querySelector('#colherJardimVivo').onclick = () => { colherCultivo(-slotId); atualizarModalJardimVivo(); };
  modal.querySelector('#sementeJardimVivo').onclick = () => { gerarSementeDoCultivo(-slotId); atualizarModalJardimVivo(); };
  modal.querySelector('#trazerLaboratorioV088').onclick = () => { pararRegaV080(); modal.remove(); abrirEscolhaVasoRetornoV088(slotId); };
  document.body.append(modal); atualizarModalJardimVivo(); modal.showModal();
};

function atualizarModalJardimVivo() {
  const modal = document.querySelector('.jardim-vivo-modal'); if (!modal) return;
  const c = cultivoDoVaso(-Number(modal.dataset.slot)); if (!c) { modal.remove(); return; }
  modal.querySelector('.planta-v084').innerHTML = htmlPlantaProceduralV083(c.plantaV083 || retratoParaCaderno(c));
  modal.querySelector('.estado-planta-jardim').textContent = `${NOMES_ESTAGIOS_CULTIVO[c.estagio]} · Água ${Math.round(c.umidade)}% · Saúde ${Math.round(c.saude)}%`;
  atualizarProgressoVivo(modal.querySelector('.progresso-jardim-vivo'), c);
  modal.querySelector('#colherJardimVivo').disabled = c.estagio !== 'MADURA' || !c.producaoPronta || c.saude < 30;
  modal.querySelector('#sementeJardimVivo').disabled = c.estagio !== 'MADURA' || c.sementeDnaGerada || c.saude < 40;
  modal.querySelector('#sementeJardimVivo').textContent = c.sementeDnaGerada ? '🧬 Semente-DNA já fornecida' : '🧬 Gerar Semente-DNA';
}

const sincronizarAntesTempoVivo = sincronizarTodasV083;
sincronizarTodasV083 = function() {
  sincronizarAntesTempoVivo();
  for (const slot of estado.jardimV088?.slots || []) if (slot.cultivo) sincronizarCultivoParaPlantaV083({id:-slot.id,cultivo:slot.cultivo});
};
const barraAntesTempoVivo = atualizarBarraVasoV080;
atualizarBarraVasoV080 = function(id) { barraAntesTempoVivo(id); atualizarModalJardimVivo(); };
const renderAntesTempoVivo = render;
render = function() { renderAntesTempoVivo(); atualizarInterfaceTempoVivo(); };
const ambienteAntesTempoVivo = renderLaboratorioV081;
renderLaboratorioV081 = function() { ambienteAntesTempoVivo(); atualizarInterfaceTempoVivo(); };

document.addEventListener('pointerup', () => { pararAceleracaoViva(); pararRegaV080(); });
document.addEventListener('pointercancel', () => { pararAceleracaoViva(); pararRegaV080(); });
document.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') pararAceleracaoViva(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) pausarTempoVivo(); });
window.addEventListener('pagehide', pausarTempoVivo);
window.addEventListener('blur', () => { pararAceleracaoViva(); pararRegaV080(); });
document.querySelector('#btnNovoJogo')?.addEventListener('click', pausarTempoVivo, {capture:true});
// A velocidade antiga era fixa. Agora somente segurar concede o impulso local.
for (const vaso of estado.quartoV080?.vasos || []) if (vaso.cultivo) { vaso.cultivo.velocidade = 1; vaso.cultivo.localAtual = 'VASO'; }
for (const slot of estado.jardimV088?.slots || []) if (slot.cultivo) { slot.cultivo.velocidade = 1; slot.cultivo.localAtual = 'JARDIM'; slot.congeladoEm = null; }
sincronizarTodasV083(); salvar(); render();
if (sessionStorage.getItem('aplantinha_pausa_tempo') !== '1') iniciarTempoVivo();
