const branchData = {
    // --- 1. 鳥松大智店 (使用總部帳號) ---
    "niaosong": {
        name: "鳥松大智店",
        igAccount: "suoyicoffee", 
        igUrl: "https://www.instagram.com/suoyicoffee/",
        igPhotos: [
            { img: "assets/img/stores/niaosong/ig_1.jpg", link: "https://www.instagram.com/suoyicoffee/" },
            { img: "assets/img/stores/niaosong/ig_2.jpg", link: "https://www.instagram.com/suoyicoffee/" },
            { img: "assets/img/stores/niaosong/ig_3.jpg", link: "https://www.instagram.com/suoyicoffee/" },
            { img: "assets/img/stores/niaosong/ig_4.jpg", link: "https://www.instagram.com/suoyicoffee/" }
        ]
    },

    // 台南安平店 (獨立帳號) ---
    "anping": {
        name: "台南安平店",
        igAccount: "suoyi_coffee", // 這是安平店的 ID
        igUrl: "https://www.instagram.com/suoyi_coffee/",
        igPhotos: [
            // 請去安平店 IG 下載 4 張照片，命名為 anping_ig_1.jpg ~ 4.jpg
            { img: "assets/img/stores/anping/ig_1.jpg", link: "https://www.instagram.com/suoyi_coffee/" },
            { img: "assets/img/stores/anping/ig_2.jpg", link: "https://www.instagram.com/suoyi_coffee/" },
            { img: "assets/img/stores/anping/ig_3.jpg", link: "https://www.instagram.com/suoyi_coffee/" },
            { img: "assets/img/stores/anping/ig_4.jpg", link: "https://www.instagram.com/suoyi_coffee/" }
        ]
    },

    //新興新田店 (獨立帳號) ---
    "xintian": { // ID 建議用英文拼音
        name: "新興新田店",
        igAccount: "suoyi_coffee_sintian",
        igUrl: "https://www.instagram.com/suoyi_coffee_sintian/",
        igPhotos: [
            { img: "assets/img/stores/xintian/ig_1.jpg", link: "https://www.instagram.com/suoyi_coffee_sintian/" },
            { img: "assets/img/stores/xintian/ig_2.jpg", link: "https://www.instagram.com/suoyi_coffee_sintian/" },
            { img: "assets/img/stores/xintian/ig_3.jpg", link: "https://www.instagram.com/suoyi_coffee_sintian/" },
            { img: "assets/img/stores/xintian/ig_4.jpg", link: "https://www.instagram.com/suoyi_coffee_sintian/" }
        ]
    },

    // 新興復橫店 (獨立帳號) ---
    "fuheng": {
        name: "新興復橫店",
        igAccount: "suoyi_coffee_fuheng",
        igUrl: "https://www.instagram.com/suoyi_coffee_fuheng/",
        igPhotos: [
            { img: "assets/img/stores/fuheng/ig_1.jpg", link: "https://www.instagram.com/suoyi_coffee_fuheng/" },
            { img: "assets/img/stores/fuheng/ig_2.jpg", link: "https://www.instagram.com/suoyi_coffee_fuheng/" },
            { img: "assets/img/stores/fuheng/ig_3.jpg", link: "https://www.instagram.com/suoyi_coffee_fuheng/" },
            { img: "assets/img/stores/fuheng/ig_4.jpg", link: "https://www.instagram.com/suoyi_coffee_fuheng/" }
        ]
    },

    // 高雄左營富國店 (獨立帳號) ---
    "zuoying": {
        name: "左營富國店",
        igAccount: "331zyble",
        igUrl: "https://www.instagram.com/331zyble",
        igPhotos: [
            { img: "assets/img/stores/zuoying/ig_1.jpg", link: "https://www.instagram.com/331zyble" },
            { img: "assets/img/stores/zuoying/ig_2.jpg", link: "https://www.instagram.com/331zyble" },
            { img: "assets/img/stores/zuoying/ig_3.jpg", link: "https://www.instagram.com/331zyble" },
            { img: "assets/img/stores/zuoying/ig_4.jpg", link: "https://www.instagram.com/331zyble" }
        ]
    }
};

// 定義「檔名」與「資料 ID」的對照表
const fileMapping = {
    'store-niaosong.html': 'niaosong', // 鳥松店
    'store-tainan.html':   'anping',   // 安平店 
    'store-xinxing.html':  'xintian',  // 新興新田店 
    'store-fuheng.html':   'fuheng',   // 新興復橫店
    'store-zuoying.html':  'zuoying'   // 左營富國店
};

// 自動偵測當前 ID
let currentBranchId = 'niaosong'; // 預設值 (如果找不到檔名就顯示鳥松)

// 取得當前路徑 (例如 /store-tainan.html)
const path = window.location.pathname;

// 檢查路徑包含哪個關鍵字
for (const [filename, id] of Object.entries(fileMapping)) {
    if (path.includes(filename)) {
        currentBranchId = id;
        break;
    }
}

// 3. 取得資料並渲染
const branch = branchData[currentBranchId];

if (branch) {
    // 更新 IG 帳號文字
    const handleDisplay = document.getElementById('ig-handle-display');
    if (handleDisplay) handleDisplay.textContent = `@${branch.igAccount}`;
    
    // 更新 IG 連結
    const followBtn = document.getElementById('ig-follow-btn');
    if (followBtn) followBtn.href = branch.igUrl;

    // 更新 4 張照片
    const container = document.getElementById('ig-grid-container');
    if (container) {
        let html = '';
        // 檢查是否有照片資料，避免報錯
        const photos = branch.igPhotos || []; 
        
        photos.forEach(photo => {
            html += `
              <a href="${photo.link}" target="_blank" class="ig-item d-block">
                <img src="${photo.img}" alt="${branch.name} IG Photo">
                <div class="ig-overlay"><i class="bi bi-heart-fill"></i></div>
              </a>
            `;
        });
        container.innerHTML = html;
    }
}