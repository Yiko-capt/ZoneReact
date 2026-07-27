/**
 * ZoneReact - game-engine.js
 * Motor de Mapa 2D usando recursos de Perry Platypus (pasto, escuela y capas corriendo Personaje 2)
 */
window.ZR = window.ZR || {};

const TILE = {
  GRASS:        0,
  ROAD_H:       1,
  ROAD_V:       2,
  ROAD_INT:     3,
  BUILDING_RED: 4,
  BUILDING_BLUE:5,
  BUILDING_DARK:6,
  BUILDING_TAN: 7,
  PARK:         8,
  SIDEWALK:     9,
  SCHOOL:      10,
  WATER:       11
};

const TILE_SIZE = 32;
const MAP_COLS  = 48;
const MAP_ROWS  = 36;

// Preload Perry Platypus map textures
const ASSET_CACHE = {};
function preloadAsset(src) {
  if (ASSET_CACHE[src]) return ASSET_CACHE[src];
  const img = new Image();
  img.src = src;
  ASSET_CACHE[src] = img;
  return img;
}

const pastoImg   = preloadAsset('assets/pasto.png');
const escuelaImg = preloadAsset('assets/escuela.png');

function generateTilemap() {
  const map = Array.from({ length: MAP_ROWS }, () => new Array(MAP_COLS).fill(TILE.GRASS));

  function fill(r1, c1, r2, c2, type) {
    for (let r = r1; r <= r2; r++)
      for (let c = c1; c <= c2; c++)
        if (r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS)
          map[r][c] = type;
  }

  const hRoads = [[4, 6], [15, 17], [26, 28]];
  const vRoads = [[7, 9], [22, 24], [37, 39]];

  hRoads.forEach(r => fill(r[0], 0, r[1], MAP_COLS - 1, TILE.ROAD_H));
  vRoads.forEach(c => fill(0, c[0], MAP_ROWS - 1, c[1], TILE.ROAD_V));

  hRoads.forEach(r => {
    vRoads.forEach(c => fill(r[0], c[0], r[1], c[1], TILE.ROAD_INT));
  });

  for (let r = 0; r < MAP_ROWS; r++) {
    for (let c = 0; c < MAP_COLS; c++) {
      if (map[r][c] === TILE.GRASS) {
        let nearRoad = false;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < MAP_ROWS && nc >= 0 && nc < MAP_COLS) {
              if ([TILE.ROAD_H, TILE.ROAD_V, TILE.ROAD_INT].includes(map[nr][nc])) {
                nearRoad = true;
              }
            }
          }
        }
        if (nearRoad) map[r][c] = TILE.SIDEWALK;
      }
    }
  }

  fill(8, 11, 13, 20, TILE.PARK);
  fill(1, 26, 3, 35, TILE.SCHOOL);

  fill(1, 1, 3, 5, TILE.BUILDING_RED);
  fill(1, 11, 3, 19, TILE.BUILDING_BLUE);

  fill(8, 1, 10, 5, TILE.BUILDING_TAN);
  fill(11, 1, 13, 5, TILE.BUILDING_DARK);
  fill(8, 26, 10, 35, TILE.BUILDING_RED);
  fill(11, 26, 13, 35, TILE.BUILDING_BLUE);

  fill(18, 1, 21, 5, TILE.BUILDING_BLUE);
  fill(18, 11, 21, 20, TILE.BUILDING_TAN);
  fill(18, 26, 21, 35, TILE.BUILDING_DARK);

  fill(23, 1, 24, 5, TILE.BUILDING_DARK);
  fill(30, 1, 33, 5, TILE.BUILDING_RED);
  fill(30, 11, 33, 20, TILE.BUILDING_BLUE);

  fill(30, 26, 33, 35, TILE.BUILDING_TAN);
  fill(30, 41, 33, 46, TILE.BUILDING_RED);

  fill(9, 13, 11, 17, TILE.WATER);

  return map;
}

const WALKABLE = new Set([
  TILE.GRASS, TILE.ROAD_H, TILE.ROAD_V, TILE.ROAD_INT, TILE.PARK, TILE.SIDEWALK
]);

class GameEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = options;

    this.TILE_SIZE = TILE_SIZE;
    this.MAP_COLS  = MAP_COLS;
    this.MAP_ROWS  = MAP_ROWS;

    this.tilemap = generateTilemap();
    this.camera  = { x: 0, y: 0 };

    this.player = {
      wx: 8 * TILE_SIZE + 16,
      wy: 5 * TILE_SIZE + 16,
      speed: 3.4,
      size: 32,
      moving: false,
      dir: 'down',
      animFrame: 0,
      animTimer: 0
    };

    this.leo = {
      wx: 9 * TILE_SIZE + 16,
      wy: 5 * TILE_SIZE + 16,
      speed: 3.0,
      size: 32,
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
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','Space','PageUp','PageDown'].includes(e.code)) {
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

      const newX = this.player.wx + dx * spd;
      const newY = this.player.wy + dy * spd;
      const halfS = 10;

      if (this._canMoveTo(newX, this.player.wy, halfS)) {
        this.player.wx = newX;
      } else {
        if (this._canMoveTo(newX, this.player.wy - 6, halfS)) this.player.wy -= spd * 0.6;
        else if (this._canMoveTo(newX, this.player.wy + 6, halfS)) this.player.wy += spd * 0.6;
      }

      if (this._canMoveTo(this.player.wx, newY, halfS)) {
        this.player.wy = newY;
      } else {
        if (this._canMoveTo(this.player.wx - 6, newY, halfS)) this.player.wx -= spd * 0.6;
        else if (this._canMoveTo(this.player.wx + 6, newY, halfS)) this.player.wx += spd * 0.6;
      }

      this.player.wx = Math.max(16, Math.min(this.player.wx, MAP_COLS*TILE_SIZE - 16));
      this.player.wy = Math.max(16, Math.min(this.player.wy, MAP_ROWS*TILE_SIZE - 16));

      this.player.animTimer += dt;
      if (this.player.animTimer > 6) {
        this.player.animFrame = (this.player.animFrame + 1) % 4;
        this.player.animTimer = 0;
      }
    } else {
      this.player.animFrame = 0;
    }

    const vw = this.canvas.width;
    const vh = this.canvas.height;
    this.camera.x = this.player.wx - vw / 2;
    this.camera.y = this.player.wy - vh / 2;
    this.camera.x = Math.max(0, Math.min(this.camera.x, MAP_COLS * TILE_SIZE - vw));
    this.camera.y = Math.max(0, Math.min(this.camera.y, MAP_ROWS * TILE_SIZE - vh));

    this.nearSituation = null;
    this.situations.forEach(s => {
      if (this.completedSituations.has(s.id)) return;
      const dist = Math.hypot(s.wx - this.player.wx, s.wy - this.player.wy);
      if (dist < TILE_SIZE * 2.2) {
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

    if (this.options.mode === 'story') {
      const followDist = 44;
      const ldx = this.player.wx - this.leo.wx;
      const ldy = this.player.wy - this.leo.wy;
      const ldist = Math.hypot(ldx, ldy);
      if (ldist > followDist) {
        const lspd = this.player.speed * 0.88 * dt;
        this.leo.wx += (ldx / ldist) * lspd;
        this.leo.wy += (ldy / ldist) * lspd;
        this.leo.dir = Math.abs(ldx) > Math.abs(ldy) ? (ldx > 0 ? 'right' : 'left') : (ldy > 0 ? 'down' : 'up');
        this.leo.animTimer += dt;
        if (this.leo.animTimer > 7) {
          this.leo.animFrame = (this.leo.animFrame + 1) % 4;
          this.leo.animTimer = 0;
        }
      } else {
        this.leo.animFrame = 0;
      }
    }

    if (this.options.mode === 'multi' && this.options.timer) {
      this.options.timer.elapsed += dt * (16.67 / 1000);
      this._updateTimerHUD();
    }
  }

  _canMoveTo(wx, wy, halfS) {
    const corners = [
      { x: wx - halfS, y: wy - halfS },
      { x: wx + halfS, y: wy - halfS },
      { x: wx - halfS, y: wy + halfS },
      { x: wx + halfS, y: wy + halfS }
    ];
    return corners.every(pt => {
      const col = Math.floor(pt.x / TILE_SIZE);
      const row = Math.floor(pt.y / TILE_SIZE);
      if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return false;
      return WALKABLE.has(this.tilemap[row][col]);
    });
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

    const startCol = Math.max(0, Math.floor(this.camera.x / TILE_SIZE));
    const startRow = Math.max(0, Math.floor(this.camera.y / TILE_SIZE));
    const endCol   = Math.min(MAP_COLS - 1, Math.ceil((this.camera.x + cw) / TILE_SIZE));
    const endRow   = Math.min(MAP_ROWS - 1, Math.ceil((this.camera.y + ch) / TILE_SIZE));

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const tile = this.tilemap[r][c];
        const sx = c * TILE_SIZE - Math.floor(this.camera.x);
        const sy = r * TILE_SIZE - Math.floor(this.camera.y);
        this._draw16BitTile(ctx, tile, sx, sy, c, r);
      }
    }

    this._drawRoadMarkings16Bit(ctx, startRow, endRow, startCol, endCol);
    this._drawParkFoliage16Bit(ctx, startRow, endRow, startCol, endCol);
    this._drawSituationPins16Bit(ctx);

    if (this.options.mode === 'story') {
      this._draw16BitLeo(ctx);
    }

    this._draw16BitPlayer(ctx);
  }

  _draw16BitTile(ctx, tile, sx, sy, col, row) {
    const S = TILE_SIZE;

    if (tile === TILE.GRASS) {
      if (pastoImg.complete && pastoImg.naturalWidth > 0) {
        ctx.drawImage(pastoImg, sx, sy, S, S);
      } else {
        ctx.fillStyle = '#68B04D';
        ctx.fillRect(sx, sy, S, S);
      }
    }
    else if (tile === TILE.SCHOOL) {
      if (escuelaImg.complete && escuelaImg.naturalWidth > 0) {
        ctx.drawImage(escuelaImg, sx, sy, S, S);
      } else {
        ctx.fillStyle = '#E0AC28';
        ctx.fillRect(sx, sy, S, S);
      }
    }
    else if (tile === TILE.SIDEWALK) {
      ctx.fillStyle = '#C2B8A3';
      ctx.fillRect(sx, sy, S, S);
      ctx.fillStyle = '#A49A84';
      ctx.fillRect(sx, sy, S, 2);
      ctx.fillRect(sx, sy, 2, S);
    }
    else if (tile === TILE.ROAD_H || tile === TILE.ROAD_V || tile === TILE.ROAD_INT) {
      ctx.fillStyle = '#424549';
      ctx.fillRect(sx, sy, S, S);
      ctx.fillStyle = '#343639';
      if ((col + row) % 2 === 0) ctx.fillRect(sx + 6, sy + 12, 3, 2);
    }
    else if (tile === TILE.PARK) {
      ctx.fillStyle = '#4E963D';
      ctx.fillRect(sx, sy, S, S);
    }
    else if (tile === TILE.WATER) {
      ctx.fillStyle = '#4284C4';
      ctx.fillRect(sx, sy, S, S);
      const wave = Math.floor(Date.now() / 300 + col + row) % 3;
      ctx.fillStyle = '#78B4EC';
      ctx.fillRect(sx + 4 + wave * 4, sy + 8, 8, 2);
    }
    else {
      const isRoof = (row % 4 === 0);
      let wallColor = '#C85238', shadowColor = '#9E3824', roofColor = '#802618';

      if (tile === TILE.BUILDING_BLUE) {
        wallColor = '#4268A0'; shadowColor = '#2E4B75'; roofColor = '#1F3454';
      } else if (tile === TILE.BUILDING_DARK) {
        wallColor = '#5C5C78'; shadowColor = '#42425A'; roofColor = '#2D2D3E';
      } else if (tile === TILE.BUILDING_TAN) {
        wallColor = '#D4A462'; shadowColor = '#AA7E40'; roofColor = '#7E5B28';
      }

      if (isRoof) {
        ctx.fillStyle = roofColor;
        ctx.fillRect(sx, sy, S, S);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(sx, sy, S, 4);
      } else {
        ctx.fillStyle = wallColor;
        ctx.fillRect(sx, sy, S, S);
        ctx.fillStyle = shadowColor;
        ctx.fillRect(sx, sy, S, 2);

        ctx.fillStyle = '#FCE883';
        ctx.fillRect(sx + 6, sy + 6, 8, 10);
        ctx.fillRect(sx + 18, sy + 6, 8, 10);
      }
    }

    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(sx, sy + S - 1, S, 1);
  }

  _drawRoadMarkings16Bit(ctx, startRow, endRow, startCol, endCol) {
    const S = TILE_SIZE;
    ctx.fillStyle = '#F4C430';

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const tile = this.tilemap[r][c];
        const sx = c * S - Math.floor(this.camera.x);
        const sy = r * S - Math.floor(this.camera.y);

        if (tile === TILE.ROAD_H && (r === 5 || r === 16 || r === 27)) {
          ctx.fillRect(sx, sy + 15, 14, 2);
        }
        if (tile === TILE.ROAD_V && (c === 8 || c === 23 || c === 38)) {
          ctx.fillRect(sx + 15, sy, 2, 14);
        }
      }
    }
  }

  _drawParkFoliage16Bit(ctx, startRow, endRow, startCol, endCol) {
    const S = TILE_SIZE;
    const trees = [
      {r:8,c:12},{r:8,c:20},{r:9,c:14},{r:9,c:18},{r:10,c:12},
      {r:10,c:20},{r:12,c:12},{r:12,c:20},{r:13,c:14},{r:13,c:18}
    ];

    trees.forEach(t => {
      if (t.r >= startRow && t.r <= endRow && t.c >= startCol && t.c <= endCol) {
        const sx = t.c * S - Math.floor(this.camera.x) + 16;
        const sy = t.r * S - Math.floor(this.camera.y) + 16;

        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(sx, sy + 12, 14, 6, 0, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = '#6E4223';
        ctx.fillRect(sx - 4, sy + 2, 8, 12);

        ctx.fillStyle = '#2A7A22';
        ctx.fillRect(sx - 16, sy - 18, 32, 22);
        ctx.fillStyle = '#3E9E34';
        ctx.fillRect(sx - 14, sy - 22, 28, 20);

        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 2;
        ctx.strokeRect(sx - 14, sy - 22, 28, 20);
      }
    });
  }

  _drawSituationPins16Bit(ctx) {
    const now = Date.now();

    this.situations.forEach((s, idx) => {
      const sx = s.wx - Math.floor(this.camera.x);
      const sy = s.wy - Math.floor(this.camera.y);

      if (sx < -40 || sx > this.canvas.width + 40 || sy < -40 || sy > this.canvas.height + 40) return;

      const completed = this.completedSituations.has(s.id);
      const bounce = completed ? 0 : Math.sin(now / 300 + idx) * 5;

      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(sx, sy + 16, 12, 5, 0, 0, Math.PI*2);
      ctx.fill();

      ctx.fillStyle = completed ? '#5A8A4A' : '#E8543E';
      ctx.fillRect(sx - 14, sy - 24 + bounce, 28, 24);
      ctx.fillStyle = completed ? '#3A5F2E' : '#B83020';
      ctx.fillRect(sx - 14, sy - 4 + bounce, 28, 4);

      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx - 14, sy - 24 + bounce, 28, 24);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(completed ? '✓' : String(s.id), sx, sy - 12 + bounce);

      if (this.nearSituation === s) {
        ctx.strokeStyle = '#F4C430';
        ctx.lineWidth = 3;
        ctx.strokeRect(sx - 18, sy - 28 + bounce, 36, 32);
      }
    });
  }

  _draw16BitPlayer(ctx) {
    const sx = Math.floor(this.player.wx - this.camera.x);
    const sy = Math.floor(this.player.wy - this.camera.y);
    const av = window.ZR.state.avatar;
    const skinNum = av.skin || 1;
    const eyesNum = av.eyes || 1;
    const mouthNum = av.mouth || 1;
    const poloName = (av.polo || 'azul').toLowerCase();
    const hairStyle = av.hairStyle || 'corto';
    const hairColor = av.hairColor === 'marron' ? 'castano' : (av.hairColor || 'negro');

    const base = 'assets/Personaje 2/';
    const runningLayers = [
      `${base}Piel corriendo/piel_${skinNum}_corriendo.png`,
      `${base}Polo corriendo/polo_${poloName}_corriendo.png`,
      `${base}Shorts corriendo/shorts_corriendo.png`,
      `${base}botas_corriendo.png`,
      `${base}Ojos corriendo/ojos_${eyesNum}_corriendo.png`,
      `${base}Boca corriendo/boca_${mouthNum}_corriendo.png`,
      `${base}Cabello corriendo/${hairStyle}_${hairColor}_corriendo.png`
    ];

    ctx.save();
    ctx.translate(sx, sy);

    if (this.player.dir === 'left') {
      ctx.scale(-1, 1);
    }

    let allLoaded = true;
    runningLayers.forEach(src => {
      const img = preloadAsset(src);
      if (!img.complete || img.naturalWidth === 0) allLoaded = false;
    });

    if (allLoaded) {
      runningLayers.forEach(src => {
        const img = ASSET_CACHE[src];
        ctx.drawImage(img, -20, -32, 40, 48);
      });
    } else {
      // Fallback 16-bit canvas player
      ctx.fillStyle = '#1A1A1A';
      ctx.fillRect(-8, 10, 6, 6);
      ctx.fillRect(2, 10, 6, 6);

      ctx.fillStyle = '#2C3E50';
      ctx.fillRect(-7, 2, 5, 10);
      ctx.fillRect(2, 2, 5, 10);

      ctx.fillStyle = '#4A6FA5';
      ctx.fillRect(-10, -14, 20, 18);

      ctx.fillStyle = '#FCE0C4';
      ctx.fillRect(-9, -28, 18, 16);

      ctx.fillStyle = '#2B2B2B';
      ctx.fillRect(-10, -32, 20, 7);
    }

    ctx.restore();

    ctx.fillStyle = 'rgba(26,26,26,0.85)';
    ctx.fillRect(sx - 30, sy + 20, 60, 16);
    ctx.fillStyle = '#F4C430';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((window.ZR.state.playerName || 'TÚ').substring(0, 9), sx, sy + 28);
  }

  _draw16BitLeo(ctx) {
    const sx = Math.floor(this.leo.wx - this.camera.x);
    const sy = Math.floor(this.leo.wy - this.camera.y);
    const dir = this.leo.dir;
    const step = this.leo.animFrame;
    const legOffset = (step % 2 === 0 ? 0 : (step === 1 ? -3 : 3));

    ctx.save();
    ctx.translate(sx, sy);

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 12, 5, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(-8 + legOffset, 10, 6, 6);
    ctx.fillRect(2 - legOffset, 10, 6, 6);

    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(-7 + legOffset, 2, 5, 10);
    ctx.fillRect(2 - legOffset, 2, 5, 10);

    ctx.fillStyle = '#C0392B';
    ctx.fillRect(-10, -14, 20, 18);
    ctx.fillStyle = '#8B1E14';
    ctx.fillRect(-3, -14, 6, 18);
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-10, -14, 20, 18);

    ctx.fillStyle = '#FCE0C4';
    ctx.fillRect(-14, -8 + legOffset, 4, 10);
    ctx.fillRect(10, -8 - legOffset, 4, 10);

    ctx.fillStyle = '#FCE0C4';
    ctx.fillRect(-9, -28, 18, 16);
    ctx.strokeRect(-9, -28, 18, 16);

    ctx.fillStyle = '#7B4A28';
    ctx.fillRect(-11, -33, 22, 8);
    ctx.fillRect(-8, -36, 16, 4);

    ctx.fillStyle = '#1A1A1A';
    if (dir === 'down') {
      ctx.fillRect(-5, -22, 3, 4);
      ctx.fillRect(2, -22, 3, 4);
    } else if (dir === 'left') {
      ctx.fillRect(-7, -22, 3, 4);
    } else if (dir === 'right') {
      ctx.fillRect(4, -22, 3, 4);
    }

    ctx.restore();
    ctx.fillStyle = '#C0392B';
    ctx.fillRect(sx - 18, sy + 20, 36, 16);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LEO', sx, sy + 28);
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
