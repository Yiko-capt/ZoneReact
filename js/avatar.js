/**
 * ZoneReact - avatar.js
 * Customizador de Avatar con Recursos de Perry Platypus
 */
window.ZR = window.ZR || {};

const AVATAR_CONFIG = {
  skins: [
    { id: 1, label: 'Tono 1', color: '#FCE0C4' },
    { id: 2, label: 'Tono 2', color: '#D4A274' },
    { id: 3, label: 'Tono 3', color: '#8C5838' }
  ],
  hairs: [
    { style: 'corto', color: 'negro',    label: 'Corto Negro',  hex: '#2B2B2B' },
    { style: 'corto', color: 'marron',   label: 'Corto Marrón', hex: '#7B4A28' },
    { style: 'corto', color: 'amarillo', label: 'Corto Rubio',  hex: '#F4C430' },
    { style: 'cola',  color: 'negro',    label: 'Cola Negro',   hex: '#2B2B2B' },
    { style: 'cola',  color: 'marron',   label: 'Cola Marrón',  hex: '#7B4A28' },
    { style: 'cola',  color: 'amarillo', label: 'Cola Rubio',   hex: '#F4C430' }
  ],
  polos: [
    { color: 'Azul',  label: 'Azul',  hex: '#4A6FA5' },
    { color: 'Rojo',  label: 'Rojo',  hex: '#E8543E' },
    { color: 'Rosa',  label: 'Rosa',  hex: '#E888A0' },
    { color: 'Verde', label: 'Verde', hex: '#5A8A4A' }
  ],
  eyes: [
    { id: 1, label: 'Ojos 1' },
    { id: 2, label: 'Ojos 2' }
  ],
  mouths: [
    { id: 1, label: 'Boca 1' },
    { id: 2, label: 'Boca 2' },
    { id: 3, label: 'Boca 3' },
    { id: 4, label: 'Boca 4' }
  ]
};

let activeTab = 'piel';

window.ZR.registerScreen('screen-avatar', function () {
  renderAvatarCustomizer();
  updateAvatarPreview();
});

function renderAvatarCustomizer() {
  const tabBtns = document.querySelectorAll('.avatar-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeTab = this.dataset.tab;
      renderSwatchGrid(activeTab);
    });
  });

  renderSwatchGrid(activeTab);

  document.getElementById('avatar-back-btn')?.addEventListener('click', () => {
    window.ZR.navigate('screen-menu-aventura');
  });

  document.getElementById('avatar-save-btn')?.addEventListener('click', () => {
    window.ZR.saveAvatar();
    window.ZR.showToast('✅ <b>Avatar guardado</b> correctamente!');
    setTimeout(() => window.ZR.navigate('screen-menu-aventura'), 1000);
  });
}

function renderSwatchGrid(tab) {
  const grid = document.getElementById('avatar-swatch-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const av = window.ZR.state.avatar;

  if (tab === 'piel') {
    AVATAR_CONFIG.skins.forEach(s => {
      const swatch = createColorSwatch(s.color, s.label, av.skin === s.id, () => {
        av.skin = s.id;
        renderSwatchGrid('piel');
        updateAvatarPreview();
      });
      grid.appendChild(swatch);
    });
  }
  else if (tab === 'cabello') {
    AVATAR_CONFIG.hairs.forEach(h => {
      const isSel = (av.hairStyle || av.hair?.style) === h.style && (av.hairColor || av.hair?.color) === h.color;
      const swatch = createColorSwatch(h.hex, h.label, isSel, () => {
        av.hairStyle = h.style;
        av.hairColor = h.color;
        renderSwatchGrid('cabello');
        updateAvatarPreview();
      });
      grid.appendChild(swatch);
    });
  }
  else if (tab === 'polo') {
    AVATAR_CONFIG.polos.forEach(p => {
      const swatch = createColorSwatch(p.hex, p.label, av.polo === p.color, () => {
        av.polo = p.color;
        renderSwatchGrid('polo');
        updateAvatarPreview();
      });
      grid.appendChild(swatch);
    });
  }
  else if (tab === 'ojos') {
    AVATAR_CONFIG.eyes.forEach(e => {
      const swatch = createColorSwatch('#2C3E50', e.label, av.eyes === e.id, () => {
        av.eyes = e.id;
        renderSwatchGrid('ojos');
        updateAvatarPreview();
      });
      grid.appendChild(swatch);
    });
  }
  else if (tab === 'boca') {
    AVATAR_CONFIG.mouths.forEach(m => {
      const swatch = createColorSwatch('#C0392B', m.label, av.mouth === m.id, () => {
        av.mouth = m.id;
        renderSwatchGrid('boca');
        updateAvatarPreview();
      });
      grid.appendChild(swatch);
    });
  }
}

function createColorSwatch(hex, label, isSelected, onClick) {
  const btn = document.createElement('button');
  btn.className = 'avatar-swatch' + (isSelected ? ' selected' : '');
  btn.title = label;
  btn.style.cssText = `background:${hex}; border:3px solid ${isSelected ? 'var(--ink)' : 'transparent'}; box-shadow:${isSelected ? '3px 3px 0 var(--ink)' : 'none'}`;
  btn.innerHTML = `<span style="font-size:11px;font-weight:900;color:${isLight(hex) ? '#1A1A1A' : '#FFFFFF'}">${label}</span>`;
  btn.addEventListener('click', onClick);
  return btn;
}

function isLight(color) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

function updateAvatarPreview() {
  window.ZR.renderAvatarInContainer('avatar-stage-display', window.ZR.state.avatar);
  window.ZR.renderAvatarInContainer('aventura-avatar-display', window.ZR.state.avatar);
  window.ZR.renderAvatarInContainer('lobby-avatar-display', window.ZR.state.avatar);
}

window.ZR.updateAvatarPreviews = updateAvatarPreview;
