# 所以咖啡（SUOYI COFFEE）官方網站工程維護手冊

> 南台灣現萃外帶咖啡品牌官方網站（高雄 6 間門市 ＋ 台南 1 間門市）

---

## 一、 專案架構概覽

本專案為高效能、零後端負擔之現代化靜態網站，基於原生 HTML5、CSS3、Bootstrap 5.3 與 Vanilla JavaScript 構建，全站具備完整之 Schema.org 語義化結構化資料與 Google Local SEO 本地搜尋優化。

```text
/
├── index.html                  # 品牌入口首頁（7 間門市一排四欄佈局、精選菜單、加盟導流）
├── menu.html                   # 嚴選菜單（完整價格表、產品 JSON-LD、桂花拿鐵展示）
├── stores.html                 # 門市據點總覽（7 間分店完整資訊、一鍵導航、LINE 點餐）
├── store-fuhai.html            # 苓雅福海店 門市獨立專頁（全新旗艦頁面）
├── store-niaosong.html         # 鳥松大智店 門市專頁
├── store-xinxing.html          # 新興林森店 門市專頁
├── store-zuoying.html          # 左營富國店 門市專頁
├── store-fuheng.html           # 新興復橫店 門市專頁
├── store-nanzi.html            # 楠梓新店 門市專頁
├── store-tainan.html           # 台南康平店 門市專頁
├── offers.html                 # 優惠活動專頁（週三半價、買5送1、寄杯10送2）
├── franchise.html              # 加盟招募專頁（1-2人輕創業、免抽成月費、FAQPage）
├── about.html                  # 關於我們（品牌故事與現萃堅持）
├── contact.html                # 聯絡我們（預訂專線、企業外送、加盟諮詢）
├── 404.html                    # 自訂 404 錯誤導引頁
├── sitemap.xml                 # 搜尋引擎站點地圖（已登錄全站 16 頁面）
├── assets/                     # 靜態資源（css, img, js）
│   ├── css/custom.css          # 自訂品牌樣式表
│   └── img/
│       ├── products/           # 飲品實物照片（包含 Osmanthus_Latte.jpg）
│       └── stores/             # 門市照片與橫幅（包含 fuhai/）
├── docs/
│   └── seo-plan.md             # SEO 全域規劃書（v2.0）
└── seo/
    ├── keyword-research.md     # 關鍵字與商圈研究報告（v2.0）
    └── image-alt-report.md     # 圖片 Alt 屬性稽核報告
```

---

## 二、 7 大實體門市營運資料庫

| 門市名稱 | 門市代碼 | 地址 | 聯絡專線 | 專屬外送與預訂通路 |
| :--- | :--- | :--- | :--- | :--- |
| **苓雅福海店** | fuhai | 高雄市苓雅區福海街38號 | 0916-919-008 | LINE (`https://lin.ee/PafbChl`) / Uber Eats / Foodpanda |
| **鳥松大智店** | niaosong | 高雄市鳥松區大智路40號 | 0976-451-451 | Uber Eats / Foodpanda |
| **新興林森店** | xinxing | 高雄市新興區林森一路12號 | 0907-091-628 | Uber Eats / Foodpanda |
| **左營富國店** | zuoying | 高雄市左營區富國路35號 | 0901-053-157 | Uber Eats / Foodpanda |
| **新興復橫店** | fuheng | 高雄市新興區復橫一路39號 | 0968-961-398 | Uber Eats / Foodpanda |
| **楠梓新店** | nanzi | 高雄市楠梓區楠梓新路251號 | 0912-345-678 | LINE / Uber Eats / Foodpanda |
| **台南康平店** | tainan | 台南市安平區康平路190號 | 0900-112-233 | Uber Eats / Foodpanda |

---

## 三、 常態促銷方案與官方通訊規範

1. **常態三大促銷方案**：
   - **現場買 5 送 1**：限實體門市現場購買，外送平台不適用。
   - **寄杯買 10 送 2**：限本人自飲使用，可跨日兌換。
   - **每週三第二杯半價**：品牌日外帶同品項或價低者半價。
2. **社群與通訊原則**：
   - 官方社群由總部統一經營（Instagram: `@suoyicoffee`、Facebook: 官方粉絲專頁）。
   - 分店端第一線營運以官方專屬 LINE 官方帳號為主，提供熟客線上預訂自取。

---

## 四、 本地維護與自動化健檢指引

若需對全站進行結構化資料、超連結與資源完整性稽核，可隨時執行全站健檢腳本：

```bash
node scratch/full_site_audit.js
```

健檢範圍包含：
- 全站 16 個 HTML 檔案之 Schema.org JSON-LD 語法解析（確保 Google Rich Results 有效）。
- 全站內部 `<a>` 連結 404 探測。
- 全站 `<img>` 標籤資源本機實體存在校驗。
- 核心頁面 `<title>`、`<meta description>` 與 `<link rel="canonical">` 標籤檢查。
- 門市跨頁面連動一致性核驗。

