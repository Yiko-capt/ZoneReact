/**
 * ZoneReact - avatar.js
 * Customizador de Avatar con Género (Hombre/Mujer) y 6 tabs: Piel, Boca, Cabello, Superior, Inferior, Zapatos
 */
window.ZR = window.ZR || {};

/* =========================================
   CONFIGURACIÓN DE OPCIONES POR CATEGORÍA
   ========================================= */
const AVATAR_CONFIG = {
  piel: [
    { file: 'piel_clara',  label: 'Clara'  },
    { file: 'piel_media',  label: 'Media'  },
    { file: 'piel_morena', label: 'Morena' },
  ],
  boca: [
    { file: 'boca_feliz',  label: 'Feliz'  },
    { file: 'boca_seria',  label: 'Seria'  },
    { file: 'boca_triste', label: 'Triste' },
  ],
  cabello: [
    { hex: '#1A1A1A', label: 'Negro'    },
    { hex: '#C0392B', label: 'Rojo'     },
    { hex: '#F4C430', label: 'Rubio'    },
    { hex: '#7B4A28', label: 'Castaño'  },
  ],
  superior: [
    { hex: '#2980B9', label: 'Azul'     },
    { hex: '#E74C3C', label: 'Rojo'     },
    { hex: '#27AE60', label: 'Verde'    },
    { hex: '#F39C12', label: 'Amarillo' },
  ],
  inferior: [
    { hex: '#2980B9', label: 'Azul'     },
    { hex: '#E74C3C', label: 'Rojo'     },
    { hex: '#27AE60', label: 'Verde'    },
    { hex: '#F39C12', label: 'Amarillo' },
  ],
  zapatos: [
    { hex: '#1A1A1A', label: 'Negro'    },
    { hex: '#FFFFFF', label: 'Blanco'   },
    { hex: '#8B4513', label: 'Café'     },
    { hex: '#C0392B', label: 'Rojo'     },
  ],
};

let activeTab = 'piel';

const TAB_TO_STATE_KEY = {
  piel:     'skinFile',
  boca:     'mouthFile',
  cabello:  'hairColor',
  superior: 'poloColor',
  inferior: 'shortColor',
  zapatos:  'shoeColor',
};

/* =========================================
   REGISTRO DE PANTALLA
   ========================================= */
window.ZR.registerScreen('screen-avatar', function () {
  renderAvatarCustomizer();
  updateAvatarPreview();
});

/* =========================================
   RENDER PRINCIPAL DEL CUSTOMIZADOR
   ========================================= */
function renderAvatarCustomizer() {
  const nameEl = document.getElementById('av-player-name');
  if (nameEl) nameEl.textContent = window.ZR.state.playerName || 'Jugador';

  // Configuración de botones de Género (Hombre / Mujer)
  const hombreBtn = document.getElementById('av-gender-hombre');
  const mujerBtn  = document.getElementById('av-gender-mujer');

  function updateGenderUI() {
    const curGender = window.ZR.state.avatar.gender || 'hombre';
    if (hombreBtn) hombreBtn.classList.toggle('active', curGender === 'hombre');
    if (mujerBtn)  mujerBtn.classList.toggle('active', curGender === 'mujer');
  }

  hombreBtn?.addEventListener('click', () => {
    window.ZR.state.avatar.gender = 'hombre';
    updateGenderUI();
    updateAvatarPreview();
  });

  mujerBtn?.addEventListener('click', () => {
    window.ZR.state.avatar.gender = 'mujer';
    updateGenderUI();
    updateAvatarPreview();
  });

  updateGenderUI();

  // Títulos de cada tab
  const TAB_TITLES = {
    piel:     'Tono de Piel',
    boca:     'Expresión de la Boca',
    cabello:  'Color de Cabello',
    superior: 'Ropa Superior',
    inferior: 'Ropa Inferior',
    zapatos:  'Zapatos',
  };

  const tabBtns = document.querySelectorAll('.av-tab');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeTab = this.dataset.tab;
      const titleEl = document.getElementById('av-tab-title');
      if (titleEl) titleEl.textContent = TAB_TITLES[activeTab] || activeTab;
      renderSwatchGrid(activeTab);
    });
  });

  // Activar primer tab
  const firstTab = document.querySelector(`.av-tab[data-tab="${activeTab}"]`) || document.querySelector('.av-tab[data-tab="piel"]');
  if (firstTab) {
    tabBtns.forEach(b => b.classList.remove('active'));
    firstTab.classList.add('active');
  }

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

/* =========================================
   RENDER DE LOS SWATCHES DE OPCIONES
   ========================================= */
function renderSwatchGrid(tab) {
  const grid = document.getElementById('avatar-swatch-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const av = window.ZR.state.avatar;
  const stateKey = TAB_TO_STATE_KEY[tab];
  const options  = AVATAR_CONFIG[tab];
  if (!options) return;

  if (tab === 'piel') {
    options.forEach(opt => {
      const isSelected = (av.skinFile || 'piel_media') === opt.file;
      const btn = document.createElement('button');
      btn.className = 'avatar-swatch avatar-swatch-img' + (isSelected ? ' selected' : '');
      btn.title = opt.label;
      btn.style.backgroundImage = `url('assets/Avatar/Piel/${opt.file}.png')`;
      btn.innerHTML = `<span style="font-size:12px;font-weight:900;color:#fff;text-shadow:0 1px 3px #000">${opt.label}</span>`;
      btn.addEventListener('click', () => {
        av.skinFile = opt.file;
        renderSwatchGrid('piel');
        updateAvatarPreview();
      });
      grid.appendChild(btn);
    });
  } else if (tab === 'boca') {
    options.forEach(opt => {
      const isSelected = (av.mouthFile || 'boca_feliz') === opt.file;
      const btn = document.createElement('button');
      btn.className = 'avatar-swatch avatar-swatch-img' + (isSelected ? ' selected' : '');
      btn.title = opt.label;
      btn.style.backgroundImage = `url('assets/Avatar/Boca/${opt.file}.png')`;
      btn.innerHTML = `<span style="font-size:12px;font-weight:900;color:#fff;text-shadow:0 1px 3px #000">${opt.label}</span>`;
      btn.addEventListener('click', () => {
        av.mouthFile = opt.file;
        renderSwatchGrid('boca');
        updateAvatarPreview();
      });
      grid.appendChild(btn);
    });
  } else {
    options.forEach(opt => {
      const isSelected = av[stateKey] === opt.hex;
      const swatch = createColorSwatch(opt.hex, opt.label, isSelected, () => {
        av[stateKey] = opt.hex;
        renderSwatchGrid(tab);
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

  const textColor = isLight(hex) ? '#1A1A1A' : '#FFFFFF';
  btn.style.backgroundColor = hex;
  btn.innerHTML = `<span style="font-size:12px;font-weight:900;color:${textColor}">${label}</span>`;
  btn.addEventListener('click', onClick);
  return btn;
}

function isLight(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

function updateAvatarPreview() {
  const av = window.ZR.state.avatar;
  window.ZR.renderAvatarInContainer('home-avatar-display', av);
  window.ZR.renderAvatarInContainer('avatar-stage-display', av);
  window.ZR.renderAvatarInContainer('aventura-avatar-display', av);
  window.ZR.renderAvatarInContainer('lobby-avatar-display', av);
  window.ZR.renderAvatarInContainer('body-healthy-avatar', av);
  if (window.ZR.preloadActiveAvatarLayers) {
    window.ZR.preloadActiveAvatarLayers();
  }
}

window.ZR.updateAvatarPreviews = updateAvatarPreview;
