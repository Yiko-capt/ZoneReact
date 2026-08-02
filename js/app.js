/**
 * ZoneReact - app.js
 * Router SPA + Renderizador de Avatar con Canvas Tinting (HTML5 Canvas Pixel Tinting)
 */

window.ZR = window.ZR || {};

// SUPABASE INITIALIZATION
const SUPABASE_URL = "https://uwkzdwaedritpaibddjs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3a3pkd2FlZHJpdHBhaWJkZGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2MzUxODIsImV4cCI6MjEwMTIxMTE4Mn0.TMfRC1grO28iSgRBkqZJX4J1dReI84xBBlf6rcoXz40";
window.ZR.supabase = supabase.createClient("https://uwkzdwaedritpaibddjs.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3a3pkd2FlZHJpdHBhaWJkZGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2MzUxODIsImV4cCI6MjEwMTIxMTE4Mn0.TMfRC1grO28iSgRBkqZJX4J1dReI84xBBlf6rcoXz40");


/* =========================================
   ESTADO GLOBAL
   ========================================= */
window.ZR.state = {
  playerName: '',
  mode: null,          // 'story' | 'multi'
  avatar: {
    gender:     'hombre',      // 'hombre' | 'mujer'
    skinFile:   'piel_media',  // 'piel_clara' | 'piel_media' | 'piel_morena'
    mouthFile:  'boca_feliz',  // 'boca_feliz' | 'boca_seria' | 'boca_triste'
    hairColor:  '#2B2B2B',     // Color de cabello (hex)
    poloColor:  '#4A6FA5',     // Color de polo (hex)
    shortColor: '#5B7065',     // Color de short (hex)
    shoeColor:  '#8B4513',     // Color de zapatos (hex)
  },
  story: {
    situationIndex: 0,
    score: 0,
    decisions: [],
    completed: false
  },
  multi: {
    squadName: '',
    code: '',
    role: 'member',
    grupoId: null,
    partidaId: null,
    esLider: false,
    vsBots: false,
    leaderboard: []
  }
};

window.ZR.ASSETS = 'assets/';

/* =========================================
   PERSISTENCIA EN LOCALSTORAGE
   ========================================= */
window.ZR.saveAvatar = function () {
  localStorage.setItem('zr_avatar', JSON.stringify(window.ZR.state.avatar));
};

window.ZR.loadAvatar = function () {
  try {
    const saved = localStorage.getItem('zr_avatar');
    if (saved) {
      const parsed = JSON.parse(saved);
      window.ZR.state.avatar = { ...window.ZR.state.avatar, ...parsed };
    }
  } catch (e) {/* ignore */}
};

/* =========================================
   ROUTER / NAVEGACIÓN
   ========================================= */
const _screenInits = {};

window.ZR.registerScreen = function (id, initFn) {
  _screenInits[id] = initFn;
};

window.ZR.navigate = function (screenId, data) {
  if (screenId === 'screen-avatar') {
    window.ZR.state.avatarReturnScreen = (data && data.from) || window.ZR.state.currentScreen || 'screen-menu-aventura';
  } else {
    window.ZR.state.currentScreen = screenId;
  }

  if (screenId === 'screen-map' && window.ZR.preloadActiveAvatarLayers) {
    window.ZR.preloadActiveAvatarLayers();
  }

  if (window.ZR.gameEngine && screenId !== 'screen-map') {
    window.ZR.gameEngine.stop();
  }

  if (screenId !== 'screen-map' && window.ZR.stopMultiplayerMapSync) {
    window.ZR.stopMultiplayerMapSync();
  }

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  const target = document.getElementById(screenId);
  if (!target) {
    console.warn('[ZR] Screen not found:', screenId);
    return;
  }
  target.classList.add('active');

  if (screenId === 'screen-map') {
    document.body.classList.add('map-mode-active');
    document.documentElement.classList.add('map-mode-active');
  } else {
    document.body.classList.remove('map-mode-active');
    document.documentElement.classList.remove('map-mode-active');
  }

  updateNavActive(screenId);

  if (screenId === 'screen-home' && window.ZR.drawHomePreview) {
    setTimeout(window.ZR.drawHomePreview, 10);
  } else if (screenId === 'screen-menu-aventura' && window.ZR.drawAventuraPreview) {
    setTimeout(window.ZR.drawAventuraPreview, 10);
  }

  if (_screenInits[screenId]) {
    _screenInits[screenId](data || {});
  }

  window.scrollTo(0, 0);
};

