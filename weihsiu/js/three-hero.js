/**
 * TSENG WEI-HSIU 2026｜TRACK 2 THREE.JS & CINEMATIC SCROLL SYSTEM
 * V13.1 Global 90+ Storyboard Alignment Edition (Refined Edition)
 */

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.180.0/three.module.min.js';

// Accessibility check
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// DOM Selectors
const canvas = document.querySelector('#gl');
const gpuState = document.querySelector('#gpuState');
const grade = document.querySelector('#grade');
const timecode = document.querySelector('#timecode');
const shotinfo = document.querySelector('#shotinfo');
const sbImgs = [...document.querySelectorAll('[data-sb-frame]')];
const sections = [...document.querySelectorAll('.chapter')];
const railButtons = [...document.querySelectorAll('.chapterrail button')];
const actionCards = [...document.querySelectorAll('.action')];
const actionLine = document.querySelector('#actionMotionLine');
const meterNodes = [...document.querySelectorAll('.meter-nodes .node')];
const cityPills = [...document.querySelectorAll('.city-pill')];
const btnBackToTop = document.querySelector('#btnBackToTop');
const btnShareNav = document.querySelector('#btnShareNav');
const toastMessage = document.querySelector('#toastMessage');

// Action Policy Modal Selectors
const actionModal = document.querySelector('#actionModal');
const actionModalClose = document.querySelector('#actionModalClose');
const actionModalBackdrop = document.querySelector('#actionModalBackdrop');
const modalKicker = document.querySelector('#modalKicker');
const modalTitle = document.querySelector('#modalTitle');
const modalBody = document.querySelector('#modalBody');

// Motion & State Management
const motion = {
  pointer: {
    tx: 0,
    ty: 0,
    x: 0,
    y: 0,
    speed: 0,
    lastX: 0,
    lastY: 0,
    lastT: performance.now()
  },
  scroll: {
    y: window.scrollY,
    lastY: window.scrollY,
    velocity: 0,
    direction: 1,
    lastT: performance.now(),
    stopAt: performance.now()
  }
};

// Math Helpers
const clamp = (v) => Math.max(0, Math.min(1, v));
const smooth = (t) => t * t * (3 - 2 * t);
const cine = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (a, b, k) => a + (b - a) * k;
const colorLerp = (a, b, t) => new THREE.Color(a).lerp(new THREE.Color(b), t);

// Chapter Timing (Seconds)
const DUR = [12, 12, 8, 15, 22, 15];
const START = DUR.map((_, i) => DUR.slice(0, i).reduce((a, b) => a + b, 0));
const TOTAL = DUR.reduce((a, b) => a + b, 0);

// Camera Shot Configs (F01–F18)
const SHOT = [
  { name: 'HIGH MAP → CITY', f0: 42, f1: 34.5, y0: 10.6, y1: 5.25, z0: 14.8, z1: 11.0, x0: 0, x1: 0.55 },
  { name: 'LOW TRACKING / CROSSING', f0: 36, f1: 33.5, y0: 4.65, y1: 4.1, z0: 10.8, z1: 9.45, x0: -1.15, x1: 0.95 },
  { name: 'STATIC HOLD', f0: 38, f1: 38, y0: 5, y1: 5, z0: 10, z1: 10, x0: 0, x1: 0 },
  { name: 'HUMAN-SCALE DOLLY', f0: 35, f1: 32.5, y0: 1.72, y1: 1.62, z0: 9.2, z1: 7.65, x0: -1.55, x1: 0.28 },
  { name: 'URBAN RISE / IMPACT', f0: 38, f1: 33.5, y0: 3.8, y1: 6.1, z0: 10.4, z1: 12.7, x0: -1.0, x1: 0.85 },
  { name: 'REALITY / RACK FOCUS', f0: 0, f1: 0, y0: 0, y1: 0, z0: 0, z1: 0, x0: 0, x1: 0 }
];

// P05 Dynamic Zoning States
const stateConfig = [
  {
    name: '轉乘 / TRANSIT',
    desc: '捷運與輕軌站體、通勤動線、住宅街廓邊界',
    bg: '#bgTransit',
    node: [0.3, 0.2, 0.2],
    blocks: [[-5, -2, 1.2, 2.2], [-3.4, -2, 1.1, 3.0], [-1.9, -2.1, 1.0, 3.6], [2.4, -2.2, 1.0, 3.3], [4, -2.3, 1.0, 4.0], [5.2, -2.0, 0.9, 2.7]]
  },
  {
    name: '通學 / SCHOOL',
    desc: '龍華國小周邊、斑馬線行穿、接送與行人動線',
    bg: '#bgSchool',
    node: [-1.2, 0.15, 0.4],
    blocks: [[-4.8, -2.2, 1.2, 1.8], [-3.1, -2.4, 1.1, 2.3], [2.7, -2.3, 1.0, 2.6], [4.1, -2.3, 1.0, 3.0], [5.1, -2.1, 0.8, 2.2]]
  },
  {
    name: '住宅 / RESIDENTIAL',
    desc: '高密社區住宅、街廓門戶與後巷安寧維護',
    bg: '#bgHome',
    node: [0.9, 0.15, -0.2],
    blocks: [[-5, -2.5, 1.1, 3.7], [-3.6, -2.4, 1.1, 4.4], [-2.2, -2.5, 1.0, 3.9], [-0.8, -2.4, 1.0, 4.8], [2.2, -2.4, 1.0, 4.5], [3.7, -2.3, 1.0, 3.8], [5, -2.4, 0.9, 3.2]]
  },
  {
    name: '公園 / PARK',
    desc: '凹子底森林公園、步道綠蔭、長者健行界面',
    bg: '#bgPark',
    node: [1.2, 0.15, 0.3],
    blocks: [[-5, -2.8, 1.0, 2.6], [-3.6, -2.8, 1.0, 3.1], [-2.2, -2.8, 1.0, 3.6], [3.2, -2.8, 1.0, 3.2], [4.6, -2.8, 1.0, 2.8]]
  },
  {
    name: '水岸 / WATERFRONT',
    desc: '愛河之心河道、自行車道、清淤與防汛邊界',
    bg: '#bgWater',
    node: [-0.4, 0.15, -0.1],
    blocks: [[-5, -2.6, 1.0, 2.0], [-3.7, -2.5, 1.0, 2.7], [3.4, -2.6, 1.0, 2.8], [4.8, -2.5, 0.9, 2.3]]
  }
];

