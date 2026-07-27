/**
 * ZoneReact - body-module.js
 * Módulo "Tu Cuerpo" - Efecto directo al hacer clic en sustancias y órganos
 */
window.ZR = window.ZR || {};

let selectedSubstance = null;
let selectedOrganKey = null;

window.ZR.registerScreen('screen-body-select', function () {
  initBodyModule();
});

window.ZR.registerScreen('screen-body-organs', function () {
  initBodyModule();
});

function initBodyModule() {
  const container = document.getElementById('substance-cards');
  if (!container) return;

  // Default substance: alcohol
  if (!selectedSubstance) {
    selectedSubstance = window.ZR.substances[0];
  }

  // Render cards
  container.innerHTML = '';
  window.ZR.substances.forEach(substance => {
    const card = document.createElement('button');
    const isSelected = selectedSubstance?.id === substance.id;
    card.className = 'substance-card' + (isSelected ? ' selected' : '');
    card.innerHTML = `
      <div class="substance-icon">${substance.icon}</div>
      <div class="substance-name">${substance.name}</div>
      <div class="substance-type tag tag-${substance.typeColor || 'red'}">${substance.type}</div>
    `;
    card.addEventListener('click', () => {
      selectedSubstance = substance;
      container.querySelectorAll('.substance-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      updateSubstanceEffectView(substance);
    });
    container.appendChild(card);
  });

  // Hotspots click -> DIRECTLY OPEN ORGAN MODAL
  document.querySelectorAll('.organ-hotspot').forEach(hotspot => {
    const newHotspot = hotspot.cloneNode(true);
    hotspot.parentNode?.replaceChild(newHotspot, hotspot);
    newHotspot.addEventListener('click', function () {
      const organKey = this.dataset.organ;
      selectedOrganKey = organKey;
      if (selectedSubstance) {
        openOrganModalDirect(selectedSubstance, organKey);
      }
    });
  });

  // Modal close handlers
  const modalClose = document.getElementById('organ-modal-close');
  const newClose = modalClose?.cloneNode(true);
  modalClose?.parentNode?.replaceChild(newClose, modalClose);
  newClose?.addEventListener('click', closeOrganModal);

  document.getElementById('organ-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('organ-modal-backdrop')) closeOrganModal();
  });

  // Initial update
  updateSubstanceEffectView(selectedSubstance);
}

function updateSubstanceEffectView(substance) {
  if (!substance) return;

  // Render affected avatar sprite immediately
  window.ZR.renderAvatarInContainer('body-avatar-display', window.ZR.state.avatar, substance.avatarExpression);

  // Status banner update
  const statusEl = document.getElementById('substance-status-effect');
  if (statusEl) {
    statusEl.innerHTML = `
      <div style="font-family:'Press Start 2P',monospace;font-size:13px;color:var(--red);margin-bottom:6px">${substance.statusEffect || 'EFECTO EN EL CUERPO'}</div>
      <div style="font-size:15px;color:var(--ink);font-weight:700">${substance.description}</div>
    `;
  }

  // Organ tabs rendering (clicking tab directly opens modal as well!)
  const tabsContainer = document.getElementById('organ-tabs');
  if (tabsContainer) {
    tabsContainer.innerHTML = '';
    const organDefs = [
      { key: 'brain',  icon: '🧠', label: 'Cerebro' },
      { key: 'lungs',  icon: '🫁', label: substance.id === 'alcohol' ? 'Hígado' : 'Pulmones' },
      { key: 'heart',  icon: '❤️', label: 'Corazón' }
    ];

    organDefs.forEach(def => {
      const btn = document.createElement('button');
      btn.className = 'organ-tab-btn';
      btn.innerHTML = `<span class="organ-tab-icon">${def.icon}</span> ${def.label}`;
      btn.addEventListener('click', () => {
        selectedOrganKey = def.key;
        openOrganModalDirect(substance, def.key);
      });
      tabsContainer.appendChild(btn);
    });
  }
}

function openOrganModalDirect(substance, organKey) {
  const organ = substance.organs[organKey];
  if (!organ) return;

  const backdrop = document.getElementById('organ-modal-backdrop');
  if (!backdrop) return;

  // LARGE 16-BIT ORGAN IMAGE
  const imgEl = document.getElementById('modal-organ-image');
  if (imgEl) {
    imgEl.src = organ.imageFile || organ.fallbackFile;
    imgEl.onerror = () => { imgEl.src = `${window.ZR.ASSETS}Organos/${organ.fallbackFile}`; };
    imgEl.style.display = 'block';
  }

  // Title
  const titleEl = document.getElementById('modal-organ-title');
  if (titleEl) {
    titleEl.innerHTML = `
      <div style="font-size:13px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:var(--red);margin-bottom:4px">${substance.name} (${substance.type})</div>
      <div style="font-size:32px;font-weight:900">${organ.icon} ${organ.name}</div>
    `;
  }

  // Effects list with big arrows
  const effectsEl = document.getElementById('modal-organ-effects');
  if (effectsEl) {
    effectsEl.innerHTML = `
      <p style="font-size:16px;line-height:1.6;color:var(--gray);margin-bottom:16px;background:var(--paper);padding:14px;border-left:4px solid var(--yellow)">${organ.summary}</p>
      ${organ.effects.map(e => `
        <div class="organ-modal-effect">
          <div class="organ-modal-effect-zone">${e.zone}</div>
          <div class="organ-modal-effect-desc">${e.description}</div>
        </div>
      `).join('')}
    `;
  }

  // Warning
  const warnEl = document.getElementById('modal-organ-warning');
  if (warnEl) warnEl.innerHTML = `⚠️ <strong>Información Preventiva:</strong> ${organ.prevention}`;

  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOrganModal() {
  const backdrop = document.getElementById('organ-modal-backdrop');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}
