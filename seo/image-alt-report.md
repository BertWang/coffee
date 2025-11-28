## 圖片 alt 屬性稽核報表

生成日期：2025-11-27

摘要：已掃描專案中所有 HTML 檔，列出每個使用到的 `img` 圖檔（相對路徑）與對應的 `alt` 屬性。結果顯示未發現空白或遺漏的 `alt` 屬性。

| 頁面 (HTML) | 圖片路徑 (相對) | alt 內容 | 備註 |
|---|---|---|---|
| `index.html` | `assets/img/logo/logo-brown-on-white.png` | 所以咖啡 | navbar logo |
| `index.html` | `assets/img/hero/hero-coffee-lineup.jpg` | 所以咖啡飲品形象照 | 首頁 LCP 圖 |
| `index.html` | `assets/img/franchise/founder-illustration.jpg` | 所以咖啡創辦人插畫 | 加盟預告背景插畫 |
| `index.html` | `assets/img/franchise/cart-wood.jpg` | 所以咖啡餐車 3D 示意 | 加盟預告餐車示意圖 |
| `index.html` | `assets/img/franchise/cups-lineup.jpg` | 所以咖啡外帶杯形象 | 加盟預告杯子圖 |

| `about.html` | `assets/img/logo/logo-brown-on-white.png` | 所以咖啡 | navbar logo |
| `about.html` | `assets/img/hero/hero-coffee-lineup3.jpg` | 所以咖啡飲品形象照 | 關於頁示意圖 |
| `about.html` | `assets/img/about/logo-design-process.jpg` | 品牌 Logo 設計理念 | 關於頁圖示 |
| `about.html` | `assets/img/about/founder-cartoon.jpg` | 創辦人 | 關於頁創辦人圖 |
| `about.html` | `assets/img/about/founders-contract.jpg` | 加盟合約與創辦人 | 關於頁合約圖 |

| `stores.html` | `assets/img/logo/logo-brown-on-white.png` | 所以咖啡 | navbar logo |
| `stores.html` | `assets/img/stores/stores-barista-back.jpg` | 餐車實景與外帶杯 | 門市實景縮圖 |
| `stores.html` | `assets/img/stores/stores-signboard.jpg` | 所以咖啡大型招牌 | 門市實景縮圖 |
| `stores.html` | `assets/img/stores/stores-cart-bar.jpg` | 不鏽鋼餐車與紅色咖啡機 | 門市實景縮圖 |
| `stores.html` | `assets/img/stores/stores-interior-sign.jpg` | 所以 coffee 室內吧台 | 門市實景縮圖 |

| `menu.html` | `assets/img/logo/logo-brown-on-white.png` | 所以咖啡 | navbar logo |
| `menu.html` | `assets/img/products/latte.jpg` | 多張商品圖（示例：美式 / 檸檬冰美式 / 拿鐵 / 卡布奇諾 / 等）| 多個菜單項目使用同張預設圖（均已補上描述性 alt） |

| `franchise.html` | `assets/img/logo/logo-brown-on-white.png` | 所以咖啡 | navbar logo |
| `franchise.html` | `assets/img/franchise/franchise-store-opening.jpg` | 開幕活動人潮 | 優勢區圖片 |
| `franchise.html` | `assets/img/franchise/franchise-training-group.jpg` | 教育訓練合照 | 優勢區圖片 |
| `franchise.html` | `assets/img/franchise/franchise-hero-products.jpg` | 周邊商品獲利 | 優勢區圖片 |
| `franchise.html` | `assets/img/franchise/cart-wood.jpg` | 風格餐車型 | 方案示意圖 |
| `franchise.html` | `assets/img/franchise/franchise-store-real.jpg` | 社區店面型 | 方案示意圖 |
| `franchise.html` | `assets/img/franchise/franchise-founders.jpg` | 創辦人承諾 | 信賴區圖 |
| `franchise.html` | `assets/img/franchise/franchise-contract-close.jpg` | 合約書特寫 | 信賴區圖 |

| `contact.html` | `assets/img/logo/logo-brown-on-white.png` | 所以咖啡 | navbar logo |
| `contact.html` | `assets/img/stores/stores-interior-sign.jpg` | 所以咖啡門市空間 | hero 右側示意圖 |

備註：
- 本次稽核以專案內所有 `.html` 檔為範圍，使用程式式搜尋 `<img` 標籤與 `alt` 屬性；結果顯示目前所有 `<img>` 均已含描述性 `alt`（未發現空值或遺漏）。
- `menu.html` 中多個商品項目共用 `assets/img/products/latte.jpg` 作為示例圖，但每個 `<img>` 已被補上對應的描述性 `alt`（如「美式咖啡 Americano」等），可視為已完成。若未來要更精準，建議為每款商品準備專屬實拍圖以提高轉換。

如需我將報表改為 `CSV` 或輸出至其他路徑（例如 `reports/image-alt-report.csv`），或直接把報表加入版本控制並 commit，請告訴我要哪一種格式與下一步權限。 
