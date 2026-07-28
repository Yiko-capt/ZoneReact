/**
 * ZoneReact - app.js
 * Router SPA y renderizador de avatares usando capas PNG de Perry Platypus
 */

window.ZR = window.ZR || {};

/* =========================================
   ESTADO GLOBAL
   ========================================= */
window.ZR.state = {
  playerName: '',
  mode: null,          // 'story' | 'multi'
  avatar: {
    skin: 1,           // 1, 2, 3
    hairStyle: 'corto',// 'corto' | 'cola'
    hairColor: 'negro',// 'amarillo' | 'marron' | 'negro'
    eyes: 1,           // 1, 2
    mouth: 1,          // 1, 2, 3, 4
    polo: 'Azul',      // 'Azul' | 'Rojo' | 'Rosa' | 'Verde'
    gender: 'hombre'
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
  if (window.ZR.gameEngine && screenId !== 'screen-map') {
    window.ZR.gameEngine.stop();
  }

  if (screenId !== 'screen-map' && window.ZR.stopBotSimulation) {
    window.ZR.stopBotSimulation();
  }

  if (screenId === 'screen-map' && window.ZR.state.mode === 'multi' && window.ZR.startBotSimulation) {
    setTimeout(() => window.ZR.startBotSimulation(), 500);
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
   RENDERIZADOR DE AVATAR (CAPAS PNG PERRY PLATYPUS)
   ========================================= */
window.ZR.getAvatarLayers = function (av) {
  av = av || window.ZR.state.avatar;
  const base = window.ZR.ASSETS + 'Personaje 1/';
  const skinNum = av.skin || 1;
  const eyesNum = av.eyes || 1;
  const mouthNum = av.mouth || 1;
  const poloName = av.polo || 'Azul';
  const hairStyle = av.hairStyle || av.hair?.style || 'corto';
  const hairColor = av.hairColor || av.hair?.color || 'negro';

  const layers = [
    { src: `${base}Colores de piel/1 Color ${skinNum} piel.png`, name: 'skin' },
    { src: `${base}Superior color/1 Superior ${poloName}.png`, name: 'polo' },
    { src: `${base}Inferior/Shorts.png`, name: 'shorts' },
    { src: `${base}Botas.png`, name: 'boots' },
    { src: `${base}Delineado ojos/Ojos ${eyesNum}.png`, name: 'eyes' },
    { src: `${base}Boca/1 boca ${mouthNum}.png`, name: 'mouth' }
  ];

  const folder = hairStyle === 'cola' ? 'Peinado cola' : 'Peinado corto';
  const file   = hairStyle === 'cola' ? `1 cola ${hairColor}.png` : `1 corto ${hairColor}.png`;
  layers.push({ src: `${base}${folder}/${file}`, name: 'hair' });

  return layers;
};

window.ZR.renderAvatarInContainer = function (containerId, avatar, extraEffect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  if (!container.classList.contains('avatar-display')) {
    container.classList.add('avatar-display');
  }

  Array.from(container.classList).forEach(cls => {
    if (cls.startsWith('effect-')) container.classList.remove(cls);
  });

  if (extraEffect) {
    container.classList.add(`effect-${extraEffect}`);
  }

  const layers = window.ZR.getAvatarLayers(avatar);

  layers.forEach(layer => {
    const img = document.createElement('img');
    img.src = layer.src;
    img.className = 'avatar-layer layer-' + layer.name;
    img.alt = '';
    img.onerror = function() { this.style.display = 'none'; };
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

  document.addEventListener('zr:score-updated', () => {
    const scoreEl = document.getElementById('map-player-score');
    if (scoreEl) scoreEl.textContent = `${window.ZR.state.story.score} XP`;
  });

  window.ZR.navigate('screen-home');

  console.log('[ZR] ZoneReact App Initialized 🕹️ (Perry Platypus Assets)');
});
