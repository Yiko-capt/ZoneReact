/**
 * ZoneReact - game-story.js
 * Modo Historia: Cinemática de Leo en 16-bit, flujo completo de 5 situaciones
 */
window.ZR = window.ZR || {};

/* =========================================
   REGISTRO DE PANTALLAS
   ========================================= */

// --- Menú Aventura ---
window.ZR.registerScreen('screen-menu-aventura', function () {
  const name = window.ZR.state.playerName;
  const greet = document.getElementById('aventura-player-greeting');
  if (greet) greet.textContent = name ? `¡Hola, ${name}!` : 'Elige tu modo';

  window.ZR.renderAvatarInContainer('aventura-avatar-display', window.ZR.state.avatar);
  if (window.ZR.drawAventuraPreview) {
    setTimeout(window.ZR.drawAventuraPreview, 10);
  }

  document.getElementById('btn-modo-historia')?.addEventListener('click', () => {
    window.ZR.navigate('screen-cinematic');
  });

  document.getElementById('btn-multijugador')?.addEventListener('click', () => {
    window.ZR.navigate('screen-multi-join');
  });

  document.getElementById('btn-avatar-menu')?.addEventListener('click', () => {
    window.ZR.navigate('screen-avatar');
  });

  document.getElementById('aventura-avatar-click')?.addEventListener('click', () => {
    window.ZR.navigate('screen-avatar');
  });
});

// --- Cinemática Historia ---
window.ZR.registerScreen('screen-cinematic', function () {
  window.ZR.state.mode = 'story';
  window.ZR.state.story = { situationIndex: 0, score: 0, decisions: [], completed: false };
  document.dispatchEvent(new Event('zr:score-updated'));

  window.ZR.renderAvatarInContainer('cinematic-player-sprite', window.ZR.state.avatar);

  const leoContainer = document.getElementById('cinematic-leo-sprite');
  if (leoContainer) {
    leoContainer.innerHTML = `
      <img src="images/leo_16bit.jpg" alt="Leo 16-bit" />
    `;
  }

  const playerName = window.ZR.state.playerName || 'Tú';

  const nameEl = document.getElementById('cinematic-player-name');
  if (nameEl) nameEl.textContent = playerName;

  let slide = 0;
  const slides = [
    {
      title: '¡Tu mejor amigo Leo necesita tu ayuda!',
      body: ` Leo está en peligro. Su barrio está lleno de situaciones que lo pueden llevar por el mal camino.`
    },
    {
      title: 'Objetivo: Guiar a Leo',
      body: 'Debes ayudarlo a tomar las mejores decisiones en 5 momentos críticos para evitar que caiga en la adicción o el microtráfico.'
    },
    {
  title: 'Sistema de puntos',
  body: `
     cada decisión correcta te dará puntos de experiencia (XP). Cuanto más alto sea tu puntaje, mejor será tu rango al final del juego. ¡Aprende y protege a Leo!
    `
    }
  ];

  function showSlide(i) {
    const titleEl = document.getElementById('cinematic-title');
    const bodyEl  = document.getElementById('cinematic-body');
    const nextBtn = document.getElementById('cinematic-next-btn');
    const progEl  = document.getElementById('cinematic-progress');

    if (titleEl) titleEl.textContent = slides[i].title;
    if (bodyEl)  bodyEl.textContent  = slides[i].body;
    if (progEl)  progEl.textContent  = `${i + 1} / ${slides.length}`;

    if (nextBtn) {
      nextBtn.textContent = i < slides.length - 1 ? 'Siguiente →' : '¡Empezar! →';
    }
  }

  showSlide(0);

  const nextBtn = document.getElementById('cinematic-next-btn');
  const newBtn = nextBtn?.cloneNode(true);
  nextBtn?.parentNode?.replaceChild(newBtn, nextBtn);

  newBtn?.addEventListener('click', () => {
    slide++;
    if (slide < slides.length) {
      showSlide(slide);
    } else {
      window.ZR.navigate('screen-map', { mode: 'story' });
    }
  });

  document.getElementById('cinematic-skip-btn')?.addEventListener('click', () => {
    window.ZR.navigate('screen-map', { mode: 'story' });
  });
});

