# seo/keyword-research.md — 關鍵字研究與頁面內容稿

版本：v1.0（2025-11-29）

說明：本檔提供每頁 Title/H1/Meta/Keywords/內鏈建議，符合目前據點（台南/高雄）與加盟擴張（嘉義/屏東/全台）。

---

## 1) 首頁（/）

- Primary Keywords：手沖外帶、咖啡外送、南台灣咖啡品牌、咖啡加盟
- Secondary：短程外送、平台外送（Uber Eats、Foodpanda）、企業外送、外燴
- Title：所以咖啡｜手沖外帶與咖啡外送｜台南・高雄｜加盟招募：嘉義・屏東・全台
- H1：南台灣手沖外帶與咖啡外送｜所以咖啡 Suoyi Coffee
- Meta（120–160）：現沖外帶、短程外送與平台外送（Uber Eats/Foodpanda）。現有據點台南/高雄，提供企業外送與大型外燴。啟動嘉義/屏東與全台加盟招募，讓「平價奢華」走進你的生活圈。
- Internal links：/delivery、/takeout、/stores、/franchise
- Optional meta keywords：所以咖啡, Suoyi Coffee, 手沖咖啡外帶, 咖啡外送, 台南咖啡外送, 高雄外帶咖啡, 嘉義咖啡加盟, 屏東咖啡加盟, 外帶咖啡加盟

---

## 2) 外送專頁（/delivery）

- Primary：咖啡外送、台南咖啡外送、高雄咖啡外送、Uber Eats 咖啡、Foodpanda 咖啡
- Secondary：短程外送、公司會議外送、外送到府
- Title：咖啡外送｜台南・高雄｜Uber Eats・Foodpanda・短程直送｜所以咖啡
- H1：台南・高雄咖啡外送服務
- Meta：手沖現沖、即時外送。支援 Uber Eats 與 Foodpanda，也提供短程直送與企業會議外送。查詢外送範圍、時段與最低消費，輕鬆下單。
- 版位建議：平台徽章（外連）、短程外送規格表、FAQ（範圍/時段/低消/保溫）
- Internal links：/stores（依地名）、/catering（大量/企業）、/menu

FAQ JSON‑LD 範例：
```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"外送範圍與時段？","acceptedAnswer":{"@type":"Answer","text":"目前支援台南/高雄短程外送與平台外送；服務時段以門市公告為準。"}},
{"@type":"Question","name":"是否有最低消費？","acceptedAnswer":{"@type":"Answer","text":"短程外送視距離與杯數而定；平台外送依 Uber Eats/Foodpanda 規則。"}}
]}
</script>
```

---

## 3) 外帶專頁（/takeout）

- Primary：外帶咖啡、手沖外帶、台南外帶咖啡、高雄外帶咖啡
- Secondary：現沖即取、預訂取餐、通勤咖啡
- Title：手沖外帶咖啡｜現沖即取｜台南・高雄外帶咖啡吧｜所以咖啡
- H1：手沖外帶｜現沖即取
- Meta：通勤與午休首選。鳥松/新興/左營/安平據點提供快速外帶與預訂取餐，平價奢華的精品手沖，輕鬆帶著走。
- Internal links：/stores、/menu、/delivery（若尖峰時段建議外送）
- 區塊：尖峰時段提示、門市清單、導航/電話一鍵

---

## 4) 門市與服務地區（/stores）

- Primary：高雄外帶咖啡、台南咖啡外送、鳥松咖啡、新興咖啡、左營咖啡、安平咖啡
- Secondary：外送服務地圖、平台外送、短程外送
- Title：門市與服務地區｜高雄（鳥松・新興・左營）・台南（安平）｜所以咖啡
- H1：門市據點與服務地區
- Meta：外帶與外送服務據點：高雄鳥松/新興/左營、台南安平。提供短程外送與平台下單，導航/來電一鍵快速到店。
- Internal links：/delivery（每卡片放平台按鈕）、/takeout、/contact
- JSON‑LD：LocalBusiness（areaServed：台南/高雄/嘉義/屏東/台灣）

---

## 5) 菜單（/menu）

- Primary：手沖咖啡、外帶菜單、外送咖啡菜單、精品咖啡豆
- Secondary：濾掛咖啡、客製化冰熱、企業訂購
- Title：菜單 Menu｜手沖外帶與外送精選｜所以咖啡 Suoyi Coffee
- H1：手沖與外帶/外送菜單
- Meta：精選精品豆與手沖飲品，支援外帶與外送，提供企業/團體訂購。即刻查看咖啡濃淡選擇與客製化加價。
- Internal links：/takeout、/delivery、/catering

