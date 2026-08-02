/**
 * ZoneReact - body-module.js
 * Módulo "Tu Cuerpo" - Laboratorio del Avatar & Explorador de Órganos (Adaptado a Mockups)
 */
window.ZR = window.ZR || {};

let selectedSubstance = null;
let selectedOrganKey = 'brain';

/**
 * Función global para seleccionar una sustancia desde cualquier card.
 * Llamada directamente por onclick en el HTML.
 */
window.ZR.selectSubstance = function (substanceId) {
  const list = window.ZR.substances || [];
  const found = list.find(s => s.id === substanceId);
  selectedSubstance = found || list[0] || null;
  selectedOrganKey = 'brain';
  window.ZR.navigate('screen-body-organs');
};

window.ZR.registerScreen('screen-body-select', function () {
  initBodySelectScreen();
});

window.ZR.registerScreen('screen-body-organs', function () {
  initBodyOrgansScreen();
});

function initBodySelectScreen() {
  try {
    // Update avatar with user's personalized choices
    if (window.ZR.renderAvatarInContainer && window.ZR.state && window.ZR.state.avatar) {
      window.ZR.renderAvatarInContainer('body-healthy-avatar', window.ZR.state.avatar);
    }

    const container = document.getElementById('substance-cards');
    if (!container) return;

    const list = window.ZR.substances || [];
    const ALLOWED = ['alcohol', 'marihuana', 'cocaina', 'nicotina'];

    // Filter to only the 4 main substances
    const filtered = list.filter(s => ALLOWED.includes(s.id));

    if (filtered.length > 0) {
      // Re-render from data (clears static HTML)
      container.innerHTML = '';
      const iconMap = { alcohol:'🍶', marihuana:'🌿', cocaina:'🔷', nicotina:'🚬' };
      const bgMap  = { alcohol:'#C85238', marihuana:'#587E48', cocaina:'#4A6FA5', nicotina:'#D4870A' };
      const tagBg  = { alcohol:'#FEE2D5', marihuana:'#D8EDCE', cocaina:'#D4E0F5', nicotina:'#FFF0C8' };
      const tagClr = { alcohol:'#C85238', marihuana:'#587E48', cocaina:'#4A6FA5', nicotina:'#A06500' };
      const tagLbl = { alcohol:'droga legal', marihuana:'droga ilegal', cocaina:'droga ilegal', nicotina:'droga legal' };

      filtered.forEach(substance => {
        const card = document.createElement('div');
        card.className = 'substance-card-item';
        card.dataset.substanceId = substance.id;
        card.innerHTML = `
          <div class="card-icon-box" style="background:${bgMap[substance.id] || '#888'}">${iconMap[substance.id] || substance.icon}</div>
          <div class="card-info">
            <div class="card-title">${substance.name}</div>
            <div class="card-type-tag" style="background:${tagBg[substance.id]};color:${tagClr[substance.id]}">${tagLbl[substance.id]}</div>
            <div class="card-sub">Explora sus efectos en tu cuerpo</div>
          </div>
          <div class="card-arrow">→</div>
        `;
        card.addEventListener('click', () => {
          selectedSubstance = substance;
          selectedOrganKey = 'brain';
          window.ZR.navigate('screen-body-organs');
        });
        container.appendChild(card);
      });
    } else {
      // Bind to existing static HTML cards using data-substance-id attribute
      container.querySelectorAll('.substance-card-item').forEach(card => {
        const sid = card.dataset.substanceId;
        card.onclick = () => {
          selectedSubstance = (list.find(s => s.id === sid)) || list[0] || null;
          selectedOrganKey = 'brain';
          window.ZR.navigate('screen-body-organs');
        };
      });
    }
  } catch (err) {
    console.error('[ZR] initBodySelectScreen error:', err);
  }
}


