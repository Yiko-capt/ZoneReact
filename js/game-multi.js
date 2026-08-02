/**
 * ZoneReact - game-multi.js
 * Modo Multijugador Real (Supabase)
 */
window.ZR = window.ZR || {};

let lobbySubscription = null;
let matchmakingGroupsSub = null;
let matchmakingPartidasSub = null;
let mapJugadoresSub = null;
let mapPartidaSub = null;
let gameTimerInterval = null;
let botSimulationInterval = null;

function cleanupMultiplayer() {
  if (lobbySubscription) { window.ZR.supabase.removeChannel(lobbySubscription); lobbySubscription = null; }
  if (matchmakingGroupsSub) { window.ZR.supabase.removeChannel(matchmakingGroupsSub); matchmakingGroupsSub = null; }
  if (matchmakingPartidasSub) { window.ZR.supabase.removeChannel(matchmakingPartidasSub); matchmakingPartidasSub = null; }
  if (mapJugadoresSub) { window.ZR.supabase.removeChannel(mapJugadoresSub); mapJugadoresSub = null; }
  if (mapPartidaSub) { window.ZR.supabase.removeChannel(mapPartidaSub); mapPartidaSub = null; }
  if (gameTimerInterval) { clearInterval(gameTimerInterval); gameTimerInterval = null; }
  if (botSimulationInterval) { clearInterval(botSimulationInterval); botSimulationInterval = null; }
}

// ==========================================
// SCREEN: JOIN
// ==========================================
window.ZR.registerScreen('screen-multi-join', function () {
  const joinBtn = document.getElementById('multi-join-btn');
  const newJoin = joinBtn?.cloneNode(true);
  joinBtn?.parentNode?.replaceChild(newJoin, joinBtn);

  newJoin?.addEventListener('click', async () => {
    const code = document.getElementById('multi-code-input')?.value.trim().toUpperCase();
    if (!code || code.length < 4) {
      window.ZR.showToast('📟 <b>Ingresa un código</b> válido para unirte');
      return;
    }

    const { data: grupo, error } = await window.ZR.supabase
      .from('grupos')
      .select('*')
      .eq('codigo', code)
      .single();

    if (error || !grupo) {
      window.ZR.showToast('❌ <b>Código no encontrado</b>');
      return;
    }
    if (grupo.estado === 'en_partida') {
      window.ZR.showToast('⚠️ <b>El grupo ya está jugando</b>');
      return;
    }

    const playerName = window.ZR.state.playerName || 'Jugador';
    const { data: jugador, error: errJug } = await window.ZR.supabase
      .from('jugadores')
      .insert({ grupo_id: grupo.id, nombre: playerName })
      .select()
      .single();

    if (errJug) {
      window.ZR.showToast('❌ <b>Error al unirse</b>');
      return;
    }

    window.ZR.state.multi.code = code;
    window.ZR.state.multi.squadName = grupo.nombre;
    window.ZR.state.multi.role = 'member';
    window.ZR.state.multi.grupoId = grupo.id;
    window.ZR.state.multi.playerId = jugador.id;
    window.ZR.state.multi.esLider = false;
    window.ZR.state.multi.vsBots = grupo.es_bot;

    window.ZR.navigate('screen-multi-lobby');
  });

  const createBtn = document.getElementById('multi-create-btn');
  const newCreate = createBtn?.cloneNode(true);
  createBtn?.parentNode?.replaceChild(newCreate, createBtn);
  newCreate?.addEventListener('click', () => {
    window.ZR.navigate('screen-multi-create');
  });

  const backBtn = document.getElementById('multi-join-back');
  const newBack = backBtn?.cloneNode(true);
  backBtn?.parentNode?.replaceChild(newBack, backBtn);
  newBack?.addEventListener('click', () => window.ZR.navigate('screen-menu-aventura'));
});

