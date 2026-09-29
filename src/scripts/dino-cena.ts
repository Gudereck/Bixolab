// Cena 3D da pata de dinossauro (Three.js). Carregada sob demanda pelo componente Dino3D.
// Perna, dedos e garras são "tubos" de espessura variável ao longo de curvas.
// Parada, a pata mexe os dedos e inclina seguindo o ponteiro; no toque, dá uma pisada.
import * as THREE from 'three';

const CORES = {
  pele: '#a8834a',
  sola: '#8a6a3a',
  escama: '#bf9a5c',
  garra: '#2f2a24',
  contorno: '#141613',
  poeira: '#e8dcc0',
};

type Perfil = [number, number][];

/** Interpola suavemente um perfil [t, valor] (t de 0 a 1). */
function perfil(pontos: Perfil) {
  return (t: number) => {
    for (let i = 0; i < pontos.length - 1; i++) {
      const [t0, v0] = pontos[i];
      const [t1, v1] = pontos[i + 1];
      if (t <= t1) {
        const k = (t - t0) / (t1 - t0);
        const s = k * k * (3 - 2 * k);
        return v0 + (v1 - v0) * s;
      }
    }
    return pontos[pontos.length - 1][1];
  };
}

/**
 * Tubo com raio variável ao longo de uma curva, com as pontas fechadas.
 * `largura` achata a seção (1 = redonda, < 1 = mais estreita dos lados).
 */
