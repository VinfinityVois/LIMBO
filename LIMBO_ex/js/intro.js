/* ═══════════════════════════════════════════════════════════
   П.Р.И.Н.Ц. // SUB-04 — Смотрящий A-55
   Улучшено: e.code (RU/EN) · крошки · BFS-угрозы · авто-вход
   · защита узла · привязка к HUD intro.html
   ═══════════════════════════════════════════════════════════ */
   (function () {
    'use strict';
  
    const TILE = 32, COLS = 20, ROWS = 15;
  
    // 0 floor · 1 wall · 2 gate · 3 terminal · 4 prop
    const MAP = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,3,0,1,0,1,1,1,0,1,0,4,0,4,0,4,0,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1],
      [1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1],
      [1,0,4,0,4,0,0,0,1,0,3,0,1,0,1,0,3,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,0,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,0,1],
      [1,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,1],
      [1,0,3,0,1,0,1,0,4,0,4,0,1,0,4,0,1,0,0,1],
      [1,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,1],
      [1,1,1,0,1,0,1,1,0,1,1,1,1,0,1,1,1,0,1,1],
      [1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
  
    const ROOMS = [
      { name: 'ПОСТ БЕЗОПАСНОСТИ // 1A', x1: 1, y1: 1, x2: 3, y2: 3 },
      { name: 'СЕРВЕРНЫЙ ЗАЛ // 2B', x1: 11, y1: 1, x2: 18, y2: 3 },
      { name: 'КРИО-КАМЕРА // 3C', x1: 1, y1: 9, x2: 3, y2: 11 },
      { name: 'ХРАНИЛИЩЕ // 4D', x1: 13, y1: 9, x2: 18, y2: 11 },
      { name: 'ШЛЮЗ АЛЬФА', x1: 1, y1: 13, x2: 18, y2: 13 }
    ];
  
    const LORE = {
      '0x7F': { title: 'ФРАГМЕНТ ЖУРНАЛА СМОТРЯЩЕГО', desc: 'Лог Восточного штаба: «серый дождь», сбой коллизий в Шанхае. Метка A-55.' },
      '0x9A': { title: 'СИГНАТУРА ПРОТОКОЛА «ЦЕФЕЙ»', desc: 'Крипто-подпись ядра. Без пяти фрагментов шлюз Alpha закрыт.' },
      '0x1C': { title: 'СНИМОК ПАМЯТИ СУБЪЕКТА', desc: 'Дамп из капсулы: боль, запах гари, голос Сасаки Момо. Сцена «Рёкан» жива.' },
      '0x4E': { title: 'КЛЮЧ МАРШРУТИЗАЦИИ ШТАБА', desc: 'Маркер ассистента. Обходит карантин SUB-04.' },
      '0x00': { title: 'НУЛЕВОЙ БАЙТ · ZERO', desc: 'Пустая ячейка с ненулевой массой. След класса ZERO.' }
    };
  
    const TERM_LORE = [
      'Терминал 1A: смена 04. Аномалия плотности в секторе B.',
      'Терминал 2B: перегрузка кластера 8. Сервера Шанхая на грани.',
      'Терминал 3C: пометка «Сюань У» — 7 закрытых протоколов.'
    ];
  
    // байты отдельно от терминалов
    let shards = [
      { x: 3, y: 1, code: '0x7F', got: false },
      { x: 12, y: 3, code: '0x9A', got: false },
      { x: 17, y: 5, code: '0x1C', got: false },
      { x: 3, y: 9, code: '0x4E', got: false },
      { x: 15, y: 11, code: '0x00', got: false }
    ];
  
    let terminals = [
      { x: 2, y: 2, read: false },
      { x: 10, y: 6, read: false },
      { x: 16, y: 6, read: false }
    ];
  
    // Pac-Man крошки
    let dots = [];
    function rebuildDots() {
      dots = [];
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (MAP[y][x] === 0) dots.push({ x, y, got: false });
        }
      }
    }
    rebuildDots();
  
    const S = {
      p: { x: 1, y: 13, dx: 0, dy: -1, hide: false, light: true },
      threats: [
        { x: 17, y: 11, type: 'virus', timer: 0, freeze: 0 },
        { x: 8, y: 3, type: 'bug', timer: 0, freeze: 0 },
        { x: 14, y: 10, type: 'hacker', timer: 0, freeze: 0 }
      ],
      power: 100,
      noise: 0,
      stealth: 100,
      bytes: 0,
      terms: 0,
      dotsGot: 0,
      dotsTotal: 0,
      door: false,
      dead: false,
      win: false,
      sonar: 0,
      highlight: 0,
      tick: 0,
      steps: 0,
      time: 0,
      nearTerm: null,
      ready: false, // game frozen until entry closes
      startTime: 0
    };
    S.dotsTotal = dots.length;
  
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = COLS * TILE;
    canvas.height = ROWS * TILE;
  
    const fog = document.createElement('canvas');
    fog.width = canvas.width;
    fog.height = canvas.height;
    const fctx = fog.getContext('2d');
  
    const glitchC = document.getElementById('glitch-canvas') || document.getElementById('static-overlay') || document.getElementById('static-canvas');
    const gctx = glitchC ? glitchC.getContext('2d') : null;
    if (glitchC) {
      glitchC.width = 160;
      glitchC.height = 120;
    }
  
    /* ── audio ── */
    const sfx = {
      ctx: null, muted: false,
      init() {
        if (!this.ctx) try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      },
      tone(f, d, type, v) {
        if (this.muted || !this.ctx) return;
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = type || 'square'; o.frequency.value = f;
        g.gain.value = v || 0.04;
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + d);
        o.connect(g); g.connect(this.ctx.destination);
        o.start(); o.stop(this.ctx.currentTime + d);
      },
      step() { this.tone(150 + Math.random() * 40, 0.04, 'triangle', 0.022); },
      pickup() { [480, 640, 900].forEach((f, i) => setTimeout(() => this.tone(f, 0.09, 'sine', 0.04), i * 45)); },
      sonar() { this.tone(90, 0.45, 'sine', 0.05); this.tone(160, 0.3, 'triangle', 0.03); },
      jam() { this.tone(55, 0.2, 'sawtooth', 0.05); },
      term() { this.tone(300, 0.08, 'sine', 0.04); this.tone(450, 0.12, 'triangle', 0.03); },
      die() { this.tone(70, 0.4, 'sawtooth', 0.06); },
      crumb() { this.tone(520 + Math.random() * 80, 0.03, 'sine', 0.015); }
    };
  
    const muteBtn = document.getElementById('btn-audio-toggle') || document.getElementById('btn-mute');
    if (muteBtn) muteBtn.onclick = () => {
      sfx.init();
      sfx.muted = !sfx.muted;
      const ic = document.getElementById('audio-icon');
      if (ic) ic.textContent = sfx.muted ? 'volume_off' : 'volume_up';
      const lab = document.getElementById('audio-label');
      if (lab) lab.textContent = sfx.muted ? 'MUTE' : 'SFX';
    };
  
    /* ── helpers ── */
    function $(id) { return document.getElementById(id); }
    function blocked(x, y) {
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;
      const t = MAP[y][x];
      if (t === 1 || t === 4) return true;
      if (t === 2 && !S.door) return true;
      return false;
    }
    function roomAt(x, y) {
      for (const r of ROOMS) if (x >= r.x1 && x <= r.x2 && y >= r.y1 && y <= r.y2) return r.name;
      return 'МАГИСТРАЛЬ · SUB-04';
    }
  
    function showToast(msg, lore) {
      const box = $('toast-interaction');
      if (!box) return;
      const m = $('toast-message');
      const l = $('toast-lore');
      if (m) m.textContent = msg;
      if (l) l.textContent = lore || '';
      box.classList.add('show', 'opacity-100');
      box.classList.remove('opacity-0', 'hidden');
      clearTimeout(showToast._t);
      showToast._t = setTimeout(() => {
        box.classList.remove('show', 'opacity-100');
        box.classList.add('opacity-0');
      }, 3200);
    }
  
    function toastByte(code) {
      const L = LORE[code];
      if (!L) return;
      showToast('БАЙТ ' + code + ' · ' + L.title, L.desc);
    }
  
    function updateHUD() {
      const p = (id, t) => { const e = $(id); if (e) e.textContent = t; };
      const pow = Math.max(0, Math.round(S.power)) + '%';
      p('ui-power-val', pow);
      p('hud-power', pow);
      p('task-shards-num', S.bytes + '/5');
      p('task-term-num', S.terms + '/3');
      p('footer-term-pill', S.terms + ' / 3');
      p('footer-dots-pill', S.dotsGot + '/' + S.dotsTotal);
      p('crt-room-id', 'ROOM: ' + roomAt(S.p.x, S.p.y));
      p('hud-zone', roomAt(S.p.x, S.p.y));
      p('crt-mode-state', S.p.hide ? 'МАСКИРОВКА' : (S.ready ? 'ПОИСК' : 'BIOS'));
      p('footer-status-pill', S.p.hide ? 'СТЕЛС' : (S.ready ? 'ПОИСК' : 'ОЖИДАНИЕ'));
      p('footer-light-pill', S.p.light && !S.p.hide ? 'ВКЛ' : 'ВЫКЛ');
      p('footer-gate-pill', S.door ? 'ОТКРЫТ' : 'ЗАКРЫТ');
      p('task-gate-status', S.door ? 'ОТКРЫТ' : 'БЛОК');
      p('crt-stealth-pct', S.p.hide ? '100%' : Math.round(S.stealth) + '%');
  
      const doneTasks = (S.bytes >= 5 ? 1 : 0) + (S.terms >= 3 ? 1 : 0) + (S.door ? 1 : 0) + (S.win ? 1 : 0);
      p('task-counter', doneTasks + ' / 4');
  
      if (S.bytes >= 5) {
        const i1 = $('task-icon-1'); if (i1) i1.textContent = '✓';
      }
      if (S.terms >= 3) {
        const i2 = $('task-icon-2'); if (i2) i2.textContent = '✓';
      }
      if (S.door) {
        const i3 = $('task-icon-3'); if (i3) i3.textContent = '✓';
        const fg = $('footer-gate-pill');
        if (fg) { fg.className = 'text-neon-cyan font-bold'; }
      }
  
      shards.forEach((sh, i) => {
        const slot = $('byte-slot-' + i) || $('slot-' + i);
        if (!slot) return;
        if (sh.got) {
          slot.textContent = sh.code;
          slot.classList.add('got');
        } else {
          slot.textContent = '··';
          slot.classList.remove('got');
        }
      });
    }
  
    /* ── BFS step ── */
    function nextStep(sx, sy, tx, ty) {
      if (sx === tx && sy === ty) return [0, 0];
      const key = (x, y) => x + ',' + y;
      const q = [[sx, sy]];
      const came = new Map();
      came.set(key(sx, sy), null);
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (let i = dirs.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        const tmp = dirs[i]; dirs[i] = dirs[j]; dirs[j] = tmp;
      }
      let found = null;
      while (q.length && !found) {
        const [cx, cy] = q.shift();
        if (cx === tx && cy === ty) { found = [cx, cy]; break; }
        for (const [dx, dy] of dirs) {
          const nx = cx + dx, ny = cy + dy;
          const k = key(nx, ny);
          if (came.has(k)) continue;
          if (blocked(nx, ny) && !(nx === tx && ny === ty)) continue;
          came.set(k, [cx, cy]);
          q.push([nx, ny]);
        }
        if (came.size > 200) break;
      }
      if (!found) {
        const dx = Math.sign(tx - sx), dy = Math.sign(ty - sy);
        if (!blocked(sx + dx, sy)) return [dx, 0];
        if (!blocked(sx, sy + dy)) return [0, dy];
        return [0, 0];
      }
      let cur = found;
      let prev = came.get(key(cur[0], cur[1]));
      while (prev && !(prev[0] === sx && prev[1] === sy)) {
        cur = prev;
        prev = came.get(key(cur[0], cur[1]));
      }
      return [cur[0] - sx, cur[1] - sy];
    }
  
    /* ── render ── */
    function render() {
      S.tick++;
      const p = S.p;
      ctx.fillStyle = '#03050c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const t = MAP[y][x], px = x * TILE, py = y * TILE;
          if (t === 1) {
            ctx.fillStyle = '#121a2a';
            ctx.fillRect(px, py, TILE, TILE);
            ctx.fillStyle = '#0a101c';
            ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
            ctx.strokeStyle = 'rgba(0,180,200,0.08)';
            ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
          } else if (t === 4) {
            ctx.fillStyle = '#1c0e1a';
            ctx.fillRect(px + 4, py + 4, TILE - 8, TILE - 8);
            ctx.strokeStyle = 'rgba(224,40,133,0.35)';
            ctx.strokeRect(px + 4, py + 4, TILE - 8, TILE - 8);
          } else if (t === 2) {
            ctx.fillStyle = S.door ? 'rgba(0,40,50,0.9)' : 'rgba(40,10,18,0.9)';
            ctx.fillRect(px, py, TILE, TILE);
            ctx.strokeStyle = S.door ? '#00e5f0' : '#ff2a55';
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 5, py + 5, TILE - 10, TILE - 10);
            ctx.lineWidth = 1;
            ctx.fillStyle = S.door ? '#00e5f0' : '#ff2a55';
            ctx.font = 'bold 8px monospace';
            ctx.fillText(S.door ? 'OPEN' : 'LOCK', px + 6, py + 19);
          } else {
            const chk = (x + y) % 2 === 0;
            ctx.fillStyle = chk ? '#0a1520' : '#081018';
            ctx.fillRect(px, py, TILE, TILE);
          }
          if (t === 3) {
            const read = terminals.some(tm => tm.x === x && tm.y === y && tm.read);
            ctx.fillStyle = '#08141c';
            ctx.fillRect(px + 5, py + 7, TILE - 10, TILE - 12);
            ctx.fillStyle = read
              ? 'rgba(30,201,154,0.6)'
              : 'rgba(0,229,240,' + (0.45 + Math.sin(S.tick * 0.1) * 0.2) + ')';
            ctx.fillRect(px + 8, py + 10, TILE - 16, 7);
            if (!read) {
              ctx.fillStyle = 'rgba(255,176,32,0.7)';
              ctx.font = '7px monospace';
              ctx.fillText('[F]', px + 10, py + 16);
            }
          }
        }
      }
  
      // dots
      dots.forEach(d => {
        if (d.got) return;
        const dx = d.x * TILE + TILE / 2;
        const dy = d.y * TILE + TILE / 2;
        ctx.fillStyle = 'rgba(0,229,240,0.5)';
        ctx.beginPath();
        ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
  
      // shards
      shards.forEach(sh => {
        if (sh.got) return;
        const px = sh.x * TILE + 16, py = sh.y * TILE + 16 + Math.sin(S.tick * 0.08 + sh.x) * 2;
        const g = ctx.createRadialGradient(px, py, 2, px, py, 14);
        g.addColorStop(0, 'rgba(0,229,240,0.95)');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#00e5f0';
        ctx.fillRect(px - 4, py - 4, 8, 8);
      });
  
      // threats
      const colors = {
        virus: ['#ff2a55', '#ff6a8a'],
        bug: ['#ffb020', '#ffd060'],
        hacker: ['#c026ff', '#e080ff']
      };
      const hl = S.highlight > 0;
      if (S.highlight > 0) S.highlight--;
  
      S.threats.forEach(th => {
        if (th.freeze > 0) th.freeze--;
        const c = colors[th.type] || colors.virus;
        const px = th.x * TILE, py = th.y * TILE;
        const flick = Math.sin(S.tick * 0.25 + th.x) > 0;
        if (hl) {
          ctx.strokeStyle = 'rgba(255,42,85,0.9)';
          ctx.lineWidth = 2;
          ctx.strokeRect(px + 2, py + 2, TILE - 4, TILE - 4);
          ctx.lineWidth = 1;
        }
        ctx.globalAlpha = th.freeze > 0 ? 0.35 : 1;
        ctx.fillStyle = flick ? c[0] : c[1];
        ctx.fillRect(px + 6, py + 4, TILE - 12, TILE - 8);
        ctx.fillStyle = '#fff';
        ctx.fillRect(px + 10, py + 10, 3, 3);
        ctx.fillRect(px + 19, py + 10, 3, 3);
        ctx.fillStyle = c[0];
        ctx.font = '8px monospace';
        ctx.fillText(th.type[0].toUpperCase(), px + 12, py + 28);
        ctx.globalAlpha = 1;
      });
  
      // player — cyan operator
      {
        const px = p.x * TILE, py = p.y * TILE;
        if (p.hide) {
          ctx.strokeStyle = 'rgba(0,229,240,0.4)';
          ctx.strokeRect(px + 8, py + 8, TILE - 16, TILE - 16);
          ctx.fillStyle = 'rgba(0,229,240,0.15)';
          ctx.fillRect(px + 10, py + 10, TILE - 20, TILE - 20);
        } else {
          ctx.fillStyle = '#0a1828';
          ctx.fillRect(px + 8, py + 6, TILE - 16, TILE - 12);
          ctx.strokeStyle = '#00e5f0';
          ctx.strokeRect(px + 8, py + 6, TILE - 16, TILE - 12);
          ctx.fillStyle = '#00e5f0';
          ctx.fillRect(px + 11, py + 10, TILE - 22, 4);
          // direction pip
          ctx.fillStyle = '#e8ffff';
          ctx.fillRect(px + 16 + p.dx * 6, py + 16 + p.dy * 6, 3, 3);
        }
      }
  
      // soft fog (no white ERASE artifact)
      fctx.fillStyle = 'rgba(2,4,10,' + (S.sonar > 0 ? 0.25 : 0.55) + ')';
      fctx.fillRect(0, 0, fog.width, fog.height);
      const cx = p.x * TILE + 16, cy = p.y * TILE + 16;
      fctx.save();
      fctx.globalCompositeOperation = 'destination-out';
      if (p.light && !p.hide) {
        const ang = Math.atan2(p.dy, p.dx || 0.001);
        const inner = fctx.createRadialGradient(cx, cy, 4, cx, cy, 50);
        inner.addColorStop(0, 'rgba(0,0,0,1)');
        inner.addColorStop(1, 'rgba(0,0,0,0)');
        fctx.fillStyle = inner;
        fctx.beginPath(); fctx.arc(cx, cy, 56, 0, Math.PI * 2); fctx.fill();
        fctx.beginPath();
        fctx.moveTo(cx, cy);
        fctx.arc(cx, cy, 200, ang - 0.6, ang + 0.6);
        fctx.closePath();
        fctx.fillStyle = 'rgba(0,0,0,0.95)';
        fctx.fill();
      } else {
        const tiny = fctx.createRadialGradient(cx, cy, 2, cx, cy, 28);
        tiny.addColorStop(0, 'rgba(0,0,0,0.9)');
        tiny.addColorStop(1, 'rgba(0,0,0,0)');
        fctx.fillStyle = tiny;
        fctx.beginPath(); fctx.arc(cx, cy, 32, 0, Math.PI * 2); fctx.fill();
      }
      if (S.sonar > 0) {
        fctx.beginPath();
        fctx.arc(cx, cy, (1 - S.sonar) * 360 + 40, 0, Math.PI * 2);
        fctx.fillStyle = 'rgba(0,0,0,' + S.sonar + ')';
        fctx.fill();
        S.sonar -= 0.01;
      }
      fctx.restore();
      ctx.drawImage(fog, 0, 0);
  
      // proximity
      let minD = 99;
      S.threats.forEach(th => {
        minD = Math.min(minD, Math.hypot(p.x - th.x, p.y - th.y));
      });
      const prox = $('danger-alert') || $('crt-proximity-warning') || $('prox-alert');
      const thEl = $('ui-threat-badge') || $('ui-threat') || $('hud-threat');
      if (minD < 5) {
        const intensity = Math.pow(1 - minD / 5, 1.3);
        if (glitchC) {
          glitchC.style.opacity = String(Math.min(0.45, intensity * 0.5));
          paintGlitch(intensity);
        }
        if (prox) {
          prox.classList.remove('hidden');
          prox.textContent = minD < 1.8 ? '!! КОНТАКТ !!' : 'СИГНАТУРА РЯДОМ';
        }
        if (thEl) thEl.textContent = minD < 2 ? 'КРИТИЧНО' : 'СЛЕЖЕНИЕ';
      } else {
        if (glitchC) glitchC.style.opacity = '0';
        if (prox) prox.classList.add('hidden');
        if (thEl) thEl.textContent = 'НОРМА';
      }
  
      const radar = $('radar-subtext');
      if (radar) radar.textContent = 'БЛИЖ: ' + (minD * 3.2).toFixed(1) + 'm';
    }
  
    function paintGlitch(intensity) {
      if (!gctx || !glitchC) return;
      const w = glitchC.width, h = glitchC.height;
      const img = gctx.createImageData(w, h);
      const buf = new Uint32Array(img.data.buffer);
      const tC = 0.9 - intensity * 0.3;
      for (let i = 0; i < buf.length; i++) {
        const r = Math.random();
        if (r > tC) buf[i] = 0x5500e5f0;
        else if (r > 0.96) buf[i] = 0x44ff2a55;
      }
      gctx.putImageData(img, 0, 0);
    }
  
    /* ── actions ── */
    function move(dx, dy) {
      if (!S.ready || S.dead || S.win) return;
      sfx.init();
      if (S.p.hide) { S.p.hide = false; S.p.light = true; }
      S.p.dx = dx; S.p.dy = dy;
      const nx = S.p.x + dx, ny = S.p.y + dy;
      if (blocked(nx, ny)) return;
      S.p.x = nx; S.p.y = ny;
      S.steps++;
      S.noise = Math.min(100, S.noise + (S.p.light ? 10 : 4));
      S.stealth = Math.max(0, S.stealth - (S.p.light ? 3 : 1));
      sfx.step();
  
      // dots
      dots.forEach(d => {
        if (!d.got && d.x === nx && d.y === ny) {
          d.got = true;
          S.dotsGot++;
          sfx.crumb();
          if (S.dotsGot % 12 === 0) showToast('КРОШКИ · ' + S.dotsGot + '/' + S.dotsTotal);
        }
      });
  
      // bytes
      shards.forEach((sh, idx) => {
        if (!sh.got && sh.x === nx && sh.y === ny) {
          sh.got = true; S.bytes++;
          sfx.pickup();
          toastByte(sh.code);
          if (S.bytes >= 5) {
            S.door = true;
            showToast('КЛЮЧ СОБРАН · ШЛЮЗ ALPHA ОТКРЫТ', 'Идите к GATE внизу карты.');
          }
          updateHUD();
        }
      });
  
      S.nearTerm = terminals.find(t => !t.read && Math.abs(t.x - nx) + Math.abs(t.y - ny) <= 1) || null;
  
      if (S.door && nx === 1 && ny === 13) victory();
      updateHUD();
    }
  
    function cloak() {
      if (!S.ready || S.dead || S.win) return;
      sfx.init();
      S.p.hide = !S.p.hide;
      S.p.light = !S.p.hide;
      if (S.p.hide) {
        S.noise = Math.max(0, S.noise - 28);
        S.stealth = Math.min(100, S.stealth + 15);
        showToast('МАСКИРОВКА · СВЕТ ВЫКЛ');
      } else showToast('СВЕТ ВКЛ · ВЫ ЗАМЕТНЫ');
      updateHUD();
    }
  
    function sonar() {
      if (!S.ready || S.dead || S.win) return;
      sfx.init();
      if (S.power < 8) { showToast('МАЛО ЭНЕРГИИ'); return; }
      S.power -= 8;
      S.sonar = 1.2;
      S.highlight = 200;
      sfx.sonar();
      showToast('СОНАР · КАРТА И УГРОЗЫ', 'Подсветка ~3 с');
      updateHUD();
    }
  
    function jam() {
      if (!S.ready || S.dead || S.win) return;
      sfx.init();
      if (S.power < 12) { showToast('МАЛО ЭНЕРГИИ ДЛЯ ПОМЕХ'); return; }
      S.power -= 12;
      sfx.jam();
      S.threats.forEach(th => { th.freeze = 50; });
      showToast('ПОМЕХИ · УГРОЗЫ ЗАМОРОЖЕНЫ');
      updateHUD();
    }
  
    function useTerminal() {
      if (!S.ready || S.dead || S.win) return;
      sfx.init();
      const t = terminals.find(tm => !tm.read && Math.abs(tm.x - S.p.x) + Math.abs(tm.y - S.p.y) <= 1);
      if (!t) { showToast('НЕТ ТЕРМИНАЛА РЯДОМ'); return; }
      t.read = true; S.terms++;
      sfx.term();
      const lore = TERM_LORE[S.terms - 1] || 'Данные считаны.';
      showToast('ТЕРМИНАЛ [' + S.terms + '/3]', lore);
      if (S.terms >= 3) showToast('ВСЕ ТЕРМИНАЛЫ СЧИТАНЫ');
      updateHUD();
    }
  
    /* ── AI (easier, BFS when alert) ── */
    function tickAI() {
      if (!S.ready || S.dead || S.win) return;
      const p = S.p;
  
      S.threats.forEach(th => {
        if (th.freeze > 0) return;
        const dist = Math.hypot(p.x - th.x, p.y - th.y);
        if (dist < 1.15 && !p.hide) { kill(th.type); return; }
  
        let chase = false;
        if (th.type === 'virus') {
          chase = !p.hide && p.light && dist < 6;
        } else if (th.type === 'bug') {
          chase = S.noise > 45 && dist < 7;
        } else if (th.type === 'hacker') {
          chase = (!p.hide && dist < 5) || (S.noise > 55 && dist < 8);
        }
  
        th.timer++;
        // slower: virus every 3, hacker 4, bug 5
        const speed = th.type === 'virus' ? 3 : (th.type === 'hacker' ? 4 : 5);
        if (th.timer % speed !== 0) return;
  
        if (chase) {
          const [sx, sy] = nextStep(th.x, th.y, p.x, p.y);
          if (sx || sy) { th.x += sx; th.y += sy; }
        } else {
          // idle wander
          const opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => !blocked(th.x + dx, th.y + dy));
          if (opts.length && Math.random() > 0.4) {
            const [dx, dy] = opts[(Math.random() * opts.length) | 0];
            th.x += dx; th.y += dy;
          }
        }
        if (th.x === p.x && th.y === p.y && !p.hide) kill(th.type);
      });
  
      S.noise = Math.max(0, S.noise - 2.2);
      if (p.light && !p.hide) {
        S.power = Math.max(0, S.power - 0.06);
        S.stealth = Math.max(0, S.stealth - 0.12);
      } else {
        S.stealth = Math.min(100, S.stealth + 0.4);
      }
      if (S.power <= 0) S.p.light = false;
      S.time++;
      updateHUD();
    }
  
    function kill(type) {
      if (S.dead || S.win) return;
      S.dead = true;
      sfx.die();
      if (glitchC) glitchC.style.opacity = '0.6';
      const names = { virus: 'ВИРУСНАЯ СИГНАТУРА', bug: 'БАГ-КЛАСТЕР', hacker: 'ХАКЕР-ФАНТОМ' };
      const card = $('game-status-card');
      if (card) {
        card.classList.remove('hidden');
        const title = $('status-card-title');
        const desc = $('status-card-desc');
        if (title) {
          title.textContent = 'КАНАЛ СКОМПРОМЕТИРОВАН';
          title.className = 'font-headline font-bold text-xl text-corruption-red tracking-wide uppercase';
        }
        if (desc) desc.textContent = (names[type] || 'УГРОЗА') + ' перехватила аватар. Сектор сброшен.';
        const btn = $('btn-modal-restart');
        if (btn) btn.textContent = 'ПЕРЕЗАПУСК [ENTER]';
      }
      const modal = $('game-modal');
      if (modal) {
        modal.classList.remove('hidden', 'win');
        modal.classList.add('show');
        const mt = $('modal-title'); if (mt) mt.textContent = 'КАНАЛ СКОМПРОМЕТИРОВАН';
        const md = $('modal-desc'); if (md) md.textContent = (names[type] || 'УГРОЗА') + ' перехватила аватар.';
        const mb = $('modal-btn'); if (mb) mb.textContent = 'ПЕРЕЗАПУСК [ENTER]';
      }
    }
  
    function victory() {
      if (S.win) return;
      S.win = true;
      sfx.pickup();
      const elapsed = Math.floor((Date.now() - (S.startTime || Date.now())) / 1000);
      const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const ss = String(elapsed % 60).padStart(2, '0');
  
      // victory-screen (intro.html)
      const vs = $('victory-screen');
      if (vs) {
        if ($('vs-bytes')) $('vs-bytes').textContent = S.bytes + ' / 5';
        if ($('vs-terminals')) $('vs-terminals').textContent = S.terms + ' / 3';
        if ($('vs-dots')) $('vs-dots').textContent = S.dotsGot + ' / ' + S.dotsTotal;
        if ($('vs-time')) $('vs-time').textContent = mm + ':' + ss;
        if ($('vs-power')) $('vs-power').textContent = Math.round(S.power) + '%';
        if ($('vs-stealth')) $('vs-stealth').textContent = Math.round(S.stealth) + '%';
        if ($('victoryQuote')) {
          $('victoryQuote').textContent = '«Защита узла успешна. Сигнатуры не пробили периметр. Канал A-55 стабилен.»';
        }
        if ($('victoryRank')) {
          const rank = S.terms >= 3 && S.dotsGot > S.dotsTotal * 0.5 ? 'S' : (S.terms >= 2 ? 'A' : 'B');
          $('victoryRank').textContent = rank;
          $('victoryRank').className = 'victory-rank ' + rank;
        }
        vs.classList.add('show');
        let cd = 6;
        const cdEl = $('victoryCountdown');
        const iv = setInterval(() => {
          cd--;
          if (cdEl) cdEl.textContent = cd;
          if (cd <= 0) {
            clearInterval(iv);
            try { location.href = 'terminal.html'; } catch (e) {}
          }
        }, 1000);
        const cont = $('victory-continue');
        if (cont) cont.onclick = () => { try { location.href = 'terminal.html'; } catch (e) {} };
      } else {
        const card = $('game-status-card');
        if (card) {
          card.classList.remove('hidden');
          const title = $('status-card-title');
          const desc = $('status-card-desc');
          if (title) {
            title.textContent = 'ЗАЩИТА УЗЛА УСПЕШНА';
            title.className = 'font-headline font-bold text-xl text-neon-cyan tracking-wide uppercase';
          }
          if (desc) desc.textContent = 'Периметр удержан. Байты собраны. Переход к терминалу П.Р.И.Н.Ц.';
        }
        setTimeout(() => { try { location.href = 'terminal.html'; } catch (e) {} }, 2800);
      }
      const i4 = $('task-icon-4'); if (i4) i4.textContent = '✓';
    }
  
    function restart() {
      if (S.win) { try { location.href = 'terminal.html'; } catch (e) {} return; }
      S.p = { x: 1, y: 13, dx: 0, dy: -1, hide: false, light: true };
      S.threats = [
        { x: 17, y: 11, type: 'virus', timer: 0, freeze: 0 },
        { x: 8, y: 3, type: 'bug', timer: 0, freeze: 0 },
        { x: 14, y: 10, type: 'hacker', timer: 0, freeze: 0 }
      ];
      S.power = 100; S.noise = 0; S.stealth = 100;
      S.bytes = 0; S.terms = 0; S.door = false;
      S.dead = false; S.win = false; S.sonar = 0; S.highlight = 0;
      S.steps = 0; S.time = 0; S.nearTerm = null;
      S.dotsGot = 0;
      shards.forEach(s => { s.got = false; });
      terminals.forEach(t => { t.read = false; });
      rebuildDots();
      S.dotsTotal = dots.length;
      const card = $('game-status-card');
      if (card) card.classList.add('hidden');
      const modal = $('game-modal');
      if (modal) modal.classList.add('hidden');
      if (glitchC) glitchC.style.opacity = '0';
      S.startTime = Date.now();
      updateHUD();
    }
  
    /* ── input (e.code = RU/EN) ── */
    window.addEventListener('keydown', e => {
      // still in bios / mission intro?
      if ($('bios-boot') || ($('mission-intro') && !$('mission-intro').classList.contains('hide') && $('mission-intro').style.display !== 'none' && $('mission-intro').classList.contains('show'))) {
        return;
      }
      if ($('sys-entry')) return;
  
      if (S.dead || S.win) {
        if (e.code === 'Enter' || e.key === 'Enter') {
          if (S.win) try { location.href = 'terminal.html'; } catch (err) {}
          else restart();
        }
        return;
      }
  
      const code = e.code;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'KeyF', 'KeyQ'].includes(code)) {
        e.preventDefault();
      }
      switch (code) {
        case 'KeyW': case 'ArrowUp': move(0, -1); break;
        case 'KeyS': case 'ArrowDown': move(0, 1); break;
        case 'KeyA': case 'ArrowLeft': move(-1, 0); break;
        case 'KeyD': case 'ArrowRight': move(1, 0); break;
        case 'Space': cloak(); break;
        case 'KeyE': sonar(); break;
        case 'KeyF': useTerminal(); break;
        case 'KeyQ': jam(); break;
      }
    });
  
    const stealthBtn = $('btn-stealth-action');
    if (stealthBtn) stealthBtn.onclick = cloak;
    const sonarBtn = $('btn-sonar-action');
    if (sonarBtn) sonarBtn.onclick = sonar;
    const restartBtn = $('btn-modal-restart') || $('modal-btn');
    if (restartBtn) restartBtn.onclick = restart;
  
    const hudToggle = $('btn-toggle-hud');
    if (hudToggle) hudToggle.onclick = () => {
      const list = $('task-list');
      if (!list) return;
      list.classList.toggle('hidden');
      hudToggle.textContent = list.classList.contains('hidden') ? '[РАЗВЕРНУТЬ]' : '[СВЕРНУТЬ]';
    };
  
    setInterval(tickAI, 520);
    function loop() { render(); requestAnimationFrame(loop); }
    requestAnimationFrame(loop);
    updateHUD();
  
    /* ── unlock game when entry layers gone ── */
    function tryReady() {
      if (S.ready) return;
      if ($('bios-boot')) return;
      const mi = $('mission-intro');
      if (mi && mi.classList.contains('show') && !mi.classList.contains('hide')) return;
      if ($('sys-entry')) return;
      S.ready = true;
      S.startTime = Date.now();
      updateHUD();
      showToast('ПОИСК НАЧАТ · SUB-04', 'Собери байты и крошки. Защити узел.');
    }
    setInterval(tryReady, 400);
  
    // If no bios layer, start immediately after short delay
    setTimeout(() => {
      if (!$('bios-boot') && !$('sys-entry')) tryReady();
    }, 800);
  
    // expose for bios close hooks
    window.__limboStartSearch = function () {
      S.ready = true;
      S.startTime = Date.now();
      updateHUD();
    };
  })();
  