// ==========================================
// SCREEN: CREATE
// ==========================================
window.ZR.registerScreen('screen-multi-create', function () {
  const codeEl = document.getElementById('generated-code-display');
  if (codeEl) codeEl.textContent = '——————';

  const nameInput = document.getElementById('squad-name-input');
  const genBtn = document.getElementById('generate-code-btn');
  const newGenBtn = genBtn?.cloneNode(true);
  genBtn?.parentNode?.replaceChild(newGenBtn, genBtn);

  let generatedCode = null;

  newGenBtn?.addEventListener('click', () => {
    const name = nameInput?.value.trim();
    if (!name) {
      window.ZR.showToast('✏️ <b>Escribe el nombre</b> de tu comunidad');
      return;
    }
    generatedCode = window.ZR.generateCode();
    if (codeEl) codeEl.textContent = generatedCode;
    window.ZR.showToast('✅ <b>Código generado</b>, elige un modo abajo.');
  });

  async function createGroupAndJoin(isBot) {
    if (!generatedCode) {
      window.ZR.showToast('🔑 <b>Genera el código</b> primero');
      return;
    }
    const name = nameInput?.value.trim() || 'Comunidad';
    const { data: grupo, error } = await window.ZR.supabase
      .from('grupos')
      .insert({ codigo: generatedCode, nombre: name, es_bot: isBot })
      .select()
      .single();

    if (error || !grupo) {
      window.ZR.showToast('❌ <b>Error creando grupo</b>');
      return;
    }

    const playerName = window.ZR.state.playerName || 'Líder';
    const { data: jugador, error: errJug } = await window.ZR.supabase
      .from('jugadores')
      .insert({ grupo_id: grupo.id, nombre: playerName })
      .select()
      .single();

    if (errJug) {
      window.ZR.showToast('❌ <b>Error uniéndose</b>');
      return;
    }

    window.ZR.state.multi.code = generatedCode;
    window.ZR.state.multi.squadName = name;
    window.ZR.state.multi.role = 'leader';
    window.ZR.state.multi.grupoId = grupo.id;
    window.ZR.state.multi.playerId = jugador.id;
    window.ZR.state.multi.esLider = true;
    window.ZR.state.multi.vsBots = isBot;

    window.ZR.navigate('screen-multi-lobby');
  }

  const readyBtn = document.getElementById('create-ready-btn');
  const newReady = readyBtn?.cloneNode(true);
  readyBtn?.parentNode?.replaceChild(newReady, readyBtn);
  newReady?.addEventListener('click', () => createGroupAndJoin(false));

  const botsBtn = document.getElementById('create-bots-btn');
  if (botsBtn) {
    const newBotsBtn = botsBtn.cloneNode(true);
    botsBtn.parentNode.replaceChild(newBotsBtn, botsBtn);
    newBotsBtn.addEventListener('click', () => createGroupAndJoin(true));
  }

  const backBtn = document.getElementById('create-back-btn');
  const newBack = backBtn?.cloneNode(true);
  backBtn?.parentNode?.replaceChild(newBack, backBtn);
  newBack?.addEventListener('click', () => window.ZR.navigate('screen-multi-join'));

  const membersList = document.getElementById('create-members-list');
  if (membersList) membersList.innerHTML = '';
  const memberCount = document.getElementById('mc-member-count');
  if (memberCount) memberCount.textContent = '0 / 5';
});