// --- Mapa ---
window.ZR.registerScreen('screen-map', function (data) {
  const mode = data.mode || window.ZR.state.mode || 'story';
  window.ZR.state.mode = mode;

  const nameEl = document.getElementById('map-player-name');
  if (nameEl) nameEl.textContent = window.ZR.state.playerName || 'Jugador';

  const scoreEl = document.getElementById('map-player-score');
  if (scoreEl) scoreEl.textContent = `${window.ZR.state.story.score} XP`;

  const timerCard = document.getElementById('map-timer-card');
  const lbCard    = document.getElementById('map-leaderboard-card');
  if (timerCard) timerCard.style.display = mode === 'multi' ? '' : 'none';
  if (lbCard)    lbCard.style.display    = mode === 'multi' ? '' : 'none';

  const modeLabel = document.getElementById('map-mode-label');
  if (modeLabel) modeLabel.textContent = mode === 'story' ? '📖 Modo Historia' : '👥 Multijugador';

  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;

  if (window.ZR.gameEngine) {
    window.ZR.gameEngine.stop();
    window.ZR.gameEngine = null;
  }

  const timerConfig = mode === 'multi' ? { total: 7 * 60, elapsed: 0 } : null;

  window.ZR.gameEngine = new window.ZR.GameEngine(canvas, {
    mode: mode,
    situations: window.ZR.situations,
    timer: timerConfig,
    onSituationTrigger: handleSituationTrigger,
    onTimerEnd: handleTimerEnd
  });

  window.ZR.state.story.decisions.forEach(d => {
    window.ZR.gameEngine.markSituationComplete(d.situationId);
  });

  window.ZR.gameEngine.start();
});

function handleSituationTrigger(situation) {
  window.ZR.gameEngine.stop();
  window.ZR.state.story.situationIndex = situation.id - 1;
  window.ZR.navigate('screen-situation', { situation });
}

function handleTimerEnd() {
  window.ZR.showToast('⏰ ¡El tiempo ha terminado!');
  setTimeout(() => window.ZR.navigate('screen-ending'), 1500);
}

// --- Situación ---
window.ZR.registerScreen('screen-situation', function ({ situation }) {
  if (!situation) {
    const idx = window.ZR.state.story.situationIndex;
    situation = window.ZR.situations[idx];
  }
  if (!situation) { window.ZR.navigate('screen-map', { mode: window.ZR.state.mode }); return; }

  const tagEl = document.getElementById('situation-tag');
  if (tagEl) {
    tagEl.textContent = situation.tag;
    tagEl.className = `tag tag-${situation.tagColor || 'red'} situation-tag`;
  }

  const titleEl = document.getElementById('situation-title');
  if (titleEl) titleEl.textContent = situation.title;

  const ctxEl = document.getElementById('situation-context');
  if (ctxEl) ctxEl.textContent = situation.context;

  const tipEl = document.getElementById('situation-tip');
  if (tipEl) tipEl.textContent = situation.tip;

  const emojiEl = document.getElementById('situation-emoji');
  if (emojiEl) emojiEl.textContent = situation.emoji || '⚠️';

  const sceneEl = document.getElementById('situation-scene-title');
  if (sceneEl) sceneEl.textContent = situation.title;

  const decideBtn = document.getElementById('situation-decide-btn');
  const backBtn   = document.getElementById('situation-back-btn');

  const newDecideBtn = decideBtn?.cloneNode(true);
  decideBtn?.parentNode?.replaceChild(newDecideBtn, decideBtn);
  newDecideBtn?.addEventListener('click', () => {
    window.ZR.navigate('screen-decision', { situation });
  });

  const newBackBtn = backBtn?.cloneNode(true);
  backBtn?.parentNode?.replaceChild(newBackBtn, backBtn);
  newBackBtn?.addEventListener('click', () => {
    window.ZR.navigate('screen-map', { mode: window.ZR.state.mode });
  });
});