// Six Actions Rich Civic Data
const actionDetailsData = [
  {
    kicker: "01 · MOVE / 交通安心・行人有路",
    title: "通學安心步道與路口會勘計畫",
    problem: "凹子底與愛河周邊車流量大，龍華國小上下學校園周邊家長接送動線、輕軌大順路沿線路口人車轉彎交會，常造成長輩與學童步行壓力。",
    solution: "1. 爭取龍子里重點學區路口全面設置『行人早開時相』，增加綠斑馬辨識度。<br>2. 盤點通學步道障礙物與路面平整度，定期向工務局與交通局反映辦理現場會勘。<br>3. 針對夜間照明不足路段，協調加裝高亮度節能投光燈，守護步行安全。",
    contactRole: "市府交通局 · 工務局道路養護工程處 · 鼓山分局"
  },
  {
    kicker: "02 · BUILD / 大型建設生活品質把關",
    title: "周邊重大工程施工監督機制",
    problem: "北高雄核心開發案密集，重型工程車進出住宅巷弄、清晨深夜施工噪音、泥沙揚塵與重車壓損路面，嚴重影響社區安寧與起居。",
    solution: "1. 建立里民施工即時通報專線，嚴格要求營造廠商遵守法定施工時段。<br>2. 監督重型車輛行駛指定聯外幹道，嚴禁違規抄近路穿行狹窄住宅巷道。<br>3. 要求工地落實防塵灑水與出入口清洗，一旦發現路面破損立即要求限期刨除重鋪。",
    contactRole: "工務局建管處 · 環保局公害稽查科"
  },
  {
    kicker: "03 · CARE / 銀髮友善與科技樂齡",
    title: "通訊專長結合樂齡防詐與長照對接",
    problem: "高齡長輩面臨智慧型手機功能繁複、各類通訊與 AI 投資詐騙層出不窮；同時市府長照資源繁多，許多長輩家庭不知從何申請。",
    solution: "1. 發揮曾偉修十餘年通訊門市與產業專業，每月在里辦公室開辦『手機健檢與防詐日常小教室』。<br>2. 一對一協助長輩排除智慧裝置疑難雜症、設定防詐辨識。<br>3. 整合社會局與長照中心資源，主動協助獨居與需要照護的長輩媒合送餐、居服與喘息服務。",
    contactRole: "社會局長照中心 · 社區關懷據點"
  },
  {
    kicker: "04 · SAFE / 治安守護與民防協防",
    title: "暗巷照明補強與社區巡守互助網",
    problem: "社區部分後巷、防火巷與尚未開闢空地邊緣夜間視線不佳，晚歸上班族與婦女朋友步行產生安全顧慮。",
    solution: "1. 延續曾偉修長期擔任龍華民防副小隊長之經驗，重組強化夜間義務巡守動線。<br>2. 全面清查龍子里治安盲區，向警政與工務單位爭取加裝高解析監錄系統與感應照明。<br>3. 建立里民 LINE 安全互助聯防群組，遇突發狀況第一時間相互通報並對接派出所快打。",
    contactRole: "鼓山分局龍華派出所 · 民防義警大隊"
  },
  {
    kicker: "05 · CONNECT / 里民服務單一窗口",
    title: "陳情專人列管與跨局處協調機制",
    problem: "里民遇到水溝異味、行道樹遮蔽、違停或鄰損陳情，往往撥打 1999 或在局處間多方轉接，案件進度不透明。",
    solution: "1. 曾偉修以企業管理與專案協調背景，成立里民服務『單一受理窗口』。<br>2. 每件里民反映事項均給予編號並建檔列管，三日內親自勘查並回報市府立案進度。<br>3. 主動協調跨局處聯合會勘，不讓公務程序互推皮球，把事情追到真正有進展。",
    contactRole: "里長服務處 · 市府 1999 · 區公所民政課"
  },
  {
    kicker: "06 · GROUND / 生活環境與基礎維護",
    title: "防汛清淤巡查與道路即時修補",
    problem: "汛期暴雨易因落葉雜物阻塞側溝排水格柵，形成局部積水；路面偶有坑洞裂損危及機車騎士安全。",
    solution: "1. 每年雨季與颱風季節來臨前，逐條巡檢全里易積水側溝箱涵，提早通報水利局環保局全面清淤。<br>2. 建立『巡查即拍照、即通報、即補平』之快速反應慣例，如日前美術東五路破損案即刻列管改善。<br>3. 維護凹子底周邊鄰里公園步道平整與夜間照明，守護長者散步日常。",
    contactRole: "水利局清疏隊 · 道工處 · 環保局清潔隊"
  }
];

let renderer, scene, camera, clock, sun, hemi;
let active = -1;
const groups = [];

// Initialize Section Dynamic Heights
sections.forEach((s, i) => {
  s.style.height = (100 + DUR[i] * 7) + 'vh';
});

