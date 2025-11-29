<!--
  這個檔案用於指引 AI 編碼代理（Copilot / Assistant）如何在本專案中安全且有效地工作。
  - 列出可被直接修改的範圍、專案慣例、重要檔案範例與本地預覽指令。
  - 請在修改任何「SEO meta、JSON-LD 或 LCP preload」時特別小心，保留原始語意。
-->

# 所以咖啡（suoyicoffee） — Copilot 使用說明

摘要：此為靜態網站（純 HTML/CSS/少量 JS）的專案；主要檔案放在專案根目錄（`*.html`）與 `assets/`（`css/`, `img/`, `js/`）。沒有建置流程或測試套件。

重點指引：

- 專案類型：靜態多頁網站（server-side 無動態後端）。主要互動為修改 HTML、CSS、與少量前端 JS。
- 主要檔案：
  - `index.html`, `menu.html`, `stores.html`, `franchise.html`, `about.html`, `contact.html`（各頁有 SEO/OG 與 JSON-LD）。
  - `assets/css/custom.css`：全域樣式；大多數樣式變更請放此檔。
  - `assets/img/`：所有靜態圖像；圖片檔名與 `alt` 已維護（參見 `seo/image-alt-report.md`）。
  - `assets/js/main.js`：目前為空檔，若需小型交互可加入，但請先檢視是否有外部 CDN 依賴。
  - `seo/keyword-research.md`：包含每頁建議 `title` / `meta description` 與關鍵字，優先參考此檔再修改 HTML。

可接受與不接受的變更

- 可接受：更新頁面內容（文字、title/meta）、修正/新增 `alt`、新增全域或頁面樣式（prefer `assets/css/custom.css`），和加入小量前端互動（`assets/js/main.js`）。
- 謹慎修改（需註明並留下原文）：「JSON-LD 結構化資料」、「`rel="preload"` 的 LCP 圖片 URL」、以及主要的 OG / canonical 標籤。若要改動，請在 PR 描述或 commit message 中註明原因與範例。不要任意移除 `meta` 的 index/follow 或 canonical。 

專案慣例與模式（可直接模仿的範例）

- SEO 與 Heading：
  - 每個頁面在 head 中都有精心撰寫的 `<title>`、`<meta name="description">`、OG 與 `application/ld+json`。範例：`index.html` 的 title 包含「品牌＋用途關鍵字」。
  - 內容結構使用 H1 在 hero、H2 為主要區塊、H3 為小節（請沿用相同階層以維持 SEO 一致性）。

- CSS 分工：
  - 全域樣式放 `assets/css/custom.css`（例：`.text-brown`, `.btn-brown`, `.hero-section`）。
  - 頁面特殊樣式（少量）可放在該頁 `<head>` 的 `<style>`（見 `franchise.html`），但優先考慮將能共用的樣式移至 `custom.css`。

- 圖片與可存取性：
  - 圖片皆有 `alt` 屬性（報表：`seo/image-alt-report.md`）。新增圖片時請同步加入描述性 `alt`。
  - 重要 LCP 圖片有 `link rel="preload"`，若更換圖片請同時更新 preload 標記。

不可見的假設與設計理由（Agent 應知道）

- 無建置步驟：倉庫中沒有 `package.json` 或其他打包設定，頁面大多透過 CDN（Bootstrap、Bootstrap Icons）載入 CSS/JS。不要新增假定的編譯流程，除非您也同時新增必要的設定檔與說明。
- JSON-LD：多數頁面含商家與 FAQ 的 JSON-LD（structured data），這有助於 Rich Results。不要移除；若要更新請保留 `@context` 與 `@type` 結構。
- 中文與檔案系統：專案路徑與部分檔案名稱含中文（例如 `d:/所以咖啡/coffee`），在跨平台工具或自動化腳本時要注意編碼與路徑轉譯。

修改 commit / PR 建議

- Commit 訊息範例：`feat(seo): update title/meta for franchise page (follow seo/keyword-research.md)`
- 若變更會影響 SEO（title/meta、JSON-LD、canonical、preload），在 PR 描述中逐條列出變更、原因與驗證方式（建議提供本地 preview 的 URL 與示意截圖）。

遇到不確定的情況（詢問須包含）

- 若您需要變更多個頁面的 title/meta，請先提供對應的 `seo/keyword-research.md` 條目或新的變更清單。
- 若要新增第三方腳本或追蹤 (analytics)，請先在 PR 中註明來源、用途與隱私考量（網站目前未包含 analytics 設定）。

參考檔案（直接打開即可）

- `index.html`（主頁）
- `franchise.html`（內容與頁面專屬樣式示例）
- `assets/css/custom.css`（全域樣式）
- `assets/js/main.js`（前端輕量互動放置處）
- `seo/keyword-research.md`（每頁 title/meta 與關鍵字建議）
- `seo/image-alt-report.md`（圖片 alt 稽核結果）

若此指示檔有遺漏的專案細節（例如 CI、部署或未列出的 config），請告訴我，我會更新並與您確認要不要合併到現有文件。完成後我會將 TODO 標為已完成並回報變更。 
