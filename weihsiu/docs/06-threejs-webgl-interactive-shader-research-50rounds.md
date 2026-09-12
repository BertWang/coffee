# 模組六：Three.js、WebGL 互動著色器與 2026 數位藝術視覺深度調研（第 1～50 輪）

> **專案代號**：XIU  
> **研究範圍**：Three.js、WebGL 2.0 / WebGPU、GLSL 互動著色器（Interactive Shaders）、ThreeUI 開源元件庫、Awwwards 2026 年度前沿 3D 滾動敘事、粒子幾何力學與行動端效能極限工程  
> **核心定位**：為全新版本 `index2.html` 提供完整的 3D 視覺美學理論、數學演算、著色器代碼與工程架構支撐，以「龍子藍 × 行動黃」專屬品牌識別，建立全球頂級網頁數位藝術標竿。

---

## 目錄導覽

- [第一階段：底層渲染管線與數學著色器引擎（第 01～10 輪）](#第一階段底層渲染管線與數學著色器引擎第-0110-輪)
- [第二階段：高效能粒子系統與公民網絡力學（第 11～20 輪）](#第二階段高效能粒子系統與公民網絡力學第-1120-輪)
- [第三階段：人機互動、物理游標與射線檢測（第 21～30 輪）](#第三階段人機互動物理游標與射線檢測第-2130-輪)
- [第四階段：Awwwards 級滾動敘事與鏡頭電影語言（第 31～40 輪）](#第四階段awwwards-級滾動敘事與鏡頭電影語言第-3140-輪)
- [第五階段：效能治理、行動優化與 2026 數位藝術治理實踐（第 41～50 輪）](#第五階段效能治理行動優化與-2026-數位藝術治理實踐第-4150-輪)

---

## 第一階段：底層渲染管線與數學著色器引擎（第 01～10 輪）

### 第 01 輪：WebGL 2.0 / WebGPU 渲染管線與 Three.js 核心架構解析
- **底層管線原理**：從 CPU 傳遞頂點資料（Attributes）與全域參數（Uniforms）至 GPU。經過頂點著色器（Vertex Shader）完成座標空間變換（Model Space $\to$ World Space $\to$ View Space $\to$ Clip Space $\to$ NDC），再經過光柵化（Rasterization），最後由片段著色器（Fragment Shader）逐像素計算色值並輸出至訊框緩衝區（Framebuffer）。
- **Three.js 核心對映**：
  - `THREE.BufferGeometry`：直接封裝 TypedArray（Float32Array），減少 V8 垃圾回收壓力。
  - `THREE.ShaderMaterial`：完全接管頂點與片段著色器，繞過內建固定材質計算，獲得最高渲染自由度與性能優化空間。
- **2026 視角應用**：在 `index2.html` 中採用單一全螢幕 WebGL Canvas 作為背板，將 DOM 元素置於前景，以零額外 Draw Call 的方式承載極致 3D 視覺。

### 第 02 輪：GLSL 著色器數學基礎（SDF 符號距離場與三角干涉波）
- **SDF（Signed Distance Function）數學**：
  計算點 $p$ 到幾何形狀邊界的有向距離。以圓形為例：
  ```glsl
  float sdCircle(vec2 p, float r) {
      return length(p) - r;
  }
  ```
- **平滑階躍函數 `smoothstep`**：
  利用 Hermite 插值消除邊緣鋸齒（Antialiasing）：
  ```glsl
  float alpha = smoothstep(0.01, 0.0, sdCircle(uv, 0.45));
  ```
- **波形干涉方程式**：
  多重正弦與餘弦波疊加，模擬水波與光流交錯：
  $$W(x, y, t) = \sin(k_1 x + \omega_1 t) \cdot \cos(k_2 y + \omega_2 t) + \sin(\sqrt{x^2 + y^2} \cdot k_3 - \omega_3 t)$$

### 第 03 輪：古典 Perlin Noise 與 Simplex Noise 的 GLSL 著色器演算法
- **Value Noise vs. Gradient Noise**：
  Value Noise 在網格頂點插值容易產生塊狀 artifacts；Perlin Noise 在網格頂點計算隨機梯度向量，透過五次多項式 $6t^5 - 15t^4 + 10t^3$ 達到 $C^2$ 連續性。
- **Simplex Noise 優勢**：
  在二維空間使用三角形網格（二維單純形）取代正方形網格，計算複雜度從 $O(2^n)$ 降為 $O(n^2)$，在行動裝置上顯著降低 GPU ALU 運算負荷。
- **GLSL Simplex 2D 精簡核**：
  ```glsl
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
  }
  ```

### 第 04 輪：FBM（Fractional Brownian Motion 分形布朗運動）流體數學
- **數學定義**：
  透過疊加不同頻率（Frequency）與振幅（Amplitude）的倍頻程（Octaves）：
  $$fbm(p) = \sum_{i=0}^{N-1} A \cdot \gamma^i \cdot noise(p \cdot \lambda^i)$$
  其中度規通常取 Lacunarity $\lambda = 2.0$，Gain $\gamma = 0.5$。
- **Domain Warping（域扭曲 / 流動塑形）**：
  以噪波作為噪波自身的取樣座標偏移量：
  $$q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)))$$
  $$r = vec2(fbm(p + 4.0 \cdot q + vec2(1.7, 9.2)), fbm(p + 4.0 \cdot q + vec2(8.3, 2.8)))$$
  $$color = fbm(p + 4.0 \cdot r)$$
- **視覺效果**：產生如同絲綢、極光、液態深海般的有機起伏，極具高級感與生命力。

### 第 05 輪：ThreeUI 開源元件庫架構解構（Liquid Metal 與 Aurora Mesh）
- **ThreeUI 設計範式**：
  - 將 Shader 參數解耦為 Uniforms：`u_time`, `u_resolution`, `u_mouse`, `u_color_primary`, `u_color_accent`。
  - 使用封裝良好的 Canvas 生命週期，自動監聽 Resize 與 Visibility 變化。
- **在「龍子藍 × 行動黃」中的著色映射**：
  - 底色（Base）：午夜深藍 `vec3(0.027, 0.075, 0.141)` (`#071324`)。
  - 核心色（Primary）：海軍深藍 `vec3(0.082, 0.200, 0.376)` (`#153360`)。
  - 能量峰值（Highlight）：行動金光 `vec3(0.949, 0.788, 0.298)` (`#F2C94C`)。
  - 自然微光（Accent）：翡翠生活綠 `vec3(0.243, 0.541, 0.306)` (`#3E8A4E`)。

### 第 06 輪：頂點置換著色器（Vertex Displacement Shader）
- **幾何形變原理**：
  在 Vertex Shader 中根據空間位置與時間改變頂點位置：
  ```glsl
  uniform float u_time;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
      vUv = uv;
      vec3 pos = position;
      float elevation = sin(pos.x * 2.0 + u_time * 0.8) * cos(pos.y * 2.0 + u_time * 0.8) * 0.15;
      elevation += snoise(pos.xy * 1.5 + u_time * 0.2) * 0.1;
      pos.z += elevation;
      vElevation = elevation;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  ```
- **好處**：真實改變 3D 幾何深度，使物件隨光影轉動時產生無可挑剔的立體起伏。

### 第 07 輪：色散（Chromatic Aberration）與微稜鏡折射原理
- **光學原理解析**：不同波長的光在介質中的折射率不同（柯西色散公式 $n(\lambda) = A + \frac{B}{\lambda^2}$），導致紅、綠、藍色通道在邊緣分離。
- **GLSL 片段採樣分離**：
  ```glsl
  vec2 offset = (vUv - 0.5) * u_distortion_intensity;
  float r = texture2D(u_texture, vUv + offset * 1.02).r;
  float g = texture2D(u_texture, vUv).g;
  float b = texture2D(u_texture, vUv - offset * 1.02).b;
  gl_FragColor = vec4(r, g, b, 1.0);
  ```
- **意象象徵**：在科技與都會感網頁中，細微的色散為數位介面帶來物理鏡頭的光學質感。

### 第 08 輪：法線向量動態重新計算（Finite Difference 擾動法）
- **問題**：頂點經過置換後，原有的法線（Normal）失效，會導致光照計算錯誤。
- **有限差分法（Finite Difference）解法**：
  在頂點著色器中取微小步長 $\epsilon$，計算相鄰點的高度差以求出切線向量（Tangent）與副切線（Bitangent），再叉乘獲得精確法線：
  $$\vec{T} = \frac{\partial \vec{P}}{\partial u}, \quad \vec{B} = \frac{\partial \vec{P}}{\partial v}, \quad \vec{N} = normalize(\vec{T} \times \vec{B})$$

### 第 09 輪：HDR 環境光照與 PBR 材質（Physically Based Rendering）
- **Cook-Torrance 微表面 BRDF 模型**：
  $$f_r(v, l) = \frac{D(h) \cdot F(v, h) \cdot G(v, l, h)}{4(\vec{n} \cdot \vec{v})(\vec{n} \cdot \vec{l})}$$
  - $D(h)$：GGX 法線分佈函數（微表面粗糙度）。
  - $F(v, h)$：Schlick 近似菲涅爾方程（掠射角高反光）。
  - $G(v, l, h)$：Smith 幾何遮擋陰影函數。
- **應用場景**：首頁「3D 印章金屬徽章」採用高粗糙度金屬（Metalness: 0.85, Roughness: 0.25），反射出溫潤而奢華的金箔質感。

### 第 10 輪：ShaderMaterial vs. onBeforeCompile 注入
- **比較分析**：
  - `ShaderMaterial`：完全自主，但若需要 Three.js 內建的級聯陰影（CSM）、霧化與複雜點光源，必須手寫大量標準代碼。
  - `material.onBeforeCompile`：在標準 PBR 材質的編譯字串中做正則替換（Replace），以最小代價注入客製噪波置換，同時保留所有環境光與陰影計算。
- **決策**：背景流體特效採用純淨的高性能 `ShaderMaterial`；前景 3D 金印採用帶環境反射貼圖的 PBR 材質。

---

## 第二階段：高效能粒子系統與公民網絡力學（第 11～20 輪）

### 第 11 輪：`THREE.Points` 點雲系統與 GPU Instancing 實例化
- **渲染成本對比**：
  - 1,545 個獨立 `THREE.Mesh`：產生 1,545 次 Draw Calls，行動端必卡頓。
  - `THREE.Points`：以單一幾何體、單一 Draw Call 渲染數萬顆粒子。頂點著色器透過 `gl_PointSize` 設定視距衰減大小。
- **頂點屬性封裝**：
  ```javascript
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
  ```

### 第 12 輪：1,545 顆信任星塵粒子空間拓撲分佈
- **斐波那契球面網格（Fibonacci Sphere Lattice）**：
  以黃金比例 $\phi = \frac{1 + \sqrt{5}}{2}$ 計算分佈，保證粒子在三維空間中絕對均勻無聚集：
  $$y_i = 1 - \frac{2i}{N - 1}, \quad r_i = \sqrt{1 - y_i^2}, \quad \theta_i = 2\pi \cdot \phi \cdot i$$
  $$x_i = r_i \cdot \cos(\theta_i), \quad z_i = r_i \cdot \sin(\theta_i)$$
- **公民象徵語意**：1,545 顆粒子每顆皆為獨立幾何節點，代表四年前 1,545 份託付的選票，在空間中形成保護龍子里的圓融守護場。

### 第 13 輪：動態線段幾何網絡（Proximity Meshing / Constellation）演算法
- **動態晶瑩光絲連接原理**：
  當任意兩粒子間距 $d < D_{max}$ 時，在頂點緩衝區動態寫入線段頂點與漸變透明度。
- **雙緩衝區更新**：
  使用動態頂點屬性 `lineGeometry.setDrawRange(0, lineCount * 2)`，只在 GPU 繪製實際觸發的有效連線。

### 第 14 輪：空間劃分資料結構（Spatial Hashing）加速
- **複雜度瓶頸**：$N$ 個粒子的兩兩距離計算複雜度為 $O(N^2)$。若 $N = 1545$，$N^2 \approx 2.38 \times 10^6$，在每秒 60 幀運算下會導致 CPU 掉幀。
- **空間哈希網格（Spatial Hash Grid）優化**：
  將 3D 空間劃分為大小為 $D_{max}$ 的虛擬立體網格。每個粒子只與自身及相鄰 26 個網格內的粒子進行距離比對，計算量降至接近 $O(N)$。

### 第 15 輪：Point Texture 著色器遮罩與動態閃爍（Twinkle）
- **圓形柔焦著色遮罩**：
  在 Fragment Shader 中以徑向距離計算衰減，免去載入外部 PNG 圖檔的額外請求：
  ```glsl
  void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float alpha = clamp(1.0 - (dist * 2.0), 0.0, 1.0);
      alpha = pow(alpha, 1.8);
      gl_FragColor = vec4(vColor, alpha * vOpacity);
  }
  ```

### 第 16 輪：Curl Noise 向量場引導的有機流向
- **無散度（Divergence-free）特性**：
  速度場的散度 $\nabla \cdot \vec{v} = 0$，意味著粒子運動不產生源（Source）或匯（Sink），流動如同不可壓縮流體般平滑柔順。
- **Curl 計算公式**：
  $$\vec{v} = \nabla \times \vec{\Psi} = \left( \frac{\partial \Psi_z}{\partial y} - \frac{\partial \Psi_y}{\partial z}, \frac{\partial \Psi_x}{\partial z} - \frac{\partial \Psi_z}{\partial x}, \frac{\partial \Psi_y}{\partial x} - \frac{\partial \Psi_x}{\partial y} \right)$$

### 第 17 輪：GPU 粒子運算（GPGPU / FBO Ping-Pong）邊界評估
- **技術評估**：
  GPGPU 透過浮點紋理（Float Texture）在 GPU 片段著色器更新數十萬顆粒子座標。
- **選型決策**：
  本專案定位為 1,545 顆象徵性高質感粒子。使用 CPU Spatial Hashing + GPU Instancing 即可在 60 FPS 順暢執行，且相容於 100% 的行動裝置與舊版瀏覽器，避免 GPGPU 在部分 iOS 裝置上的 WebGL 擴展限制（如 `OES_texture_float`）。

### 第 18 輪：粒子深度衰減與相機近剪裁面軟粒子（Soft Particles）
- **相機穿幫防護**：
  當粒子靠近相機近剪裁面（Near Plane）時，粒子突然消失會產生視覺刺眼感。
- **距離過渡透明度**：
  在頂點著色器中計算與相機的距離 $d$，當 $d < d_{near}$ 時將透明度平滑衰減為 0。

### 第 19 輪：色彩插值學（龍子深藍 $\to$ 曜金光暈 $\to$ 翡翠光斑）
- **三段式波長插值**：
  在粒子著色器中，以粒子的動能速度 $v$ 作為色彩漸變因子：
  - 低速時（靜態沉潛）：呈現深邃靜謐的龍子藍 `vec3(0.08, 0.20, 0.38)`。
  - 中速時（流轉守護）：微透出自然生態翡翠綠 `vec3(0.24, 0.54, 0.31)`。
  - 高速或游標激發時（承諾行動）：瞬間綻放高飽和行動曜金 `vec3(0.95, 0.79, 0.30)`。

### 第 20 輪：粒子生命週期狀態機（Birth, Orbit, Disturbance, Re-gather）
- **四態閉環力學模型**：
  1. `Orbit`（常態繞行）：繞空間引力中心做輕緩的角速度旋轉。
  2. `Disturbance`（游標推擠）：滑鼠掠過時施加徑向排斥衝量 $\vec{F}_{repel} = \frac{k}{r^2} \cdot \hat{r}$。
  3. `Re-gather`（回歸凝聚）：以彈簧係數 $k_{spring}$ 與阻尼 $c$ 將粒子拉回原生軌道。
  4. `Rest`（穩定守護）：呼吸頻率與背景波浪達成諧振共鳴。

---

## 第三階段：人機互動、物理游標與射線檢測（第 21～30 輪）

### 第 21 輪：Raycaster 光線投射與 NDC 座標逆變換
- **標準設備座標（NDC）轉換公式**：
  $$x_{ndc} = \frac{x_{clientX}}{width} \cdot 2 - 1, \quad y_{ndc} = -\left( \frac{y_{clientY}}{height} \cdot 2 - 1 \right)$$
- **射線碰撞檢測**：
  相機從視點發出射線 $\vec{R}(t) = \vec{O} + t \cdot \vec{D}$，在三維空間中與 3D 物件的 Bounding Box 或幾何多邊形進行相交測試。

### 第 22 輪：彈簧阻尼物理系統（LERP 慣性平滑演算法）
- **線性插值（LERP）公式**：
  $$x_{current} = x_{current} + (x_{target} - x_{current}) \cdot factor$$
- **FPS 無關阻尼（Frame-rate Independent Damping）**：
  若幀率波動，固定 $factor$ 會導致慢速卡頓。採用指數衰減公式：
  $$factor = 1.0 - \exp(-\lambda \cdot \Delta t)$$
  確保不論在 60Hz、120Hz（ProMotion）或 30Hz 螢幕上，滑鼠懸浮與 3D 鏡頭跟隨的慣性滑動手感完全一致。

### 第 23 輪：游標流體擾動場（Cursor Fluid Ripple）
- **二維速度轉譯**：
  計算滑鼠位移差 $\vec{V} = \frac{\Delta \vec{P}}{\Delta t}$，將速度大小傳遞給 Shader Uniform `u_mouse_velocity`。
- **著色器漣漪交互**：
  在 Fragment Shader 中以游標座標為震源，生成向外擴散的同心環形位移衰減波。

### 第 24 輪：3D 立體印章徽章建模（幾何法線與金屬反光）
- **程序化幾何建構**：
  採用 `THREE.CylinderGeometry` 或 `THREE.ExtrudeGeometry` 建構具備微圓角倒角（Chamfer / Bevel）的實體印章。
- **倒角光學價值**：
  無倒角的 3D 模型在邊緣不會產生高光切線（Specular Highlight）。加入 0.05 倒角後，環境光掠過印章邊緣會閃爍出如珠寶般的精緻光芒。

### 第 25 輪：滑鼠懸浮 3D 傾斜視差（Gyroscopic Tilt Parallax）
- **視錐體角度限制**：
  將滑鼠在畫面中的偏移量歸一化至 $[-1, 1]$，驅動 3D 印章與攝影機角度微旋轉：
  $$\theta_y = normalizedX \cdot 15^\circ, \quad \theta_x = -normalizedY \cdot 15^\circ$$
- **視覺心理學**：創造出「螢幕彷彿是一塊具備深度的微型櫥窗」的立體透視感。

### 第 26 輪：行動裝置陀螺儀（DeviceOrientation API）重力聯動
- **API 權限與捕獲**：
  在 iOS 13+ 上主動申請權限 `DeviceOrientationEvent.requestPermission()`，讀取 $\beta$（俯仰角 Pitch）與 $\gamma$（橫滾角 Roll）。
- **觸發交互**：使用者傾斜手機時，3D 場景內的金色微光與金印徽章隨重力自然偏轉，呈現如實體金屬銘牌般的反光體驗。

### 第 27 輪：觸控手勢（Touch Events）防誤觸與穿透調度
- **穿透難題**：若全螢幕 WebGL Canvas 攔截了 `touchstart` / `touchmove`，會導致使用者無法正常滑動網頁。
- **優雅解法**：
  1. Canvas 設定 `pointer-events: none;`。
  2. 在全域 `window` 監聽被動觸控事件 `{ passive: true }`，僅讀取觸控座標傳給 Shader，絕不呼叫 `preventDefault()`。
  3. 保證原生 HTML 滾動行雲流水，3D 特效在背景同時靈敏反應。

### 第 28 輪：HTML DOM 與 WebGL 深度層疊與擊穿機制
- **CSS 視差層級規範**：
  - WebGL Canvas：`position: fixed; inset: 0; z-index: 0; pointer-events: none;`
  - 磨砂玻璃背景卡片：`position: relative; z-index: 1; backdrop-filter: blur(12px);`
  - 文字與互動按鈕：`position: relative; z-index: 2; pointer-events: auto;`
- **完美共生**：文字始終清晰可複製、按鈕始終靈敏可點擊，3D 動態光流在卡片空隙與邊緣流動透出。

### 第 29 輪：3D 物件微回饋（Micro-Interactions & Spatial Reaction）
- **互動反饋循環**：
  當滑鼠滑過特定重點區塊（例如「六大行動」卡片）時，向 3D 場景發送廣播事件，使背景對應區域的金色流光瞬間加速凝聚，創造「介面聽得懂使用者游標」的靈動感知。

### 第 30 輪：速度感知動態形變（Velocity-based Motion Stretch）
- **動態延伸（Squash & Stretch）**：
  依據滑鼠移動速度向量，將 3D 徽章或粒子在移動方向輕微拉長（1.05x）、在垂直方向輕微壓縮（0.95x），帶來迪士尼動畫十二法則中的彈性生動手感。

---

## 第四階段：Awwwards 級滾動敘事與鏡頭電影語言（第 31～40 輪）

### 第 31 輪：Awwwards 2026 年度獲獎網站滾動敘事架構拆解
- **獲獎作品共通架構**：
  - **Single Page Continuous Spatial Narrative**：頁面不是突兀切換，而是相機在統一的三維宇宙中穿梭旅行。
  - **Scroll as Timeline**：網頁滾動進度不是單純的像素位移，而是驅動 3D 空間動畫與著色器時間變數的控制軸。
  - **Content Anchored**：所有 3D 運動最終服務於內容閱讀，絕不喧賓奪主阻礙資訊傳遞。

### 第 32 輪：虛擬相機三維樣條軌道（Catmull-Rom Spline）
- **鏡頭運動軌跡數學**：
  定義空間關鍵幀控制點 $P_0, P_1, P_2, P_3$，相機位置隨總體滾動百分比 $T \in [0, 1]$ 沿樣條平滑滑行：
  $$\vec{C}(T) = CatmullRom(P_0, P_1, \dots, P_k, T)$$
  相機朝向目標點（LookAt）亦沿第二條樣條平滑插值，實現如電影運鏡般的環繞與推軌。

### 第 33 輪：景深效果（Depth of Field - Bokeh）與視覺注意力引導
- **焦距物理模擬**：
  前景文字卡片處於焦點平面（Focal Plane），背景 3D 深處的粒子產生柔和的散景光斑（Bokeh Discs）。
- **心理學效應**：將選民的視覺焦點無形中錨定在核心政見與行動承諾上，背景 3D 作為氛圍托底。

### 第 34 輪：動態 Bloom 輝光（UnrealBloomPass）發光閾值調校
- **避免光污染**：
  設定 Bloom 閾值 `threshold = 0.75`，只有金色高光頂點（`luminance > 0.75`）才產生柔光溢出（Glow Bleed），保持深藍基底的純淨與沉穩，展現低調奢華的官網格調。

### 第 35 輪：章節過渡著色器（Noise Dissolve & Wipe）
- **幾何溶融轉場**：
  從首頁過渡至「地方故事」時，著色器透過噪波門檻值進行溶解過渡，避免生硬的硬切，讓章節切換如水墨散開般自然。

### 第 36 輪：原生滾動與 3D 緩動雙軌互鎖（Scroll Interop）
- **非侵入式滾動監聽**：
  絕不綁架或覆蓋瀏覽器的原生捲軸（避免 Accessibility 與使用者體驗災難）。
  採用 `window.requestAnimationFrame` 取樣 `window.scrollY`，透過 LERP 阻尼在 3D 渲染器內部實現平滑跟隨。

### 第 37 輪：各章節情緒氛圍色調自適應矩陣
- **章節色調動態流變**：
  - 【Hero 首頁】：深邃龍子藍 + 曜金微光（穩健信任、大器開場）。
  - 【認識偉修】：海軍藍 + 香檳銀白（真誠生平、人生厚度）。
  - 【地方生活圈】：深藍底 + 翡翠翠綠光暈（農16公園森林、雙軌生態）。
  - 【六大行動】：高對比金色能量匯聚（務實行動力、執行效率）。
  - 【聯絡窗口】：溫暖曜金 + LINE 品牌純綠（即時溫度、無摩擦溝通）。

### 第 38 輪：3D 場景與 HTML 雜誌排版的視覺引導線（Leading Lines）
- **幾何佈局對位**：
  3D 背景光流的波峰與粒子旋向，精確指向左側大標題與右側重點按鈕，形成潛意識的視覺閱讀動線指引。

### 第 39 輪：空間指數霧（FogExp2）深度營造
- **霧化公式**：
  $$f = e^{-(\text{density} \cdot d)^2}$$
  在遠端邊界融入背景底色 `#071324`，使 3D 粒子與光波自然隱沒在無窮遠處，消除硬截斷邊界。

### 第 40 輪：微縮城市節點矩陣（3D Wireframe Metro Matrix）
- **農16雙軌意象視覺化**：
  以極細的發光幾何線條勾勒出凹子底站、輕軌龍華國小站與愛河之心的拓撲幾何網絡，展現現代智慧城市的科技未來感。

---

## 第五階段：效能治理、行動優化與 2026 數位藝術治理實踐（第 41～50 輪）

### 第 41 輪：Draw Call 極限壓制與幾何合併
- **批次繪製（Batching）**：
  所有裝飾性微型網格使用 `BufferGeometryUtils.mergeBufferGeometries` 合併為單一幾何體，全站 3D 背景總 Draw Call 控制在 **3 次以內**（背景 Mesh 1 次、粒子系統 1 次、動態連線 1 次），CPU 負擔幾乎趨近於零。

### 第 42 輪：記憶體管理與 WebGL Context 洩漏全面免疫
- **Dispose 規範三步驟**：
  ```javascript
  function cleanupThree(scene, renderer) {
      scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
              if (Array.isArray(object.material)) {
                  object.material.forEach(mat => mat.dispose());
              } else {
                  object.material.dispose();
              }
          }
      });
      renderer.dispose();
      renderer.forceContextLoss();
  }
  ```
- 保證長時間開著網頁或分頁切換時，記憶體佔用穩定不增長。

### 第 43 輪：GPU Overdraw 與早期深度測試（Early-Z）優化
- **不透明優先渲染**：
  將透明物體嚴格排序，背景平面開啟深度寫入（`depthWrite: true`），避免多層透明半透明混合導致的 GPU 像素填充率（Fillrate）瓶頸。

### 第 44 輪：動態 DPR（Device Pixel Ratio）智慧封頂
- **高分屏效能陷阱**：
  iPhone 或高階 Android 手機的 `devicePixelRatio` 常達到 3 或 4。若以 3x 渲染全螢幕，像素點高達 $1290 \times 2796 \approx 360$ 萬，會導致手機發熱耗電。
- **2026 智慧平衡公式**：
  ```javascript
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(pixelRatio);
  ```
  在保證肉眼極致細膩的前提下，減少 55% 的 GPU 著色運算。

### 第 45 輪：省電模式與後台自動凍結（Page Visibility API）
- **分頁隱藏自動暫停**：
  ```javascript
  document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
          cancelAnimationFrame(animationFrameId);
      } else {
          lastTime = performance.now();
          animate();
      }
  });
  ```
  當使用者切換至其他分頁或將瀏覽器最小化時，立即停止渲染循環，**零耗電、零發熱**。

### 第 46 輪：無障礙自適應（`prefers-reduced-motion`）
- **身心友善規範**：
  監聽系統動效偏好：
  ```javascript
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) {
      // 停止動態波浪計算，固定於優美靜態第一幀
      u_speed = 0.0;
  }
  ```

### 第 47 輪：WebGL 支援度偵測與優雅降級回退系統
- **漸進增強（Progressive Enhancement）**：
  在初始化時檢測 `window.WebGLRenderingContext`。若使用者瀏覽器關閉硬體加速或 WebGL 崩潰，自動將 Canvas 替換為 CSS 高階多層漸層動畫（`linear-gradient`），**網站內容與功能 100% 正常運作，絕不白屏**。

### 第 48 輪：CDN 模組化極速載入策略（首屏 LCP 零阻塞）
- **非同步非阻塞注入**：
  將 Three.js 腳本放置於 `</body>` 閉合前，或使用 `defer` 載入。
- **LCP（Largest Contentful Paint）優先**：
  優先載入 HTML 文字與 Hero 關鍵圖，Three.js 在瀏覽器空閒時（`requestIdleCallback`）背景初始化，確保 Google Lighthouse 效能評分維持 90+ 綠標。

### 第 49 輪：雙版本安全隔離架構（`index.html` vs. `index2.html`）
- **零風險雙軌制**：
  - **`index.html`**：現有正式版，完全凍結、原封不動，供日常穩健瀏覽與正式宣傳。
  - **`index2.html`**：2026 Three.js 視覺藝術旗艦版，融入 50 輪調研的所有著色器與互動精髓，供科技、年輕族群與高階社群傳播。

### 第 50 輪：2026 數位公民空戰總結——以頂尖美學樹立不可超越的候選人標竿
- **結論與戰略意義**：
  2026 年的高雄鼓山龍子里，是北高雄最現代化、最有品味、房價與居民素質最高的核心生活圈。
  透過 Three.js 與互動著色器打造的 `index2.html`，不是單純炫技，而是**直接以國際一線科技與視覺藝術標準，向所有龍子里居民證明：曾偉修具備引領龍子里走向下一個現代化十年的眼光、專業與執行力！**