// ==========================================
// SCREEN: LOBBY
// ==========================================
window.ZR.registerScreen('screen-multi-lobby', async function () {
  cleanupMultiplayer();
  const grupoId = window.ZR.state.multi.grupoId;

  const title = document.getElementById('lobby-title');
  if (title) title.textContent = `Bienvenido a ${window.ZR.state.multi.squadName || 'tu Comunidad'}`;

  const playerDisplay = document.getElementById('lobby-player-display-name');
  if (playerDisplay) playerDisplay.textContent = window.ZR.state.playerName || 'Tú';

  async function fetchMembers() {
    const { data } = await window.ZR.supabase.from('jugadores').select('*').eq('grupo_id', grupoId);
    renderLobbyMembers(data || []);
  }

  lobbySubscription = window.ZR.supabase.channel(`grupo-${grupoId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'jugadores', filter: `grupo_id=eq.${grupoId}` }, () => {
      fetchMembers();
    })
    .subscribe();

  fetchMembers();

  const readyBtn = document.getElementById('lobby-ready-btn');
  const newReady = readyBtn?.cloneNode(true);
  readyBtn?.parentNode?.replaceChild(newReady, readyBtn);

  if (window.ZR.state.multi.esLider) {
    newReady.style.display = 'block';
    newReady.innerHTML = window.ZR.state.multi.vsBots ? '🤖 INICIAR VS BOTS →' : '⚔️ BUSCAR PARTIDA →';
    
    newReady.addEventListener('click', async () => {
      await window.ZR.supabase.from('grupos').update({ estado: 'buscando_partida' }).eq('id', grupoId);
      
      if (window.ZR.state.multi.vsBots) {
        // Create bot opponent
        const { data: botGroup } = await window.ZR.supabase.from('grupos').insert({
          codigo: window.ZR.generateCode(),
          nombre: 'CPU_' + Math.floor(Math.random() * 1000),
          estado: 'en_partida',
          es_bot: true
        }).select().single();

        await window.ZR.supabase.from('jugadores').insert([
          { grupo_id: botGroup.id, nombre: 'Bot_Alpha' },
          { grupo_id: botGroup.id, nombre: 'Bot_Bravo' }
        ]);

        const { data: partida } = await window.ZR.supabase.from('partidas').insert({
          grupo_a_id: grupoId,
          grupo_b_id: botGroup.id,
          estado: 'jugando',
          inicio_at: new Date().toISOString(),
          duracion_segundos: 300
        }).select().single();

        await window.ZR.supabase.from('grupos').update({ estado: 'en_partida' }).eq('id', grupoId);
        window.ZR.state.multi.partidaId = partida.id;
        window.ZR.state.multi.rivalGroupId = botGroup.id;
        window.ZR.navigate('screen-vs');
      } else {
        window.ZR.navigate('screen-multi-matchmaking');
      }
    });
  } else {
    newReady.style.display = 'none';
  }

  // Listen if leader changed status to buscando_partida or en_partida
  const lobbyGroupSub = window.ZR.supabase.channel(`grupo-estado-${grupoId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'grupos', filter: `id=eq.${grupoId}` }, (payload) => {
      if (!window.ZR.state.multi.esLider && payload.new.estado === 'buscando_partida') {
        if (!window.ZR.state.multi.vsBots) {
          window.ZR.navigate('screen-multi-matchmaking');
        }
      }
    }).subscribe();

  const oldCleanup = cleanupMultiplayer;
  cleanupMultiplayer = function() {
    oldCleanup();
    window.ZR.supabase.removeChannel(lobbyGroupSub);
  };

  const backBtn = document.getElementById('lobby-back-btn');
  const newBack = backBtn?.cloneNode(true);
  backBtn?.parentNode?.replaceChild(newBack, backBtn);
  newBack?.addEventListener('click', () => window.ZR.navigate('screen-multi-join'));
});

function renderLobbyMembers(members) {
  const list = document.getElementById('lobby-leaderboard');
  if (!list) return;
  list.innerHTML = '';

  members.forEach((m, i) => {
    const isMe = m.id === window.ZR.state.multi.playerId;
    list.innerHTML += `
      <div class="lb-row ${isMe ? 'is-you' : ''}">
        <div class="lb-rank">#${i + 1}</div>
        <div>${m.nombre} ${isMe ? '⭐ (TÚ)' : ''}</div>
        <div style="text-align:right">${m.puntaje} XP</div>
      </div>
    `;
  });
}

