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
let createMembersSub = null;
let gameTimerInterval = null;
let botSimulationInterval = null;

function cleanupMultiplayer() {
  if (lobbySubscription) { window.ZR.supabase.removeChannel(lobbySubscription); lobbySubscription = null; }
  if (matchmakingGroupsSub) { window.ZR.supabase.removeChannel(matchmakingGroupsSub); matchmakingGroupsSub = null; }
  if (matchmakingPartidasSub) { window.ZR.supabase.removeChannel(matchmakingPartidasSub); matchmakingPartidasSub = null; }
  if (mapJugadoresSub) { window.ZR.supabase.removeChannel(mapJugadoresSub); mapJugadoresSub = null; }
  if (mapPartidaSub) { window.ZR.supabase.removeChannel(mapPartidaSub); mapPartidaSub = null; }
  if (createMembersSub) { window.ZR.supabase.removeChannel(createMembersSub); createMembersSub = null; }
  if (gameTimerInterval) { clearInterval(gameTimerInterval); gameTimerInterval = null; }
  if (botSimulationInterval) { clearInterval(botSimulationInterval); botSimulationInterval = null; }
  // Cleanup position broadcast
  if (window.ZR._posBroadcastInterval) { clearInterval(window.ZR._posBroadcastInterval); window.ZR._posBroadcastInterval = null; }
  if (window.ZR._posChannel) { window.ZR.supabase.removeChannel(window.ZR._posChannel); window.ZR._posChannel = null; }
  window.ZR.otherPlayers = {};
  window.ZR._activeEngine = null;
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
      .maybeSingle();

    if (error || !grupo) {
      console.error("Error al buscar grupo con código:", code, error);
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
      console.error("Error al insertar jugador en grupo:", errJug);
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
  cleanupMultiplayer();

  const codeEl = document.getElementById('generated-code-display');
  if (codeEl) codeEl.textContent = '——————';

  const nameInput = document.getElementById('squad-name-input');
  const genBtn = document.getElementById('generate-code-btn');
  const newGenBtn = genBtn?.cloneNode(true);
  genBtn?.parentNode?.replaceChild(newGenBtn, genBtn);

  const membersList = document.getElementById('create-members-list');
  if (membersList) membersList.innerHTML = '';
  const memberCount = document.getElementById('mc-member-count');
  if (memberCount) memberCount.textContent = '0 / 5';

  let generatedCode = null;

  async function updateMembersList(grupoId) {
    if (!grupoId) return;
    const { data: members, error } = await window.ZR.supabase
      .from('jugadores')
      .select('*')
      .eq('grupo_id', grupoId);

    if (error) {
      console.error("Error al obtener miembros del grupo:", error);
      return;
    }

    if (memberCount) memberCount.textContent = `${members ? members.length : 0} / 5`;
    if (membersList) {
      membersList.innerHTML = '';
      (members || []).forEach((m, idx) => {
        const item = document.createElement('div');
        item.style.cssText = 'background:#1E293B; border:1px solid #3B82F6; padding:10px; border-radius:6px; color:white; font-family:"Press Start 2P", monospace; font-size:10px; display:flex; align-items:center; gap:8px;';
        item.innerHTML = `<span>👤</span> <span>${m.nombre}</span> ${idx === 0 ? '<span style="color:#F59E0B; font-size:8px;">[LÍDER]</span>' : ''}`;
        membersList.appendChild(item);
      });
    }
  }

  async function createGroupInSupabase(isBot) {
    const name = nameInput?.value.trim() || 'Comunidad';
    if (!generatedCode) {
      generatedCode = window.ZR.generateCode();
      if (codeEl) codeEl.textContent = generatedCode;
    }

    // Insert group into Supabase immediately so code is searchable
    const { data: grupo, error } = await window.ZR.supabase
      .from('grupos')
      .insert({ codigo: generatedCode, nombre: name, es_bot: isBot, estado: 'esperando_miembros' })
      .select()
      .single();

    if (error || !grupo) {
      console.error("Error al crear grupo en Supabase:", error);
      window.ZR.showToast('❌ <b>Error creando grupo</b>');
      return null;
    }

    const playerName = window.ZR.state.playerName || 'Líder';
    const { data: jugador, error: errJug } = await window.ZR.supabase
      .from('jugadores')
      .insert({ grupo_id: grupo.id, nombre: playerName })
      .select()
      .single();

    if (errJug || !jugador) {
      console.error("Error al registrar líder en jugadores:", errJug);
      window.ZR.showToast('❌ <b>Error registrando líder</b>');
      return null;
    }

    window.ZR.state.multi.code = generatedCode;
    window.ZR.state.multi.squadName = name;
    window.ZR.state.multi.role = 'leader';
    window.ZR.state.multi.grupoId = grupo.id;
    window.ZR.state.multi.playerId = jugador.id;
    window.ZR.state.multi.esLider = true;
    window.ZR.state.multi.vsBots = isBot;

    // Realtime subscription for waiting room
    if (createMembersSub) window.ZR.supabase.removeChannel(createMembersSub);
    createMembersSub = window.ZR.supabase.channel(`create-grupo-${grupo.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jugadores', filter: `grupo_id=eq.${grupo.id}` }, () => {
        updateMembersList(grupo.id);
      })
      .subscribe();

    updateMembersList(grupo.id);
    return grupo;
  }

  newGenBtn?.addEventListener('click', async () => {
    const name = nameInput?.value.trim();
    if (!name) {
      window.ZR.showToast('✏️ <b>Escribe el nombre</b> de tu comunidad');
      return;
    }

    if (!window.ZR.state.multi.grupoId) {
      const grupo = await createGroupInSupabase(false);
      if (grupo) {
        window.ZR.showToast('✅ <b>Código generado</b> en el servidor. Tus amigos ya pueden unirse.');
      }
    } else {
      window.ZR.showToast('ℹ️ <b>Tu código ya está activo:</b> ' + window.ZR.state.multi.code);
    }
  });

  async function proceedToLobby(isBot) {
    const name = nameInput?.value.trim() || 'Comunidad';

    if (!window.ZR.state.multi.grupoId) {
      const grupo = await createGroupInSupabase(isBot);
      if (!grupo) return;
    } else {
      // Update group properties if changed
      await window.ZR.supabase
        .from('grupos')
        .update({ nombre: name, es_bot: isBot })
        .eq('id', window.ZR.state.multi.grupoId);

      window.ZR.state.multi.squadName = name;
      window.ZR.state.multi.vsBots = isBot;
    }

    window.ZR.navigate('screen-multi-lobby');
  }

  const readyBtn = document.getElementById('create-ready-btn');
  const newReady = readyBtn?.cloneNode(true);
  readyBtn?.parentNode?.replaceChild(newReady, readyBtn);
  newReady?.addEventListener('click', () => proceedToLobby(false));

  const botsBtn = document.getElementById('create-bots-btn');
  if (botsBtn) {
    const newBotsBtn = botsBtn.cloneNode(true);
    botsBtn.parentNode.replaceChild(newBotsBtn, botsBtn);
    newBotsBtn.addEventListener('click', () => proceedToLobby(true));
  }

  const backBtn = document.getElementById('create-back-btn');
  const newBack = backBtn?.cloneNode(true);
  backBtn?.parentNode?.replaceChild(newBack, backBtn);
  newBack?.addEventListener('click', () => {
    cleanupMultiplayer();
    window.ZR.state.multi.grupoId = null;
    window.ZR.navigate('screen-multi-join');
  });
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

  // Render player avatar preview
  if (window.ZR.renderAvatarInContainer) {
    window.ZR.renderAvatarInContainer('lobby-avatar-display', window.ZR.state.avatar);
  }

  // Bind avatar change button
  const avatarBtn = document.getElementById('lobby-avatar-btn');
  if (avatarBtn) {
    const newAvatarBtn = avatarBtn.cloneNode(true);
    avatarBtn.parentNode.replaceChild(newAvatarBtn, avatarBtn);
    newAvatarBtn.addEventListener('click', () => {
      window.ZR.state.avatarReturnScreen = 'screen-multi-lobby';
      window.ZR.navigate('screen-avatar');
    });
  }

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

  // Botón de regresar
  const backBtn = document.getElementById('matchmaking-back-btn');
  if (backBtn) {
    const newBack = backBtn.cloneNode(true);
    backBtn.parentNode.replaceChild(newBack, backBtn);
    newBack.addEventListener('click', () => window.ZR.navigate('screen-multi-lobby'));
  }

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
      listEl.innerHTML = `
        <div style="background:#1E293B; border:2px dashed #475569; padding:24px; text-align:center; border-radius:8px;">
          <div style="font-size:2rem; margin-bottom:10px;">📡</div>
          <div style="color:#F8FAFC; font-family:'Press Start 2P', monospace; font-size:11px; margin-bottom:6px;">No hay otros barrios buscando retador</div>
          <div style="color:#94A3B8; font-size:11px;">Esperando que otra comunidad se conecte...</div>
        </div>
      `;
      return;
    }

    data.forEach(g => {
      const card = document.createElement('div');
      card.style.cssText = 'background: #1E1B4B; border: 3px solid #6366F1; box-shadow: 4px 4px 0 rgba(0,0,0,0.4); padding: 16px 20px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 8px;';
      
      const infoDiv = document.createElement('div');
      infoDiv.style.cssText = 'display: flex; align-items: center; gap: 12px;';
      infoDiv.innerHTML = `
        <span style="font-size: 24px;">🏰</span>
        <div>
          <div style="color: #F8FAFC; font-family: 'Press Start 2P', monospace; font-size: 13px; font-weight: bold;">${g.nombre}</div>
          <div style="color: #A5B4FC; font-size: 10px; margin-top: 4px; display: flex; align-items: center; gap: 6px;">
            <span style="width: 8px; height: 8px; background: #22C55E; border-radius: 50%; display: inline-block;"></span>
            <span>EN BUSCA DE RIVAL</span>
          </div>
        </div>
      `;
      card.appendChild(infoDiv);

      if (window.ZR.state.multi.esLider) {
        const btn = document.createElement('button');
        btn.className = 'mj-btn mj-btn-yellow';
        btn.style.cssText = 'padding: 10px 18px; font-size: 10px; min-width: 130px; margin: 0; box-shadow: 2px 2px 0 #000;';
        btn.textContent = '⚔️ RETAR';
        btn.onclick = async () => {
          await window.ZR.supabase.from('partidas').insert({
            grupo_a_id: grupoId,
            grupo_b_id: g.id,
            estado: 'retando'
          });
          btn.textContent = '⏳ ENVIADO';
          btn.disabled = true;
          btn.style.opacity = '0.7';
          window.ZR.showToast('⏳ Reto enviado a ' + g.nombre + '. Esperando respuesta...');
        };
        card.appendChild(btn);
      } else {
        const span = document.createElement('div');
        span.style.cssText = 'color: #94A3B8; font-family: "Press Start 2P", monospace; font-size: 9px; background: #0F172A; padding: 8px 12px; border-radius: 4px; border: 1px solid #334155;';
        span.textContent = '👁️ Esperando al líder...';
        card.appendChild(span);
      }
      listEl.appendChild(card);
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
  const totalDuration = p.duracion_segundos || 300;

  if (gameTimerInterval) clearInterval(gameTimerInterval);

  function tickTimer() {
    const now = Date.now();
    let left = totalDuration - Math.floor((now - startTime) / 1000);
    
    if (left <= 0) {
      left = 0;
      if (gameTimerInterval) {
        clearInterval(gameTimerInterval);
        gameTimerInterval = null;
      }
      // Cualquier jugador puede marcar como finalizada (Supabase ignora si ya está en ese estado)
      if (partidaId) {
        window.ZR.supabase.from('partidas').update({ estado: 'finalizada' }).eq('id', partidaId);
      }
      window.ZR.navigate('screen-multi-ending');
      return;
    }

    if (timerEl) {
      const m = Math.floor(left / 60);
      const s = left % 60;
      timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }
  }

  tickTimer();
  gameTimerInterval = setInterval(tickTimer, 1000);

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
        window.ZR.navigate('screen-multi-ending');
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
  // === SINCRONIZACIÓN DE POSICIONES EN TIEMPO REAL ===
  window.ZR.otherPlayers = {};
  const myJugadorId = window.ZR.state.multi.jugadorId || window.ZR.state.multi.playerId;
  const myNombre = window.ZR.state.playerName || 'Jugador';
  const myGrupoId = myGroupId;

  // Canal de broadcast para posiciones
  const posChannel = window.ZR.supabase.channel(`pos-${partidaId}`, {
    config: { broadcast: { self: false } }
  });

  posChannel
    .on('broadcast', { event: 'pos' }, ({ payload }) => {
      if (!payload || payload.id === myJugadorId) return;
      window.ZR.otherPlayers[payload.id] = payload;
    })
    .subscribe();

  // Guardar referencia para limpiar
  window.ZR._posChannel = posChannel;

  // Publicar posición del jugador actual cada 150ms
  window.ZR._posBroadcastInterval = setInterval(() => {
    const engine = window.ZR._activeEngine;
    // No transmitir si el motor no está corriendo (jugador en situación)
    if (!engine || !engine.player || !engine.isRunning) return;
    posChannel.send({
      type: 'broadcast',
      event: 'pos',
      payload: {
        id: myJugadorId,
        nombre: myNombre,
        grupoId: myGrupoId,
        wx: engine.player.wx,
        wy: engine.player.wy,
        ts: Date.now(),
      }
    });
  }, 200);
};

window.ZR.stopMultiplayerMapSync = cleanupMultiplayer;

// Used by game-story.js to submit a decision in multi mode
window.ZR.submitMultiplayerDecision = async function(score, situationId, letter, isCorrect) {
  if (!window.ZR.state.multi.playerId) return;

  const { data: player } = await window.ZR.supabase.from('jugadores').select('puntaje, situaciones_completadas').eq('id', window.ZR.state.multi.playerId).maybeSingle();
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

  // Verificar si TODOS los jugadores de ambos equipos han completado TODAS las situaciones
  const totalSituations = (window.ZR.situations || []).length;
  const partidaId = window.ZR.state.multi.partidaId;
  const myGroupId = window.ZR.state.multi.grupoId;
  const rivalGroupId = window.ZR.state.multi.rivalGroupId;

  if (partidaId && totalSituations > 0) {
    const groupIds = [myGroupId];
    if (rivalGroupId) groupIds.push(rivalGroupId);

    const { data: allPlayers } = await window.ZR.supabase
      .from('jugadores')
      .select('situaciones_completadas')
      .in('grupo_id', groupIds);

    // Solo marcar finalizada si TODOS completaron TODAS las situaciones
    if (allPlayers && allPlayers.length > 0) {
      const allDone = allPlayers.every(pl =>
        Array.isArray(pl.situaciones_completadas) &&
        pl.situaciones_completadas.length >= totalSituations
      );
      if (allDone) {
        await window.ZR.supabase.from('partidas')
          .update({ estado: 'finalizada' })
          .eq('id', partidaId);
      }
    }
  }
};

// ==========================================
// SCREEN: MULTIPLAYER ENDING / LEADERBOARD
// ==========================================
window.ZR.registerScreen('screen-multi-ending', async function () {
  cleanupMultiplayer();

  const myGroupId = window.ZR.state.multi.grupoId;
  const rivalGroupId = window.ZR.state.multi.rivalGroupId;
  const partidaId = window.ZR.state.multi.partidaId;

  if (!myGroupId) {
    window.ZR.navigate('screen-menu-aventura');
    return;
  }

  async function loadAndRenderMultiEnding() {
    // 1. Fetch group names
    const { data: myG } = await window.ZR.supabase.from('grupos').select('nombre').eq('id', myGroupId).maybeSingle();
    const { data: rivG } = rivalGroupId ? await window.ZR.supabase.from('grupos').select('nombre').eq('id', rivalGroupId).maybeSingle() : { data: null };

    const myName = myG?.nombre || window.ZR.state.multi.squadName || 'Mi Comunidad';
    const rivalName = rivG?.nombre || 'Rival';

    // 2. Fetch match status
    const { data: partida } = partidaId ? await window.ZR.supabase.from('partidas').select('*').eq('id', partidaId).maybeSingle() : { data: null };
    const isFinished = partida ? partida.estado === 'finalizada' : false;

    // 3. Fetch all players from both groups
    const groupIds = [myGroupId];
    if (rivalGroupId) groupIds.push(rivalGroupId);

    const { data: players, error } = await window.ZR.supabase
      .from('jugadores')
      .select('*')
      .in('grupo_id', groupIds);

    if (error) {
      console.error("Error al cargar jugadores finales:", error);
    }

    const allPlayers = players || [];
    let myScore = 0;
    let rivalScore = 0;

    allPlayers.forEach(p => {
      if (p.grupo_id === myGroupId) myScore += p.puntaje;
      if (p.grupo_id === rivalGroupId) rivalScore += p.puntaje;
    });

    // 4. Update UI
    const myNameEl = document.getElementById('me-my-name');
    const myScoreEl = document.getElementById('me-my-score');
    const rivNameEl = document.getElementById('me-rival-name');
    const rivScoreEl = document.getElementById('me-rival-score');
    const badgeEl = document.getElementById('me-status-badge');

    if (myNameEl) myNameEl.textContent = myName;
    if (myScoreEl) myScoreEl.textContent = `${myScore} XP`;
    if (rivNameEl) rivNameEl.textContent = rivalName;
    if (rivScoreEl) rivScoreEl.textContent = `${rivalScore} XP`;

    if (badgeEl) {
      if (!isFinished) {
        badgeEl.textContent = `⚡ EN VIVO: PARTIDA EN CURSO`;
        badgeEl.className = 'me-status-badge me-badge-draw';
      } else {
        if (myScore > rivalScore) {
          badgeEl.textContent = `🏆 ¡VICTORIA DE ${myName.toUpperCase()}!`;
          badgeEl.className = 'me-status-badge me-badge-win';
        } else if (myScore < rivalScore) {
          badgeEl.textContent = `💔 DERROTA - GANA ${rivalName.toUpperCase()}`;
          badgeEl.className = 'me-status-badge me-badge-lose';
        } else {
          badgeEl.textContent = '🤝 ¡EMPATE ESPECTACULAR!';
          badgeEl.className = 'me-status-badge me-badge-draw';
        }
      }
    }

    // Sort players descending by puntaje
    allPlayers.sort((a, b) => b.puntaje - a.puntaje);

    const lbList = document.getElementById('me-lb-list');
    if (lbList) {
      lbList.innerHTML = '';
      allPlayers.forEach((p, idx) => {
        const isMe = p.id === window.ZR.state.multi.playerId;
        const isMyGroup = p.grupo_id === myGroupId;
        const squadTag = isMyGroup ? myName : rivalName;
        const isMvp = idx === 0;

        const row = document.createElement('div');
        row.className = `me-lb-row ${isMvp ? 'me-row-mvp' : ''} ${isMe ? 'me-row-you' : ''}`;
        row.innerHTML = `
          <div style="font-weight:900;">${isMvp ? '👑' : '#' + (idx + 1)}</div>
          <div style="font-weight:bold; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            ${p.nombre} ${isMe ? '<span style="color:#60A5FA;">⭐ (TÚ)</span>' : ''}
          </div>
          <div style="color:${isMyGroup ? '#FCD34D' : '#FCA5A5'}; font-size:9px;">${squadTag}</div>
          <div style="text-align:right; font-weight:900; color:#F59E0B;">${p.puntaje} XP</div>
        `;
        lbList.appendChild(row);
      });
    }
  }

  await loadAndRenderMultiEnding();

  // Realtime Subscriptions for live updates while sitting on screen-multi-ending
  const filterGroups = rivalGroupId ? `grupo_id=in.(${myGroupId},${rivalGroupId})` : `grupo_id=eq.${myGroupId}`;
  const endingScoresSub = window.ZR.supabase.channel('ending-scores-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'jugadores', filter: filterGroups }, () => {
      loadAndRenderMultiEnding();
    })
    .subscribe();

  let endingPartidaSub = null;
  if (partidaId) {
    endingPartidaSub = window.ZR.supabase.channel('ending-partida-live')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'partidas', filter: `id=eq.${partidaId}` }, () => {
        loadAndRenderMultiEnding();
      })
      .subscribe();
  }

  const oldCleanup = cleanupMultiplayer;
  cleanupMultiplayer = function() {
    oldCleanup();
    if (endingScoresSub) window.ZR.supabase.removeChannel(endingScoresSub);
    if (endingPartidaSub) window.ZR.supabase.removeChannel(endingPartidaSub);
  };

  // Action Buttons
  const retryBtn = document.getElementById('me-retry-btn');
  const newRetry = retryBtn?.cloneNode(true);
  retryBtn?.parentNode?.replaceChild(newRetry, retryBtn);
  newRetry?.addEventListener('click', () => {
    cleanupMultiplayer();
    window.ZR.state.multi.grupoId = null;
    window.ZR.navigate('screen-multi-join');
  });

  const homeBtn = document.getElementById('me-home-btn');
  const newHome = homeBtn?.cloneNode(true);
  homeBtn?.parentNode?.replaceChild(newHome, homeBtn);
  newHome?.addEventListener('click', () => {
    cleanupMultiplayer();
    window.ZR.state.multi.grupoId = null;
    window.ZR.navigate('screen-menu-aventura');
  });
});
