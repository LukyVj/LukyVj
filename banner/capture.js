const { chromium } = require('playwright');
const [,, theme='dark', frames='1', fps='20', out='f'] = process.argv;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 360 }, deviceScaleFactor: 1 });
  p.on('console', m => console.log('console:', m.text()));
  p.on('pageerror', e => console.log('err:', e.message));
  await p.addInitScript(() => {
    let t = 0, q = [];
    performance.now = () => t;
    window.requestAnimationFrame = cb => { q.push(cb); return q.length; };
    window.cancelAnimationFrame = () => {};
    window.__step = (ms) => { t += ms; const c = q; q = []; c.forEach(f => f(t)); };
    window.__flush = () => { const c = q; q = []; c.forEach(f => f(t)); };
  });
  await p.goto(`http://localhost:8765/render.html?${theme}`);
  await p.waitForFunction(() => window.ready);
  for (let i = 0; i < 30; i++) { await p.evaluate(() => window.__step(0)); await p.waitForTimeout(100); }
  const n = +frames, dt = 1000 / +fps;
  for (let i = 0; i < n; i++) {
    await p.evaluate(dt => window.__step(dt), i === 0 ? 0 : dt);
    await p.evaluate(() => new Promise(r => setTimeout(r, 30)));
    await p.screenshot({ path: `${out}${String(i).padStart(4,'0')}.png` });
  }
  await b.close();
})();
