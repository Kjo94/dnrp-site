// 3D 지구본 — Cobe (MIT, 약 5KB). 데스크톱에서만, 한가할 때 불러와 정지 SVG 위로 교차 전환한다.
const host = document.querySelector('[data-globe]');
const ok = host && matchMedia('(min-width: 961px)').matches
  && !matchMedia('(prefers-reduced-motion: reduce)').matches
  && !(navigator.connection && navigator.connection.saveData);
if (ok) (window.requestIdleCallback || ((f) => setTimeout(f, 700)))(() => start().catch(() => {}));

async function start() {
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return;
  const { default: createGlobe } = await import('https://cdn.jsdelivr.net/npm/cobe@2.0.1/+esm');
  const origin = JSON.parse(host.dataset.origin);
  const dests = JSON.parse(host.dataset.markets || '[]');
  const canvas = document.createElement('canvas');
  host.appendChild(canvas);
  const toPhi = (lon) => Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2);
  let phi = toPhi(origin[1] + 28);
  let width = host.clientWidth, drag = 0, down = null, visible = true;
  createGlobe(canvas, {
    devicePixelRatio: Math.min(devicePixelRatio, 2), width: width * 2, height: width * 2,
    phi, theta: 0.3, dark: 1, diffuse: 1.25, scale: 1, mapSamples: 16000, mapBrightness: 5.5,
    baseColor: [0.32, 0.38, 0.55], markerColor: [1, 0.42, 0.24], glowColor: [0.2, 0.28, 0.7],
    markers: [{ location: origin, size: 0.07 }].concat(dests.map((d) => ({ location: d, size: 0.035, color: [0.56, 0.64, 1] }))),
    arcs: dests.map((d) => ({ from: origin, to: d })),
    arcColor: [0.43, 0.55, 1], arcWidth: 0.6, arcHeight: 0.3, markerElevation: 0.01,
    onRender: (state) => {
      if (visible && down === null) phi -= 0.0022;
      state.phi = phi + drag;
      state.width = width * 2; state.height = width * 2;
    },
  });
  canvas.addEventListener('pointerdown', (ev) => { down = ev.clientX - drag * 200; canvas.style.cursor = 'grabbing'; });
  addEventListener('pointerup', () => { down = null; canvas.style.cursor = ''; });
  addEventListener('pointermove', (ev) => { if (down !== null) drag = (ev.clientX - down) / 200; });
  new ResizeObserver(() => { width = host.clientWidth; }).observe(host);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(host);
  requestAnimationFrame(() => host.classList.add('live'));
}
