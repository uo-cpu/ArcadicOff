// ══════════════════════════════════════════════
//  ArcadicRPG — game.js
//  ゲームロジック補助・データ永続化
// ══════════════════════════════════════════════

// ─── 起動時：保存データを復元 ──────────────
function initGameData() {
  // 既読シーンを復元（storage.jsのloadReadScenesを使用）
  if (typeof loadReadScenes === 'function') {
    window.readScenes = loadReadScenes();
  }

  // 設定を復元
  if (typeof loadSettings === 'function') {
    const saved = loadSettings();
    if (saved) {
      window.settings = Object.assign(window.settings || {}, saved);
    }
  }

  // サイト設定（管理者編集内容）を復元
  if (typeof loadSiteConfig === 'function') {
    const cfg = loadSiteConfig();
    if (cfg) {
      window.siteConfig = Object.assign(window.siteConfig || {}, cfg);
      // タイトル反映
      const logoFb = document.getElementById('logo-fallback');
      const titleSub = document.querySelector('.title-sub');
      if (logoFb && cfg.title) logoFb.textContent = cfg.title;
      if (titleSub && cfg.sub) titleSub.textContent = cfg.sub;
    }
  }

  // キャラクターデータを復元（追加分をマージ）
  if (typeof loadCharacters === 'function') {
    const savedChars = loadCharacters();
    if (savedChars) {
      window.characters = savedChars;
    }
  }

  // シーンデータを復元（追加分をマージ）
  if (typeof loadScenes === 'function') {
    const savedScenes = loadScenes();
    if (savedScenes) {
      window.scenes = savedScenes;
    }
  }

  console.log('[ArcadicRPG] Game data initialized.');
}

// ─── シーンを既読にしてセーブ ───────────────
function markSceneRead(id) {
  if (!window.readScenes) window.readScenes = new Set();
  window.readScenes.add(id);
  if (typeof saveReadScenes === 'function') {
    saveReadScenes(window.readScenes);
  }
}

// ─── 設定変更時に自動保存 ───────────────────
function persistSettings() {
  if (window.settings && typeof saveSettings === 'function') {
    saveSettings(window.settings);
  }
}

// ─── キャラ追加/編集後に自動保存 ────────────
function persistCharacters() {
  if (window.characters && typeof saveCharacters === 'function') {
    saveCharacters(window.characters);
  }
}

// ─── シーン追加/編集後に自動保存 ────────────
function persistScenes() {
  if (window.scenes && typeof saveScenes === 'function') {
    saveScenes(window.scenes);
  }
}

// ─── サイト設定変更後に自動保存 ─────────────
function persistSiteConfig() {
  if (window.siteConfig && typeof saveSiteConfig === 'function') {
    saveSiteConfig(window.siteConfig);
  }
}

// ─── データリセット確認 ──────────────────────
function resetAllDataConfirm() {
  if (confirm('全データ（既読・設定・追加キャラ・追加シーン）を削除します。\nよろしいですか？')) {
    if (typeof clearAllData === 'function') clearAllData();
    alert('リセットしました。ページをリロードします。');
    location.reload();
  }
}

// ─── バックアップ UI ─────────────────────────
function openBackupPanel() {
  const existing = document.getElementById('backup-panel');
  if (existing) { existing.remove(); return; }

  const panel = document.createElement('div');
  panel.id = 'backup-panel';
  panel.style.cssText = `
    position:fixed;bottom:60px;left:16px;z-index:999;
    background:rgba(10,6,14,0.97);border:1px solid rgba(200,168,75,0.3);
    padding:16px;min-width:220px;font-family:'Noto Serif JP',serif;
  `;
  panel.innerHTML = `
    <div style="color:rgba(200,168,75,0.8);font-size:.65rem;letter-spacing:.3em;margin-bottom:12px;">— DATA BACKUP —</div>
    <button onclick="exportData()" style="display:block;width:100%;padding:8px;margin-bottom:6px;background:none;border:1px solid rgba(200,168,75,0.3);color:rgba(200,168,75,0.7);font-size:.65rem;letter-spacing:.2em;cursor:pointer;">💾 バックアップ保存</button>
    <label style="display:block;width:100%;padding:8px;margin-bottom:6px;background:none;border:1px solid rgba(200,168,75,0.3);color:rgba(200,168,75,0.7);font-size:.65rem;letter-spacing:.2em;cursor:pointer;text-align:center;">
      📂 バックアップ読込
      <input type="file" accept=".json" style="display:none" onchange="handleImport(event)">
    </label>
    <button onclick="resetAllDataConfirm()" style="display:block;width:100%;padding:8px;background:none;border:1px solid rgba(122,16,16,0.4);color:rgba(200,80,80,0.6);font-size:.6rem;letter-spacing:.2em;cursor:pointer;">⚠ 全データリセット</button>
    <button onclick="document.getElementById('backup-panel').remove()" style="display:block;width:100%;padding:6px;margin-top:8px;background:none;border:none;color:rgba(200,168,75,0.3);font-size:.6rem;cursor:pointer;">閉じる</button>
  `;
  document.body.appendChild(panel);
}

function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  importData(file, (ok) => {
    alert(ok ? 'インポート成功！ページをリロードします。' : 'インポートに失敗しました。');
    if (ok) location.reload();
  });
}