function initBodyOrgansScreen() {
  if (!selectedSubstance) {
    selectedSubstance = window.ZR.substances[0];
  }

  // Back button
  const backBtn = document.getElementById('body-organs-back');
  if (backBtn) {
    backBtn.onclick = () => window.ZR.navigate('screen-body-select');
  }

  // Dynamic Substance Color Themes
  const themeMap = {
    alcohol: { main: '#C85238', canvas: '#E57360' },
    marihuana: { main: '#587E48', canvas: '#68A058' },
    cocaina: { main: '#4A6FA5', canvas: '#5A82B8' },
    nicotina: { main: '#D4870A', canvas: '#E5A730' }
  };
  const currentTheme = themeMap[selectedSubstance.id] || { main: '#C85238', canvas: '#E59560' };

  // Substance badges
  const badgeEl = document.getElementById('organ-substance-badge');
  if (badgeEl) {
    badgeEl.textContent = `EFECTOS DE ${selectedSubstance.name.toUpperCase()}`;
    badgeEl.style.backgroundColor = currentTheme.main;
  }

  const panelSubBadge = document.getElementById('panel-substance-badge');
  if (panelSubBadge) {
    panelSubBadge.textContent = `■ ${selectedSubstance.name}`;
    panelSubBadge.style.backgroundColor = currentTheme.main;
  }

  const panelStateBadge = document.getElementById('panel-state-badge');
  if (panelStateBadge) {
    const effectStr = selectedSubstance.statusEffect ? selectedSubstance.statusEffect.replace(/^[^\w]+/, '').trim() : 'Alterado';
    panelStateBadge.textContent = `ESTADO: ${effectStr}`;
  }

  // Info Card Shadow Theme
  const infoCard = document.getElementById('organ-info-card');
  if (infoCard) {
    infoCard.style.boxShadow = `6px 6px 0 ${currentTheme.main}`;
  }

  // Avatar Canvas Panel Theme
  const avatarPanel = document.querySelector('.avatar-organ-panel');
  if (avatarPanel) {
    avatarPanel.style.backgroundColor = currentTheme.canvas;
  }

  // Render affected avatar
  window.ZR.renderAvatarInContainer('body-organs-avatar', window.ZR.state.avatar, selectedSubstance.avatarExpression);

  // Render Organ Tabs Bar
  const tabsContainer = document.getElementById('organ-tabs-bar');
  if (tabsContainer) {
    tabsContainer.innerHTML = '';
    const organDefs = [
      { key: 'brain', icon: '🧠', label: 'Cerebro' },
      { key: 'heart', icon: '❤️', label: 'Corazón' },
      { key: 'lungs', icon: '🩺', label: selectedSubstance.id === 'alcohol' ? 'Hígado' : 'Pulmones' },
      { key: 'nerves', icon: '⚡', label: 'Sistema nervioso' }
    ];

    organDefs.forEach(def => {
      const btn = document.createElement('button');
      btn.className = 'organ-tab-item' + (selectedOrganKey === def.key ? ' active' : '');
      btn.innerHTML = `<span class="tab-icon">${def.icon}</span> ${def.label} <span class="arrow-next">►</span>`;
      btn.addEventListener('click', () => {
        selectedOrganKey = def.key;
        updateOrganInfoView(def.key);
        openOrganModal(selectedSubstance, def.key);
      });
      tabsContainer.appendChild(btn);
    });
  }

  // Bind Target Pins on Body
  document.querySelectorAll('.organ-target-pin').forEach(pin => {
    pin.onclick = function() {
      const key = this.dataset.organ;
      selectedOrganKey = key;
      updateOrganInfoView(key);
      openOrganModal(selectedSubstance, key);
    };
  });

  // Modal open & close listeners
  const infoOpenBtn = document.getElementById('info-open-modal-btn');
  if (infoOpenBtn) {
    infoOpenBtn.onclick = () => openOrganModal(selectedSubstance, selectedOrganKey);
  }

  const closeBtn = document.getElementById('organ-modal-close');
  if (closeBtn) closeBtn.onclick = closeOrganModal;

  const understandBtn = document.getElementById('modal-understand-btn');
  if (understandBtn) understandBtn.onclick = closeOrganModal;

  const modalBackdrop = document.getElementById('organ-modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.onclick = (e) => {
      if (e.target === modalBackdrop) closeOrganModal();
    };
  }

  updateOrganInfoView(selectedOrganKey);
}

function updateOrganInfoView(organKey) {
  if (!selectedSubstance) return;

  // Update tabs active state
  document.querySelectorAll('.organ-tab-item').forEach(btn => {
    const text = btn.textContent.toLowerCase();
    const isTarget = (organKey === 'brain' && text.includes('cerebro')) ||
                     (organKey === 'heart' && text.includes('corazón')) ||
                     (organKey === 'lungs' && (text.includes('hígado') || text.includes('pulmones'))) ||
                     (organKey === 'nerves' && text.includes('sistema'));
    if (isTarget) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Update target pins active state
  document.querySelectorAll('.organ-target-pin').forEach(pin => {
    if (pin.dataset.organ === organKey) pin.classList.add('active');
    else pin.classList.remove('active');
  });

  // Update Left Organ Info Card
  const organ = selectedSubstance.organs[organKey] || selectedSubstance.organs['brain'];
  if (!organ) return;

  const nameEl = document.getElementById('info-organ-name');
  if (nameEl) nameEl.textContent = organ.name;

  const descEl = document.getElementById('info-organ-desc');
  if (descEl) descEl.textContent = organ.summary;
}

function openOrganModal(substance, organKey) {
  const organ = substance.organs[organKey] || substance.organs['brain'];
  if (!organ) return;

  const backdrop = document.getElementById('organ-modal-backdrop');
  if (!backdrop) return;

  // Title & Subtitle
  const titleEl = document.getElementById('modal-organ-title-text');
  if (titleEl) titleEl.textContent = `Dentro del ${organ.name.toLowerCase()}`;

  const subEl = document.getElementById('modal-organ-subtitle');
  if (subEl) subEl.textContent = organ.summary;

  // Organ Image
  const imgEl = document.getElementById('modal-organ-image');
  if (imgEl) {
    imgEl.src = organ.imageFile || organ.fallbackFile;
    imgEl.onerror = () => { imgEl.src = `${window.ZR.ASSETS}Organos/${organ.fallbackFile}`; };
  }

  // Impact Breakdown Items
  const listEl = document.getElementById('modal-impact-list');
  if (listEl) {
    listEl.innerHTML = organ.effects.map((e, idx) => {
      const colorClass = idx === 0 ? 'yellow' : (idx === 1 ? 'red' : 'blue');
      return `
        <div class="impact-item">
          <div class="impact-box-label ${colorClass}">${e.zone}</div>
          <div class="impact-item-text">${e.description}</div>
        </div>
      `;
    }).join('');
  }

  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOrganModal() {
  const backdrop = document.getElementById('organ-modal-backdrop');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(initBodySelectScreen, 50);
});

