  (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "AIzaSyDwPxjg1QXV28eSg4_mP4_e-iocQj6KDg4",
    v: "beta",
  });
  // --- Google Maps 資料載入與處理邏輯 ---
  async function initStoreData() {
    try {
      // 1. 載入 Places Library
      const { Place } = await google.maps.importLibrary("places");
      
      // 2. 建立 Place 物件
      const place = new Place({
        id: PLACE_ID,
        requestedLanguage: 'zh-TW',
      });

      // 3. 抓取資料
      await place.fetchFields({
        fields: [
          'displayName', 
          'rating', 
          'userRatingCount', 
          'reviews', 
          'regularOpeningHours'
        ],
      });

      // 4. 取得營業狀態 (修正點：改用 place.isOpen())
      // isOpen() 是非同步的，會回傳 Promise<boolean | null>
      const isOpen = await place.isOpen();

      // 5. 更新 UI
      updateStoreStatus(isOpen); // 直接傳入 true/false
      updateReviews(place.reviews, place.rating, place.userRatingCount);
      updateJsonLdSchema(place);

    } catch (error) {
      console.error("Google Maps 資料載入失敗:", error);
      // 失敗時不動作，網頁維持靜態內容
    }
  }

  // 1. 更新營業狀態 (修正點：接收 boolean)
  function updateStoreStatus(isOpen) {
    const badge = document.getElementById('store-status-badge');
    
    // 如果 isOpen 是 null (代表沒資料)，則不更新
    if (isOpen === null || isOpen === undefined) return;

    if (isOpen) {
      badge.className = 'badge bg-success text-white mb-2';
      badge.innerHTML = '<i class="bi bi-clock-fill"></i> 現正營業中';
    } else {
      badge.className = 'badge bg-danger text-white mb-2';
      badge.innerHTML = '<i class="bi bi-moon-stars-fill"></i> 休息中';
    }
  }

  // 2. 更新評論
  function updateReviews(reviews, rating, count) {
    if (rating) {
      document.getElementById('google-rating-display').innerHTML = 
        `${rating} <i class="bi bi-star-fill star-pulse ms-1"></i> <span class="fs-6 text-muted">(${count})</span>`;
    }

    const track = document.getElementById('google-reviews-track');
    if (reviews && reviews.length > 0) {
      let html = '';
      const textReviews = reviews.filter(r => r.text).slice(0, 5);
      
      textReviews.forEach(review => {
        const shortText = review.text.length > 40 ? review.text.substring(0, 40) + '...' : review.text;
        // 安全存取作者資訊
        const photoUrl = review.authorAttribution?.photoUri || 'assets/img/logo/logo-brown-on-white.png';
        const authorName = review.authorAttribution?.displayName || 'Google 使用者';

        html += `
          <div class="review-item">
            <div class="d-flex align-items-center gap-2 mb-1">
               <img src="${photoUrl}" style="width:20px; height:20px; border-radius:50%;">
               <span class="fw-bold text-brown small">${authorName}</span>
            </div>
            <small class="text-muted">${shortText}</small>
          </div>
        `;
      });
      track.innerHTML = html;
    }
  }

  //更新 SEO Schema
  function updateJsonLdSchema(place) {
    const script = document.querySelector('script[type="application/ld+json"]');
    if (script) {
      try {
        const data = JSON.parse(script.textContent);
        const storeData = data['@graph'].find(item => item['@type'] === 'CafeOrCoffeeShop');
        
        if (storeData && place.rating) {
          storeData.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": place.rating,
            "reviewCount": place.userRatingCount
          };
          script.textContent = JSON.stringify(data);
        }
      } catch (e) {
        console.warn("Schema update failed", e);
      }
    }
  }
  // 啟動
  initStoreData();