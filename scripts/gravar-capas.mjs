// Grava a capa de cada projeto: abre o site no Edge headless, rola a página em tempo real capturando
// quadros (CDP screencast) e depois monta o vídeo no próprio navegador (canvas + MediaRecorder).
// Uso: node grava.mjs <pasta-de-trabalho> <pasta-do-projeto> [slug ...]
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [, , trabalho, projeto, ...so] = process.argv;
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORTA_CDP = 9334;
const PORTA_HTTP = 9335;
const L = 1280;
const A = 800;
const sites = {
  acervatio: 'https://acervatio.com.br/',
  'soraya-batista': 'https://sorayabatistafisio.com.br/',
  realium: 'https://realium.com.br/',
  pacepoint: 'https://pacepoint.com.br/Home',
};
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const pastaVideos = path.join(projeto, 'public', 'projetos');
const pastaCapas = path.join(projeto, 'src', 'assets', 'projetos');
fs.mkdirSync(pastaVideos, { recursive: true });
fs.mkdirSync(pastaCapas, { recursive: true });

async function conecta(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let id = 0;
  const pend = new Map();
  const ouvintes = new Map();
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pend.has(m.id)) {
      pend.get(m.id)(m.result ?? m.error);
      pend.delete(m.id);
    } else if (m.method && ouvintes.has(m.method)) ouvintes.get(m.method)(m.params);
  });
  return {
    envia: (method, params = {}) =>
      new Promise((resolve) => {
        const meu = ++id;
        pend.set(meu, resolve);
        ws.send(JSON.stringify({ id: meu, method, params }));
      }),
    em: (method, fn) => ouvintes.set(method, fn),
    fecha: () => ws.close(),
  };
}
const novaAba = async (url) =>
  (await fetch(`http://127.0.0.1:${PORTA_CDP}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();

// Servidor local: entrega a página gravadora e os quadros, recebe o vídeo pronto.
const paginaGravadora = `<!doctype html><meta charset="utf-8"><canvas id="c" width="${L}" height="${A}"></canvas><script>
(async () => {
  const slug = new URLSearchParams(location.search).get('slug');
  const quadros = await (await fetch('/quadros/' + slug + '/lista.json')).json();
  const imgs = await Promise.all(quadros.map(async (q) => createImageBitmap(await (await fetch('/quadros/' + slug + '/' + q.arq)).blob())));
  const c = document.getElementById('c');
  const ctx = c.getContext('2d');
  const tipos = ['video/mp4;codecs=avc1.640028', 'video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];
  const tipo = tipos.find((t) => MediaRecorder.isTypeSupported(t));
  ctx.drawImage(imgs[0], 0, 0, ${L}, ${A});
  const rec = new MediaRecorder(c.captureStream(30), { mimeType: tipo, videoBitsPerSecond: 1600000 });
  const partes = [];
  rec.ondataavailable = (e) => e.data.size && partes.push(e.data);
  const fim = new Promise((r) => (rec.onstop = r));
  rec.start();
  const t0 = performance.now();
  const total = quadros[quadros.length - 1].t;
  let i = 0;
  await new Promise((pronto) => {
    const passo = () => {
      const t = performance.now() - t0;
      while (i < quadros.length - 1 && quadros[i + 1].t <= t) i++;
      ctx.drawImage(imgs[i], 0, 0, ${L}, ${A});
      if (t >= total) return pronto();
      setTimeout(passo, 1000 / 30);
    };
    passo();
  });
  rec.stop();
  await fim;
  const blob = new Blob(partes, { type: tipo });
  const ext = tipo.startsWith('video/mp4') ? 'mp4' : 'webm';
  await fetch('/salva?slug=' + slug + '&ext=' + ext, { method: 'POST', body: blob });
  document.title = 'pronto:' + ext + ':' + tipo;
})().catch((e) => (document.title = 'erro:' + e.message));
</script>`;

const servidor = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/gravadora') return res.setHeader('content-type', 'text/html').end(paginaGravadora);
  if (u.pathname.startsWith('/quadros/')) {
    const arq = path.join(trabalho, u.pathname.replace(/\.\./g, ''));
    return fs.existsSync(arq) ? res.end(fs.readFileSync(arq)) : res.writeHead(404).end();
  }
  if (u.pathname === '/salva' && req.method === 'POST') {
    const partes = [];
    req.on('data', (d) => partes.push(d));
    req.on('end', () => {
      const destino = path.join(pastaVideos, `${u.searchParams.get('slug')}.${u.searchParams.get('ext')}`);
      fs.writeFileSync(destino, Buffer.concat(partes));
      res.end('ok');
    });
    return;
  }
  res.writeHead(404).end();
});
servidor.listen(PORTA_HTTP, '127.0.0.1');

const proc = spawn(edge, [
  '--headless=new',
  '--hide-scrollbars',
  '--autoplay-policy=no-user-gesture-required',
  `--remote-debugging-port=${PORTA_CDP}`,
  `--user-data-dir=${path.join(trabalho, 'perfil-video')}`,
  `--window-size=${L},${A}`,
  'about:blank',
]);
await espera(3000);

// Roteiro da rolagem, executado dentro da página: pausa, desce, pausa, volta ao topo (para o loop fechar).
const roteiro = `new Promise((fim) => {
  const alvo = Math.min(document.documentElement.scrollHeight - innerHeight, innerHeight * 2.6);
  const suave = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
  const fases = [[1200, 0, 0], [6500, 0, alvo], [900, alvo, alvo], [1800, alvo, 0], [400, 0, 0]];
  const t0 = performance.now();
  const passo = () => {
    let t = performance.now() - t0;
    for (const [d, de, ate] of fases) {
      if (t <= d) { window.scrollTo(0, de + (ate - de) * suave(t / d)); return requestAnimationFrame(passo); }
      t -= d;
    }
    window.scrollTo(0, 0);
    fim(true);
  };
  passo();
})`;

for (const [slug, url] of Object.entries(sites)) {
  if (so.length && !so.includes(slug)) continue;
  const pastaQ = path.join(trabalho, 'quadros', slug);
  fs.rmSync(pastaQ, { recursive: true, force: true });
  fs.mkdirSync(pastaQ, { recursive: true });

  const aba = await conecta((await novaAba('about:blank')).webSocketDebuggerUrl);
  await aba.envia('Emulation.setDeviceMetricsOverride', { width: L, height: A, deviceScaleFactor: 1, mobile: false });
  await aba.envia('Page.enable');
  await aba.envia('Page.navigate', { url });
  await espera(12000);
  // Tira da gravação o selo flutuante do reCAPTCHA
  await aba.envia('Runtime.evaluate', {
    expression: `document.head.insertAdjacentHTML('beforeend', '<style>.grecaptcha-badge{visibility:hidden!important}</style>')`,
  });
  await espera(300);

  // Capa estática (pôster do vídeo e reserva quando o vídeo não toca)
  const { data } = await aba.envia('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(pastaQ, 'capa.png'), Buffer.from(data, 'base64'));

  const quadros = [];
  let t0 = null;
  aba.em('Page.screencastFrame', (p) => {
    const agora = performance.now();
    if (t0 === null) t0 = agora;
    const arq = `q${String(quadros.length).padStart(4, '0')}.jpg`;
    fs.writeFileSync(path.join(pastaQ, arq), Buffer.from(p.data, 'base64'));
    quadros.push({ t: Math.round(agora - t0), arq });
    aba.envia('Page.screencastFrameAck', { sessionId: p.sessionId });
  });
  await aba.envia('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: L, maxHeight: A, everyNthFrame: 1 });
  // O site da Realium controla a própria rolagem e fica vazio quando rolado por script:
  // nele a capa mostra só o topo, com as fotos do banner trocando.
  const parado = slug === 'realium';
  await aba.envia('Runtime.evaluate', {
    expression: parado ? 'new Promise((r) => setTimeout(r, 10000))' : roteiro,
    awaitPromise: true,
  });
  await espera(300);
  await aba.envia('Page.stopScreencast');
  fs.writeFileSync(path.join(pastaQ, 'lista.json'), JSON.stringify(quadros));
  aba.fecha();

  // Monta o vídeo
  const alvoRec = await novaAba(`http://127.0.0.1:${PORTA_HTTP}/gravadora?slug=${slug}`);
  const rec = await conecta(alvoRec.webSocketDebuggerUrl);
  let titulo = '';
  for (let i = 0; i < 120 && !/^(pronto|erro):/.test(titulo); i++) {
    await espera(500);
    titulo = (await rec.envia('Runtime.evaluate', { expression: 'document.title' })).result?.value ?? '';
  }
  rec.fecha();
  console.log(slug, quadros.length, 'quadros,', quadros.at(-1)?.t, 'ms ->', titulo);
}

proc.kill();
servidor.close();
process.exit(0);