function updateNavActive(screenId) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const mapping = {
    'screen-home': 'nav-home',
    'screen-menu-aventura': 'nav-aventura',
    'screen-avatar': 'nav-aventura',
    'screen-multi-join': 'nav-aventura',
    'screen-multi-lobby': 'nav-aventura',
    'screen-multi-create': 'nav-aventura',
    'screen-vs': 'nav-aventura',
    'screen-cinematic': 'nav-aventura',
    'screen-map': 'nav-aventura',
    'screen-situation': 'nav-aventura',
    'screen-decision': 'nav-aventura',
    'screen-result': 'nav-aventura',
    'screen-ending': 'nav-aventura',
    'screen-body-select': 'nav-body',
    'screen-body-organs': 'nav-body'
  };
  const navId = mapping[screenId];
  if (navId) {
    const btn = document.getElementById(navId);
    if (btn) btn.classList.add('active');
  }
}

/* =========================================
   TOAST NOTIFICATION
   ========================================= */
window.ZR.showToast = function (msg, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
};

/* =========================================
   MOTOR DE TINTADO CANVAS (HTML5 Canvas Pixel Tinting)
   Carga un sprite en escala de grises, tinta píxel a píxel con el color deseado
   preservando brillo/sombras, y devuelve una data URL lista para mostrar.
   ========================================= */

/**
 * Convierte un color hex "#RRGGBB" a { r, g, b }
 */
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16)
  };
}

/**
 * Tinta un sprite en escala de grises con el color hex dado.
 * Usa normalización basada en PERCENTIL 90 como lumMax para evitar que
 * píxeles muy blancos (ojos, dientes) distorsionen el tintado del resto.
 */
const DARK_THRESHOLD = 40;
const TINT_CACHE = new Map();

function tintSprite(imgSrc, hexColor) {
  const cacheKey = `${imgSrc}_${hexColor}`;
  if (TINT_CACHE.has(cacheKey)) {
    return Promise.resolve(TINT_CACHE.get(cacheKey));
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const { r: tR, g: tG, b: tB } = hexToRgb(hexColor);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // PASO 1: Recopilar luminosidades de píxeles válidos
      const lums = [];
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 10) continue;
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (lum > DARK_THRESHOLD) lums.push(lum);
      }

      lums.sort((a, b) => a - b);
      const p85idx   = Math.floor(lums.length * 0.85);
      const lumMax   = lums.length > 0 ? Math.max(lums[p85idx], DARK_THRESHOLD + 1) : 200;
      const lumRange = lumMax - DARK_THRESHOLD;

      // PASO 2: Tintado con rango normalizado
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 10) continue;
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (lum < DARK_THRESHOLD) continue;

        const t = Math.min(1.0, (lum - DARK_THRESHOLD) / lumRange);
        data[i]     = Math.round(tR * t);
        data[i + 1] = Math.round(tG * t);
        data[i + 2] = Math.round(tB * t);
      }

      ctx.putImageData(imageData, 0, 0);
      const resultUrl = canvas.toDataURL('image/png');
      TINT_CACHE.set(cacheKey, resultUrl);
      resolve(resultUrl);
    };
    img.onerror = () => resolve('');
    img.src = imgSrc;
  });
}

/* =========================================
   CAPAS DE AVATAR
   Define los 5 sprites y el color que se les aplica
   ========================================= */
window.ZR.getAvatarLayerDefs = function (av) {
  av = av || window.ZR.state.avatar;
  const base = window.ZR.ASSETS + 'Avatar/';
  const skinFile  = av.skinFile  || 'piel_media';
  const mouthFile = av.mouthFile || 'boca_feliz';
  const gender    = (av.gender === 'mujer') ? 'mujer' : 'hombre';

  const genderFolder = (gender === 'mujer') ? 'Mujer' : 'Hombre';
  const eyesFile     = (gender === 'mujer') ? 'ojos_mujer' : 'ojos_hombre';
  const hairFile     = (gender === 'mujer') ? 'cabello_mujer' : 'cabello_hombre';

  return [
    { src: `${base}Piel/${skinFile}.png`, color: null, name: 'piel' },
    { src: `${base}Boca/${mouthFile}.png`, color: null, name: 'boca' },
    { src: `${base}${genderFolder}/${eyesFile}.png`, color: null, name: 'ojos' },
    { src: `${base}Inferior/inferior_base.png`, color: av.shortColor || '#5B7065', name: 'inferior' },
    { src: `${base}Superior/superior_base.png`, color: av.poloColor  || '#4A6FA5', name: 'superior' },
    { src: `${base}Zapatos/zapatos_base.png`,   color: av.shoeColor  || '#8B4513', name: 'zapatos'  },
    { src: `${base}${genderFolder}/${hairFile}.png`, color: av.hairColor || '#2B2B2B', name: 'cabello' },
  ];
};

/* =========================================
   RENDERIZADOR PRINCIPAL DE AVATAR CON CANVAS TINTING
   Acepta un containerId donde pintará las capas apiladas.
   ========================================= */
// Sprite nativo exacto: 340 x 720 px
const SPRITE_W = 340;
const SPRITE_H = 720;

