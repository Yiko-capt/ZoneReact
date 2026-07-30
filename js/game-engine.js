/**
 * ZoneReact - game-engine.js
 * Motor de Mapa 2D usando assets/mapa.png (2752x1536) y sprites animados de Leo
 */
window.ZR = window.ZR || {};

const MAP_WIDTH  = 2752;
const MAP_HEIGHT = 1536;

const ASSET_CACHE = {};
function preloadAsset(src) {
  if (ASSET_CACHE[src]) return ASSET_CACHE[src];
  const img = new Image();
  img.src = src;
  ASSET_CACHE[src] = img;
  return img;
}

// Preload map and Leo sprites
preloadAsset('assets/mapa.png');
preloadAsset('assets/Leo/leo_parado.png');
preloadAsset('assets/Leo/leo_camina0.png');
preloadAsset('assets/Leo/leo_camina1.png');

class GameEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = options;

    this.MAP_WIDTH  = MAP_WIDTH;
    this.MAP_HEIGHT = MAP_HEIGHT;
    this.camera     = { x: 0, y: 0 };

    // Posición inicial: Frente a la Casa de Leo (derecha en mapa.png)
    this.player = {
      wx: 2420,
      wy: 1020,
      speed: 4.8,
      size: 40,
      moving: false,
      dir: 'down',
      animFrame: 0,
      animTimer: 0
    };

    this.leo = {
      wx: 2360,
      wy: 1020,
      speed: 4.4,
      size: 40,
      moving: false,
      dir: 'down',
      animFrame: 0,
      animTimer: 0
    };

    this.keys = {};
    this.isRunning = false;
    this.rafId = null;

    this.situations = (options.situations || window.ZR.situations || []).map(s => ({
      ...s,
      triggered: false,
      wx: s.mapPosition.x,
      wy: s.mapPosition.y
    }));

    this.nearSituation = null;
    this.completedSituations = new Set();
    this.touch = { active: false, x: 0, y: 0 };

    this._bindInput();
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _bindInput() {
    this._onKeyDown = (e) => {
      this.keys[e.code] = true;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'KeyE' || e.code === 'Space') {
        if (this.nearSituation && !this.completedSituations.has(this.nearSituation.id)) {
          this._triggerSituation(this.nearSituation);
        }
      }
    };
    this._onKeyUp = (e) => { delete this.keys[e.code]; };

    this._onWheel = (e) => {
      if (this.isRunning) e.preventDefault();
    };

    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup',   this._onKeyUp);
    window.addEventListener('wheel',     this._onWheel, { passive: false });

    this.canvas.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.touch = {
        active: true,
        startX: t.clientX - rect.left,
        startY: t.clientY - rect.top,
        x: t.clientX - rect.left,
        y: t.clientY - rect.top
      };
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.touch.x = t.clientX - rect.left;
      this.touch.y = t.clientY - rect.top;
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.touch.active = false;
      if (this.nearSituation && !this.completedSituations.has(this.nearSituation.id)) {
        this._triggerSituation(this.nearSituation);
      }
    });
  }

  _resize() {
    const parent = this.canvas.parentElement;
    const w = parent && parent.clientWidth ? parent.clientWidth : window.innerWidth;
    const h = parent && parent.clientHeight ? parent.clientHeight : (window.innerHeight - 64);
    this.canvas.width  = Math.max(w, window.innerWidth);
    this.canvas.height = Math.max(h, window.innerHeight - 64);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this._resize();
    this.lastTime = performance.now();
    const loop = (time) => {
      if (!this.isRunning) return;
      const dt = Math.min((time - this.lastTime) / 16.67, 3);
      this.lastTime = time;
      this._update(dt);
      this._draw();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup',   this._onKeyUp);
    if (this._onWheel) window.removeEventListener('wheel', this._onWheel);
  }

  _update(dt) {
    const spd = this.player.speed * dt;
    let dx = 0, dy = 0;

    if (this.keys['ArrowUp']    || this.keys['KeyW']) dy -= 1;
    if (this.keys['ArrowDown']  || this.keys['KeyS']) dy += 1;
    if (this.keys['ArrowLeft']  || this.keys['KeyA']) dx -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) dx += 1;

    if (this.touch.active) {
      const tx = this.touch.x - this.touch.startX;
      const ty = this.touch.y - this.touch.startY;
      const dist = Math.sqrt(tx*tx + ty*ty);
      if (dist > 12) {
        dx = tx / dist;
        dy = ty / dist;
      }
    }

    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    this.player.moving = (dx !== 0 || dy !== 0);

    if (this.player.moving) {
      if (Math.abs(dx) > Math.abs(dy)) {
        this.player.dir = dx > 0 ? 'right' : 'left';
      } else {
        this.player.dir = dy > 0 ? 'down' : 'up';
      }

      this.player.wx += dx * spd;
      this.player.wy += dy * spd;

      // Límites del mapa
      this.player.wx = Math.max(40, Math.min(this.player.wx, MAP_WIDTH - 40));
      this.player.wy = Math.max(40, Math.min(this.player.wy, MAP_HEIGHT - 40));
    }

    // Cámara sigue al jugador
    const vw = this.canvas.width;
    const vh = this.canvas.height;
    this.camera.x = Math.max(0, Math.min(this.player.wx - vw / 2, MAP_WIDTH - vw));
    this.camera.y = Math.max(0, Math.min(this.player.wy - vh / 2, MAP_HEIGHT - vh));

    // Comprobar proximidad a situaciones
    this.nearSituation = null;
    this.situations.forEach(s => {
      if (this.completedSituations.has(s.id)) return;
      const dist = Math.hypot(s.wx - this.player.wx, s.wy - this.player.wy);
      if (dist < 90) {
        this.nearSituation = s;
      }
    });

    const prompt = document.getElementById('map-interact-prompt');
    if (prompt) {
      if (this.nearSituation) {
        prompt.classList.add('visible');
        prompt.querySelector('.situation-name-hint').textContent = this.nearSituation.title || '';
      } else {
        prompt.classList.remove('visible');
      }
    }

    // Movimiento y Animación de LEO (sigue al personaje en Modo Historia)
    if (this.options.mode === 'story') {
      const followDist = 52;
      const ldx = this.player.wx - this.leo.wx;
      const ldy = this.player.wy - this.leo.wy;
      const ldist = Math.hypot(ldx, ldy);

      if (ldist > followDist) {
        this.leo.moving = true;
        const lspd = this.player.speed * 0.90 * dt;
        this.leo.wx += (ldx / ldist) * lspd;
        this.leo.wy += (ldy / ldist) * lspd;
        this.leo.dir = Math.abs(ldx) > Math.abs(ldy) ? (ldx > 0 ? 'right' : 'left') : (ldy > 0 ? 'down' : 'up');

        // Animación de caminata de Leo (conmutar frame entre leo_camina0 y leo_camina1)
        this.leo.animTimer += dt;
        if (this.leo.animTimer > 8) {
          this.leo.animFrame = (this.leo.animFrame + 1) % 2;
          this.leo.animTimer = 0;
        }
      } else {
        this.leo.moving = false;
        this.leo.animFrame = 0;
      }
    }

    if (this.options.mode === 'multi' && this.options.timer) {
      this.options.timer.elapsed += dt * (16.67 / 1000);
      this._updateTimerHUD();
    }
  }

  _triggerSituation(situation) {
    if (this.options.onSituationTrigger) {
      this.options.onSituationTrigger(situation);
    }
  }

  markSituationComplete(id) {
    this.completedSituations.add(id);
  }

  _draw() {
    const ctx = this.ctx;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    ctx.clearRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = false;

    // 1. DIBUJAR MAPA GENERAL (assets/mapa.png)
    const mapaImg = ASSET_CACHE['assets/mapa.png'] || preloadAsset('assets/mapa.png');
    if (mapaImg.complete && mapaImg.naturalWidth > 0) {
      const sx = Math.max(0, Math.floor(this.camera.x));
      const sy = Math.max(0, Math.floor(this.camera.y));
      const sw = Math.min(MAP_WIDTH - sx, cw);
      const sh = Math.min(MAP_HEIGHT - sy, ch);

      ctx.drawImage(
        mapaImg,
        sx, sy, sw, sh,
        0, 0, sw, sh
      );
    } else {
      ctx.fillStyle = '#1A2B1E';
      ctx.fillRect(0, 0, cw, ch);
    }

    // 2. DIBUJAR PINS DE SITUACIONES
    this._drawSituationPins(ctx);

    // 3. DIBUJAR A LEO (Animado si camina, leo_parado si está quieto)
    if (this.options.mode === 'story') {
      this._drawLeo(ctx);
    }

    // 4. DIBUJAR AVATAR PERSONALIZABLE (Estático por el momento)
    this._drawPlayerAvatar(ctx);
  }

  _drawSituationPins(ctx) {
    const now = Date.now();

    this.situations.forEach((s, idx) => {
      const sx = Math.floor(s.wx - this.camera.x);
      const sy = Math.floor(s.wy - this.camera.y);

      if (sx < -80 || sx > this.canvas.width + 80 || sy < -80 || sy > this.canvas.height + 80) return;

      const completed = this.completedSituations.has(s.id);
      const bounce = completed ? 0 : Math.sin(now / 250 + idx) * 6;

      // Sombra
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath();
      ctx.ellipse(sx, sy + 16, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Caja de Pin estilo 16-bit
      ctx.fillStyle = completed ? '#27AE60' : '#E74C3C';
      ctx.fillRect(sx - 20, sy - 38 + bounce, 40, 34);
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 3;
      ctx.strokeRect(sx - 20, sy - 38 + bounce, 40, 34);

      // Icono / Emoji
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(completed ? '✓' : (s.emoji || String(s.id)), sx, sy - 20 + bounce);

      // Cartel con nombre del lugar abajo
      const titleShort = (s.title || '').replace(/"/g, '');
      ctx.fillStyle = 'rgba(26,26,26,0.9)';
      ctx.fillRect(sx - 65, sy + 4 + bounce, 130, 20);
      ctx.strokeStyle = completed ? '#27AE60' : '#E74C3C';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(sx - 65, sy + 4 + bounce, 130, 20);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(titleShort.substring(0, 18), sx, sy + 14 + bounce);

      if (this.nearSituation === s) {
        ctx.strokeStyle = '#F1C40F';
        ctx.lineWidth = 4;
        ctx.strokeRect(sx - 24, sy - 42 + bounce, 48, 42);
      }
    });
  }

  _drawLeo(ctx) {
    const sx = Math.floor(this.leo.wx - this.camera.x);
    const sy = Math.floor(this.leo.wy - this.camera.y);

    ctx.save();
    ctx.translate(sx, sy);

    // Sombra en el suelo
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Invertir si va a la izquierda
    if (this.leo.dir === 'left') {
      ctx.scale(-1, 1);
    }

    // Selección de sprite de Leo:
    // Si camina -> conmutar entre leo_camina0.png y leo_camina1.png
    // Si está quieto -> leo_parado.png
    let spriteSrc = 'assets/Leo/leo_parado.png';
    if (this.leo.moving) {
      spriteSrc = (this.leo.animFrame === 0)
        ? 'assets/Leo/leo_camina0.png'
        : 'assets/Leo/leo_camina1.png';
    }

    const leoImg = ASSET_CACHE[spriteSrc] || preloadAsset(spriteSrc);
    if (leoImg.complete && leoImg.naturalWidth > 0) {
      ctx.drawImage(leoImg, -28, -52, 56, 72);
    }

    ctx.restore();

    // Cartel con nombre LEO
    ctx.fillStyle = '#C0392B';
    ctx.fillRect(sx - 20, sy + 28, 40, 16);
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx - 20, sy + 28, 40, 16);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LEO', sx, sy + 36);
  }

  _drawPlayerAvatar(ctx) {
    const sx = Math.floor(this.player.wx - this.camera.x);
    const sy = Math.floor(this.player.wy - this.camera.y);

    ctx.save();
    ctx.translate(sx, sy);

    // Sombra en el suelo
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (this.player.dir === 'left') {
      ctx.scale(-1, 1);
    }

    // Dibujar capas del avatar personalizable (estático sin animación por el momento)
    const layerDefs = window.ZR.getAvatarLayerDefs ? window.ZR.getAvatarLayerDefs() : [];

    layerDefs.forEach(layer => {
      if (layer.src) {
        const img = ASSET_CACHE[layer.src] || preloadAsset(layer.src);
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, -28, -52, 56, 72);
        }
      }
    });

    ctx.restore();

    // Cartel con nombre del Jugador
    const pName = (window.ZR.state.playerName || 'TÚ').toUpperCase();
    ctx.fillStyle = 'rgba(26,26,26,0.9)';
    ctx.fillRect(sx - 35, sy + 28, 70, 16);
    ctx.strokeStyle = '#F4C430';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx - 35, sy + 28, 70, 16);

    ctx.fillStyle = '#F4C430';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pName.substring(0, 10), sx, sy + 36);
  }

  _updateTimerHUD() {
    const timer = this.options.timer;
    if (!timer) return;
    const remaining = Math.max(0, timer.total - timer.elapsed);
    const mins = Math.floor(remaining / 60);
    const secs = Math.floor(remaining % 60);
    const el = document.getElementById('map-timer-display');
    if (el) {
      el.textContent = `${mins}:${secs.toString().padStart(2,'0')}`;
      if (remaining < 60) el.classList.add('urgent');
      else el.classList.remove('urgent');
    }
    if (remaining <= 0 && this.options.onTimerEnd) {
      this.options.onTimerEnd();
      this.stop();
    }
  }
}

window.ZR.GameEngine = GameEngine;