// --- Decisión ---
window.ZR.registerScreen('screen-decision', function ({ situation }) {
  if (!situation) {
    const idx = window.ZR.state.story.situationIndex;
    situation = window.ZR.situations[idx];
  }
  if (!situation) return;

  const tagEl = document.getElementById('decision-tag');
  if (tagEl) {
    tagEl.textContent = 'MOMENTO CLAVE';
    tagEl.className = 'tag tag-red';
  }

  const ctxEl = document.getElementById('decision-context');
  if (ctxEl) ctxEl.textContent = situation.context;

  const tipEl = document.getElementById('decision-tip-text');
  if (tipEl) tipEl.textContent = situation.tip;

  const container = document.getElementById('decision-options');
  if (!container) return;
  container.innerHTML = '';

  let selectedOption = null;

  situation.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'decision-option';
    btn.dataset.letter = opt.letter;
    btn.innerHTML = `
      <div class="decision-option-letter">${opt.letter}</div>
      <div class="decision-option-text">${opt.text}</div>
      <div class="decision-option-arrow">→</div>
    `;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.decision-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedOption = opt;
    });
    container.appendChild(btn);
  });

  const confirmBtn = document.getElementById('decision-confirm-btn');
  const newConfirmBtn = confirmBtn?.cloneNode(true);
  confirmBtn?.parentNode?.replaceChild(newConfirmBtn, confirmBtn);

  newConfirmBtn?.addEventListener('click', () => {
    if (!selectedOption) {
      window.ZR.showToast('🤔 <b>Selecciona una opción</b> antes de confirmar');
      return;
    }

    window.ZR.state.story.score += selectedOption.score;
    window.ZR.state.story.decisions.push({
      situationId: situation.id,
      letter: selectedOption.letter,
      score: selectedOption.score,
      isCorrect: selectedOption.isCorrect
    });

    if (window.ZR.gameEngine) {
      window.ZR.gameEngine.markSituationComplete(situation.id);
    }

    window.ZR.navigate('screen-result', { situation, option: selectedOption });
  });

  const backBtn = document.getElementById('decision-back-btn');
  const newBackBtn = backBtn?.cloneNode(true);
  backBtn?.parentNode?.replaceChild(newBackBtn, backBtn);
  newBackBtn?.addEventListener('click', () => {
    window.ZR.navigate('screen-situation', { situation });
  });
});

// --- Resultado ---
window.ZR.registerScreen('screen-result', function ({ situation, option }) {
  if (!situation || !option) return;

  const isGood = option.isCorrect;

  const iconEl = document.getElementById('result-icon');
  if (iconEl) {
    iconEl.textContent = isGood ? '✓' : '!';
    iconEl.className = 'result-icon' + (isGood ? '' : ' bad');
  }

  const labelEl = document.getElementById('result-label');
  if (labelEl) {
    labelEl.textContent = isGood ? 'DECISIÓN SEGURA' : 'NUEVA OPORTUNIDAD';
    labelEl.className = `tag ${isGood ? 'tag-green' : 'tag-red'}`;
  }

  const titleEl = document.getElementById('result-title');
  if (titleEl) titleEl.textContent = isGood ? '¡Buena decisión!' : 'Esta decisión te puso en riesgo';

  const fbEl = document.getElementById('result-feedback');
  if (fbEl) {
    fbEl.textContent = option.feedback;
    fbEl.className = 'result-feedback' + (isGood ? '' : ' bad');
  }

  const xpNumEl = document.getElementById('result-xp-num');
  const xpTotalEl = document.getElementById('result-xp-total');
  if (xpNumEl) {
    xpNumEl.textContent = option.score > 0 ? `+${option.score}` : `–10`;
    xpNumEl.className = 'xp-badge-num' + (option.score > 0 ? '' : ' negative');
  }
  if (xpTotalEl) xpTotalEl.textContent = `Total: ${window.ZR.state.story.score} XP`;

  const posterEl = document.getElementById('result-poster');
  if (posterEl) posterEl.className = `result-poster${isGood ? '' : ' bad'}`;

  const wordEl = document.getElementById('result-word');
  if (wordEl) wordEl.textContent = option.resultWord || (isGood ? '¡BIEN!' : 'PIENSA');

  const quoteEl = document.getElementById('result-quote');
  if (quoteEl) quoteEl.textContent = option.quote || '';

  const barEl = document.getElementById('result-score-bar-fill');
  const pctLabel = document.getElementById('result-score-pct');
  const totalScore = window.ZR.state.story.score;
  const maxScore = window.ZR.situations.length * 20;

  if (barEl) {
    const pct = Math.max(0, Math.min(100, (totalScore / maxScore) * 100));
    barEl.style.width = pct + '%';
    barEl.className = 'progress-bar-fill' + (isGood ? ' green' : ' red');
  }
  if (pctLabel) pctLabel.textContent = `${totalScore} / ${maxScore} XP`;
  document.dispatchEvent(new Event('zr:score-updated'));

  const allDecisions = window.ZR.state.story.decisions.length;
  const totalSituations = window.ZR.situations.length;
  const isDone = allDecisions >= totalSituations;

  const mapBtn = document.getElementById('result-map-btn');
  const newMapBtn = mapBtn?.cloneNode(true);
  mapBtn?.parentNode?.replaceChild(newMapBtn, mapBtn);

  if (newMapBtn) {
    newMapBtn.textContent = isDone ? 'Ver resultado final →' : 'Volver al mapa →';
    newMapBtn.addEventListener('click', () => {
      if (isDone) {
        window.ZR.navigate('screen-ending');
      } else {
        window.ZR.navigate('screen-map', { mode: window.ZR.state.mode });
      }
    });
  }
});

