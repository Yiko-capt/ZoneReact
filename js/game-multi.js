/**
 * ZoneReact - game-multi.js
 * Modo Multijugador SIMULADO
 * - Crear comunidad / unirse con código
 * - Sala de espera con leaderboard
 * - VS screen
 * - Mapa compartido con timer 7:30
 * - Bots que acumulan puntos aleatoriamente
 */
window.ZR = window.ZR || {};

/* =========================================
   DATOS SIMULADOS
   ========================================= */
const SQUAD_NAMES = ['Fénix', 'Yiko', 'Sage', 'Clove', 'Artulol'];
const ENEMY_SQUAD = ['Drago', 'Nexus', 'Kira', 'Bolt', 'Zara'];

let botInterval = null;

/* =========================================
   PANTALLA 4 - JOIN / CREATE
   ========================================= */
window.ZR.registerScreen('screen-multi-join', function () {
  // Join button
  const joinBtn = document.getElementById('multi-join-btn');
  const newJoin = joinBtn?.cloneNode(true);
  joinBtn?.parentNode?.replaceChild(newJoin, joinBtn);
  newJoin?.addEventListener('click', () => {
    const code = document.getElementById('multi-code-input')?.value.trim().toUpperCase();
    if (!code || code.length < 4) {
      window.ZR.showToast('📟 <b>Ingresa un código</b> válido para unirte');
      return;
    }
    window.ZR.state.multi.code = code;
    window.ZR.state.multi.squadName = 'SchoolSJL';
    window.ZR.state.multi.role = 'member';
    window.ZR.navigate('screen-multi-lobby');
  });

  // Create button
  const createBtn = document.getElementById('multi-create-btn');
  const newCreate = createBtn?.cloneNode(true);
  createBtn?.parentNode?.replaceChild(newCreate, createBtn);
  newCreate?.addEventListener('click', () => {
    window.ZR.navigate('screen-multi-create');
  });

  // Back
  const backBtn = document.getElementById('multi-join-back');
  const newBack = backBtn?.cloneNode(true);
  backBtn?.parentNode?.replaceChild(newBack, backBtn);
  newBack?.addEventListener('click', () => window.ZR.navigate('screen-menu-aventura'));
});

/* =========================================
   PANTALLA 7 - CREAR COMUNIDAD
   ========================================= */
window.ZR.registerScreen('screen-multi-create', function () {
  // Reset code
  const codeEl = document.getElementById('generated-code-display');
  if (codeEl) codeEl.textContent = '——————';

  const nameInput = document.getElementById('squad-name-input');
  const genBtn = document.getElementById('generate-code-btn');
  const newGenBtn = genBtn?.cloneNode(true);
  genBtn?.parentNode?.replaceChild(newGenBtn, genBtn);

  newGenBtn?.addEventListener('click', () => {
    const name = nameInput?.value.trim();
    if (!name) {
      window.ZR.showToast('✏️ <b>Escribe el nombre</b> de tu comunidad');
      return;
    }
    const code = window.ZR.generateCode();
    window.ZR.state.multi.code = code;
    window.ZR.state.multi.squadName = name;
    window.ZR.state.multi.role = 'leader';

    if (codeEl) codeEl.textContent = code;

    // Simulate members joining
    simulateMembersJoining();
  });

  // Ready button
  const readyBtn = document.getElementById('create-ready-btn');
  const newReady = readyBtn?.cloneNode(true);
  readyBtn?.parentNode?.replaceChild(newReady, readyBtn);
  newReady?.addEventListener('click', () => {
    if (!window.ZR.state.multi.code) {
      window.ZR.showToast('🔑 <b>Genera el código</b> primero');
      return;
    }
    window.ZR.navigate('screen-multi-lobby');
  });

  // Back
  const backBtn = document.getElementById('create-back-btn');
  const newBack = backBtn?.cloneNode(true);
  backBtn?.parentNode?.replaceChild(newBack, backBtn);
  newBack?.addEventListener('click', () => window.ZR.navigate('screen-multi-join'));

  // Members list
  const membersList = document.getElementById('create-members-list');
  if (membersList) {
    membersList.innerHTML = `
      <div class="lb-row is-you">
        <div class="lb-rank">1</div>
        <div class="lb-name">${window.ZR.state.playerName || 'Tú'} <small>TÚ</small></div>
        <div class="lb-score">0</div>
      </div>
    `;
  }
});

function simulateMembersJoining() {
  const membersList = document.getElementById('create-members-list');
  if (!membersList) return;

  const bots = SQUAD_NAMES.filter(n => n !== (window.ZR.state.playerName || '')).slice(0, 4);
  let joined = 0;

  const interval = setInterval(() => {
    if (joined >= bots.length) { clearInterval(interval); return; }
    const botName = bots[joined++];
    const row = document.createElement('div');
    row.className = 'lb-row';
    row.innerHTML = `
      <div class="lb-rank">${joined + 1}</div>
      <div class="lb-name">${botName}</div>
      <div class="lb-score">0</div>
    `;
    membersList.appendChild(row);
    window.ZR.showToast(`👾 <b>${botName}</b> se unió a tu comunidad`);
  }, 1500);
}

