/* A partida viaja em um arquivo local; nenhum progresso é enviado a um servidor. */
const LIMITE_PARTIDA = 4 * 1024 * 1024;

function arquivoDaPartida() {
  salvar();
  return JSON.stringify({ formato: 'aplantinha', versao: 1, exportadoEm: new Date().toISOString(), estado }, null, 2);
}

function lerArquivoPartida(texto) {
  if (texto.length > LIMITE_PARTIDA) throw new Error('Este arquivo é grande demais. Escolha uma cópia da Plantinha.');
  const pacote = JSON.parse(texto);
  const e = pacote?.estado;
  const objeto = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  if (pacote?.formato !== 'aplantinha' || pacote.versao !== 1 || !e ||
      !Number.isFinite(e.moedas) || e.moedas < 0 || !e.inventario ||
      !Array.isArray(e.quartoV080?.vasos) || e.quartoV080.vasos.length !== 5 ||
      !Array.isArray(e.cadernoDescobertas?.plantas) || !Array.isArray(e.cadernoDescobertas?.conquistas)) {
    throw new Error('Escolha um arquivo criado pelo botão Baixar minha partida.');
  }
  const modelo = estadoInicial();
  for (const chave of Object.keys(modelo)) {
    const valor = modelo[chave];
    if (valor === null) continue;
    if (Array.isArray(valor) ? !Array.isArray(e[chave]) :
        objeto(valor) ? !objeto(e[chave]) : typeof e[chave] !== typeof valor) {
      throw new Error('A partida está incompleta ou é de outra versão.');
    }
  }
  if (!objeto(e.tempo) || !objeto(e.armazenamentoV086) ||
      !Array.isArray(e.jardimV088?.slots) || e.jardimV088.slots.length !== 3 ||
      e.quartoV080.vasos.some((v, i) => !objeto(v) || v.id !== i + 1 || typeof v.desbloqueado !== 'boolean') ||
      [...e.quartoV080.vasos, ...e.jardimV088.slots].some(v => !objeto(v) ||
        (v.cultivo !== null && (!objeto(v.cultivo) || !/^S[1-5]$/.test(v.cultivo.base))))) {
    throw new Error('Não foi possível reconhecer os cultivos desta partida.');
  }
  let itens = 0;
  function validar(valor, profundidade = 0, caminho = '') {
    if (++itens > 100000 || profundidade > 40) throw new Error('Arquivo de partida inválido.');
    if (typeof valor === 'number' && !Number.isFinite(valor)) throw new Error('Arquivo de partida inválido.');
    // Apelidos do caderno já são exibidos como texto. Os motores antigos usam HTML.
    if (typeof valor === 'string' && /<\/?[a-z][^>]*>/i.test(valor) &&
        !/^\.cadernoDescobertas\.plantas\.\d+\.nome$/.test(caminho)) {
      throw new Error('O arquivo contém texto incompatível com esta versão.');
    }
    if (valor && typeof valor === 'object') {
      for (const [chave, filho] of Object.entries(valor)) {
        if (['__proto__', 'prototype', 'constructor'].includes(chave)) throw new Error('Arquivo de partida inválido.');
        validar(filho, profundidade + 1, caminho + '.' + chave);
      }
    }
  }
  validar(e);
  return e;
}

function baixarPartida() {
  const blob = new Blob([arquivoDaPartida()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `aplantinha-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function abrirPartida() {
  let dialogo = document.querySelector('#suaPartida');
  if (!dialogo) {
    dialogo = document.createElement('dialog');
    dialogo.id = 'suaPartida';
    dialogo.innerHTML = `<h2>Sua partida</h2>
      <p>Suas plantas e descobertas ficam guardadas neste navegador. Baixe uma cópia para continuar em outro aparelho ou em aplantinha.online.</p>
      <button type="button" id="baixarPartida">Baixar minha partida</button>
      <p>Para continuar uma partida guardada, escolha o arquivo. Antes de substituir, baixe também uma cópia da partida atual.</p>
      <label for="arquivoPartida">Abrir uma partida guardada</label>
      <input type="file" id="arquivoPartida" accept=".json,application/json">
      <p id="resultadoPartida" role="status"></p>
      <button type="button" id="fecharPartida">Voltar ao cultivo</button>`;
    document.body.append(dialogo);
    dialogo.querySelector('#fecharPartida').onclick = () => dialogo.close();
    dialogo.querySelector('#baixarPartida').onclick = baixarPartida;
    dialogo.querySelector('#arquivoPartida').onchange = async evento => {
      const arquivo = evento.target.files[0];
      const aviso = dialogo.querySelector('#resultadoPartida');
      try {
        if (!arquivo) return;
        if (arquivo.size > LIMITE_PARTIDA) throw new Error('Este arquivo é grande demais.');
        const proxima = lerArquivoPartida(await arquivo.text());
        if (!confirm('Abrir esta partida no lugar da atual? Uma cópia de segurança da atual ficará neste navegador.')) return;
        const anterior = localStorage.getItem(SAVE_KEY);
        if (anterior) localStorage.setItem(SAVE_KEY + '_antes_importacao', anterior);
        localStorage.setItem(SAVE_KEY, JSON.stringify(proxima));
        location.reload();
      } catch (erro) {
        aviso.textContent = erro instanceof SyntaxError ? 'Não foi possível ler esse arquivo de partida.' : erro.message;
      } finally {
        evento.target.value = '';
      }
    };
  }
  dialogo.querySelector('#resultadoPartida').textContent = '';
  dialogo.showModal();
}

const botaoPartida = document.createElement('button');
botaoPartida.id = 'abrirPartida';
botaoPartida.type = 'button';
botaoPartida.textContent = 'Sua partida';
botaoPartida.onclick = abrirPartida;
document.querySelector('#atalhoCaderno').append(botaoPartida);