// ==========================================
// SCREEN: MATCHMAKING
// ==========================================
window.ZR.registerScreen('screen-multi-matchmaking', async function () {
  const grupoId = window.ZR.state.multi.grupoId;
  const listEl = document.getElementById('matchmaking-groups-list');
  const modal = document.getElementById('challenge-modal');
  const challengerName = document.getElementById('challenger-name');
  
  if (modal) modal.style.display = 'none';

  async function fetchGroups() {
    if (!listEl) return;
    const { data } = await window.ZR.supabase
      .from('grupos')
      .select('*')
      .eq('estado', 'buscando_partida')
      .eq('es_bot', false)
      .neq('id', grupoId);
    
    listEl.innerHTML = '';
    if (!data || data.length === 0) {
      listEl.innerHTML = '<div style="color:white;text-align:center;font-family:\'Press Start 2P\', monospace;font-size:10px;">No hay otros grupos buscando...</div>';
      return;
    }

    data.forEach(g => {
      const div = document.createElement('div');
      div.style.background = '#2C3A50';
      div.style.border = '2px solid white';
      div.style.padding = '15px';
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
      div.style.fontFamily = "'Press Start 2P', monospace";
      
      div.innerHTML = `
        <div style="color:white; font-size:12px;">${g.nombre}</div>
      `;
      if (window.ZR.state.multi.esLider) {
        const btn = document.createElement('button');
        btn.className = 'mc-btn mc-btn-ready';
        btn.style.padding = '10px';
        btn.style.fontSize = '10px';
        btn.textContent = 'RETAR';
        btn.onclick = async () => {
          await window.ZR.supabase.from('partidas').insert({
            grupo_a_id: grupoId,
            grupo_b_id: g.id,
            estado: 'retando'
          });
          btn.textContent = 'ENVIADO';
          btn.disabled = true;
          window.ZR.showToast('⏳ Reto enviado. Esperando respuesta...');
        };
        div.appendChild(btn);
      } else {
        const span = document.createElement('span');
        span.style.color = '#888';
        span.style.fontSize = '10px';
        span.textContent = 'Esperando al líder...';
        div.appendChild(span);
      }
      listEl.appendChild(div);
    });
  }

  matchmakingGroupsSub = window.ZR.supabase.channel('matchmaking-groups')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'grupos', filter: "estado=eq.buscando_partida" }, fetchGroups)
    .subscribe();
  
  fetchGroups();

  let incomingPartidaId = null;
  let rivalGroupIdLocal = null;

  matchmakingPartidasSub = window.ZR.supabase.channel('matchmaking-partidas')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'partidas' }, async (payload) => {
      const p = payload.new;
      
      // We are group B (Challenged)
      if (p.grupo_b_id === grupoId && p.estado === 'retando') {
        if (window.ZR.state.multi.esLider) {
          const { data: gA } = await window.ZR.supabase.from('grupos').select('nombre').eq('id', p.grupo_a_id).single();
          if (challengerName && gA) challengerName.textContent = gA.nombre;
          incomingPartidaId = p.id;
          rivalGroupIdLocal = p.grupo_a_id;
          if (modal) modal.style.display = 'flex';
        }
      }
      
      // We are group A (Challenger) and they rejected
      if (p.grupo_a_id === grupoId && p.estado === 'rechazada') {
        if (window.ZR.state.multi.esLider) {
          window.ZR.showToast('❌ <b>Solicitud rechazada</b> por el otro equipo');
          fetchGroups();
        }
      }

      // Either group and it started
      if ((p.grupo_a_id === grupoId || p.grupo_b_id === grupoId) && p.estado === 'jugando') {
        window.ZR.state.multi.partidaId = p.id;
        window.ZR.state.multi.rivalGroupId = (p.grupo_a_id === grupoId) ? p.grupo_b_id : p.grupo_a_id;
        window.ZR.navigate('screen-vs');
      }
    })
    .subscribe();

  const acceptBtn = document.getElementById('accept-challenge-btn');
  const newAccept = acceptBtn?.cloneNode(true);
  acceptBtn?.parentNode?.replaceChild(newAccept, acceptBtn);
  newAccept?.addEventListener('click', async () => {
    if (!incomingPartidaId) return;
    if (modal) modal.style.display = 'none';
    await window.ZR.supabase.from('partidas').update({ estado: 'jugando', inicio_at: new Date().toISOString(), duracion_segundos: 300 }).eq('id', incomingPartidaId);
    await window.ZR.supabase.from('grupos').update({ estado: 'en_partida' }).in('id', [grupoId, rivalGroupIdLocal]);
  });

  const rejectBtn = document.getElementById('reject-challenge-btn');
  const newReject = rejectBtn?.cloneNode(true);
  rejectBtn?.parentNode?.replaceChild(newReject, rejectBtn);
  newReject?.addEventListener('click', async () => {
    if (!incomingPartidaId) return;
    if (modal) modal.style.display = 'none';
    await window.ZR.supabase.from('partidas').update({ estado: 'rechazada' }).eq('id', incomingPartidaId);
  });
});

// ==========================================
// SCREEN: VS (Transition)
// ==========================================
window.ZR.registerScreen('screen-vs', async function () {
  const { data: myG } = await window.ZR.supabase.from('grupos').select('nombre').eq('id', window.ZR.state.multi.grupoId).single();
  const { data: rivG } = await window.ZR.supabase.from('grupos').select('nombre').eq('id', window.ZR.state.multi.rivalGroupId).single();

  const vsMy = document.getElementById('vs-my-squad');
  const vsRiv = document.getElementById('vs-enemy-squad');
  if (vsMy && myG) vsMy.textContent = myG.nombre;
  if (vsRiv && rivG) vsRiv.textContent = rivG.nombre;

  setTimeout(() => {
    window.ZR.navigate('screen-map', { mode: 'multi' });
  }, 3000);
});

