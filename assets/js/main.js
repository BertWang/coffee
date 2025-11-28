// 自訂全域互動腳本
document.addEventListener("DOMContentLoaded", function () {
    const modalEl = document.getElementById("welcomeVideoModal");
    const videoEl = document.getElementById("welcomeVideo");
    const soundBtn = document.getElementById("videoSoundToggle");
    
    if (!modalEl || !videoEl || !window.bootstrap) return;

    const modal = new bootstrap.Modal(modalEl, {
        backdrop: "static", // 點擊空白不關閉（可視需求改成 true）
        keyboard: true
    });

    // 判斷是否已經看過（本次瀏覽 Session 只彈一次）
    const hasSeen = sessionStorage.getItem("welcomeVideoSeen");

    //if (!hasSeen) {
        // 延遲 1.5 秒彈出，避免一載入就打斷使用者
        setTimeout(() => {
        modal.show();
        // 嘗試自動播放（因為 muted，大多數瀏覽器會允許）
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {
            // 若瀏覽器限制自動播放，就保持停在第一幀，讓使用者自行按播放
        });
        sessionStorage.setItem("welcomeVideoSeen", "1");
        }, 1500);
    //}
    
    // 播放完畢自動關閉
    videoEl.addEventListener("ended", () => {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();
    });

    // Modal 關閉時：暫停並回到開頭
    modalEl.addEventListener("hidden.bs.modal", () => {
        if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
        }
    });

    // Modal 再次打開時：若影片在暫停，嘗試播放
    modalEl.addEventListener("shown.bs.modal", () => {
        if (videoEl && videoEl.paused) {
        videoEl.play().catch(() => {});
        }
    });
  
    // 聲音控制按鈕：切換靜音 / 有聲
    if (soundBtn) {
        soundBtn.addEventListener("click", function () {
        // 反轉 muted 狀態
        videoEl.muted = !videoEl.muted;

        // 若從靜音切到有聲，盡量確保影片正在播放
        if (!videoEl.muted && videoEl.paused) {
            videoEl.play().catch(() => {});
        }

        // 更新按鈕文字與 icon
        if (videoEl.muted) {
            soundBtn.innerHTML = '<i class="bi bi-volume-mute-fill me-1"></i> 開啟聲音';
        } else {
            soundBtn.innerHTML = '<i class="bi bi-volume-up-fill me-1"></i> 關閉聲音';
        }
        });
    }
    modalEl.addEventListener('shown.bs.modal', () => {
    document.body.classList.add('welcome-backdrop-open');
    });
    modalEl.addEventListener('hidden.bs.modal', () => {
    document.body.classList.remove('welcome-backdrop-open');
    });    
});
