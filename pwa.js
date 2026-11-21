/* LECAA CAST: installation and offline use. Exercise mechanics and embedded media are unchanged from 0.6.3.
   Kept outside index.html so that changes here do not touch the 97 MB programme file. */
(() => {
  if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
  // Exact size of index.html, the only large file (all images, audios, videos and fonts are inside it).
  // maintenance/update-sw.py keeps it in step with sw.js.
  const APP_BYTES = 96354493;
  const UPDATE = 'Nueva versión descargada. Cierra todas las ventanas de LECAA CAST y vuelve a abrir la aplicación para actualizarla.';
  let prompt = null, installed = false, failed = false, phase = 'starting', done = 0, total = APP_BYTES, waiting = false;
  const mb = bytes => (bytes / 1e6).toLocaleString('es-ES', { maximumFractionDigits: bytes < 1e7 ? 1 : 0 });
  const sizeText = () => 'unos ' + Math.round(APP_BYTES / 1e6) + ' MB';
  const percent = () => phase === 'ready' ? 100 : Math.min(99, Math.floor(done * 100 / (total || APP_BYTES)));
  const statusText = () => {
    if (waiting) return UPDATE;
    if (failed) return 'No se ha completado la descarga sin conexión. Mantén la conexión y vuelve a intentarlo. Puedes seguir usando LECAA CAST online; comprueba también el espacio disponible.';
    if (phase === 'ready') return 'Lista para usar sin conexión: imágenes y audios incluidos (' + sizeText() + ' guardados en este dispositivo).';
    if (phase === 'downloading') return 'Descargando para usar sin conexión: ' + mb(done) + ' de ' + mb(total) + ' MB (' + percent() + ' %). No cierres esta ventana hasta que termine.';
    return 'Preparando el uso sin conexión… La primera descarga incluye todas las imágenes y los audios (' + sizeText() + ').';
  };

  // One status line and one progress bar; the same pair is shown on the home page and in the install dialog.
  const statusBlock = () => {
    const box = document.createElement('div'); box.className = 'pwa-progress-box'; box.dataset.pwaProgressBox = '';
    const message = document.createElement('p'); message.dataset.pwaStatus = ''; message.setAttribute('role', 'status');
    const bar = document.createElement('progress'); bar.className = 'pwa-progress'; bar.max = 100; bar.dataset.pwaBar = '';
    bar.setAttribute('aria-label', 'Descarga para usar sin conexión');
    box.append(message, bar); return box;
  };
  const paint = () => {
    for (const box of document.querySelectorAll('[data-pwa-progress-box]')) {
      const message = box.querySelector('[data-pwa-status]'), bar = box.querySelector('[data-pwa-bar]'), text = statusText();
      if (message.textContent !== text) message.textContent = text;
      const showBar = !waiting && !failed && phase !== 'ready';
      bar.hidden = !showBar;
      if (phase === 'downloading') bar.value = percent(); else bar.removeAttribute('value'); // no value = indeterminate
    }
    for (const retry of document.querySelectorAll('[data-pwa-retry]')) retry.hidden = !failed;
  };

  const render = () => {
    const host = document.querySelector('.launch-inner');
    if (!host) return;
    let panel = host.querySelector('.pwa-tools');
    if (!panel) {
      panel = document.createElement('section'); panel.className = 'pwa-tools'; panel.setAttribute('aria-label', 'Instalación y uso sin conexión');
      const retry = document.createElement('button'); retry.type = 'button'; retry.className = 'btn ghost small'; retry.dataset.pwaRetry = ''; retry.textContent = 'Reintentar descarga'; retry.onclick = register;
      const details = document.createElement('details'); const summary = document.createElement('summary'); summary.textContent = 'Cómo instalar y usar sin conexión';
      const help = document.createElement('p'); help.textContent = 'LECAA CAST ocupa ' + sizeText() + '. En Chrome o Edge, usa el botón «Instalar» de la pantalla de inicio o la opción de instalación del navegador. En iPhone o iPad, abre esta página en Safari y elige Compartir › Añadir a la pantalla de inicio (activa «Abrir como app web» si aparece). Espera al mensaje «Lista para usar sin conexión» antes de desconectarte. Los perfiles y las sesiones se guardan solo en este navegador y dispositivo; conserva tus copias de seguridad. Una instalación en otro navegador no transfiere los perfiles.';
      details.append(summary, help); panel.append(statusBlock(), retry, details); host.append(panel);
    }
    const nav = host.querySelector('.home-info-actions');
    if (nav && !nav.querySelector('[data-home-install]')) {
      const install = document.createElement('button'); install.type = 'button'; install.className = 'btn ghost small'; install.dataset.homeInstall = ''; install.textContent = 'Instalar';
      install.setAttribute('aria-haspopup', 'dialog');
      install.onclick = showInstallDialog;
      nav.append(install);
    }
    const homeInstall = nav?.querySelector('[data-home-install]');
    if (homeInstall) homeInstall.hidden = installed || standalone();
    paint();
  };
  // Already opened as an installed app: no install button.
  const standalone = () => matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true;
  // iPadOS 13+ reports itself as a Mac; touch points tell them apart.
  const apple = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Ask the browser not to clear the stored programme when space runs short (best effort; some browsers decide by themselves).
  const persist = () => navigator.storage?.persist?.().catch(() => false);

  // Size warning before installing: what is stored, how much space it needs and how the download is going.
  async function showInstallDialog() {
    const event = prompt;
    const { body, close } = localDialog('Instalar LECAA CAST', 'install-dialog');
    const p = (text, cls) => { const el = document.createElement('p'); el.textContent = text; if (cls) el.className = cls; return el; };
    const warning = document.createElement('div'); warning.className = 'pwa-size-warning'; warning.setAttribute('role', 'note');
    const heading = document.createElement('h3'); heading.textContent = 'Ocupa ' + sizeText();
    warning.append(heading,
      p('Al instalar LECAA CAST se guarda en este dispositivo todo lo necesario para funcionar sin conexión: el programa, las imágenes, los audios, los vídeos y los tipos de letra.'),
      p(phase === 'ready' ? 'La descarga ya está completa en este navegador: instalarla no vuelve a descargar nada.' : 'Si usas datos móviles, mejor conéctate a una red wifi antes de continuar.'));
    const space = p('', 'pwa-space'); warning.append(space);
    body.append(warning, statusBlock());
    paint();
    // Free space as the browser reports it (an estimate; Safari may not give it).
    try {
      const { quota, usage } = await navigator.storage.estimate();
      if (quota) {
        const free = quota - (usage || 0), needed = phase === 'ready' ? 0 : Math.max(0, APP_BYTES - done);
        if (free < needed * 1.1) { space.textContent = 'Atención: este navegador solo puede guardar unos ' + mb(free) + ' MB más. Libera espacio en el dispositivo antes de instalar, o LECAA CAST no funcionará sin conexión.'; space.classList.add('pwa-space-low'); }
        else space.textContent = 'Espacio disponible para este navegador: unos ' + (free >= 1e9 ? (free / 1e9).toLocaleString('es-ES', { maximumFractionDigits: 1 }) + ' GB' : mb(free) + ' MB') + '. Es suficiente.';
      }
    } catch (e) {}
    if (event) {
      const actions = document.createElement('div'); actions.className = 'pwa-install-actions';
      const go = document.createElement('button'); go.type = 'button'; go.className = 'btn'; go.textContent = 'Instalar (' + sizeText() + ')';
      const cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'btn ghost'; cancel.textContent = 'Cancelar'; cancel.onclick = close;
      go.onclick = async () => {
        if (prompt !== event) { close(); return; }
        prompt = null; close(); persist();
        // A deferred install prompt can be shown only once; Chromium fires beforeinstallprompt again if it is dismissed.
        await event.prompt(); await event.userChoice.catch(() => null);
        render();
      };
      actions.append(go, cancel); body.append(actions); go.focus();
      return;
    }
    // Safari and browsers without the install prompt: the same warning, then the steps.
    const steps = document.createElement('ol');
    const lines = apple()
      ? ['Abre esta página en Safari.', 'Toca el botón Compartir (el cuadrado con una flecha hacia arriba).', 'Elige «Añadir a pantalla de inicio». Si aparece «Abrir como app web», déjalo activado.', 'Toca «Añadir». LECAA CAST aparecerá en la pantalla de inicio.']
      : ['Abre el menú del navegador.', 'Elige «Instalar LECAA CAST», «Instalar aplicación» o «Añadir a la pantalla de inicio».', 'Si no aparece ninguna de estas opciones, puede que LECAA CAST ya esté instalada en este dispositivo o que el navegador no permita instalar aplicaciones web; prueba con Chrome o Edge.'];
    for (const line of lines) { const li = document.createElement('li'); li.textContent = line; steps.append(li); }
    body.append(p(apple() ? 'En iPad y iPhone, la instalación se hace desde Safari:' : 'Este navegador no ofrece la instalación directa desde el botón:'), steps,
      p('Espera al mensaje «Lista para usar sin conexión» antes de desconectarte. Los perfiles se guardan en este navegador y dispositivo: una instalación en otro navegador no los transfiere.'));
    persist();
  }

  const ready = async () => {
    const reg = await navigator.serviceWorker.ready;
    const channel = new MessageChannel();
    channel.port1.onmessage = e => {
      if (e.data?.type === 'LECAA_CAST_READY') { phase = 'ready'; failed = false; done = total; render(); if (standalone()) persist(); }
    };
    reg.active?.postMessage({ type: 'LECAA_CAST_STATUS' }, [channel.port2]);
  };
  // Progress messages come from the service worker while it stores index.html.
  navigator.serviceWorker.addEventListener('message', e => {
    const data = e.data;
    if (data?.type === 'LECAA_CAST_PROGRESS') {
      // Once offline use is ready, a new version downloads quietly and announces itself when it is installed.
      if (phase === 'ready') return;
      phase = 'downloading'; done = data.done; total = data.total || APP_BYTES; failed = false; paint();
    } else if (data?.type === 'LECAA_CAST_FAILED') { failed = true; render(); }
  });
  async function register() {
    failed = false; waiting = false; if (phase !== 'ready') { phase = 'starting'; done = 0; } render();
    try {
      const reg = await navigator.serviceWorker.register('/lecaa_cast/sw.js', { scope: '/lecaa_cast/', updateViaCache: 'none' });
      const watch = () => {
        const worker = reg.installing;
        worker?.addEventListener('statechange', () => {
          // A failed update leaves the installed version working offline.
          if (worker.state === 'redundant' && phase !== 'ready') { failed = true; render(); }
          if (worker.state === 'installed' && navigator.serviceWorker.controller) { waiting = true; render(); }
        });
      };
      watch(); reg.addEventListener('updatefound', watch);
      if (reg.waiting) { waiting = true; render(); }
      else if (reg.active) ready().catch(() => {});
      else if (reg.installing) { reg.installing.addEventListener('statechange', function () { if (this.state === 'activated') ready().catch(() => {}); }); }
    } catch (e) { failed = true; render(); }
  }
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); prompt = e; render(); });
  window.addEventListener('appinstalled', () => { prompt = null; installed = true; render(); });
  matchMedia('(display-mode: standalone)').addEventListener?.('change', render);
  navigator.serviceWorker.addEventListener('controllerchange', () => ready().catch(() => {}));
  // Home only: never add controls to the student stage or modify scanning targets.
  const original = showStart;
  showStart = function (...args) { const result = original.apply(this, args); render(); return result; };
  render(); register();
})();