// Event Listeners for Pointer & Scroll Dynamics
function onPointer(e) {
  const now = performance.now();
  const dt = Math.max(16, now - motion.pointer.lastT);
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  const ny = (e.clientY / window.innerHeight) * 2 - 1;
  const dx = e.clientX - motion.pointer.lastX;
  const dy = e.clientY - motion.pointer.lastY;

  motion.pointer.tx = nx;
  motion.pointer.ty = ny;
  motion.pointer.speed = Math.min(1, Math.hypot(dx, dy) / (dt * 0.55));
  motion.pointer.lastX = e.clientX;
  motion.pointer.lastY = e.clientY;
  motion.pointer.lastT = now;
  document.body.classList.add('motion-active');
}

window.addEventListener('pointermove', onPointer, { passive: true });
window.addEventListener('pointerleave', () => {
  motion.pointer.tx = 0;
  motion.pointer.ty = 0;
  motion.pointer.speed = 0;
  document.body.classList.remove('motion-active');
});

window.addEventListener('scroll', () => {
  const now = performance.now();
  const dy = window.scrollY - motion.scroll.lastY;
  const dt = Math.max(16, now - motion.scroll.lastT);
  motion.scroll.velocity = Math.min(1, Math.abs(dy) / (dt * 1.4));
  motion.scroll.direction = dy >= 0 ? 1 : -1;
  motion.scroll.lastY = window.scrollY;
  motion.scroll.lastT = now;
  motion.scroll.stopAt = now;

  // Floating Back to Top Button visibility
  if (btnBackToTop) {
    btnBackToTop.classList.toggle('show', window.scrollY > 800);
  }
}, { passive: true });

// Chapter Rail Navigation
railButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const idx = +btn.dataset.jump;
    if (sections[idx]) {
      sections[idx].scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  });
});

// Meter Nodes Click Navigation
meterNodes.forEach(node => {
  node.addEventListener('click', () => {
    const step = +node.dataset.step;
    if (sections[step]) {
      sections[step].scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  });
});

// P05 City Pills Interactivity
cityPills.forEach(pill => {
  pill.addEventListener('click', (e) => {
    e.stopPropagation();
    const idx = +pill.dataset.state;
    applyState(idx);
    cityPills.forEach((p, pi) => p.classList.toggle('active', pi === idx));
  });
});

// Action Policy Modal Controls
function openActionModal(idx) {
  const data = actionDetailsData[idx];
  if (!data || !actionModal) return;
  if (modalKicker) modalKicker.textContent = data.kicker;
  if (modalTitle) modalTitle.textContent = data.title;
  if (modalBody) {
    modalBody.innerHTML = `
      <div class="modal-section">
        <h4>現況觀察與問題痛點</h4>
        <p>${data.problem}</p>
      </div>
      <div class="modal-section">
        <h4>曾偉修具體執行方案</h4>
        <p>${data.solution}</p>
      </div>
      <div class="modal-section">
        <h4>主責協調單位</h4>
        <p>${data.contactRole}</p>
      </div>
    `;
  }
  actionModal.classList.add('show');
  actionModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeActionModal() {
  if (actionModal) {
    actionModal.classList.remove('show');
    actionModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

if (actionModalClose) actionModalClose.addEventListener('click', closeActionModal);
if (actionModalBackdrop) actionModalBackdrop.addEventListener('click', closeActionModal);
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeActionModal();
});

document.querySelectorAll('.action-detail-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openActionModal(+btn.dataset.actionIdx);
  });
});

actionCards.forEach((card, i) => {
  card.addEventListener('click', () => {
    openActionModal(i);
  });
  card.addEventListener('pointerenter', () => {
    actionCards.forEach(c => c.classList.remove('is-active'));
    card.classList.add('is-active');
    if (actionLine) {
      actionLine.style.width = ((i + 1) / actionCards.length * 100) + '%';
    }
  });
  card.addEventListener('pointerleave', () => {
    card.classList.remove('is-active');
  });
});

// Floating Back to Top Click
if (btnBackToTop) {
  btnBackToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });
}

// Nav Share Link & Toast
let toastTimer = null;
function showToast(msg) {
  if (!toastMessage) return;
  toastMessage.textContent = msg;
  toastMessage.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.classList.remove('show');
  }, 2400);
}

if (btnShareNav) {
  btnShareNav.addEventListener('click', async () => {
    const shareUrl = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast('已複製網址！歡迎分享支持曾偉修');
        return;
      } catch (e) {}
    }
    showToast('請複製網址轉發：' + shareUrl);
  });
}

// Storyboard Backplate Lock Cross-fading (F01–F16)
function updateStoryboardLayer(sceneIndex, p) {
  sbImgs.forEach(im => {
    im.style.opacity = 0;
  });
  const pointerX = motion?.pointer?.x || 0;
  const pointerY = motion?.pointer?.y || 0;

  if (sceneIndex <= 4) {
    const first = sceneIndex * 3 + 1;
    let a, b, t;
    if (p <= 0.5) {
      a = first;
      b = first + 1;
      t = clamp(p / 0.5);
    } else {
      a = first + 1;
      b = first + 2;
      t = clamp((p - 0.5) / 0.5);
    }
    const ia = sbImgs[a - 1];
    const ib = sbImgs[b - 1];
    if (ia) {
      ia.style.opacity = (1 - t) * 0.985;
      ia.style.transform = `scale(${1.018 + t * 0.006}) translate(${pointerX * -0.18}%, ${pointerY * -0.09}%)`;
    }
    if (ib) {
      ib.style.opacity = t * 0.985;
      ib.style.transform = `scale(${1.024 - t * 0.004}) translate(${pointerX * -0.18}%, ${pointerY * -0.09}%)`;
    }
    if (canvas) {
      canvas.style.opacity = [0.16, 0.10, 0, 0.10, 0.12][sceneIndex];
    }
  } else {
    // Scene 5: Reality Transition (F16 -> Real Waterfront + Cutout)
    const f16 = sbImgs[15];
    const fade = 1 - clamp((p - 0.06) / 0.26);
    if (f16) {
      f16.style.opacity = fade * 0.94;
      f16.style.transform = `scale(${lerp(1.018, 1.035, 1 - fade)})`;
    }
    if (canvas) {
      canvas.style.opacity = 0;
    }
  }
}