/* =========================================
   PANTALLA 5 - LOBBY / SALA DE ESPERA
   ========================================= */
window.ZR.registerScreen('screen-multi-lobby', function () {
  const squadName = window.ZR.state.multi.squadName || 'SchoolSJL';
  const playerName = window.ZR.state.playerName || 'Tú';

  // Title
  const titleEl = document.getElementById('lobby-title');
  if (titleEl) titleEl.textContent = `Bienvenido a ${squadName}`;

  // Render avatar
  window.ZR.renderAvatarInContainer('lobby-avatar-display', window.ZR.state.avatar);

  const lobbyNameEl = document.getElementById('lobby-player-display-name');
  if (lobbyNameEl) lobbyNameEl.textContent = playerName;

  // Build leaderboard (player + bots)
  const lb = buildSimulatedLeaderboard(playerName);
  window.ZR.state.multi.leaderboard = lb;
  renderLobbyLeaderboard(lb);

  // Avatar btn
  const avatarBtn = document.getElementById('lobby-avatar-btn');
  const newAvatarBtn = avatarBtn?.cloneNode(true);
  avatarBtn?.parentNode?.replaceChild(newAvatarBtn, avatarBtn);
  newAvatarBtn?.addEventListener('click', () => window.ZR.navigate('screen-avatar'));

  // Ready btn
  const readyBtn = document.getElementById('lobby-ready-btn');
  const newReady = readyBtn?.cloneNode(true);
  readyBtn?.parentNode?.replaceChild(newReady, readyBtn);
  newReady?.addEventListener('click', () => {
    window.ZR.navigate('screen-vs');
  });

  // Back
  const backBtn = document.getElementById('lobby-back-btn');
  const newBack = backBtn?.cloneNode(true);
  backBtn?.parentNode?.replaceChild(newBack, backBtn);
  newBack?.addEventListener('click', () => window.ZR.navigate('screen-multi-join'));
});

function buildSimulatedLeaderboard(playerName) {
  const mySquad = [
    { name: playerName, score: 0, isYou: true },
    ...SQUAD_NAMES.filter(n => n !== playerName).slice(0,4).map(n => ({ name: n, score: 0, isYou: false }))
  ];
  return mySquad;
}

function renderLobbyLeaderboard(lb) {
  const container = document.getElementById('lobby-leaderboard');
  if (!container) return;
  container.innerHTML = '';

  lb.forEach((entry, i) => {
    const row = document.createElement('div');
    row.className = 'lb-row' + (entry.isYou ? ' is-you' : '');
    const rankClasses = ['gold','silver','bronze'];
    row.innerHTML = `
      <div class="lb-rank ${rankClasses[i] || ''}">${i + 1}</div>
      <div class="lb-name">${entry.name}${entry.isYou ? ' <small>TÚ</small>' : ''}</div>
      <div class="lb-score">${entry.score}</div>
    `;
    container.appendChild(row);
  });
}

/* =========================================
   PANTALLA 6 - VS SCREEN
   ========================================= */
window.ZR.registerScreen('screen-vs', function () {
  const mySquad  = window.ZR.state.multi.squadName || 'SchoolSJL';
  const myEl  = document.getElementById('vs-my-squad');
  const enemyEl = document.getElementById('vs-enemy-squad');

  if (myEl) myEl.textContent = mySquad;
  if (enemyEl) enemyEl.textContent = 'LuriganchoCity';

  // Auto-advance to map after 3 seconds
  setTimeout(() => {
    window.ZR.navigate('screen-map', { mode: 'multi' });
  }, 3200);
});

/* =========================================
   PANTALLA MAP - MULTI MODE
   (handled by game-story.js registerScreen 'screen-map')
   Extra: timer and mini-leaderboard
   ========================================= */

// Mini leaderboard update for multi map HUD
window.ZR.updateMultiHUD = function () {
  const lb = window.ZR.state.multi.leaderboard;
  if (!lb) return;

  // Sort by score
  lb.sort((a, b) => b.score - a.score);

  const container = document.getElementById('map-mini-lb-body');
  if (!container) return;
  container.innerHTML = '';

  lb.slice(0, 5).forEach((entry, i) => {
    const row = document.createElement('div');
    row.className = 'map-mini-lb-row';
    row.innerHTML = `
      <span class="map-mini-lb-rank">${i + 1}</span>
      <span class="map-mini-lb-name">${entry.name}</span>
      <span class="map-mini-lb-score">${entry.score}</span>
    `;
    container.appendChild(row);
  });
};

// Start bot score updates for multi mode
window.ZR.startBotSimulation = function () {
  if (botInterval) clearInterval(botInterval);

  botInterval = setInterval(() => {
    const lb = window.ZR.state.multi.leaderboard;
    if (!lb) return;

    // Random bots score
    lb.forEach(entry => {
      if (!entry.isYou) {
        if (Math.random() < 0.15) {
          entry.score = Math.min(100, entry.score + 20);
        }
      }
    });

    window.ZR.updateMultiHUD();
  }, 4000);
};

window.ZR.stopBotSimulation = function () {
  if (botInterval) {
    clearInterval(botInterval);
    botInterval = null;
  }
};
