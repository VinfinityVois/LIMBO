(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // ../../../tmp/limbo-build/phaser-shim.js
  var require_phaser_shim = __commonJS({
    "../../../tmp/limbo-build/phaser-shim.js"(exports, module) {
      module.exports = window.Phaser;
      module.exports.default = window.Phaser;
    }
  });

  // intro-src/main.ts
  var import_phaser3 = __toESM(require_phaser_shim());

  // intro-src/scenes/BiosScene.ts
  var import_phaser = __toESM(require_phaser_shim());
  var BiosScene = class extends import_phaser.default.Scene {
    constructor() {
      super("Bios");
    }
    create() {
      const start = () => {
        const btn2 = document.getElementById("btn-bios-confirm");
        if (btn2 && btn2.disabled) return;
        const layer = document.getElementById("bios-layer");
        if (layer) {
          layer.classList.add("bios-out");
          setTimeout(() => layer.remove(), 600);
        }
        const mode = document.getElementById("crt-mode-state");
        if (mode) mode.textContent = "\u041F\u041E\u0418\u0421\u041A";
        const st = document.getElementById("footer-status-pill");
        if (st) st.textContent = "\u041F\u041E\u0418\u0421\u041A";
        this.scene.start("Search");
      };
      window.__limboStartSearch = start;
      const btn = document.getElementById("btn-bios-confirm");
      if (btn) btn.addEventListener("click", start);
      const onKey = (e) => {
        if (e.code === "Enter" || e.code === "Space") {
          e.preventDefault();
          const b = document.getElementById("btn-bios-confirm");
          if (b && b.disabled) return;
          window.removeEventListener("keydown", onKey);
          start();
        }
      };
      window.addEventListener("keydown", onKey);
      this.runBiosLog();
    }
    runBiosLog() {
      const log = document.getElementById("bios-log");
      if (!log) return;
      const lines = [
        { t: "POST \xB7 neural bus check\u2026", c: "dim" },
        { t: "CPU SYNAPSE-8 \xB7 OK", c: "ok" },
        { t: "AUTH A-55 \xB7 \u0425\u044D \u042E\u0447\u043E\u0443 \xB7 OK", c: "ok" },
        { t: "ROLE \xB7 \u0421\u041C\u041E\u0422\u0420\u042F\u0429\u0418\u0419 (\u043D\u0435 \u0441\u0443\u0431\u044A\u0435\u043A\u0442)", c: "ok" },
        { t: "WARN \xB7 quarantine SUB-04 soft-open", c: "warn" },
        { t: "MODE \xB7 SEARCH / RECOVERY (\u043D\u0435 \u043F\u0435\u0440\u0435\u0445\u0432\u0430\u0442)", c: "ok" },
        { t: "OBJ \xB7 5 \u0431\u0430\u0439\u0442 \u043F\u0430\u043C\u044F\u0442\u0438 + 3 \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B\u0430 \u2192 Alpha", c: "ok" },
        { t: "NOTE \xB7 \u0438\u0441\u0441\u043B\u0435\u0434\u0443\u0439\u0442\u0435 \u043A\u043E\u043C\u043D\u0430\u0442\u044B \xB7 \u0441\u0438\u0433\u043D\u0430\u0442\u0443\u0440\u044B \u043C\u0435\u0434\u043B\u0435\u043D\u043D\u044B\u0435", c: "dim" },
        { t: "CHANNEL READY \xB7 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0432\u0445\u043E\u0434", c: "ok" }
      ];
      let i = 0;
      const push = () => {
        if (i >= lines.length || !document.getElementById("bios-log")) return;
        const d = document.createElement("div");
        d.className = "bios-line " + lines[i].c;
        d.textContent = "> " + lines[i].t;
        log.appendChild(d);
        i++;
        if (i >= lines.length) {
          const btn = document.getElementById("btn-bios-confirm");
          if (btn) btn.disabled = false;
        }
        if (i < lines.length) window.setTimeout(push, 170 + Math.random() * 110);
      };
      window.setTimeout(push, 280);
    }
  };

  // intro-src/scenes/SearchScene.ts
  var import_phaser2 = __toESM(require_phaser_shim());

  // intro-src/systems/MapData.ts
  var TILE = {
    FLOOR: 0,
    WALL: 1,
    GATE: 2,
    SERVER: 3,
    POD: 4,
    TERMINAL: 5,
    CABLE: 6,
    HAZARD: 7
  };
  var COLS = 32;
  var ROWS = 18;
  var TILE_SIZE = 40;
  var MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 6, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 6, 0, 0, 0, 0, 4, 0, 1, 0, 0, 0, 6, 0, 0, 1],
    [1, 0, 3, 3, 0, 4, 0, 1, 0, 3, 3, 3, 0, 0, 1, 0, 4, 0, 0, 5, 3, 3, 0, 0, 1, 0, 4, 0, 3, 3, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 7, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 7, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 5, 0, 0, 0, 3, 0, 0, 5, 0, 6, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 3, 0, 0, 0, 4, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 4, 0, 0, 3, 3, 0, 0, 4, 0, 0, 3, 0, 6, 0, 0, 3, 0, 0, 4, 0, 0, 3, 3, 0, 0, 4, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 1],
    [1, 0, 3, 3, 0, 0, 4, 0, 0, 3, 3, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 3, 3, 0, 0, 4, 0, 0, 3, 3, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];
  var BYTES = [
    { x: 3, y: 2, code: "0x7F", title: "\u0416\u0423\u0420\u041D\u0410\u041B \u0421\u041C\u041E\u0422\u0420\u042F\u0429\u0415\u0413\u041E", lore: "\u0421\u0431\u043E\u0439 \u043A\u043E\u043B\u043B\u0438\u0437\u0438\u0439. \u041C\u0435\u0442\u043A\u0430 A-55. \u0428\u0430\u043D\u0445\u0430\u0439.", collected: false },
    { x: 12, y: 2, code: "0x9A", title: "\u0421\u0418\u0413\u041D\u0410\u0422\u0423\u0420\u0410 \u0426\u0415\u0424\u0415\u0419", lore: "\u041A\u0440\u0438\u043F\u0442\u043E-\u043F\u043E\u0434\u043F\u0438\u0441\u044C \u044F\u0434\u0440\u0430. \u041D\u0443\u0436\u043D\u0430 \u0434\u043B\u044F \u0448\u043B\u044E\u0437\u0430.", collected: false },
    { x: 28, y: 3, code: "0x1C", title: "\u0421\u041D\u0418\u041C\u041E\u041A \u041F\u0410\u041C\u042F\u0422\u0418", lore: "\u0414\u0430\u043C\u043F \u0438\u0437 \u043A\u0430\u043F\u0441\u0443\u043B\u044B. \u0421\u0446\u0435\u043D\u0430 \xAB\u0420\u0451\u043A\u0430\u043D\xBB \u0430\u043A\u0442\u0438\u0432\u043D\u0430.", collected: false },
    { x: 8, y: 14, code: "0x4E", title: "\u041A\u041B\u042E\u0427 \u041C\u0410\u0420\u0428\u0420\u0423\u0422\u0410", lore: "\u041E\u0431\u0445\u043E\u0434 \u043A\u0430\u0440\u0430\u043D\u0442\u0438\u043D\u0430 SUB-04.", collected: false },
    { x: 24, y: 14, code: "0x00", title: "\u041D\u0423\u041B\u0415\u0412\u041E\u0419 \u0411\u0410\u0419\u0422", lore: "\u0410\u043D\u043E\u043C\u0430\u043B\u0438\u044F ZERO. \u0421\u043E\u0431\u0435\u0440\u0438\u0442\u0435 \u0438 \u0443\u0445\u043E\u0434\u0438\u0442\u0435.", collected: false }
  ];
  var TERMINALS = [
    { x: 2, y: 6, label: "TERM-01", lore: "\u0421\u043C\u0435\u043D\u0430 04. \u0410\u043D\u043E\u043C\u0430\u043B\u0438\u044F \u043F\u043B\u043E\u0442\u043D\u043E\u0441\u0442\u0438 \u0432 \u0441\u0435\u043A\u0442\u043E\u0440\u0435 B.", read: false },
    { x: 9, y: 6, label: "TERM-02", lore: "\u041F\u0435\u0440\u0435\u0433\u0440\u0443\u0437\u043A\u0430 \u043A\u043B\u0430\u0441\u0442\u0435\u0440\u0430 8. \u0421\u0435\u0440\u0432\u0435\u0440\u0430 \u0428\u0430\u043D\u0445\u0430\u044F.", read: false },
    { x: 21, y: 6, label: "TERM-03", lore: "\u041F\u043E\u043C\u0435\u0442\u043A\u0430 \xAB\u0421\u044E\u0430\u043D\u044C \u0423\xBB \u2014 7 \u0437\u0430\u043A\u0440\u044B\u0442\u044B\u0445 \u043F\u0440\u043E\u0442\u043E\u043A\u043E\u043B\u043E\u0432.", read: false }
  ];
  function isBlocked(x, y, gateOpen) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return true;
    const t = MAP[y][x];
    if (t === TILE.WALL || t === TILE.SERVER || t === TILE.POD) return true;
    if (t === TILE.GATE && !gateOpen) return true;
    return false;
  }
  var ROOMS = [
    { name: "\u041F\u041E\u0421\u0422 1A", x1: 1, y1: 1, x2: 6, y2: 3 },
    { name: "\u0421\u0415\u0420\u0412\u0415\u0420\u041D\u0410\u042F 2B", x1: 15, y1: 1, x2: 23, y2: 4 },
    { name: "\u041A\u0420\u0418\u041E 3C", x1: 1, y1: 9, x2: 6, y2: 12 },
    { name: "\u0425\u0420\u0410\u041D\u0418\u041B\u0418\u0429\u0415 4D", x1: 20, y1: 9, x2: 30, y2: 14 },
    { name: "\u0428\u041B\u042E\u0417 ALPHA", x1: 1, y1: 15, x2: 8, y2: 16 }
  ];
  function roomAt(x, y) {
    for (const r of ROOMS) {
      if (x >= r.x1 && x <= r.x2 && y >= r.y1 && y <= r.y2) return r.name;
    }
    return "\u041C\u0410\u0413\u0418\u0421\u0422\u0420\u0410\u041B\u042C SUB-04";
  }

  // intro-src/systems/AudioBus.ts
  var AudioBus = class {
    constructor() {
      __publicField(this, "ctx", null);
      __publicField(this, "muted", false);
    }
    init() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
    }
    tone(freq, dur, type = "triangle", vol = 0.04) {
      if (!this.ctx || this.muted) return;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.value = vol;
      g.gain.exponentialRampToValueAtTime(1e-3, this.ctx.currentTime + dur);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start();
      o.stop(this.ctx.currentTime + dur);
    }
    step() {
      this.tone(100 + Math.random() * 30, 0.05, "triangle", 0.02);
    }
    pickup() {
      [523, 659, 784].forEach((f, i) => setTimeout(() => this.tone(f, 0.08, "square", 0.035), i * 50));
    }
    sonar() {
      this.tone(90, 0.45, "sine", 0.05);
      this.tone(160, 0.3, "triangle", 0.03);
    }
    terminal() {
      this.tone(300, 0.08, "sine", 0.04);
      this.tone(450, 0.12, "triangle", 0.03);
    }
    warn() {
      this.tone(110, 0.1, "sawtooth", 0.03);
    }
    toggleMute() {
      this.muted = !this.muted;
      if (this.ctx) {
        if (this.muted) void this.ctx.suspend();
        else void this.ctx.resume();
      }
      return this.muted;
    }
  };

  // intro-src/scenes/SearchScene.ts
  var SearchScene = class extends import_phaser2.default.Scene {
    constructor() {
      super("Search");
      __publicField(this, "audio", new AudioBus());
      __publicField(this, "cursors");
      __publicField(this, "wasd");
      __publicField(this, "keyE");
      __publicField(this, "keyF");
      __publicField(this, "keySpace");
      __publicField(this, "player", { x: 3, y: 15, dir: { x: 1, y: 0 }, stealth: false, light: true });
      __publicField(this, "bytes", BYTES.map((b) => ({ ...b })));
      __publicField(this, "terminals", TERMINALS.map((t) => ({ ...t })));
      __publicField(this, "collected", 0);
      __publicField(this, "termsRead", 0);
      __publicField(this, "gateOpen", false);
      __publicField(this, "power", 100);
      __publicField(this, "sonarT", 0);
      __publicField(this, "highlightT", 0);
      __publicField(this, "moveLock", false);
      /** Ambient patrols — slow, limited aggro radius */
      __publicField(this, "patrols", [
        { x: 10, y: 3, dir: 1, kind: "virus", timer: 0 },
        { x: 18, y: 13, dir: -1, kind: "bug", timer: 0 }
      ]);
      __publicField(this, "watcher", { x: 26, y: 10, timer: 0, lost: 0, lastX: 16, lastY: 8 });
      __publicField(this, "mapGfx");
      __publicField(this, "fogGfx");
      __publicField(this, "entGfx");
      __publicField(this, "dead", false);
      __publicField(this, "won", false);
    }
    create() {
      var _a, _b, _c;
      this.cameras.main.setBackgroundColor("#020307");
      this.mapGfx = this.add.graphics();
      this.entGfx = this.add.graphics();
      this.fogGfx = this.add.graphics();
      if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys("W,A,S,D");
        this.keyE = this.input.keyboard.addKey("E");
        this.keyF = this.input.keyboard.addKey("F");
        this.keySpace = this.input.keyboard.addKey("SPACE");
        this.input.keyboard.on("keydown", (e) => this.onKey(e));
      }
      this.drawMapStatic();
      this.syncHud();
      this.showToast("\u0421\u0415\u041A\u0422\u041E\u0420 SUB-04 \xB7 \u0420\u0415\u0416\u0418\u041C \u041F\u041E\u0418\u0421\u041A\u0410", "\u0418\u0441\u0441\u043B\u0435\u0434\u0443\u0439\u0442\u0435 \u043A\u043E\u043C\u043D\u0430\u0442\u044B, \u0441\u043E\u0431\u0438\u0440\u0430\u0439\u0442\u0435 \u0431\u0430\u0439\u0442\u044B. \u0421\u0438\u0433\u043D\u0430\u0442\u0443\u0440\u044B \u043C\u0435\u0434\u043B\u0435\u043D\u043D\u044B\u0435 \u2014 \u043D\u0435 \u0431\u0435\u0433\u0438\u0442\u0435, \u0438\u0449\u0438\u0442\u0435.");
      (_a = document.getElementById("btn-stealth-action")) == null ? void 0 : _a.addEventListener("click", () => this.toggleStealth());
      (_b = document.getElementById("btn-sonar-action")) == null ? void 0 : _b.addEventListener("click", () => this.sonar());
      (_c = document.getElementById("btn-audio-toggle")) == null ? void 0 : _c.addEventListener("click", () => {
        this.audio.init();
        const m = this.audio.toggleMute();
        const ic = document.getElementById("audio-icon");
        if (ic) ic.textContent = m ? "volume_off" : "volume_up";
      });
      this.time.addEvent({ delay: 720, loop: true, callback: () => this.tickPatrols() });
    }
    onKey(e) {
      if (this.dead || this.won) {
        if (e.code === "Enter") {
          if (this.won) location.href = "terminal.html";
          else this.scene.restart();
        }
        return;
      }
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          this.tryMove(0, -1);
          break;
        case "KeyS":
        case "ArrowDown":
          this.tryMove(0, 1);
          break;
        case "KeyA":
        case "ArrowLeft":
          this.tryMove(-1, 0);
          break;
        case "KeyD":
        case "ArrowRight":
          this.tryMove(1, 0);
          break;
        case "Space":
          this.toggleStealth();
          break;
        case "KeyE":
          this.sonar();
          break;
        case "KeyF":
          this.readTerminal();
          break;
      }
    }
    tryMove(dx, dy) {
      if (this.moveLock || this.dead || this.won) return;
      this.audio.init();
      if (this.player.stealth) this.toggleStealth();
      this.player.dir = { x: dx, y: dy };
      const nx = this.player.x + dx;
      const ny = this.player.y + dy;
      if (isBlocked(nx, ny, this.gateOpen)) return;
      this.player.x = nx;
      this.player.y = ny;
      this.audio.step();
      this.moveLock = true;
      this.time.delayedCall(90, () => {
        this.moveLock = false;
      });
      this.bytes.forEach((b, idx) => {
        if (!b.collected && b.x === nx && b.y === ny) {
          b.collected = true;
          this.collected++;
          this.audio.pickup();
          this.showToast(`\u0411\u0410\u0419\u0422 ${b.code} \xB7 ${b.title}`, b.lore);
          this.markSlot(idx, b.code);
          this.syncHud();
          if (this.collected >= 5) {
            this.gateOpen = true;
            this.showToast("\u0428\u041B\u042E\u0417 ALPHA \u0420\u0410\u0417\u0411\u041B\u041E\u041A\u0418\u0420\u041E\u0412\u0410\u041D", "\u0412\u0441\u0435 \u0431\u0430\u0439\u0442\u044B \u0441\u043E\u0431\u0440\u0430\u043D\u044B. \u041D\u0430\u0439\u0434\u0438\u0442\u0435 GATE \u0432\u043D\u0438\u0437\u0443 \u0441\u043B\u0435\u0432\u0430.");
          }
        }
      });
      if (this.gateOpen && ny === 16 && (nx === 1 || nx === 2)) this.victory();
      this.syncHud();
    }
    readTerminal() {
      if (this.dead || this.won) return;
      this.audio.init();
      const p = this.player;
      const term = this.terminals.find((t) => Math.abs(t.x - p.x) <= 1 && Math.abs(t.y - p.y) <= 1);
      if (!term) {
        this.showToast("\u041D\u0415\u0422 \u0422\u0415\u0420\u041C\u0418\u041D\u0410\u041B\u0410 \u0412 \u0420\u0410\u0414\u0418\u0423\u0421\u0415");
        return;
      }
      if (term.read) {
        this.showToast("\u0423\u0416\u0415 \u0421\u0427\u0418\u0422\u0410\u041D\u041E \xB7 " + term.label);
        return;
      }
      term.read = true;
      this.termsRead++;
      this.audio.terminal();
      this.showToast(`${term.label} \xB7 \u0414\u0410\u041C\u041F`, term.lore);
      this.syncHud();
    }
    toggleStealth() {
      if (this.dead || this.won) return;
      this.audio.init();
      this.player.stealth = !this.player.stealth;
      this.player.light = !this.player.stealth;
      this.showToast(this.player.stealth ? "\u041C\u0410\u0421\u041A\u0418\u0420\u041E\u0412\u041A\u0410 \xB7 \u0421\u0412\u0415\u0422 \u0412\u042B\u041A\u041B" : "\u041F\u0410\u0422\u0420\u0423\u041B\u042C \xB7 \u0421\u0412\u0415\u0422 \u0412\u041A\u041B");
      this.syncHud();
    }
    sonar() {
      if (this.dead || this.won) return;
      this.audio.init();
      if (this.power < 8) {
        this.showToast("\u041C\u0410\u041B\u041E \u042D\u041D\u0415\u0420\u0413\u0418\u0418");
        return;
      }
      this.power -= 8;
      this.sonarT = 1.35;
      this.highlightT = 200;
      this.audio.sonar();
      this.showToast("[E] \u0421\u041E\u041D\u0410\u0420", "\u041A\u0430\u0440\u0442\u0430 \u0438 \u0441\u0438\u0433\u043D\u0430\u0442\u0443\u0440\u044B \u043F\u043E\u0434\u0441\u0432\u0435\u0447\u0435\u043D\u044B \u0434\u043E\u043B\u044C\u0448\u0435.");
      this.showToast("\u0421\u041E\u041D\u0410\u0420 \xB7 \u0421\u041A\u0410\u041D \u0421\u0415\u041A\u0422\u041E\u0420\u0410", "\u041A\u0430\u0440\u0442\u0430 \u0438 \u0441\u0438\u0433\u043D\u0430\u0442\u0443\u0440\u044B \u043F\u043E\u0434\u0441\u0432\u0435\u0447\u0435\u043D\u044B \u0434\u043E\u043B\u044C\u0448\u0435.");
      this.syncHud();
    }
    tickPatrols() {
      if (this.dead || this.won) return;
      const p = this.player;
      this.patrols.forEach((v) => {
        v.timer++;
        const dist = Math.hypot(p.x - v.x, p.y - v.y);
        const curious = !p.stealth && p.light && dist < 3.2;
        if (v.timer % (curious ? 3 : 5) === 0) {
          if (curious) {
            const dx = Math.sign(p.x - v.x);
            const dy = Math.sign(p.y - v.y);
            if (!isBlocked(v.x + dx, v.y, this.gateOpen)) v.x += dx;
            else if (!isBlocked(v.x, v.y + dy, this.gateOpen)) v.y += dy;
          } else if (!isBlocked(v.x + v.dir, v.y, this.gateOpen)) {
            v.x += v.dir;
          } else {
            v.dir *= -1;
          }
        }
        if (v.x === p.x && v.y === p.y && !p.stealth) {
          this.fail("\u0421\u0438\u0433\u043D\u0430\u0442\u0443\u0440\u0430 \u043F\u0435\u0440\u0435\u0445\u0432\u0430\u0442\u0438\u043B\u0430 \u043A\u0430\u043D\u0430\u043B \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u043F\u043E\u0438\u0441\u043A\u0430.");
        }
      });
      this.watcher.timer++;
      if (p.stealth) this.watcher.lost = Math.min(10, this.watcher.lost + 1);
      else {
        this.watcher.lost = Math.max(0, this.watcher.lost - 1);
        this.watcher.lastX = p.x;
        this.watcher.lastY = p.y;
      }
      if (this.watcher.timer % 5 === 0) {
        const tx = this.watcher.lost > 6 ? this.watcher.lastX : p.x;
        const ty = this.watcher.lost > 6 ? this.watcher.lastY : p.y;
        const dx = Math.sign(tx - this.watcher.x);
        const dy = Math.sign(ty - this.watcher.y);
        if (!isBlocked(this.watcher.x + dx, this.watcher.y, this.gateOpen)) this.watcher.x += dx;
        else if (!isBlocked(this.watcher.x, this.watcher.y + dy, this.gateOpen)) this.watcher.y += dy;
      }
      if (Math.hypot(p.x - this.watcher.x, p.y - this.watcher.y) < 1.1 && !p.stealth) {
        this.fail("\u0425\u0430\u043A\u0435\u0440-\u0441\u0438\u0433\u043D\u0430\u0442\u0443\u0440\u0430 \u0437\u0430\u0444\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u043B\u0430 \u0430\u0432\u0430\u0442\u0430\u0440.");
      }
    }
    fail(reason) {
      this.dead = true;
      this.audio.warn();
      this.showEnd(false, reason);
    }
    victory() {
      this.won = true;
      this.audio.pickup();
      const layer = document.getElementById("exit-layer");
      if (layer) {
        layer.classList.remove("hidden");
        layer.classList.add("active");
      }
      this.time.delayedCall(1600, () => {
        try {
          location.href = "terminal.html";
        } catch (e) {
        }
      });
    }
    showEnd(win, msg) {
      const card = document.getElementById("game-status-card");
      if (!card) return;
      const title = document.getElementById("status-card-title");
      const desc = document.getElementById("status-card-desc");
      if (title) {
        title.textContent = win ? "\u041A\u0410\u041D\u0410\u041B \u041E\u0422\u041A\u0420\u042B\u0422" : "\u041A\u0410\u041D\u0410\u041B \u0421\u041A\u041E\u041C\u041F\u0420\u041E\u041C\u0415\u0422\u0418\u0420\u041E\u0412\u0410\u041D";
        title.className = win ? "font-headline font-bold text-xl text-neon-cyan tracking-wide uppercase" : "font-headline font-bold text-xl text-corruption-red tracking-wide uppercase";
      }
      if (desc) desc.textContent = msg;
      card.classList.remove("hidden");
    }
    markSlot(idx, code) {
      const el = document.getElementById("byte-slot-" + idx);
      if (!el) return;
      el.textContent = code;
      el.classList.add("got");
    }
    showToast(msg, lore = "") {
      const box = document.getElementById("toast-interaction");
      const m = document.getElementById("toast-message");
      const l = document.getElementById("toast-lore");
      if (!box || !m) return;
      m.textContent = msg;
      if (l) l.textContent = lore;
      box.classList.add("show");
      window.clearTimeout(box._t);
      box._t = window.setTimeout(() => box.classList.remove("show"), 3200);
    }
    syncHud() {
      const set = (id, t) => {
        const e = document.getElementById(id);
        if (e) e.textContent = t;
      };
      set("ui-power-val", Math.round(this.power) + "%");
      set("task-shards-num", this.collected + "/5");
      set("task-term-num", this.termsRead + "/3");
      set("footer-term-pill", this.termsRead + " / 3");
      set("crt-room-id", "ROOM: " + roomAt(this.player.x, this.player.y));
      set("crt-mode-state", this.player.stealth ? "\u041C\u0410\u0421\u041A\u0418\u0420\u041E\u0412\u041A\u0410" : "\u041F\u041E\u0418\u0421\u041A");
      set("footer-status-pill", this.player.stealth ? "\u0421\u0422\u0415\u041B\u0421" : "\u041F\u041E\u0418\u0421\u041A");
      set("footer-light-pill", this.player.light && !this.player.stealth ? "\u0412\u041A\u041B" : "\u0412\u042B\u041A\u041B");
      set("footer-gate-pill", this.gateOpen ? "\u041E\u0422\u041A\u0420\u042B\u0422" : "\u0417\u0410\u041A\u0420\u042B\u0422");
      set("task-gate-status", this.gateOpen ? "\u041E\u0422\u041A\u0420\u042B\u0422" : "\u0411\u041B\u041E\u041A");
      if (this.collected >= 5) set("task-counter", this.termsRead >= 3 ? "3 / 4" : "2 / 4");
    }
    drawMapStatic() {
    }
    update() {
      if (this.sonarT > 0) this.sonarT = Math.max(0, this.sonarT - 8e-3);
      if (this.highlightT > 0) this.highlightT--;
      this.mapGfx.clear();
      this.entGfx.clear();
      this.fogGfx.clear();
      for (let r2 = 0; r2 < ROWS; r2++) {
        for (let c = 0; c < COLS; c++) {
          const t = MAP[r2][c];
          const x = c * TILE_SIZE;
          const y = r2 * TILE_SIZE;
          if (t === TILE.WALL) {
            this.mapGfx.fillStyle(66e4, 1);
            this.mapGfx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            this.mapGfx.lineStyle(1, 61695, 0.05);
            this.mapGfx.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
          } else if (t === TILE.SERVER) {
            this.mapGfx.fillStyle(856610, 1);
            this.mapGfx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            this.mapGfx.fillStyle((Date.now() + c * 100) % 600 > 300 ? 61695 : 17493, 1);
            this.mapGfx.fillRect(x + 6, y + 8, 8, 4);
            this.mapGfx.fillStyle(16758784, 1);
            this.mapGfx.fillRect(x + 18, y + 8, 6, 4);
          } else if (t === TILE.POD) {
            this.mapGfx.fillStyle(528928, 1);
            this.mapGfx.fillRect(x + 5, y + 4, TILE_SIZE - 10, TILE_SIZE - 8);
            this.mapGfx.lineStyle(1, 61695, 0.3);
            this.mapGfx.strokeRect(x + 5, y + 4, TILE_SIZE - 10, TILE_SIZE - 8);
          } else if (t === TILE.TERMINAL) {
            const term = this.terminals.find((tm) => tm.x === c && tm.y === r2);
            const ok = term == null ? void 0 : term.read;
            this.mapGfx.fillStyle(ok ? 862242 : 1709096, 1);
            this.mapGfx.fillRect(x + 4, y + 6, TILE_SIZE - 8, TILE_SIZE - 12);
            this.mapGfx.lineStyle(1, ok ? 61695 : 16758784, 1);
            this.mapGfx.strokeRect(x + 4, y + 6, TILE_SIZE - 8, TILE_SIZE - 12);
          } else if (t === TILE.GATE) {
            this.mapGfx.fillStyle(this.gateOpen ? 61695 : 16722517, 1);
            this.mapGfx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            this.mapGfx.fillStyle(329489, 1);
            this.mapGfx.fillRect(x + 5, y + 5, TILE_SIZE - 10, TILE_SIZE - 10);
          } else if (t === TILE.CABLE) {
            this.mapGfx.fillStyle(7725, 0.5);
            this.mapGfx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            this.mapGfx.lineStyle(1, 61695, 0.4);
            this.mapGfx.lineBetween(x + 4, y + 20, x + 36, y + 20);
          } else if (t === TILE.HAZARD) {
            this.mapGfx.fillStyle(16722517, 0.08);
            this.mapGfx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          } else if ((c + r2) % 2 === 0) {
            this.mapGfx.fillStyle(10295, 0.12);
            this.mapGfx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          }
        }
      }
      this.bytes.forEach((b) => {
        if (b.collected) return;
        const bx = b.x * TILE_SIZE + 20;
        const by = b.y * TILE_SIZE + 20 + Math.sin(Date.now() / 220) * 3;
        this.entGfx.fillStyle(61695, 0.25);
        this.entGfx.fillCircle(bx, by, 14);
        this.entGfx.fillStyle(61695, 1);
        this.entGfx.fillCircle(bx, by, 5);
      });
      const hl = this.highlightT > 0;
      this.patrols.forEach((v, i) => {
        const vx = v.x * TILE_SIZE;
        const vy = v.y * TILE_SIZE;
        if (hl) {
          this.entGfx.lineStyle(2, 16722517, 0.9);
          this.entGfx.strokeRect(vx + 2, vy + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        }
        this.entGfx.fillStyle(v.kind === "virus" ? 16722517 : 16758784, 1);
        this.entGfx.fillRect(vx + 10, vy + 10, 20, 20);
        this.entGfx.fillStyle(16777215, 1);
        this.entGfx.fillRect(vx + 16, vy + 16, 5, 5);
      });
      {
        const wx = this.watcher.x * TILE_SIZE;
        const wy = this.watcher.y * TILE_SIZE;
        if (hl) {
          this.entGfx.lineStyle(2, 16722517, 1);
          this.entGfx.strokeRect(wx + 1, wy + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        }
        this.entGfx.fillStyle(655880, 1);
        this.entGfx.fillRect(wx + 4, wy + 2, 32, 36);
        this.entGfx.lineStyle(1, 16722517, 1);
        this.entGfx.strokeRect(wx + 6, wy + 4, 28, 32);
        this.entGfx.fillStyle(16722517, 0.7 + Math.sin(Date.now() / 180) * 0.3);
        this.entGfx.fillRect(wx + 12, wy + 12, 16, 10);
        this.entGfx.fillStyle(16777215, 1);
        this.entGfx.fillRect(wx + 18, wy + 14, 4, 6);
      }
      {
        const px = this.player.x * TILE_SIZE;
        const py = this.player.y * TILE_SIZE;
        const cx2 = px + TILE_SIZE / 2;
        const cy2 = py + TILE_SIZE / 2;
        if (this.player.stealth) {
          this.entGfx.lineStyle(1, 54504, 0.45);
          this.entGfx.strokeCircle(cx2, cy2, 10);
          this.entGfx.fillStyle(54504, 0.2);
          this.entGfx.fillCircle(cx2, cy2, 6);
        } else {
          this.entGfx.fillStyle(792616, 1);
          this.entGfx.fillRect(px + 12, py + 10, 16, 20);
          this.entGfx.lineStyle(1, 54504, 0.9);
          this.entGfx.strokeRect(px + 12, py + 10, 16, 20);
          this.entGfx.fillStyle(54504, 1);
          this.entGfx.fillRect(px + 14, py + 14, 12, 4);
          const dx = this.player.dir.x;
          const dy = this.player.dir.y;
          this.entGfx.fillStyle(61695, 1);
          this.entGfx.fillCircle(cx2 + dx * 10, cy2 + dy * 10, 3);
        }
      }
      const cx = this.player.x * TILE_SIZE + TILE_SIZE / 2;
      const cy = this.player.y * TILE_SIZE + TILE_SIZE / 2;
      const viewR = this.player.stealth || !this.player.light ? 90 : 150;
      const sonarBoost = this.sonarT > 0 ? (1 - this.sonarT) * 280 + 40 : 0;
      const r = viewR + sonarBoost;
      const W = COLS * TILE_SIZE;
      const H = ROWS * TILE_SIZE;
      const fogA = this.sonarT > 0 ? 0.28 : 0.55;
      this.fogGfx.fillStyle(131848, fogA);
      this.fogGfx.fillRect(0, 0, W, H);
      this.fogGfx.fillStyle(131848, 0);
      for (let i = 6; i >= 1; i--) {
        const rr = r * i / 6;
        const a = fogA * (1 - i / 6) * 0.15;
      }
      this.fogGfx.clear();
      this.fogGfx.fillStyle(131848, this.sonarT > 0 ? 0.15 : 0.32);
      this.fogGfx.fillRect(0, 0, W, H);
      this.entGfx.lineStyle(1, 54504, this.player.stealth ? 0.15 : 0.28);
      this.entGfx.strokeCircle(cx, cy, r * 0.35);
      if (this.player.light && !this.player.stealth) {
        const ang = Math.atan2(this.player.dir.y, this.player.dir.x || 1e-3);
        this.entGfx.lineStyle(1, 54504, 0.2);
        this.entGfx.beginPath();
        this.entGfx.moveTo(cx, cy);
        this.entGfx.arc(cx, cy, r * 0.55, ang - 0.4, ang + 0.4, false);
        this.entGfx.closePath();
        this.entGfx.strokePath();
      }
      let minD = Math.hypot(this.player.x - this.watcher.x, this.player.y - this.watcher.y);
      this.patrols.forEach((v) => {
        minD = Math.min(minD, Math.hypot(this.player.x - v.x, this.player.y - v.y));
      });
      const alert = document.getElementById("danger-alert");
      const threat = document.getElementById("ui-threat-badge");
      const glitch = document.getElementById("glitch-canvas");
      if (minD < 7) {
        const intensity = Math.pow(1 - minD / 7, 1.4);
        alert == null ? void 0 : alert.classList.remove("hidden");
        if (threat) threat.textContent = minD < 2 ? "\u041A\u0420\u0418\u0422\u0418\u0427\u041D\u041E" : "\u0412\u041D\u0418\u041C\u0410\u041D\u0418\u0415";
        if (glitch) {
          glitch.style.opacity = String(Math.min(0.7, intensity * 0.75));
          this.paintGlitch(glitch, intensity);
        }
      } else {
        alert == null ? void 0 : alert.classList.add("hidden");
        if (threat) threat.textContent = "\u041D\u041E\u0420\u041C\u0410";
        if (glitch) glitch.style.opacity = "0";
      }
    }
    paintGlitch(canvas, intensity) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const img = ctx.createImageData(w, h);
      const buf = new Uint32Array(img.data.buffer);
      const tC = 0.92 - intensity * 0.35;
      const tR = 0.97 - intensity * 0.25;
      for (let i = 0; i < buf.length; i++) {
        const r = Math.random();
        if (r > tC) buf[i] = 2852188415;
        else if (r > tR) buf[i] = 3439274581;
      }
      ctx.putImageData(img, 0, 0);
    }
  };

  // intro-src/main.ts
  var config = {
    type: import_phaser3.default.AUTO,
    parent: "phaser-root",
    width: COLS * TILE_SIZE,
    height: ROWS * TILE_SIZE,
    backgroundColor: "#020307",
    scene: [BiosScene, SearchScene],
    scale: {
      mode: import_phaser3.default.Scale.FIT,
      autoCenter: import_phaser3.default.Scale.CENTER_BOTH
    },
    input: { keyboard: true }
  };
  new import_phaser3.default.Game(config);
})();