function fmt(sec) {
  sec = Math.max(0, Math.min(TOTAL, sec));
  return '00:' + String(Math.floor(sec)).padStart(2, '0');
}

function setFov(v) {
  if (camera && Math.abs(camera.fov - v) > 0.01) {
    camera.fov = v;
    camera.updateProjectionMatrix();
  }
}

function setSun({ x, y, z, color, intensity, ambient }) {
  if (!sun) return;
  sun.position.set(x, y, z);
  sun.color.copy(color instanceof THREE.Color ? color : new THREE.Color(color));
  sun.intensity = intensity;
  hemi.intensity = ambient;
}

function progress(sec) {
  const r = sec.getBoundingClientRect();
  const d = sec.offsetHeight - window.innerHeight;
  return clamp(d > 0 ? -r.top / d : 0);
}

function bg(id, opacity = 1) {
  document.querySelectorAll('.bg img').forEach(x => {
    x.style.opacity = 0;
  });
  if (id) {
    const el = document.querySelector(id);
    if (el) el.style.opacity = opacity;
  }
}

function mat(c, rough = 0.92) {
  return new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: 0 });
}

function addBlock(g, x, z, w, d, h, c = 0xeee9df) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, 1, d), mat(c));
  m.position.set(x, 0.5, z);
  m.castShadow = true;
  m.receiveShadow = true;
  m.scale.y = 0.04;
  g.add(m);
  return { m, h };
}

// --------------------------------------------------------------------------
// Scene Builders (P01–P05)
// --------------------------------------------------------------------------

function buildP01() {
  const g = new THREE.Group();
  groups[0] = g;
  scene.add(g);

  // F01–F03 Match: Displaced Depressed Basin Mesh
  const geo = new THREE.PlaneGeometry(15.5, 10.5, 70, 48);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getY(i);
    const basin = -0.72 * Math.exp(-(x * x / 12 + z * z / 5.8));
    const edge = 0.035 * Math.hypot(x, z);
    const micro = 0.035 * Math.sin(x * 0.85) * Math.cos(z * 0.72);
    pos.setZ(i, basin + edge + micro);
  }
  geo.computeVertexNormals();

  const terrain = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xe7e1d7, roughness: 1, metalness: 0 }));
  terrain.rotation.x = -Math.PI / 2;
  terrain.receiveShadow = true;
  g.add(terrain);
  g.userData.terrain = terrain;

  const water = new THREE.Mesh(
    new THREE.CircleGeometry(2.25, 72),
    new THREE.MeshStandardMaterial({ color: 0x7893a3, roughness: 0.38, transparent: true, opacity: 0.05 })
  );
  water.rotation.x = -Math.PI / 2;
  water.scale.set(1.7, 0.72, 1);
  water.position.set(0.15, -0.49, 0.05);
  g.add(water);
  g.userData.pool = water;

  g.userData.contours = [];
  [1.25, 1.75, 2.3, 3.0, 3.75].forEach((r, i) => {
    const pts = [];
    for (let a = 0; a < 96; a++) {
      const th = a / 96 * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(th) * r * 1.45, -0.42 + i * 0.075, Math.sin(th) * r * 0.78));
    }
    const line = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0x87939a, transparent: true, opacity: 0.20 - i * 0.022 })
    );
    g.add(line);
    g.userData.contours.push(line);
  });

  g.userData.blocks = [];
  const L = [
    [-5.7, -3.2, 1.0, 1.0, 2.0], [-4.2, -3.4, 0.9, 1.0, 2.8], [-2.8, -3.55, 0.9, 1.0, 3.6],
    [2.8, -3.5, 0.9, 1.0, 3.2], [4.2, -3.3, 0.9, 1.0, 4.0], [5.6, -3.0, 0.8, 1.0, 2.5],
    [-5.8, 2.9, 0.85, 0.9, 1.9], [-4.3, 3.2, 0.9, 0.9, 2.6], [-2.9, 3.5, 0.95, 0.9, 3.2],
    [3.0, 3.5, 0.95, 0.9, 3.0], [4.5, 3.2, 0.9, 0.9, 3.5], [5.7, 2.7, 0.8, 0.9, 2.2]
  ];
  L.forEach((v, i) => g.userData.blocks.push(addBlock(g, ...v, i === 4 ? 0xe2ddd2 : 0xeee9df)));
  g.visible = false;
}

function buildP02() {
  const g = new THREE.Group();
  groups[1] = g;
  scene.add(g);

  const waterPts = [[-7, 0, 2.2], [-5.6, 0.02, 1.6], [-4, 0.02, 1.2], [-2.5, 0.02, 0.8], [-1, 0.02, 0.5], [0.8, 0.02, 0.2], [2.4, 0.02, -0.2]];
  const railPts = [[2.4, 0.02, -0.2], [3.4, 0.02, -0.45], [4.5, 0.02, -0.75], [5.5, 0.02, -1.05], [6.5, 0.02, -1.25]];
  const all = [...waterPts, ...railPts.slice(1)].map(v => new THREE.Vector3(...v));
  const curve = new THREE.CatmullRomCurve3(all, false, 'catmullrom', 0.35);

  const water = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 140, 0.05, 8, false),
    new THREE.MeshBasicMaterial({ color: 0x7893a3, transparent: true, opacity: 1 })
  );
  g.add(water);

  const rail1 = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 140, 0.018, 6, false),
    new THREE.MeshBasicMaterial({ color: 0x17232b, transparent: true, opacity: 0 })
  );
  const rail2 = rail1.clone();
  rail1.position.z = 0.15;
  rail2.position.z = -0.15;
  g.add(rail1, rail2);

  const tram = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.48, 0.5), mat(0xeee9df));
  body.position.y = 0.34;
  tram.add(body);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.51), mat(0x7893a3, 0.45));
  glass.position.set(-0.02, 0.48, 0);
  tram.add(glass);
  g.add(tram);

  g.userData = { curve, tram, water, rails: [rail1, rail2] };
  g.visible = false;
}

