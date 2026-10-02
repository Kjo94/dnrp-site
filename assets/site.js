(() => {
  // 헤더: 어두운 머리 위에서는 밝은 글자, 지나가면 밝은 유리
  const top = document.querySelector('.top');
  const dark = document.querySelector('.hero, .page-head');
  const onScroll = () => {
    const y = scrollY, past = !dark || y > dark.offsetHeight - 69;
    top.classList.toggle('dark', !past);
    top.classList.toggle('glass', !past && y > 24);
    top.classList.toggle('light', past);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // 휴대폰 메뉴 — Esc·닫기 버튼, 열려 있는 동안 포커스를 안에 가둔다
  const sheet = document.querySelector('.sheet');
  const openBtn = document.querySelector('.top .menu-btn');
  if (sheet && openBtn) {
    const focusables = () => sheet.querySelectorAll('a,button');
    const close = () => { sheet.classList.remove('open'); openBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; openBtn.focus(); };
    openBtn.addEventListener('click', () => {
      sheet.classList.add('open'); openBtn.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden';
      focusables()[0].focus();
    });
    sheet.querySelector('[data-close]').addEventListener('click', close);
    sheet.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') close();
      if (ev.key === 'Tab') {
        const f = focusables(), first = f[0], last = f[f.length - 1];
        if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      }
    });
  }

  // 떠 있는 주문 카드 — 장식이라 본문 HTML 에 두지 않는다 (숫자 없음)
  const globe = document.querySelector('[data-globe]');
  const cards = globe ? JSON.parse(globe.dataset.cards || '[]') : [];
  const spots = [['2%', '14%'], ['60%', '3%'], ['64%', '80%']];
  const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.5l4.2 4L19 7"/></svg>';
  cards.slice(0, 3).forEach((c, i) => {
    const d = document.createElement('div');
    d.className = 'chip-order'; d.setAttribute('aria-hidden', 'true');
    d.style.left = spots[i][0]; d.style.top = spots[i][1];
    const s = document.createElement('span'); s.innerHTML = icon;
    const b = document.createElement('b'); b.textContent = c[0];
    const m = document.createElement('small'); m.textContent = c[1];
    const t = document.createElement('div'); t.append(b, m);
    d.append(s, t); globe.appendChild(d);
  });

  // 숫자 띠 — 처음 보일 때 한 번만 센다
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target, end = parseFloat(el.dataset.count), t0 = performance.now();
      const tick = (t) => { const k = Math.min(1, (t - t0) / 900); el.firstChild.nodeValue = Math.round(end * (1 - Math.pow(1 - k, 3))).toLocaleString('ko-KR'); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: .6 });
    document.querySelectorAll('[data-count]').forEach((el) => io.observe(el));
  }
})();
