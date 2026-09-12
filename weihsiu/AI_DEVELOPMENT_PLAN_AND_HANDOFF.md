# 曾偉修 2026 龍子里網站專案｜AI 快速接手開發指南（AI Handover Quickstart）

> 📢 **致所有後續接手的 AI 程式碼助理（Claude, GPT, Gemini, DeepSeek, Antigravity 等）**：  
> 本專案為**高雄市鼓山區龍子里里長候選人 曾偉修（XIU 專案）**之官方數位選戰服務平台。請在動工前**務必熟讀本指南**。

---

## ⚡ 三秒快速掌握核心原則（Top 3 Golden Rules）

1. **【雙軌制隔離】**：
   - 軌道一（`weihsiu/index.html` + `weihsiu/css/style.css`）：**正式定案上線版，嚴格凍結，不可改動！**
   - 軌道二（`weihsiu/index2.html` + `weihsiu/css/style2.css` + `weihsiu/js/three-hero.js`）：**Three.js 3D WebGL 旗艦版，當前活躍開發主戰場。**
2. **【四大紅線規範】**：
   - 全站對訪客稱呼**一律使用敬語「您」**，嚴禁出現「你」。
   - 選戰年份**嚴格鎖定「2026」**，嚴禁出現已淘汰歷史詞彙「2035」。
   - Threads 社群連結**嚴格使用** `https://www.threads.net/@logimaskimo`（嚴禁 `threads.com`）。
   - **嚴禁污染 `d:\所以咖啡\coffee` 根目錄**下的所以咖啡官網既有頁面（`about.html`、`menu.html` 等）。
3. **【3D 引擎防護】**：
   - `#webgl-canvas` 必須永久保持 `pointer-events: none`（確保底層點擊與滾動不被劫持）。
   - WebGL DPR 必須鎖定上限 2.0（`Math.min(window.devicePixelRatio || 1, 2)`），維護行動端 60 FPS 與電池健康度。

---

## 🗺️ 專案檔案地圖（Where is what?）

| 檔案路徑 | 檔案類型 | 狀態 | 核心職責 |
| :--- | :--- | :--- | :--- |
| `weihsiu/index.html` | HTML5 | **[FROZEN 凍結]** | 線上正式穩定版，零更動防退行保證。 |
| `weihsiu/css/style.css` | CSS | **[FROZEN 凍結]** | 線上正式版樣式表，零更動保證。 |
| `weihsiu/index2.html` | HTML5 | **[ACTIVE 開發中]** | 3D WebGL 視覺藝術旗艦版首頁。 |
| `weihsiu/css/style2.css` | CSS | **[ACTIVE 開發中]** | 3D 旗艦版專屬樣式（曜金深邃夜空、毛玻璃擬態、光影微動態）。 |
| `weihsiu/js/three-hero.js` | Vanilla JS | **[ACTIVE 開發中]** | Three.js 3D 視覺引擎（Simplex 水波著色器、1545 信任粒子、3D 曜金印章、Scroll LERP）。 |
| `weihsiu/docs/` | Markdown | **[DOCS 智庫]** | 00~07 完整 50 輪田野智庫與技術規格。 |

---

## 📚 完整工程規範與技術規格文檔

請詳閱以下專題文件以取得完整的技術細節與演算法說明：
- 🌟 **[07-index2-threejs-3d-architecture-and-ai-handoff-spec.md](./docs/07-index2-threejs-3d-architecture-and-ai-handoff-spec.md)**：**【核心必讀】3D 旗艦版架構、五大子系統、演算法公式與驗證流程全手冊**。
- 🔬 **[06-threejs-webgl-interactive-shader-research-50rounds.md](./docs/06-threejs-webgl-interactive-shader-research-50rounds.md)**：Three.js / WebGL 2.0 / GLSL 著色器 50 輪頂尖技術研究報告。
- 🏛️ **[00-official-candidate-base-spec.md](./docs/00-official-candidate-base-spec.md)**：曾偉修候選人官方核心規格與經歷認同基礎。
- 🧭 **[docs/README.md](./docs/README.md)**：50 輪地方田野研究智庫總目錄索引。

---

## 🛠️ 開發日常自檢腳本（One-liner Runbook）

每次修改程式碼後，請直接在 PowerShell 執行：

```powershell
# 1. 檢查 index.html 與 style.css 是否保持 0 變更 (必須無輸出)
git diff weihsiu/index.html weihsiu/css/style.css

# 2. 檢查 JS 語法
node --check d:\所以咖啡\coffee\weihsiu\js\three-hero.js

# 3. 檢查 CSS 大括號成對
node -e "const fs = require('fs'); const css = fs.readFileSync('d:/所以咖啡/coffee/weihsiu/css/style2.css', 'utf8'); const o = (css.match(/{/g)||[]).length; const c = (css.match(/}/g)||[]).length; console.log('CSS Braces Diff:', o - c); if(o!==c) process.exit(1);"

# 4. 檢查 HTML 標籤閉合
node -e "const fs = require('fs'); const html = fs.readFileSync('d:/所以咖啡/coffee/weihsiu/index2.html', 'utf8'); const stack = []; const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']); const tagRegex = /<\/?([a-zA-Z0-9\-]+)[^>]*>/g; let m; while((m = tagRegex.exec(html)) !== null) { const full = m[0]; const tag = m[1].toLowerCase(); if(voidTags.has(tag) || full.endsWith('/>')) continue; if(!full.startsWith('</')) stack.push(tag); else { const last = stack.pop(); if(last !== tag) { console.error('Mismatch:', last, tag); process.exit(1); } } } console.log('HTML Tags OK, Unclosed:', stack.length); if(stack.length!==0) process.exit(1);"
```
