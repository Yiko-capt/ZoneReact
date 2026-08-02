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
preloadAsset('assets/story_map.jpg');
preloadAsset('assets/Leo/leo_parado.png');
preloadAsset('assets/Leo/leo_camina0.png');
preloadAsset('assets/Leo/leo_camina1.png');

class GameEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = options;

    // En modo historia usamos un espacio de mundo igual al tamaño del canvas (sin scroll)
    // En multijugador usamos el mapa grande 2752x1536
    this.isStoryMode = options.mode === 'story';
    this.MAP_WIDTH  = this.isStoryMode ? 1400 : MAP_WIDTH;
    this.MAP_HEIGHT = this.isStoryMode ? 720  : MAP_HEIGHT;
    this.camera     = { x: 0, y: 0 };

    // Posición inicial del jugador
    const defaultPos = this.isStoryMode
      ? { wx: 80, wy: 420 }    // Historia: Nivel 1 - Casa de Lucas (izquierda del canvas)
      : { wx: 2420, wy: 1020 }; // Multijugador - posición original
    const startPos = (window.ZR.state && window.ZR.state.lastPlayerPosition)
      ? window.ZR.state.lastPlayerPosition
      : defaultPos;

    this.player = {
      wx: startPos.wx,
      wy: startPos.wy,
      speed: 4.8,
      size: 40,
      moving: false,
      dir: 'down',
      animFrame: 0,
      animTimer: 0
    };

    this.leo = {
      wx: startPos.wx - 60,
      wy: startPos.wy + 20,
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
    this.completedStorySituations = new Set();
    this.completedMultiSituations = new Set();
    this.touch = { active: false, x: 0, y: 0 };

    this._bindInput();
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  getCompletedSet() {
    const isMulti = (window.ZR.state && window.ZR.state.mode === 'multi') || (this.options && this.options.mode === 'multi');
    return isMulti ? this.completedMultiSituations : this.completedStorySituations;
  }

  _bindInput() {
    this._onKeyDown = (e) => {
      this.keys[e.code] = true;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'KeyE' || e.code === 'Space') {
        if (this.nearSituation && !this.getCompletedSet().has(this.nearSituation.id)) {
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

      // Límites del mapa (usa this.MAP_WIDTH/HEIGHT que varía según modo)
      this.player.wx = Math.max(40, Math.min(this.player.wx, this.MAP_WIDTH - 40));
      this.player.wy = Math.max(40, Math.min(this.player.wy, this.MAP_HEIGHT - 40));
    }

    // Cámara: en historia se queda fija en 0,0 (pantalla completa sin scroll)
    // En multijugador sigue al jugador por el mapa grande
    if (!this.isStoryMode) {
      const vw = this.canvas.width;
      const vh = this.canvas.height;
      this.camera.x = Math.max(0, Math.min(this.player.wx - vw / 2, MAP_WIDTH - vw));
      this.camera.y = Math.max(0, Math.min(this.player.wy - vh / 2, MAP_HEIGHT - vh));
    }

    // Comprobar proximidad a situaciones
    this.nearSituation = null;
    const unlockedLevel = (window.ZR.state && window.ZR.state.storyUnlockedLevel) || 1;
    this.situations.forEach(s => {
      if (this.getCompletedSet().has(s.id)) return;
      // En modo historia solo se puede interactuar con el nivel desbloqueado actual
      if (this.options.mode === 'story' && s.id !== unlockedLevel) return;
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
    this.getCompletedSet().add(id);
  }

  resetCompletedSituations(mode) {
    if (mode === 'multi') {
      this.completedMultiSituations.clear();
    } else {
      this.completedStorySituations.clear();
    }
  }

  _draw() {
    const ctx = this.ctx;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    ctx.clearRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = false;

    // 1. DIBUJAR MAPA DE FONDO
    if (this.isStoryMode) {
      // Historia: story_map.jpg estirado a pantalla completa (sin scroll)
      const storyImg = ASSET_CACHE['assets/story_map.jpg'] || preloadAsset('assets/story_map.jpg');
      if (storyImg.complete && storyImg.naturalWidth > 0) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(storyImg, 0, 0, cw, ch);
        ctx.imageSmoothingEnabled = false;
      } else {
        ctx.fillStyle = '#1A2B1E';
        ctx.fillRect(0, 0, cw, ch);
      }
    } else {
      // Multijugador: mapa.png con scroll/camera normal
      const mapaImg = ASSET_CACHE['assets/mapa.png'] || preloadAsset('assets/mapa.png');
      if (mapaImg.complete && mapaImg.naturalWidth > 0) {
        const sx = Math.max(0, Math.floor(this.camera.x));
        const sy = Math.max(0, Math.floor(this.camera.y));
        const sw = Math.min(MAP_WIDTH - sx, cw);
        const sh = Math.min(MAP_HEIGHT - sy, ch);
        ctx.drawImage(mapaImg, sx, sy, sw, sh, 0, 0, sw, sh);
      } else {
        ctx.fillStyle = '#1A2B1E';
        ctx.fillRect(0, 0, cw, ch);
      }
    }

    // 2. DIBUJAR CAMINO OVERCOOKED (solo en historia, antes de los pins)
    if (this.isStoryMode) {
      this._drawStoryPath(ctx);
    }

    // 3. DIBUJAR PINS DE SITUACIONES
    this._drawSituationPins(ctx);

    // 4. DIBUJAR A LEO (Animado si camina, leo_parado si está quieto)
    if (this.isStoryMode) {
      this._drawLeo(ctx);
    }

    // 5. DIBUJAR OTROS JUGADORES (MULTIJUGADOR EN TIEMPO REAL)
    this._drawOtherPlayers(ctx);

    // 6. DIBUJAR AVATAR PERSONALIZABLE
    this._drawPlayerAvatar(ctx);
  }


  _drawStoryPath(ctx) {
    if (this.situations.length < 2) return;

    for (let i = 0; i < this.situations.length - 1; i++) {
      const a = this.situations[i];
      const b = this.situations[i + 1];
      const ax = Math.floor(a.wx - this.camera.x);
      const ay = Math.floor(a.wy - this.camera.y);
      const bx = Math.floor(b.wx - this.camera.x);
      const by = Math.floor(b.wy - this.camera.y);

      const aCompleted = this.getCompletedSet().has(a.id);

      ctx.save();

      // Sombra / halo oscuro de fondo para que se vea sobre el mapa
      ctx.setLineDash([]);
      ctx.lineWidth = 14;
      ctx.strokeStyle = 'rgba(0,0,0,0.55)';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();

      // Línea punteada principal
      ctx.setLineDash([16, 10]);
      ctx.lineWidth = 7;
      ctx.strokeStyle = aCompleted ? 'rgba(80,220,120,0.95)' : 'rgba(255,255,255,0.75)';
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.restore();
    }

    // Halo META al completar todos
    const last = this.situations[this.situations.length - 1];
    const lx = Math.floor(last.wx - this.camera.x);
    const ly = Math.floor(last.wy - this.camera.y);
    const allDone = this.situations.every(s => this.getCompletedSet().has(s.id));

    if (allDone) {
      const grd = ctx.createRadialGradient(lx, ly - 60, 8, lx, ly - 60, 60);
      grd.addColorStop(0, 'rgba(255,215,0,0.95)');
      grd.addColorStop(1, 'rgba(255,140,0,0.0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(lx, ly - 60, 60, 0, Math.PI * 2);
      ctx.fill();
    }
  }


  _drawSituationPins(ctx) {
    const now = Date.now();
    const isStory = this.options.mode === 'story';
    const unlockedLevel = (window.ZR.state && window.ZR.state.storyUnlockedLevel) || 1;

    this.situations.forEach((s, idx) => {
      const sx = Math.floor(s.wx - this.camera.x);
      const sy = Math.floor(s.wy - this.camera.y);

      if (sx < -80 || sx > this.canvas.width + 80 || sy < -80 || sy > this.canvas.height + 80) return;

      const completed = this.getCompletedSet().has(s.id);

      if (isStory) {
        // --- Nodo estilo Overcooked ---
        const isUnlocked = s.id <= unlockedLevel;
        const isCurrent = s.id === unlockedLevel && !completed;
        const bounce = isCurrent ? Math.sin(now / 220 + idx) * 5 : 0;
        const radius = 28;

        // Sombra circular
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.ellipse(sx, sy + radius + 6, radius * 0.7, radius * 0.27, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pulso animado para nivel actual
        if (isCurrent) {
          const pulse = (Math.sin(now / 400) * 0.5 + 0.5) * 14;
          ctx.beginPath();
          ctx.arc(sx, sy - bounce, radius + pulse, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(241,196,15,0.18)';
          ctx.fill();
        }

        // Círculo del nodo
        let fillColor, strokeColor;
        if (completed) {
          fillColor = '#27AE60'; strokeColor = '#1D8348';
        } else if (isCurrent) {
          fillColor = '#E74C3C'; strokeColor = '#F1C40F';
        } else {
          fillColor = '#2C2C3A'; strokeColor = '#555';
        }

        ctx.beginPath();
        ctx.arc(sx, sy - bounce, radius, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isCurrent ? 4 : 3;
        ctx.stroke();

        // Icono/Emoji dentro del nodo
        ctx.font = completed ? 'bold 20px sans-serif' : (isUnlocked ? '18px sans-serif' : '20px sans-serif');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFFFFF';
        if (completed) {
          ctx.fillText('✓', sx, sy - bounce);
        } else if (isUnlocked) {
          ctx.fillText(s.emoji || String(s.id), sx, sy - bounce);
        } else {
          ctx.fillText('🔒', sx, sy - bounce);
        }

        // Número de nivel en la esquina superior izquierda del nodo
        ctx.beginPath();
        ctx.arc(sx - radius + 8, sy - bounce - radius + 8, 11, 0, Math.PI * 2);
        ctx.fillStyle = '#1A1A1A';
        ctx.fill();
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = '#F4C430';
        ctx.fillText(String(s.id), sx - radius + 8, sy - bounce - radius + 8);

        // Etiqueta del nombre debajo
        const titleShort = (s.title || '').replace(/"/g, '');
        ctx.fillStyle = completed ? 'rgba(39,174,96,0.92)' : (isCurrent ? 'rgba(231,76,60,0.92)' : 'rgba(40,40,50,0.88)');
        ctx.fillRect(sx - 68, sy + radius - bounce + 8, 136, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(sx - 68, sy + radius - bounce + 8, 136, 20);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(titleShort.substring(0, 20), sx, sy + radius - bounce + 18);

        // Halo amarillo si es el nodo cercano al jugador
        if (this.nearSituation === s) {
          ctx.beginPath();
          ctx.arc(sx, sy - bounce, radius + 7, 0, Math.PI * 2);
          ctx.strokeStyle = '#F1C40F';
          ctx.lineWidth = 4;
          ctx.stroke();
        }

      } else {
        // --- Pin original (multijugador) ---
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
    ctx.ellipse(0, 22, 28, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Invertir si va a la izquierda
    if (this.leo.dir === 'left') {
      ctx.scale(-1, 1);
    }

    let spriteSrc = 'assets/Leo/leo_parado.png';
    if (this.leo.moving) {
      spriteSrc = (this.leo.animFrame === 0)
        ? 'assets/Leo/leo_camina0.png'
        : 'assets/Leo/leo_camina1.png';
    }

    const leoImg = ASSET_CACHE[spriteSrc] || preloadAsset(spriteSrc);
    if (leoImg.complete && leoImg.naturalWidth > 0) {
      // Tamaño ampliado (+20% adicional) manteniendo proporción (108 x 138 px)
      ctx.drawImage(leoImg, -54, -110, 108, 138);
    }

    ctx.restore();

    // Cartel con nombre LUCAS
    ctx.fillStyle = '#C0392B';
    ctx.fillRect(sx - 30, sy + 28, 60, 18);
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx - 30, sy + 28, 60, 18);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LUCAS', sx, sy + 37);
  }

  _drawPlayerAvatar(ctx) {
    const sx = Math.floor(this.player.wx - this.camera.x);
    const sy = Math.floor(this.player.wy - this.camera.y);

    ctx.save();
    ctx.translate(sx, sy);

    // Sombra en el suelo
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 26, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    if (this.player.dir === 'left') {
      ctx.scale(-1, 1);
    }

    // Dibujar capas del avatar (+20% adicional) en proporción exacta (340x720 -> 65x138)
    if (window.ZR.activeAvatarImages && window.ZR.activeAvatarImages.length > 0) {
      window.ZR.activeAvatarImages.forEach(img => {
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, -32, -110, 65, 138);
        }
      });
    } else {
      const layerDefs = window.ZR.getAvatarLayerDefs ? window.ZR.getAvatarLayerDefs() : [];
      layerDefs.forEach(layer => {
        if (layer.src) {
          const img = ASSET_CACHE[layer.src] || preloadAsset(layer.src);
          if (img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, -32, -110, 65, 138);
          }
        }
      });
    }

    ctx.restore();

    // Cartel con nombre del Jugador
    const pName = (window.ZR.state.playerName || 'TÚ').toUpperCase();
    ctx.fillStyle = 'rgba(26,26,26,0.9)';
    ctx.fillRect(sx - 40, sy + 28, 80, 18);
    ctx.strokeStyle = '#F4C430';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx - 40, sy + 28, 80, 18);

    ctx.fillStyle = '#F4C430';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pName.substring(0, 10), sx, sy + 37);
  }

  _drawOtherPlayers(ctx) {
    // Solo en modo multijugador
    if (!this.options || this.options.mode !== 'multi') return;
    const others = window.ZR.otherPlayers;
    if (!others || typeof others !== 'object') return;

    const myId = window.ZR.state && window.ZR.state.multi && window.ZR.state.multi.jugadorId;
    const myGrupo = window.ZR.state && window.ZR.state.multi && window.ZR.state.multi.grupoId;

    Object.values(others).forEach(p => {
      if (!p || p.wx === undefined || p.wy === undefined) return;
      if (p.id === myId) return;

      const sx = Math.floor(p.wx - this.camera.x);
      const sy = Math.floor(p.wy - this.camera.y);

      const isSameTeam = p.grupoId === myGrupo;
      const teamColor  = isSameTeam ? '#4299E1' : '#E53E3E'; // azul aliado, rojo rival
      const teamDark   = isSameTeam ? '#2B6CB0' : '#9B2C2C';
      const teamLight  = isSameTeam ? '#BEE3F8' : '#FED7D7';

      ctx.save();

      // --- Sombra ---
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath();
      ctx.ellipse(sx, sy + 8, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // --- Cuerpo pixel (proporción similar al player principal: ~65x138 escala) ---
      // Piernas
      ctx.fillStyle = '#2D3748';
      ctx.fillRect(sx - 10, sy - 12, 8, 16);
      ctx.fillRect(sx + 2,  sy - 12, 8, 16);

      // Zapatos
      ctx.fillStyle = '#1A202C';
      ctx.fillRect(sx - 12, sy + 2, 10, 6);
      ctx.fillRect(sx + 2,  sy + 2, 10, 6);

      // Cuerpo / Camiseta
      ctx.fillStyle = teamColor;
      ctx.fillRect(sx - 12, sy - 38, 24, 26);

      // Detalle camiseta (línea central)
      ctx.fillStyle = teamDark;
      ctx.fillRect(sx - 1, sy - 38, 2, 26);

      // Brazos
      ctx.fillStyle = teamColor;
      ctx.fillRect(sx - 18, sy - 36, 6, 18);
      ctx.fillRect(sx + 12, sy - 36, 6, 18);

      // Cuello / piel
      ctx.fillStyle = '#F6AD55';
      ctx.fillRect(sx - 4, sy - 44, 8, 8);

      // Cabeza
      ctx.fillStyle = '#F6AD55';
      ctx.fillRect(sx - 10, sy - 64, 20, 22);

      // Ojos
      ctx.fillStyle = '#1A202C';
      ctx.fillRect(sx - 7, sy - 58, 4, 4);
      ctx.fillRect(sx + 3, sy - 58, 4, 4);

      // Boca
      ctx.fillStyle = '#C05621';
      ctx.fillRect(sx - 4, sy - 50, 8, 2);

      // Cabello (color según equipo)
      ctx.fillStyle = teamDark;
      ctx.fillRect(sx - 10, sy - 66, 20, 4);
      ctx.fillRect(sx - 12, sy - 64, 4, 6);
      ctx.fillRect(sx + 8, sy - 64, 4, 6);

      // Indicador de equipo (pequeño rombo sobre la cabeza)
      ctx.fillStyle = teamLight;
      ctx.beginPath();
      ctx.arc(sx, sy - 74, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = teamColor;
      ctx.beginPath();
      ctx.arc(sx, sy - 74, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // --- Etiqueta con nombre ---
      const label = (p.nombre || 'Jugador').substring(0, 10).toUpperCase();
      const lw = Math.max(56, label.length * 6.5 + 16);
      ctx.fillStyle = isSameTeam ? 'rgba(43,108,176,0.92)' : 'rgba(155,44,44,0.92)';
      ctx.beginPath();
      ctx.roundRect(sx - lw/2, sy + 13, lw, 16, 4);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, sx, sy + 21);
    });
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