---

## 6) 加盟（/franchise）

- Primary：咖啡加盟、外帶咖啡加盟、嘉義咖啡加盟、屏東咖啡加盟
- Secondary：南部加盟、輕創業品牌、加盟流程、回收試算
- Title：外帶咖啡加盟｜輕創業模式｜嘉義・台南・高雄・屏東招募｜所以咖啡
- H1：外帶咖啡加盟＆輕創業合作
- Meta：以外帶/外送為核心的輕量營運模型，結合平台導流。現有據點台南/高雄；優先招募嘉義/屏東與全台加盟。提供教育訓練與行銷資源。
- Internal links：/stores（展示現況）、/contact（表單/LINE）、/about（品牌支援）

FAQ JSON‑LD 範例：
```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"加盟條件與費用？","acceptedAnswer":{"@type":"Answer","text":"採輕量化外帶模型，費用與回收期將於諮詢時提供試算。優先城市：嘉義/屏東。"}},
{"@type":"Question","name":"是否提供教育訓練？","acceptedAnswer":{"@type":"Answer","text":"提供完整手沖技能、門市管理與行銷導流訓練。"}}
]}
</script>
```

---

## 7) 外燴/企業（/catering）

- Primary：外燴咖啡、公司會議咖啡外送、活動咖啡外送、百人咖啡
- Secondary：短程配送、企業方案、團體訂購
- Title：公司會議與活動外燴咖啡｜百人服務・短程配送｜所以咖啡
- H1：企業/活動咖啡外送與外燴
- Meta：提供會議/展演/活動的咖啡外送與外燴服務，支援百人規模。諮詢杯數、時段與保溫方案，快速取得報價。
- Internal links：/delivery（大量時段安排）、/contact（報價表單）、/menu（品項）

---

## 8) 關於（/about）

- Primary：南台灣咖啡品牌、手沖外帶、平價奢華
- Secondary：在地烘豆、永續選豆、品牌理念、平台外送合作
- Title：關於所以咖啡｜南台灣手沖外帶品牌｜平價奢華的現沖日常
- H1：品牌故事與理念
- Meta：以南台灣為起點，專注手沖外帶與外送，讓平價奢華走進每個生活圈。現有台南/高雄據點，持續拓展加盟版圖。
- Internal links：/takeout、/delivery、/franchise

---

## 9) 聯絡（/contact）

- Primary：加盟洽詢、外送預訂、外燴洽詢
- Secondary：表單諮詢、電話聯繫、LINE 洽談、商務合作
- Title：聯絡我們｜外送/外燴/加盟洽詢｜所以咖啡
- H1：聯絡與預約
- Meta：預訂外送/外燴、諮詢加盟合作，或洽詢商務合作。留下需求與聯絡方式，我們將盡快回覆。
- Internal links：/delivery、/catering、/franchise、/stores

---

## 10) 控制詞彙（避免誤導）
- 優先：外帶、外送、現沖、手沖、短程外送、平台外送（Uber Eats/Foodpanda）
- 避免：咖啡館、內用空間、咖啡廳（與實際業態不符）

---

## 11) Alt 與圖片策略
- 主要圖（Hero/LCP）以 WebP；描述性 alt（例：「高雄左營 外帶手沖咖啡」）
- 更換 LCP 圖片時，同步更新 <link rel="preload"> 與 OG:image

---

## 12) JSON‑LD 快速模板（可按頁型套用）

Organization：
```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Organization","name":"所以咖啡 Suoyi Coffee","url":"https://suoyicoffee.com"}
</script>
```

LocalBusiness（全站通用，/stores 強化）：
```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"CafeOrCoffeeShop","name":"所以咖啡 Suoyi Coffee","areaServed":["台南","高雄","嘉義","屏東","台灣"],"hasDelivery":true,"url":"https://suoyicoffee.com"}
</script>
```

FAQPage：見 /delivery 與 /franchise 範例

---

## 13) 內鏈圖（摘要）
- / → /delivery, /takeout, /stores, /franchise  
- /delivery ↔ /stores（台南/高雄區塊） ↔ /catering  
- /franchise ↔ /stores（現況據點＋城市招募） ↔ /contact

---

## 14) 版本歷程
- v1.0（2025-11-29）：初版關鍵字研究與內容稿（現況：台南/高雄；擴張：嘉義/屏東/全台）