function tree(scale = 1) {
  const gr = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.08, 0.8, 8), mat(0x9d9284));
  trunk.position.y = 0.4;
  trunk.castShadow = true;
  gr.add(trunk);

  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 1), mat(0x74806c));
  crown.position.y = 1.18;
  crown.castShadow = true;
  gr.add(crown);

  gr.scale.setScalar(scale);
  gr.userData.crown = crown;
  return gr;
}

function buildP04() {
  const g = new THREE.Group();
  groups[3] = g;
  scene.add(g);
  g.userData.trees = [];
  g.userData.maquette = [];

  const trees = [[-4.5, -0.4, 1.02], [-3.4, 0.9, 0.92], [-2.2, 1.8, 0.78], [2.7, 1.5, 0.70], [3.8, 0.4, 0.76], [4.6, -0.9, 0.82]];
  trees.forEach(v => {
    const t = tree(v[2]);
    t.position.set(v[0], 0, v[1]);
    t.traverse(o => {
      if (o.material) {
        o.material = new THREE.MeshStandardMaterial({ color: 0xeee9df, roughness: 1, transparent: true, opacity: 0 });
      }
    });
    g.add(t);
    g.userData.trees.push(t);
    g.userData.maquette.push(t);
  });

  const pathCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5.8, 0.01, 2.6),
    new THREE.Vector3(-4.6, 0.01, 1.5),
    new THREE.Vector3(-3.3, 0.01, 0.55),
    new THREE.Vector3(-1.7, 0.01, -0.15),
    new THREE.Vector3(0.2, 0.01, -0.5)
  ]);
  const path = new THREE.Mesh(
    new THREE.TubeGeometry(pathCurve, 80, 0.12, 10, false),
    new THREE.MeshStandardMaterial({ color: 0xe8e2d8, roughness: 1, transparent: true, opacity: 0 })
  );
  g.add(path);
  g.userData.maquette.push(path);

  g.userData.skyline = [];
  [
    [-3.1, -4.1, 0.7, 2.5], [-1.8, -4.2, 0.72, 3.15], [-0.3, -4.35, 0.78, 3.7],
    [1.15, -4.25, 0.72, 3.3], [2.55, -4.1, 0.78, 3.55], [3.85, -4.0, 0.72, 2.85]
  ].forEach(([x, z, w, h]) => {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, 0.62),
      new THREE.MeshStandardMaterial({ color: 0xeee9df, roughness: 1, transparent: true, opacity: 0 })
    );
    b.position.set(x, h / 2, z);
    b.castShadow = true;
    g.add(b);
    g.userData.skyline.push(b);
    g.userData.maquette.push(b);
  });
  g.visible = false;
}

