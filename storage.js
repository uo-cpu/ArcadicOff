// ══════════════════════════════════════════════
//  ArcadicRPG — storage.js
//  セーブ・ロード・設定管理
// ══════════════════════════════════════════════

const KEYS = {
  SAVE:     'arcadic_save',
  READ:     'arcadic_read',
  SETTINGS: 'arcadic_settings',
  CONFIG:   'arcadic_config',
  CHARS:    'arcadic_characters',
  SCENES:   'arcadic_scenes',
};

// ─── セーブデータ ───────────────────────────
function saveGame(data) {
  try {
    localStorage.setItem(KEYS.SAVE, JSON.stringify(data));
    return true;
  } catch(e) {
    console.warn('saveGame failed:', e);
    return false;
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(KEYS.SAVE);
    return raw ? JSON.parse(raw) : null;
  } catch(e) {
    console.warn('loadGame failed:', e);
    return null;
  }
}

// ─── 既読シーン ─────────────────────────────
function saveReadScenes(set) {
  try {
    localStorage.setItem(KEYS.READ, JSON.stringify([...set]));
  } catch(e) {}
}

function loadReadScenes() {
  try {
    const raw = localStorage.getItem(KEYS.READ);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch(e) {
    return new Set();
  }
}

// ─── 設定（音量・文字サイズ） ───────────────
function saveSettings(obj) {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(obj));
  } catch(e) {}
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : null;
  } catch(e) {
    return null;
  }
}

// ─── サイト設定（管理者） ───────────────────
function saveSiteConfig(obj) {
  try {
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(obj));
  } catch(e) {}
}

function loadSiteConfig() {
  try {
    const raw = localStorage.getItem(KEYS.CONFIG);
    return raw ? JSON.parse(raw) : null;
  } catch(e) {
    return null;
  }
}

// ─── キャラクターデータ ─────────────────────
function saveCharacters(obj) {
  try {
    localStorage.setItem(KEYS.CHARS, JSON.stringify(obj));
  } catch(e) {}
}

function loadCharacters() {
  try {
    const raw = localStorage.getItem(KEYS.CHARS);
    return raw ? JSON.parse(raw) : null;
  } catch(e) {
    return null;
  }
}

// ─── シーンデータ ───────────────────────────
function saveScenes(obj) {
  try {
    localStorage.setItem(KEYS.SCENES, JSON.stringify(obj));
  } catch(e) {}
}

function loadScenes() {
  try {
    const raw = localStorage.getItem(KEYS.SCENES);
    return raw ? JSON.parse(raw) : null;
  } catch(e) {
    return null;
  }
}

// ─── 全データ削除（リセット） ───────────────
function clearAllData() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}

// ─── エクスポート（バックアップ） ──────────
function exportData() {
  const blob = new Blob([JSON.stringify({
    save:       loadGame(),
    read:       [...loadReadScenes()],
    settings:   loadSettings(),
    config:     loadSiteConfig(),
    characters: loadCharacters(),
    scenes:     loadScenes(),
    exportedAt: new Date().toISOString(),
  }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `arcadic_backup_${Date.now()}.json`;
  a.click();
}

// ─── インポート（バックアップ復元） ────────
function importData(file, callback) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.save)       saveGame(data.save);
      if (data.read)       saveReadScenes(new Set(data.read));
      if (data.settings)   saveSettings(data.settings);
      if (data.config)     saveSiteConfig(data.config);
      if (data.characters) saveCharacters(data.characters);
      if (data.scenes)     saveScenes(data.scenes);
      if (callback) callback(true);
    } catch(err) {
      console.warn('import failed:', err);
      if (callback) callback(false);
    }
  };
  reader.readAsText(file);
}
