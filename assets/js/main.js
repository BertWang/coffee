// 自訂全域互動腳本（整合版）
document.addEventListener("DOMContentLoaded", function () {
  /*** A) 歡迎影片 Modal（保留原邏輯；改為區域防呆，避免阻斷其他功能） ***/
  (function welcomeVideoInit() {
    const modalEl  = document.getElementById("welcomeVideoModal");
    const videoEl  = document.getElementById("welcomeVideo");
    const soundBtn = document.getElementById("videoSoundToggle");

    // 僅在必要元素與 Bootstrap 存在時啟動此模組
    if (!(modalEl && videoEl && window.bootstrap)) return;

    const modal = new bootstrap.Modal(modalEl, {
      backdrop: "static", // 點擊空白不關閉（可視需求改 true）
      keyboard: true
    });

    // 本次瀏覽 Session 只彈一次
    const hasSeen = sessionStorage.getItem("welcomeVideoSeen");
    if (!hasSeen) {
      // 延遲 1.5 秒彈出，避免一載入就打斷使用者
      setTimeout(() => {
        modal.show();
        // 嘗試自動播放（muted 狀態下多數瀏覽器允許）
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {
          // 瀏覽器限制自動播放時，維持停在第一幀，讓使用者自行播放
        });
        sessionStorage.setItem("welcomeVideoSeen", "1");
      }, 1500);
    }

    // 播放完畢自動關閉
    videoEl.addEventListener("ended", () => {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
    });

    // Modal 關閉時：暫停並回到開頭
    modalEl.addEventListener("hidden.bs.modal", () => {
      videoEl.pause();
      videoEl.currentTime = 0;
    });

    // Modal 再次打開時：若影片在暫停，嘗試播放
    modalEl.addEventListener("shown.bs.modal", () => {
      if (videoEl.paused) {
        videoEl.play().catch(() => {});
      }
    });

    // 聲音控制按鈕：切換靜音 / 有聲
    if (soundBtn) {
      soundBtn.addEventListener("click", function () {
        // 反轉 muted 狀態
        videoEl.muted = !videoEl.muted;

        // 從靜音切到有聲時，盡量確保影片正在播放
        if (!videoEl.muted && videoEl.paused) {
          videoEl.play().catch(() => {});
        }

        // 更新按鈕文字與 icon
        soundBtn.innerHTML = videoEl.muted
          ? '<i class="bi bi-volume-mute-fill me-1"></i> 開啟聲音'
          : '<i class="bi bi-volume-up-fill me-1"></i> 關閉聲音';
      });
    }

    // Modal 開啟/關閉時，切換 body 的 class 以控制背景樣式
    modalEl.addEventListener("shown.bs.modal", () => {
      document.body.classList.add("welcome-backdrop-open");
    });
    modalEl.addEventListener("hidden.bs.modal", () => {
      document.body.classList.remove("welcome-backdrop-open");
    });
  })();

  /*** B) 週三優惠：動態文案（非週三顯示倒數；週三高亮 .is-today） ***/
  (function wednesdayPromo() {
    const headline   = document.querySelector('[data-offer-headline]') || document.querySelector('.promo-section h3');
    const scopeEl    = document.querySelector('[data-offer-scope]');
    const promoWrap  = document.querySelector('.promo-section');
    if (!headline) return;

    const d = new Date().getDay(); // 0=Sun ... 3=Wed
    const daysToWed = (3 - d + 7) % 7;

    if (d === 3) {
      headline.textContent = '今天週三｜台南／高雄門市「第二杯半價」！';
      if (scopeEl) scopeEl.textContent = '台南／高雄 所以咖啡門市（依各店公告為準）';
      if (promoWrap) promoWrap.classList.add('is-today');
    } else {
      headline.textContent = `每週三限定｜台南／高雄門市 第二杯半價（${daysToWed} 天後）`;
      if (promoWrap) promoWrap.classList.remove('is-today');
    }
  })();

  /*** C) 影像最佳化：為未標註的圖片預設 lazy/async（不覆蓋既有屬性） ***/
  (function lazyImages() {
    document.querySelectorAll('img:not([loading])').forEach(img => {
      img.loading  = 'lazy';
      img.decoding = 'async';
    });
  })();

  /*** D) 外部連結安全屬性補齊 ***/
  (function secureExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(a => {
      const rel = (a.getAttribute('rel') || '').toLowerCase();
      if (!/noopener/.test(rel) || !/noreferrer/.test(rel)) {
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  })();
});