window.ZR.renderAvatarInContainer = async function (containerId, avatar) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Limpiar el contenedor
  container.innerHTML = '';
  container.style.position = 'relative';
  container.style.overflow = 'hidden';

  const layers = window.ZR.getAvatarLayerDefs(avatar || window.ZR.state.avatar);

  // Escalar al contenedor manteniendo proporciones exactas del sprite (340x720)
  const containerH = container.offsetHeight || 390;
  const containerW = container.offsetWidth  || Math.round(containerH * (SPRITE_W / SPRITE_H));
  const scaleH = containerH / SPRITE_H;
  const scaleW = containerW / SPRITE_W;
  const scale  = Math.min(scaleH, scaleW);  // Ajuste sin distorsión ni estiramiento

  const renderW = Math.round(SPRITE_W * scale);
  const renderH = Math.round(SPRITE_H * scale);

  // Centrar dentro del contenedor
  const offsetX = Math.round((containerW - renderW) / 2);
  const offsetY = Math.round((containerH - renderH) / 2);

  // Procesar capas: si color===null → imagen directa, si no → Canvas tinting
  const tintedUrls = await Promise.all(
    layers.map(layer =>
      layer.color === null
        ? Promise.resolve(layer.src)   // piel: usar la URL directamente
        : tintSprite(layer.src, layer.color)
    )
  );

  window.ZR.preloadActiveAvatarLayers = async function () {
    const av = window.ZR.state.avatar;
    const defs = window.ZR.getAvatarLayerDefs(av);
    const images = await Promise.all(
      defs.map(async layer => {
        const url = layer.color === null ? layer.src : await tintSprite(layer.src, layer.color);
        return new Promise(resolve => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = url;
        });
      })
    );
    window.ZR.activeAvatarImages = images.filter(Boolean);
    return window.ZR.activeAvatarImages;
  };

  tintedUrls.forEach((url, i) => {
    if (!url) return;
    const img = document.createElement('img');
    img.src = url;
    img.alt = layers[i].name;
    img.style.cssText = `
      position: absolute;
      top: ${offsetY}px;
      left: ${offsetX}px;
      width: ${renderW}px;
      height: ${renderH}px;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      pointer-events: none;
    `;
    container.appendChild(img);
  });
};

/* =========================================
   GENERACIÓN DE CÓDIGO DE COMUNIDAD
   ========================================= */
window.ZR.generateCode = function () {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

/* =========================================
   INIT DE LA APLICACIÓN
   ========================================= */
document.addEventListener('DOMContentLoaded', function () {
  window.ZR.loadAvatar();

  // Renderizar avatar genérico en pantalla principal al cargar
  setTimeout(() => {
    window.ZR.renderAvatarInContainer('home-avatar-display', window.ZR.state.avatar);
  }, 100);

  document.getElementById('nav-home')?.addEventListener('click', () => {
    window.ZR.navigate('screen-home');
  });

  document.getElementById('nav-aventura')?.addEventListener('click', () => {
    window.ZR.navigate('screen-menu-aventura');
  });

  document.getElementById('nav-body')?.addEventListener('click', () => {
    window.ZR.navigate('screen-body-select');
  });

  document.getElementById('home-start-btn')?.addEventListener('click', () => {
    const input = document.getElementById('home-player-name');
    const name = input?.value.trim();
    if (!name) {
      input?.classList.add('shake');
      setTimeout(() => input?.classList.remove('shake'), 500);
      window.ZR.showToast('<b>¡Ingresa tu nombre</b> para comenzar!');
      return;
    }
    window.ZR.state.playerName = name;
    window.ZR.navigate('screen-menu-aventura');
  });

  document.getElementById('home-player-name')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('home-start-btn')?.click();
  });

  document.querySelector('.nav-brand')?.addEventListener('click', () => {
    window.ZR.navigate('screen-home');
  });

  function updateXPDisplays() {
    const score = window.ZR.state && window.ZR.state.story ? window.ZR.state.story.score : 0;

    const navXPVal = document.getElementById('nav-xp-value');
    if (navXPVal) navXPVal.textContent = score;

    const mapScoreEl = document.getElementById('map-player-score');
    if (mapScoreEl) mapScoreEl.textContent = `${score} XP`;

    const badgeEl = document.getElementById('nav-xp-badge');
    if (badgeEl) {
      badgeEl.classList.remove('xp-pop');
      void badgeEl.offsetWidth; // Reflow para reiniciar la animación
      badgeEl.classList.add('xp-pop');
    }
  }

  document.addEventListener('zr:score-updated', updateXPDisplays);
  updateXPDisplays();

  if (window.ZR.preloadActiveAvatarLayers) {
    window.ZR.preloadActiveAvatarLayers();
  }

  window.ZR.navigate('screen-home');

  console.log('[ZR] ZoneReact App Initialized 🕹️ (Canvas Tinting Engine)');
});