// ==========================================
// MULTIPLAYER MAP SYNC
// ==========================================
window.ZR.startMultiplayerMapSync = async function () {
  if (window.ZR.state.mode !== 'multi') return;

  const partidaId = window.ZR.state.multi.partidaId;
  const myGroupId = window.ZR.state.multi.grupoId;
  const rivalGroupId = window.ZR.state.multi.rivalGroupId;

  if (!partidaId) return;

  const { data: p } = await window.ZR.supabase.from('partidas').select('*').eq('id', partidaId).single();
  if (!p) return;

  const { data: myG } = await window.ZR.supabase.from('grupos').select('nombre').eq('id', myGroupId).single();
  const { data: rivG } = await window.ZR.supabase.from('grupos').select('nombre, es_bot').eq('id', rivalGroupId).single();

  const myNameEl = document.getElementById('hud-my-team-name');
  const rivNameEl = document.getElementById('hud-rival-team-name');
  if (myNameEl && myG) myNameEl.textContent = myG.nombre;
  if (rivNameEl && rivG) rivNameEl.textContent = rivG.nombre;

  // Sync Timer
  const timerEl = document.getElementById('map-timer-display');
  const startTime = new Date(p.inicio_at).getTime();

  gameTimerInterval = setInterval(async () => {
    const now = Date.now();
    let left = (p.duracion_segundos || 300) - Math.floor((now - startTime) / 1000);
    
    if (left <= 0) {
      left = 0;
      clearInterval(gameTimerInterval);
      if (window.ZR.state.multi.esLider) {
        await window.ZR.supabase.from('partidas').update({ estado: 'finalizada' }).eq('id', partidaId);
      }
      window.ZR.navigate('screen-ending');
    }

    if (timerEl) {
      const m = Math.floor(left / 60);
      const s = left % 60;
      timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }
  }, 1000);

  // Sync Scores
  async function updateScores() {
    const { data: players } = await window.ZR.supabase.from('jugadores').select('grupo_id, puntaje').in('grupo_id', [myGroupId, rivalGroupId]);
    let myScore = 0;
    let rivScore = 0;
    (players || []).forEach(pl => {
      if (pl.grupo_id === myGroupId) myScore += pl.puntaje;
      if (pl.grupo_id === rivalGroupId) rivScore += pl.puntaje;
    });

    const myScoreEl = document.getElementById('hud-my-team-score');
    const rivScoreEl = document.getElementById('hud-rival-team-score');
    if (myScoreEl) myScoreEl.textContent = `${myScore} XP`;
    if (rivScoreEl) rivScoreEl.textContent = `${rivScore} XP`;

    window.ZR.state.multi.myScoreTotal = myScore;
    window.ZR.state.multi.rivalScoreTotal = rivScore;
  }

  mapJugadoresSub = window.ZR.supabase.channel('map-scores')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'jugadores', filter: `grupo_id=in.(${myGroupId},${rivalGroupId})` }, updateScores)
    .subscribe();
  
  updateScores();

  // Listen to match end
  mapPartidaSub = window.ZR.supabase.channel('map-partida')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'partidas', filter: `id=eq.${partidaId}` }, (payload) => {
      if (payload.new.estado === 'finalizada') {
        window.ZR.navigate('screen-ending');
      }
    }).subscribe();

  // If rival is a bot, simulate their points locally (only leader runs this)
  if (rivG && rivG.es_bot && window.ZR.state.multi.esLider) {
    botSimulationInterval = setInterval(async () => {
      if (Math.random() > 0.6) {
        const { data: bots } = await window.ZR.supabase.from('jugadores').select('*').eq('grupo_id', rivalGroupId);
        if (bots && bots.length > 0) {
          const randomBot = bots[Math.floor(Math.random() * bots.length)];
          await window.ZR.supabase.from('jugadores').update({ puntaje: randomBot.puntaje + 10 }).eq('id', randomBot.id);
        }
      }
    }, 4000);
  }
};

window.ZR.stopMultiplayerMapSync = cleanupMultiplayer;

// Used by game-story.js to submit a decision in multi mode
window.ZR.submitMultiplayerDecision = async function(score, situationId, letter, isCorrect) {
  if (!window.ZR.state.multi.playerId) return;

  const { data: player } = await window.ZR.supabase.from('jugadores').select('puntaje, situaciones_completadas').eq('id', window.ZR.state.multi.playerId).single();
  if (!player) return;

  const currentScore = player.puntaje;
  const situ = player.situaciones_completadas || [];
  situ.push({ situationId, letter, isCorrect });

  await window.ZR.supabase.from('jugadores')
    .update({ 
      puntaje: currentScore + score,
      situaciones_completadas: situ
    })
    .eq('id', window.ZR.state.multi.playerId);
};