// --- Ending ---
window.ZR.registerScreen('screen-ending', function () {
  const score = window.ZR.state.story.score;
  const totalSituations = window.ZR.situations.length;
  const maxScore = totalSituations * 20;

  let rank, rankClass, rankDesc;

  if (score >= 80) {
    rank = '🏆 ¡GUARDIÁN COMUNITARIO!';
    rankClass = 'green';
    rankDesc = `¡Increíble! Guiaste a Leo a través de todos los peligros con sabiduría y valentía. Leo está a salvo gracias a ti. Eres un guardián de tu comunidad.`;
  } else if (score >= 40) {
    rank = '🔍 DETECTIVE URBANO';
    rankClass = 'yellow';
    rankDesc = `Buen trabajo. Acertaste en varias decisiones, pero Leo aún es vulnerable en algunas situaciones. Sigue aprendiendo para protegerlo mejor.`;
  } else {
    rank = '📚 APRENDIZ PREVENTIVO';
    rankClass = 'red';
    rankDesc = `Leo estuvo en riesgo varias veces. Pero equivocarte aquí es parte del aprendizaje. Usa lo que aprendiste para proteger a tus amigos en la vida real.`;
  }

  const rankEl = document.getElementById('ending-rank');
  if (rankEl) {
    rankEl.textContent = rank;
    rankEl.className = `ending-rank-badge ${rankClass}`;
  }

  const scoreEl = document.getElementById('ending-score');
  if (scoreEl) scoreEl.textContent = `${score} / ${maxScore} XP`;

  const descEl = document.getElementById('ending-desc');
  if (descEl) descEl.textContent = rankDesc;

  const reviewEl = document.getElementById('ending-decisions');
  if (reviewEl) {
    reviewEl.innerHTML = '';
    window.ZR.state.story.decisions.forEach((d, i) => {
      const sit = window.ZR.situations[i];
      const div = document.createElement('div');
      div.style.cssText = `display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid #E0DAD0;font-size:13px;`;
      div.innerHTML = `
        <span style="font-size:18px">${d.isCorrect ? '✅' : '❌'}</span>
        <span style="flex:1;font-weight:700">${sit ? sit.title : `Situación ${i+1}`}</span>
        <span style="font-family:'Press Start 2P',monospace;font-size:11px;color:${d.score > 0 ? '#5A8A4A' : '#E8543E'}">${d.score > 0 ? `+${d.score}` : '0'} XP</span>
      `;
      reviewEl.appendChild(div);
    });
  }

  const retryBtn = document.getElementById('ending-retry-btn');
  const newRetryBtn = retryBtn?.cloneNode(true);
  retryBtn?.parentNode?.replaceChild(newRetryBtn, retryBtn);
  newRetryBtn?.addEventListener('click', () => {
    window.ZR.state.story = { situationIndex: 0, score: 0, decisions: [], completed: false };
    window.ZR.navigate('screen-cinematic');
  });

  const homeBtn = document.getElementById('ending-home-btn');
  const newHomeBtn = homeBtn?.cloneNode(true);
  homeBtn?.parentNode?.replaceChild(newHomeBtn, homeBtn);
  newHomeBtn?.addEventListener('click', () => {
    window.ZR.navigate('screen-home');
  });
});
