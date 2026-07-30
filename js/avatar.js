/**
 * ZoneReact - avatar.js
 * Customizador de Avatar con 5 tabs: Piel, Cabello, Superior, Inferior, Zapatos
 * Sistema: HTML5 Canvas Pixel Tinting (sprites en escala de grises tintados en tiempo real)
 */
window.ZR = window.ZR || {};

/* =========================================
   CONFIGURACIÓN DE COLORES POR CATEGORÍA
   ========================================= */
const AVATAR_CONFIG = {
  piel: [
    { file: 'piel_clara',  label: 'Clara'  },
    { file: 'piel_media',  label: 'Media'  },
    { file: 'piel_morena', label: 'Morena' },
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

/* =========================================
   TAB ACTIVO
   ========================================= */
let activeTab = 'piel';

/* =========================================
   MAPEO DE TAB → PROPIEDAD DEL ESTADO
   ========================================= */
const TAB_TO_STATE_KEY = {
  piel:     'skinFile',   // guarda el nombre del archivo (ej: 'piel_media')
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
  const tabBtns = document.querySelectorAll('.avatar-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeTab = this.dataset.tab;
      renderSwatchGrid(activeTab);
    });
  });

  // Activar el primer tab por defecto
  const firstTab = document.querySelector('.avatar-tab-btn[data-tab="piel"]');
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
   RENDER DE LOS SWATCHES DE COLOR
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
    // Piel: swatches con imagen directa, sin tintado
    options.forEach(opt => {
      const isSelected = (av.skinFile || 'piel_media') === opt.file;
      const btn = document.createElement('button');
      btn.className = 'avatar-swatch avatar-swatch-img' + (isSelected ? ' selected' : '');
      btn.title = opt.label;
      btn.style.cssText = `
        background-image: url('assets/Avatar/Piel/${opt.file}.png');
        background-size: cover;
        background-position: center top;
        border: 3px solid ${isSelected ? 'var(--ink, #1A1A1A)' : 'transparent'};
        box-shadow: ${isSelected ? '3px 3px 0 var(--ink, #1A1A1A)' : 'none'};
      `;
      btn.innerHTML = `<span style="font-size:10px;font-weight:900;color:#fff;text-shadow:0 1px 2px #000;margin-top:auto">${opt.label}</span>`;
      btn.addEventListener('click', () => {
        av.skinFile = opt.file;
        renderSwatchGrid('piel');
        updateAvatarPreview();
      });
      grid.appendChild(btn);
    });
  } else {
    // Resto de tabs: swatches de color con tintado Canvas
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

/* =========================================
   CREACIÓN DE UN SWATCH DE COLOR
   ========================================= */
function createColorSwatch(hex, label, isSelected, onClick) {
  const btn = document.createElement('button');
  btn.className = 'avatar-swatch' + (isSelected ? ' selected' : '');
  btn.title = label;

  const textColor = isLight(hex) ? '#1A1A1A' : '#FFFFFF';
  btn.style.cssText = `
    background: ${hex};
    border: 3px solid ${isSelected ? 'var(--ink, #1A1A1A)' : 'transparent'};
    box-shadow: ${isSelected ? '3px 3px 0 var(--ink, #1A1A1A)' : 'none'};
  `;
  btn.innerHTML = `<span style="font-size:11px;font-weight:900;color:${textColor}">${label}</span>`;
  btn.addEventListener('click', onClick);
  return btn;
}

/* =========================================
   UTILIDAD: ¿El color es claro?
   ========================================= */
function isLight(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

/* =========================================
   ACTUALIZAR TODAS LAS PREVISUALIZACIONES
   ========================================= */
function updateAvatarPreview() {
  const av = window.ZR.state.avatar;
  window.ZR.renderAvatarInContainer('home-avatar-display', av);
  window.ZR.renderAvatarInContainer('avatar-stage-display', av);
  window.ZR.renderAvatarInContainer('aventura-avatar-display', av);
  window.ZR.renderAvatarInContainer('lobby-avatar-display', av);
  window.ZR.renderAvatarInContainer('healthy-avatar-display', av);
}

window.ZR.updateAvatarPreviews = updateAvatarPreview;
