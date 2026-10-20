/* Acessos do mundo e desenho botânico, sem alterar as regras dos cultivos. */
abrirArmarioV081 = function() { renderArmazenamentoV086(); };

const acessoBancada = document.createElement('button');
acessoBancada.id = 'abrirBancada';
acessoBancada.type = 'button';
acessoBancada.textContent = '🧪 Bancada';
acessoBancada.onclick = irBancadaV081;
document.querySelector('#atalhoCaderno').append(acessoBancada);

const dialogoLoja = document.createElement('dialog');
dialogoLoja.id = 'dialogoLoja';
dialogoLoja.innerHTML = '<button type="button" id="fecharLoja">← Voltar ao cultivo</button><p class="saldo-loja" role="status"></p>';
document.body.append(dialogoLoja);
dialogoLoja.append(document.querySelector('.loja-card'));
dialogoLoja.querySelector('#fecharLoja').onclick = () => dialogoLoja.close();
const iconesLoja = { SOLO_COMUM: '🪴', SOLO_MINERAL: '🪨', SOLO_ORGANICO: '🍂', LAMPADA_FRACA: '💡', LAMPADA_FORTE: '🔆' };
dialogoLoja.querySelectorAll('[data-compra]').forEach(botao => {
  const icone = document.createElement('span');
  icone.className = 'icone-produto';
  icone.setAttribute('aria-hidden', 'true');
  icone.textContent = iconesLoja[botao.dataset.compra];
  botao.prepend(icone);
});
function atualizarSaldoLoja() {
  dialogoLoja.querySelector('.saldo-loja').textContent = `🪙 Você tem ${estado.moedas} moedas`;
}
document.querySelector('#abrirLoja').onclick = () => { atualizarSaldoLoja(); dialogoLoja.showModal(); };
const renderAntesInterfaceCultivo = render;
render = function() { renderAntesInterfaceCultivo(); atualizarSaldoLoja(); };

const bancadaAntesInterfaceCultivo = htmlBancadaV081;
htmlBancadaV081 = function() {
  return bancadaAntesInterfaceCultivo().replace(
    /Continue cultivando e descobrindo materiais\.[\s\S]*?suficientes para iniciar experimentos\./,
    'Aqui você pode guardar e retirar materiais no armário. Os experimentos ainda estão em preparação.'
  );
};

htmlPlantaProceduralV083 = function(planta) {
  if (!planta) return '<div class="planta-v083-vazia">🪴</div>';
  const visual = aparenciaPlantaV083(planta);
  const estagio = planta.estagio || 'SEMENTE';
  const fase = Math.max(0, ['SEMENTE', 'GERMINACAO', 'BROTO', 'JOVEM', 'MADURA'].indexOf(estagio));
  const vigor = Math.max(0, Math.min(5, Number(planta.dna?.vigor) || 0));
  const sombra = Math.max(0, Math.min(5, Number(planta.dna?.sombra) || 0));
  const seca = Math.max(0, Math.min(5, Number(planta.dna?.seca) || 0));
  const topo = [239, 198, 148, 80, 28][fase];
  const inclinacao = (sombra - vigor) * 1.8;
  const xCaule = y => 120 + inclinacao * Math.sin((242 - y) / 214 * Math.PI);
  let desenho = '';
  if (fase === 0) {
    desenho = '<ellipse class="semente-botanica" cx="120" cy="239" rx="11" ry="7" transform="rotate(-18 120 239)"/><path d="M115 234 Q123 238 125 243" fill="none" stroke="#d0ae77" stroke-width="2"/>';
  } else {
    desenho = `<path class="caule-botanico" d="M120 248 Q${120 + inclinacao * 2} 139 120 ${topo}" fill="none" stroke="#537344" stroke-width="${3.5 + vigor * .45}" stroke-linecap="round"/>`;
    const pares = [0, 1, 2, 3, Math.min(5, 3 + Math.floor(visual.folhas / 3))][fase];
    for (let par = 0; par < pares; par++) {
      const y = 222 - par * ((220 - topo) / Math.max(1, pares));
      const x = xCaule(y);
      for (const lado of [-1, 1]) {
        const largura = (fase === 1 ? 23 : 38 + vigor * 3 + sombra * 2) * (1 - par * .07);
        const altura = (fase === 1 ? 12 : 19 + sombra * 2 - seca) * (1 - par * .05);
        const subida = fase === 1 ? 12 : 21 + par * 2;
        desenho += `<g class="ramo-botanico" transform="translate(${x} ${y}) scale(${lado} 1)">
          <path d="M0 0 Q8 -1 14 -8" fill="none" stroke="#608047" stroke-width="2.7" stroke-linecap="round"/>
          <path class="folha-botanica" d="M12 -7 C${largura * .45} ${-altura - subida}, ${largura} ${-altura - subida}, ${largura + 14} ${-subida} C${largura} ${altura - subida}, 25 1, 12 -7Z" fill="var(--cor-folha)" stroke="#426638" stroke-width="1.2"/>
          <path d="M14 -8 Q${largura * .65} ${-subida} ${largura + 10} ${-subida}" fill="none" stroke="#d4dea1" stroke-width="1.2" opacity=".7"/>
        </g>`;
      }
    }
    desenho += `<path d="M120 ${topo + 12} Q103 ${topo - 3} 119 ${Math.max(8, topo - 12)} Q135 ${topo} 120 ${topo + 12}" fill="var(--cor-folha)" stroke="#426638" stroke-width="1.2"/>`;
    if (planta.producaoPronta) {
      desenho += `<g class="producao-botanica"><path d="M120 90 Q145 87 151 111" fill="none" stroke="#608047" stroke-width="2"/><circle cx="151" cy="116" r="10" fill="#d58a49" stroke="#ad6135" stroke-width="1.5"/><circle cx="148" cy="112" r="2.5" fill="#ffe4a0"/>
        <path d="M120 62 Q99 56 91 69" fill="none" stroke="#608047" stroke-width="2"/>
        <g transform="translate(89 68)" fill="#edcc94">${[0,72,144,216,288].map(a => `<ellipse cy="-6" rx="4" ry="7" transform="rotate(${a})"/>`).join('')}<circle r="4" fill="#bf9041"/></g></g>`;
    }
  }
  const corFolha = { S1: '#719956', S2: '#8c9260', S3: '#628c80', S4: '#8b9560', S5: '#9eac58' }[planta.sementeBase] || '#719956';
  return `<div class="planta-procedural-v083 planta-botanica ${estagio.toLowerCase()}" style="--cor-folha:${corFolha};--cor-planta-v083:${visual.cor};--opacidade-v083:${visual.opacidade}"><svg viewBox="0 0 240 250" aria-hidden="true" class="desenho-botanico">${desenho}</svg></div>`;
};
render();