function buildP05() {
  const g = new THREE.Group();
  groups[4] = g;
  scene.add(g);
  g.userData.blocks = [];

  const base = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 8),
    new THREE.MeshStandardMaterial({ color: 0xe8e3da, roughness: 1, transparent: true, opacity: 0.32 })
  );
  base.rotation.x = -Math.PI / 2;
  base.position.y = -0.03;
  g.add(base);
  g.userData.base = base;

  const river = new THREE.Mesh(
    new THREE.PlaneGeometry(13, 1.35),
    new THREE.MeshStandardMaterial({ color: 0x7893a3, roughness: 0.35, transparent: true, opacity: 0.36 })
  );
  river.rotation.x = -Math.PI / 2;
  river.rotation.z = -0.12;
  river.position.set(0.4, 0.015, 1.4);
  g.add(river);

  const park = new THREE.Mesh(
    new THREE.CircleGeometry(2.0, 48),
    new THREE.MeshStandardMaterial({ color: 0x74806c, roughness: 1, transparent: true, opacity: 0.28 })
  );
  park.rotation.x = -Math.PI / 2;
  park.scale.set(1.55, 0.70, 1);
  park.position.set(2.2, 0.025, -0.4);
  g.add(park);

  const railCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-6, 0.05, -1.3),
    new THREE.Vector3(-3, 0.05, -0.8),
    new THREE.Vector3(0, 0.05, -0.5),
    new THREE.Vector3(3, 0.05, -0.8),
    new THREE.Vector3(6, 0.05, -1.25)
  ]);
  [-0.10, 0.10].forEach(off => {
    const r = new THREE.Mesh(
      new THREE.TubeGeometry(railCurve, 120, 0.018, 6, false),
      new THREE.MeshBasicMaterial({ color: 0x17232b, transparent: true, opacity: 0.55 })
    );
    r.position.z = off;
    g.add(r);
  });

  const school = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 0.42, 1.35),
    new THREE.MeshStandardMaterial({ color: 0xd7c6a7, roughness: 1, transparent: true, opacity: 0.58 })
  );
  school.position.set(-3.7, 0.21, 0.2);
  g.add(school);

  for (let i = 0; i < 9; i++) {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xeee9df, roughness: 1, transparent: true, opacity: 0.82 })
    );
    b.castShadow = true;
    b.receiveShadow = true;
    b.visible = false;
    g.add(b);
    g.userData.blocks.push({ m: b, base: 1 });
  }

  const node = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0xd2a45d, emissive: 0xd2a45d, emissiveIntensity: 0.38 })
  );
  g.add(node);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.2, 0.208, 64),
    new THREE.MeshBasicMaterial({ color: 0xd2a45d, transparent: true, opacity: 0.28, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2;
  g.add(ring);

  g.userData.node = node;
  g.userData.ring = ring;
  g.userData.state = -1;
  g.visible = false;
}

function applyState(idx) {
  const g = groups[4];
  const cfg = stateConfig[idx];
  if (!g || g.userData.state === idx) return;
  g.userData.state = idx;

  const stateName = document.querySelector('#stateName');
  const stateDesc = document.querySelector('#stateDesc');
  if (stateName) stateName.textContent = cfg.name;
  if (stateDesc) stateDesc.textContent = cfg.desc;

  bg(cfg.bg, 0.78);
  g.userData.node.position.set(...cfg.node);
  g.userData.ring.position.set(cfg.node[0], 0.03, cfg.node[2]);

  g.userData.blocks.forEach((o, i) => {
    const v = cfg.blocks[i];
    if (!v) {
      o.m.visible = false;
      return;
    }
    o.m.visible = true;
    o.base = v[3];
    o.m.geometry.dispose();
    o.m.geometry = new THREE.BoxGeometry(v[2], 1, 0.9);
    o.m.position.set(v[0], v[3] / 2, v[1]);
    o.m.scale.y = v[3];
  });
}

function activate(i) {
  if (active === i) return;
  active = i;

  railButtons.forEach((b, bi) => b.classList.toggle('active', bi === i));
  meterNodes.forEach((node, ni) => node.classList.toggle('active', ni === i));

  groups.forEach((g, gi) => {
    if (g) g.visible = gi === i;
  });

  const ids = [null, '#bgWater', '#bgWater', '#bgPark', '#bgTransit', '#bgWater'];
  bg(ids[i], i === 1 ? 0.90 : i === 2 ? 0.34 : i === 3 ? 0.92 : i === 4 ? 0.78 : i === 5 ? 1 : 0);

  document.querySelectorAll('.bg img').forEach(im => {
    im.style.filter = 'saturate(.68) contrast(.96) brightness(.99) blur(0px)';
  });

  const bgWater = document.querySelector('#bgWater');
  const bgPark = document.querySelector('#bgPark');
  if (i !== 2 && bgWater) bgWater.style.transform = 'scale(1) translateY(0)';
  if (i !== 3 && bgPark) bgPark.style.transform = 'scale(1)';
  if (grade) grade.style.opacity = 0;
}

// --------------------------------------------------------------------------
// WebGL Renderer Initialization
// --------------------------------------------------------------------------

if (!reduced && canvas) {
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    if (gpuState) gpuState.textContent = 'ACTIVE';

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.set(0, 8, 14);
    clock = new THREE.Clock();

    hemi = new THREE.HemisphereLight(0xffffff, 0x819084, 1.32);
    scene.add(hemi);

    sun = new THREE.DirectionalLight(0xfff1cf, 3.0);
    sun.position.set(-6, 12, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.00035;
    sun.shadow.normalBias = 0.025;
    sun.shadow.camera.left = -14;
    sun.shadow.camera.right = 14;
    sun.shadow.camera.top = 14;
    sun.shadow.camera.bottom = -14;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 40;
    scene.add(sun);

    buildP01();
    buildP02();
    groups[2] = new THREE.Group();
    scene.add(groups[2]);
    buildP04();
    buildP05();
    groups[5] = new THREE.Group();
    scene.add(groups[5]);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    requestAnimationFrame(tick);
  } catch (e) {
    if (gpuState) gpuState.textContent = 'FALLBACK';
    if (canvas) canvas.style.display = 'none';
    console.warn('[ThreeJS] Renderer fallback:', e);
  }
} else if (gpuState) {
  gpuState.textContent = 'REDUCED';
}

// --------------------------------------------------------------------------
// Main Render Loop (Tick)
// --------------------------------------------------------------------------

function tick() {
  const t = clock ? clock.getElapsedTime() : 0;

  // Damping Dynamics
  motion.pointer.x = damp(motion.pointer.x, motion.pointer.tx, 0.065);
  motion.pointer.y = damp(motion.pointer.y, motion.pointer.ty, 0.065);
  motion.pointer.speed = damp(motion.pointer.speed, 0, 0.04);

  const scrollStopped = performance.now() - motion.scroll.stopAt > 140;
  motion.scroll.velocity = damp(motion.scroll.velocity, scrollStopped ? 0 : motion.scroll.velocity, 0.08);

  // Viewport Active Chapter Discovery
  let current = 0;
  let best = 9999;
  sections.forEach((s, i) => {
    const r = s.getBoundingClientRect();
    const d = Math.abs(r.top);
    if (r.bottom > 0 && r.top < window.innerHeight && d < best) {
      best = d;
      current = i;
    }
  });

  activate(current);
  const p = progress(sections[current]);
  const q = cine(p);
  const shot = SHOT[current];

  updateStoryboardLayer(current, p);

  // SVG Layer Visibility
  const ro = document.querySelector('#routeOverlay');
  if (ro && current !== 1) ro.style.opacity = 0;
  const cs = document.querySelector('#citySystem');
  if (cs && current !== 4) cs.style.opacity = 0;

  // Cinematic Border Transitions
  const trans = clamp((p - 0.86) / 0.14);
  const framePx = (current === 0 || current === 1) ? lerp(0, Math.min(window.innerWidth * 0.025, 28), trans) : 0;
  document.documentElement.style.setProperty('--frame-r', framePx + 'px');
  document.documentElement.style.setProperty('--frame-l', (current === 5 ? lerp(0, Math.min(window.innerWidth * 0.018, 20), clamp((p - 0.82) / 0.18)) : 0) + 'px');

  // Diagnostics & HUD Updates
  const filmTime = START[current] + p * DUR[current];
  if (timecode) timecode.textContent = fmt(filmTime);

  if (shotinfo) {
    shotinfo.textContent = `${shot.name} · H ${lerp(shot.y0, shot.y1, q).toFixed(1)}m · FOV ${lerp(shot.f0, shot.f1, q).toFixed(1)}°`;
  }

  const meter = document.querySelector('#meter');
  if (meter) meter.style.width = (filmTime / TOTAL * 100) + '%';

  // Per-Scene Camera and Light Orchestration
  if (camera) {
    if (current === 0) {
      const g = groups[0];
      setFov(lerp(shot.f0, shot.f1, q));
      g.rotation.x = lerp(0, -0.26, q) + motion.pointer.y * 0.015;
      g.rotation.y = lerp(0, 0.10, q) + motion.pointer.x * 0.025;

      g.userData.blocks.forEach(({ m, h }, j) => {
        const e = clamp((p - 0.30) * 1.7 - j * 0.025);
        m.scale.y = lerp(0.02, h, cine(e));
        m.position.y = m.scale.y * 0.5 - 0.02;
      });

      g.userData.pool.material.opacity = lerp(0.04, 0.58, clamp((p - 0.16) / 0.30));
      g.userData.contours.forEach((l) => {
        l.material.opacity = lerp(0.24, 0.07, clamp((p - 0.48) / 0.38));
      });

      camera.position.set(lerp(shot.x0, shot.x1, q), lerp(shot.y0, shot.y1, q), lerp(shot.z0, shot.z1, q));
      camera.lookAt(motion.pointer.x * 0.12, lerp(0, 0.28, q) + motion.pointer.y * 0.05, 0);

      setSun({
        x: lerp(-5.5, -6.4, q),
        y: lerp(11.5, 9.2, q),
        z: 6.8,
        color: colorLerp(0xfff4dc, 0xffe5bb, q),
        intensity: lerp(2.7, 2.9, q),
        ambient: 1.3
      });
      if (grade) {
        grade.style.background = 'rgba(210,164,93,.10)';
        grade.style.opacity = 0.12 * q;
      }
    }

    if (current === 1) {
      const routeOverlay = document.querySelector('#routeOverlay');
      const wakePath = document.querySelector('#wakePath');
      const railA = document.querySelector('#railA');
      const railB = document.querySelector('#railB');
      const boatGlyph = document.querySelector('#boatGlyph');

      if (routeOverlay) routeOverlay.style.opacity = 0.72;
      const routeStage = clamp((p - 0.28) / 0.52);

      if (wakePath) wakePath.style.opacity = 1 - routeStage;
      if (railA) {
        railA.style.opacity = routeStage;
        if (railB) railB.style.opacity = routeStage * 0.65;
      }
      if (boatGlyph) {
        boatGlyph.style.opacity = 1 - clamp((p - 0.38) / 0.26);
        boatGlyph.style.transform = `translate(${p * 520}px, ${-p * 120}px)`;
      }

      const { curve, tram, water, rails } = groups[1].userData;
      const tq = clamp(q * 0.97);
      const snapQ = scrollStopped ? Math.round(tq * 8) / 8 : tq;
      const routeQ = damp(tq, snapQ, scrollStopped ? 0.08 : 1);
      const pos = curve.getPointAt(routeQ);
      const tan = curve.getTangentAt(routeQ);

      setFov(lerp(shot.f0, shot.f1, q));
      tram.position.copy(pos);
      tram.lookAt(pos.clone().add(tan));

      water.material.opacity = Math.min(1, 1 - q + motion.pointer.speed * 0.08);
      rails.forEach(r => {
        r.material.opacity = Math.min(1, q + 0.08 * motion.pointer.speed);
      });

      camera.position.set(lerp(shot.x0, shot.x1, q), lerp(shot.y0, shot.y1, q), lerp(shot.z0, shot.z1, q));
      camera.lookAt(lerp(-0.4, 0.5, q), 0.2, lerp(0.35, -0.25, q));

      setSun({ x: -5.3, y: 10.6, z: 7.1, color: 0xfff5df, intensity: 3.0, ambient: 1.32 });
      if (grade) grade.style.opacity = 0.04;
    }

    if (current === 3) {
      const g = groups[3];
      const bp = document.querySelector('#bgPark');
      const bc = document.querySelector('#breathCaption');

      const maquetteIn = clamp((p - 0.20) / 0.22);
      const maquetteOut = 1 - clamp((p - 0.68) / 0.24);
      const maquetteAlpha = maquetteIn * maquetteOut * 0.78;

      g.userData.maquette.forEach(obj => {
        if (obj.traverse) {
          obj.traverse(o => {
            if (o.material && 'opacity' in o.material) o.material.opacity = maquetteAlpha;
          });
        } else if (obj.material) {
          obj.material.opacity = maquetteAlpha;
        }
      });

      if (bp) {
        bp.style.opacity = 0.92;
        bp.style.transform = `scale(${lerp(1.015, 1.045, q)}) translate(${motion.pointer.x * -3}px, ${motion.pointer.y * -1.5}px)`;
        bp.style.filter = `saturate(${lerp(0.72, 0.82, q)}) contrast(0.96) brightness(1.01)`;
      }
      if (bc) bc.style.opacity = maquetteAlpha > 0.12 ? 0.8 : 0;

      setFov(lerp(shot.f0, shot.f1, q));
      g.userData.trees.forEach((tr, j) => {
        const wind = 1 + motion.pointer.speed * 0.35;
        tr.userData.crown.rotation.z = Math.sin(t * 0.72 + j) * 0.018 * wind;
        tr.userData.crown.position.x = Math.sin(t * 0.62 + j * 0.7) * 0.012 * wind;
      });

      camera.position.set(lerp(shot.x0, shot.x1, q), lerp(shot.y0, shot.y1, q), lerp(shot.z0, shot.z1, q));
      camera.lookAt(0.18 + motion.pointer.x * 0.18, lerp(0.34, 0.48, q) + motion.pointer.y * 0.08, 0.08);

      setSun({ x: -4.8, y: 12.5, z: 6.8, color: 0xfffbef, intensity: 3.05, ambient: 1.40 });
      if (grade) grade.style.opacity = 0;
    }

    if (current === 4) {
      const idx = Math.min(4, Math.floor(p * 5));
      const local = (p * 5) - idx;
      const lq = cine(local);

      applyState(idx);
      cityPills.forEach((pill, pi) => pill.classList.toggle('active', pi === idx));

      const citySystem = document.querySelector('#citySystem');
      if (citySystem) citySystem.style.opacity = lerp(0.18, 0.52, clamp((p - 0.08) / 0.35));

      const g = groups[4];
      const wave = local;
      const waveBoost = 1 + motion.scroll.velocity * 0.22;

      setFov(lerp(shot.f0, shot.f1, p));
      g.userData.ring.scale.setScalar(1 + wave * 7.2 * waveBoost);
      g.userData.ring.material.opacity = (1 - wave) * 0.12;

      g.userData.blocks.forEach(({ m, base }) => {
        if (!m.visible) return;
        const d = Math.hypot(m.position.x - g.userData.node.position.x, m.position.z - g.userData.node.position.z);
        const arrival = clamp(1 - Math.abs(wave * 6.2 - d) * 0.95);
        m.scale.y = base * (1 + arrival * 0.045 * waveBoost);
        m.position.y = m.scale.y * 0.5;
      });

      camera.position.set(lerp(shot.x0, shot.x1, lq), lerp(shot.y0, shot.y1, p), lerp(shot.z0, shot.z1, lq));
      camera.lookAt(0.15 + motion.pointer.x * 0.16, lerp(0.55, 0.82, p) + motion.pointer.y * 0.07, 0);

      const late = cine(p);
      setSun({
        x: lerp(-4.4, -6.5, late),
        y: lerp(9.8, 6.5, late),
        z: lerp(7.0, 5.0, late),
        color: colorLerp(0xfff7e8, 0xffddb0, late),
        intensity: lerp(2.95, 2.45, late),
        ambient: lerp(1.34, 1.14, late)
      });
      if (grade) {
        grade.style.background = 'rgba(210,164,93,.16)';
        grade.style.opacity = lerp(0.02, 0.24, late);
      }
    }

    renderer.render(scene, camera);
  }

  // Scene 2 (P03 平安) Atmosphere Hold
  if (current === 2) {
    const bw = document.querySelector('#bgWater');
    if (bw) {
      bw.style.opacity = 0.34;
      bw.style.transform = 'scale(1.06) translateY(10%)';
      bw.style.filter = 'saturate(.36) contrast(.90) brightness(1.08)';
    }
    if (shotinfo) shotinfo.textContent = 'STATIC HOLD · NO DOLLY · NO TILT';

    const e = Math.sin(p * Math.PI);
    const smoke = document.querySelector('#smoke');
    const redpaper = document.querySelector('#redpaper');

    if (smoke) {
      smoke.style.transform = `translate(${p * 16 + motion.pointer.x * 7}px, ${-p * 11 + motion.pointer.y * 3}px) scaleX(${1 + p * 0.07 + motion.pointer.speed * 0.03})`;
      smoke.style.opacity = 0.23 + 0.26 * e;
    }
    if (redpaper) {
      redpaper.style.transform = `rotate(${4 - p * 2}deg) translateY(${-p * 5}px)`;
    }
    if (grade) {
      grade.style.background = 'rgba(168,94,75,.08)';
      grade.style.opacity = 0.14 * e;
    }
  }

  // Scene 5 (P06 曾偉修) Reality Candidate Entrance & Rack Focus
  if (current === 5) {
    const base = document.querySelector('#bgWater');
    const person = document.querySelector('#person');
    const candidateCard = document.querySelector('#candidateCard');
    const veil = document.querySelector('#realityVeil');

    const reality = clamp(q / 0.24);
    const enter = clamp((q - 0.23) / 0.25);
    const focus = clamp((q - 0.56) / 0.31);
    const cardIn = clamp((q - 0.52) / 0.32);

    const scale = lerp(0.38, 0.98, focus);
    const personLeft = lerp(12, 14, focus);

    if (veil) {
      veil.style.opacity = lerp(0.82, 0, reality);
      veil.style.transform = `translateX(${lerp(0, -2.5, reality)}vw)`;
    }

    if (person) {
      person.style.opacity = enter;
      person.style.left = `${personLeft}vw`;
      person.style.transform = `translateY(${lerp(18, 0, enter)}px) scale(${scale})`;
      person.style.filter = `drop-shadow(0 20px 40px rgba(23,35,43,.14)) blur(${lerp(1.2, 0, focus).toFixed(2)}px)`;
    }

    if (candidateCard) {
      candidateCard.style.opacity = cardIn;
      candidateCard.style.transform = `translateY(${lerp(-45, -50, cardIn)}%)`;
    }

    if (base) {
      base.style.opacity = 1;
      base.style.filter = `saturate(${lerp(0.70, 0.82, reality)}) contrast(${lerp(0.95, 0.98, reality)}) brightness(${lerp(1.02, 1.0, reality)}) blur(${lerp(0, 2.0, focus).toFixed(2)}px)`;
      base.style.transform = `translate(${motion.pointer.x * -1.3 * (1 - focus)}px, ${motion.pointer.y * -0.8 * (1 - focus)}px) scale(${lerp(1.018, 1.055, focus)})`;
    }

    if (grade) {
      grade.style.background = 'rgba(210,164,93,.08)';
      grade.style.opacity = lerp(0.18, 0.06, reality);
    }

    if (shotinfo) {
      shotinfo.textContent = `F16–F18 · REALITY ${Math.round(reality * 100)}% · SUBJECT ${Math.round(lerp(12, 32, focus))}% · BG BLUR ${lerp(0, 2.0, focus).toFixed(1)}px`;
    }
  }

  requestAnimationFrame(tick);
}