function tubo(pontos: [number, number, number][], raio: (t: number) => number, largura = 1, seg = 64, radial = 24) {
  const curva = new THREE.CatmullRomCurve3(pontos.map((p) => new THREE.Vector3(...p)));
  const { normals, binormals } = curva.computeFrenetFrames(seg, false);
  const pos: number[] = [];
  const idx: number[] = [];

  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    const p = curva.getPointAt(t);
    const n = normals[i];
    const b = binormals[i];
    const r = Math.max(raio(t), 0.001);
    for (let j = 0; j < radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const c = Math.cos(a) * r;
      const s = Math.sin(a) * r * largura;
      pos.push(p.x + n.x * c + b.x * s, p.y + n.y * c + b.y * s, p.z + n.z * c + b.z * s);
    }
  }
  for (let i = 0; i < seg; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * radial + j;
      const b = i * radial + ((j + 1) % radial);
      const c = (i + 1) * radial + j;
      const d = (i + 1) * radial + ((j + 1) % radial);
      idx.push(a, b, c, b, d, c);
    }
  }
  // Tampas
  const inicio = curva.getPointAt(0);
  const fim = curva.getPointAt(1);
  const iIni = pos.length / 3;
  pos.push(inicio.x, inicio.y, inicio.z);
  const iFim = iIni + 1;
  pos.push(fim.x, fim.y, fim.z);
  for (let j = 0; j < radial; j++) {
    idx.push(iIni, (j + 1) % radial, j);
    idx.push(iFim, seg * radial + j, seg * radial + ((j + 1) % radial));
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

export function iniciarDino(root: HTMLElement, stage: HTMLButtonElement) {
  const reduzirMovimento = matchMedia('(prefers-reduced-motion: reduce)');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const ALVO_CAMERA = new THREE.Vector3(0.5, 0.9, 0);
  const CAMERA_Y = 5.2;
  camera.position.set(0, CAMERA_Y, 15);
  camera.lookAt(ALVO_CAMERA);

  const materiais = new Map<string, THREE.Material>();
  const mat = (cor: string) => {
    if (!materiais.has(cor)) {
      materiais.set(cor, new THREE.MeshStandardMaterial({ color: cor, roughness: 0.8, metalness: 0 }));
    }
    return materiais.get(cor)!;
  };
  const materialContorno = new THREE.MeshBasicMaterial({ color: CORES.contorno, side: THREE.BackSide });

  /** Contorno fino: cópia da malha "inflada" ao longo das normais, só com as faces de trás. */
  function inflar(geo: THREE.BufferGeometry, e: number) {
    const g = geo.clone();
    const p = g.getAttribute('position');
    const n = g.getAttribute('normal');
    for (let i = 0; i < p.count; i++) {
      p.setXYZ(i, p.getX(i) + n.getX(i) * e, p.getY(i) + n.getY(i) * e, p.getZ(i) + n.getZ(i) * e);
    }
    return g;
  }
  function peca(geo: THREE.BufferGeometry, cor: string, contorno = 0.035) {
    const mesh = new THREE.Mesh(geo, mat(cor));
    if (contorno > 0) mesh.add(new THREE.Mesh(inflar(geo, contorno), materialContorno));
    return mesh;
  }
  const esfera = (raio: number) => new THREE.SphereGeometry(raio, 32, 24);

  // ---------- Modelo: pata de três dedos (dedos apontando para +x, chão em y = 0) ----------
  const pata = new THREE.Group();

  // Perna: sai por cima do quadro, com o tornozelo mais grosso.
  pata.add(
    peca(
      tubo(
        [
          [-1.1, 9, 0],
          [-0.7, 4.5, 0],
          [-0.3, 2.1, 0],
          [0.05, 0.75, 0],
        ],
        perfil([
          [0, 0.95],
          [0.5, 0.7],
          [0.8, 0.62],
          [0.9, 0.72],
          [1, 0.55],
        ]),
        1,
        48,
        28,
      ),
      CORES.pele,
    ),
  );

  // Almofada do pé
  const almofada = peca(esfera(1), CORES.pele);
  almofada.scale.set(1.15, 0.62, 1.05);
  almofada.position.set(0.25, 0.62, 0);
  pata.add(almofada);

  /** Um dedo com juntas (engrossa nos nós) e garra curva escura na ponta. */
  function dedo(comprimento: number, grossura: number) {
    const g = new THREE.Group();
    const L = comprimento;
    g.add(
      peca(
        tubo(
          [
            [0, 0.62, 0],
            [L * 0.45, 0.52, 0],
            [L * 0.8, 0.4, 0],
            [L, 0.36, 0],
          ],
          perfil([
            [0, 0.5 * grossura],
            [0.3, 0.44 * grossura],
            [0.42, 0.48 * grossura],
            [0.6, 0.38 * grossura],
            [0.75, 0.41 * grossura],
            [1, 0.26 * grossura],
          ]),
          1.05,
          40,
          22,
        ),
        CORES.pele,
      ),
    );
    g.add(
      peca(
        tubo(
          [
            [L - 0.1, 0.42, 0],
            [L + 0.4, 0.46, 0],
            [L + 0.78, 0.26, 0],
            [L + 0.92, -0.02, 0],
          ],
          perfil([
            [0, 0.22 * grossura],
            [0.5, 0.14 * grossura],
            [1, 0.012],
          ]),
          0.7,
          32,
          16,
        ),
        CORES.garra,
        0.02,
      ),
    );
    return g;
  }

  // Três dedos para a frente, abertos em leque, e um pequeno atrás.
  const dedos: THREE.Group[] = [];
  for (const [angulo, comp, gross] of [
    [0.55, 1.9, 0.9],
    [0, 2.35, 1],
    [-0.55, 1.9, 0.9],
  ] as const) {
    const d = dedo(comp, gross);
    d.position.set(0.55, 0, 0);
    d.rotation.y = angulo;
    pata.add(d);
    dedos.push(d);
  }
  const traseiro = dedo(0.7, 0.55);
  traseiro.position.set(-0.3, 0.1, 0.35);
  traseiro.rotation.y = Math.PI - 0.5;
  pata.add(traseiro);

  pata.scale.setScalar(0.95);

  const pivo = new THREE.Group(); // pivô no chão, para a pisada.
  pivo.add(pata);
  const BASE_Y = -0.2;
  pivo.position.y = BASE_Y;
  scene.add(pivo);

  const materialSombra = new THREE.MeshBasicMaterial({ color: '#0b1f15', transparent: true, opacity: 0.4 });
  const sombra = new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), materialSombra);
  sombra.rotation.x = -Math.PI / 2;
  sombra.position.set(0.9, BASE_Y - 0.01, 0);
  sombra.scale.y = 0.55;
  scene.add(sombra);

  // Anel de poeira que se espalha na pisada.
  const materialPoeira = new THREE.MeshBasicMaterial({ color: CORES.poeira, transparent: true, opacity: 0, side: THREE.DoubleSide });
  const poeira = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 48), materialPoeira);
  poeira.rotation.x = -Math.PI / 2;
  poeira.position.set(0.9, BASE_Y + 0.02, 0);
  scene.add(poeira);

  scene.add(new THREE.HemisphereLight('#fff6e0', '#2a3b2e', 1.6));
  const sol = new THREE.DirectionalLight('#ffffff', 2.3);
  sol.position.set(5, 8, 7);
  scene.add(sol);
  const recorte = new THREE.DirectionalLight('#ffe7b0', 1.1);
  recorte.position.set(-5, 3, -4);
  scene.add(recorte);

  // ---------- Tamanho ----------
  const redimensionar = () => {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = camera.aspect < 0.9 ? (15 / camera.aspect) * 0.9 : 15;
    camera.updateProjectionMatrix();
    renderizar();
  };

  // ---------- Animação ----------
  const GIRO_BASE = -0.75; // dedos apontando para a câmera, de três quartos
  const alvo = { x: 0, y: 0 };
  const atual = { giro: GIRO_BASE, inclina: 0 };
  let pisada = -1; // progresso da pisada (0..1); -1 = parada
  let tempo = 0;
  let ultimo = performance.now();
  let rodando = false;
  let visivel = true;

  const renderizar = () => renderer.render(scene, camera);

  const suavizar = (a: number, b: number, dt: number, v: number) => a + (b - a) * (1 - Math.exp(-dt * v));
  const easeOut = (t: number) => 1 - (1 - t) ** 3;
  const easeIn = (t: number) => t * t * t;

  function quadro(agora: number) {
    if (!rodando) return;
    const dt = Math.min((agora - ultimo) / 1000, 1 / 20);
    ultimo = agora;
    tempo += dt;

    atual.giro = suavizar(atual.giro, GIRO_BASE + alvo.x * 0.35, dt, 4);
    atual.inclina = suavizar(atual.inclina, alvo.y * 0.06, dt, 4);

    // Dedos "tamborilando" devagar, um de cada vez.
    let curvaDedos = 0;
    dedos.forEach((d, i) => {
      d.rotation.z = Math.max(0, Math.sin(tempo * 2.2 - i * 0.9)) * 0.07;
    });

    let altura = 0;
    let achata = 0;
    let tremor = 0;
    let anel = -1;

    if (pisada >= 0) {
      pisada += dt / 1.1;
      const p = Math.min(pisada, 1);
      if (p < 0.4) {
        altura = easeOut(p / 0.4) * 1.6; // levanta devagar
        curvaDedos = easeOut(p / 0.4) * 0.3; // dedos se erguem
      } else if (p < 0.52) {
        const k = (p - 0.4) / 0.12;
        altura = (1 - easeIn(k)) * 1.6; // desce com força
        curvaDedos = (1 - k) * 0.3;
      } else {
        const k = (p - 0.52) / 0.48;
        achata = Math.sin(Math.min(k * 3, 1) * Math.PI) * 0.1; // impacto
        tremor = (1 - k) ** 2;
        anel = k;
      }
      if (pisada >= 1) pisada = -1;
    }

    for (const d of dedos) d.rotation.z += curvaDedos;

    pivo.position.y = BASE_Y + altura;
    pivo.rotation.set(atual.inclina, atual.giro, 0);
    pivo.scale.set(1 + achata * 0.5, 1 - achata, 1 + achata * 0.5);

    const s = 1 - Math.min(altura, 1.6) * 0.25;
    sombra.scale.set(s, s * 0.55, s);
    materialSombra.opacity = 0.4 * s;

    if (anel >= 0) {
      const r = 1.6 + easeOut(anel) * 2.4;
      poeira.scale.set(r, r, r);
      materialPoeira.opacity = 0.55 * (1 - anel);
    } else {
      materialPoeira.opacity = 0;
    }

    // Tremida da câmera no impacto
    camera.position.x = Math.sin(tempo * 90) * 0.12 * tremor;
    camera.position.y = CAMERA_Y + Math.cos(tempo * 110) * 0.1 * tremor;
    camera.lookAt(ALVO_CAMERA);

    renderizar();
    requestAnimationFrame(quadro);
  }

  const iniciarLoop = () => {
    if (rodando || reduzirMovimento.matches || !visivel || document.hidden) return;
    rodando = true;
    ultimo = performance.now();
    requestAnimationFrame(quadro);
  };
  const pararLoop = () => {
    rodando = false;
  };

  const poseEstatica = () => {
    pivo.position.y = BASE_Y;
    pivo.rotation.set(0, GIRO_BASE, 0);
    pivo.scale.setScalar(1);
    dedos.forEach((d) => (d.rotation.z = 0));
    renderizar();
  };

  // ---------- Eventos ----------
  window.addEventListener(
    'pointermove',
    (e) => {
      alvo.x = (e.clientX / window.innerWidth) * 2 - 1;
      alvo.y = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true },
  );

  stage.addEventListener('click', () => {
    if (reduzirMovimento.matches) return;
    if (pisada < 0) pisada = 0;
    iniciarLoop();
  });

  new IntersectionObserver(([entry]) => {
    visivel = entry.isIntersecting;
    visivel ? iniciarLoop() : pararLoop();
  }).observe(root);

  document.addEventListener('visibilitychange', () => (document.hidden ? pararLoop() : iniciarLoop()));

  reduzirMovimento.addEventListener('change', () => {
    if (reduzirMovimento.matches) {
      pararLoop();
      poseEstatica();
    } else {
      iniciarLoop();
    }
  });

  new ResizeObserver(redimensionar).observe(stage);
  stage.hidden = false;
  redimensionar();
  poseEstatica();
  root.classList.add('is-ready');
  iniciarLoop();
}
