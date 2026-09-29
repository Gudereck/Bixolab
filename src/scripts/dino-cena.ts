// Cena 3D do tricerátops (Three.js). Carregada sob demanda pelo componente Dino3D.
// Corpo, rabo, patas e chifres são "tubos" de espessura variável ao longo de
// curvas, o que dá a silhueta de um tricerátops de verdade: quadril alto,
// rabo grosso afinando, patas robustas, cabeça grande com gola e chifres longos.
import * as THREE from 'three';

const CORES = {
  corpo: '#a8834a',
  gola: '#c9a063',
  borda: '#e8dcc0',
  chifre: '#efe6cf',
  bico: '#3a3128',
  olho: '#141613',
  contorno: '#141613',
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
  camera.position.set(0, 1.4, 14);
  camera.lookAt(0, 0.1, 0);

  const materiais = new Map<string, THREE.Material>();
  const mat = (cor: string) => {
    if (!materiais.has(cor)) {
      materiais.set(cor, new THREE.MeshStandardMaterial({ color: cor, roughness: 0.78, metalness: 0 }));
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
  function peca(geo: THREE.BufferGeometry, cor: string, contorno = 0.03) {
    const mesh = new THREE.Mesh(geo, mat(cor));
    if (contorno > 0) mesh.add(new THREE.Mesh(inflar(geo, contorno), materialContorno));
    return mesh;
  }
  const esfera = (raio: number) => new THREE.SphereGeometry(raio, 32, 24);

  // ---------- Modelo (olhando para +x, patas em y = 0) ----------
  const tri = new THREE.Group();

  // Tronco: quadril mais alto que os ombros, como no animal real.
  const corpo = peca(
    tubo(
      [
        [-1.9, 2.15, 0],
        [-0.9, 2.45, 0],
        [0.2, 2.3, 0],
        [1.2, 1.98, 0],
        [1.95, 1.78, 0],
      ],
      perfil([
        [0, 0.7],
        [0.3, 1.02],
        [0.55, 1.06],
        [0.82, 0.86],
        [1, 0.58],
      ]),
      1.08,
    ),
    CORES.corpo,
  );
  tri.add(corpo);

  // Rabo (grupo com pivô na base, para balançar)
  const rabo = new THREE.Group();
  rabo.position.set(-1.6, 2.2, 0);
  rabo.add(
    peca(
      tubo(
        [
          [0.3, 0.05, 0],
          [-0.9, -0.2, 0],
          [-2.0, -0.62, 0],
          [-2.9, -0.82, 0],
          [-3.4, -0.72, 0],
        ],
        perfil([
          [0, 0.74],
          [0.35, 0.44],
          [0.75, 0.16],
          [1, 0.03],
        ]),
        0.92,
      ),
      CORES.corpo,
    ),
  );
  tri.add(rabo);

  // Patas: coxa grossa, joelho, tornozelo, pé com três garras.
  function pata(pts: [number, number, number][], raio: Perfil, pe: [number, number, number], tamPe: number) {
    const g = new THREE.Group();
    g.add(peca(tubo(pts, perfil(raio), 1, 32, 20), CORES.corpo));
    const pe3 = peca(esfera(1), CORES.corpo, 0.025);
    pe3.scale.set(0.4 * tamPe, 0.17, 0.33 * tamPe);
    pe3.position.set(...pe);
    g.add(pe3);
    for (const dz of [-0.17, 0, 0.17]) {
      const garra = peca(esfera(0.085), CORES.chifre, 0.015);
      garra.scale.set(1.3, 0.8, 1);
      garra.position.set(pe[0] + 0.36 * tamPe, pe[1] - 0.04, pe[2] + dz * tamPe);
      g.add(garra);
    }
    return g;
  }
  for (const lado of [1, -1]) {
    // Traseira (maior, joelho para a frente)
    tri.add(
      pata(
        [
          [-0.8, 2.45, 0.32 * lado],
          [-0.4, 1.2, 0.68 * lado],
          [-0.42, 0.85, 0.74 * lado],
          [-0.72, 0.28, 0.76 * lado],
        ],
        [
          [0, 0.55],
          [0.35, 0.5],
          [0.6, 0.34],
          [1, 0.24],
        ],
        [-0.66, 0.15, 0.78 * lado],
        1.05,
      ),
    );
    // Dianteira (cotovelo para fora e para trás)
    tri.add(
      pata(
        [
          [1.2, 2.0, 0.3 * lado],
          [1.12, 1.2, 0.7 * lado],
          [1.1, 0.9, 0.78 * lado],
          [1.3, 0.28, 0.74 * lado],
        ],
        [
          [0, 0.46],
          [0.35, 0.4],
          [0.65, 0.28],
          [1, 0.21],
        ],
        [1.36, 0.14, 0.76 * lado],
        0.9,
      ),
    );
  }

  // Cabeça (grupo com pivô no pescoço)
  const cabeca = new THREE.Group();
  cabeca.position.set(1.95, 1.82, 0);
  tri.add(cabeca);

  const cranio = peca(esfera(1), CORES.corpo);
  cranio.scale.set(0.95, 0.62, 0.55);
  cranio.position.set(0.6, -0.08, 0);
  cabeca.add(cranio);

  // Focinho afinando até o bico de papagaio
  cabeca.add(
    peca(
      tubo(
        [
          [0.9, -0.05, 0],
          [1.45, -0.2, 0],
          [1.85, -0.42, 0],
        ],
        perfil([
          [0, 0.46],
          [0.6, 0.3],
          [1, 0.14],
        ]),
        0.82,
        24,
        20,
      ),
      CORES.corpo,
    ),
  );
  const bico = peca(new THREE.ConeGeometry(0.15, 0.42, 20), CORES.bico, 0.02);
  bico.rotation.z = Math.PI / 2 + 0.55; // aponta para frente e para baixo
  bico.position.set(1.92, -0.55, 0);
  cabeca.add(bico);

  // Chifre do nariz (curto)
  const nasal = peca(new THREE.ConeGeometry(0.1, 0.36, 16), CORES.chifre, 0.02);
  nasal.position.set(1.42, 0.2, 0);
  nasal.rotation.z = -0.35;
  cabeca.add(nasal);

  // Chifres da testa: longos e curvados para a frente
  for (const lado of [1, -1]) {
    cabeca.add(
      peca(
        tubo(
          [
            [0.72, 0.38, 0.26 * lado],
            [1.1, 0.85, 0.33 * lado],
            [1.65, 1.2, 0.38 * lado],
            [2.2, 1.34, 0.36 * lado],
          ],
          perfil([
            [0, 0.15],
            [1, 0.012],
          ]),
          1,
          32,
          14,
        ),
        CORES.chifre,
        0.02,
      ),
    );
  }

  // Olhos
  for (const lado of [1, -1]) {
    const olho = new THREE.Mesh(esfera(0.085), mat(CORES.olho));
    olho.position.set(1.0, 0.16, 0.45 * lado);
    cabeca.add(olho);
  }

  // Gola: escudo grande, levemente inclinado para trás, com pontas na borda.
  const gola = new THREE.Group();
  gola.position.set(0.05, 0.45, 0);
  gola.rotation.z = 0.32;
  const escudo = peca(esfera(1), CORES.gola);
  escudo.scale.set(0.2, 1.2, 1.18);
  gola.add(escudo);
  const geoPonta = new THREE.ConeGeometry(0.1, 0.26, 12);
  const N = 13;
  for (let i = 0; i < N; i++) {
    const a = -Math.PI * 0.62 + (i / (N - 1)) * Math.PI * 1.24; // arco de cima
    const ponta = peca(geoPonta, CORES.borda, 0.015);
    ponta.position.set(0, Math.cos(a) * 1.22, Math.sin(a) * 1.2);
    ponta.rotation.x = a;
    gola.add(ponta);
  }
  cabeca.add(gola);

  // Centraliza e ajusta o tamanho para caber no quadro.
  tri.position.x = 0.1;
  tri.scale.setScalar(0.72);

  const pivo = new THREE.Group(); // pivô nas patas, para o squash & stretch.
  pivo.add(tri);
  const BASE_Y = -1.3;
  pivo.position.y = BASE_Y;
  scene.add(pivo);

  const materialSombra = new THREE.MeshBasicMaterial({ color: '#0b1f15', transparent: true, opacity: 0.35 });
  const sombra = new THREE.Mesh(new THREE.CircleGeometry(2.8, 48), materialSombra);
  sombra.rotation.x = -Math.PI / 2;
  sombra.scale.y = 0.4;
  sombra.position.y = BASE_Y - 0.01;
  scene.add(sombra);

  scene.add(new THREE.HemisphereLight('#fff6e0', '#2a3b2e', 1.6));
  const sol = new THREE.DirectionalLight('#ffffff', 2.2);
  sol.position.set(4, 7, 6);
  scene.add(sol);
  const recorte = new THREE.DirectionalLight('#ffe7b0', 1.2); // luz de recorte por trás
  recorte.position.set(-5, 3, -4);
  scene.add(recorte);

  // ---------- Tamanho ----------
  const redimensionar = () => {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Em telas estreitas, afasta a câmera para o tricerátops caber inteiro.
    camera.position.z = camera.aspect < 0.9 ? (14 / camera.aspect) * 0.9 : 14;
    camera.updateProjectionMatrix();
    renderizar();
  };

  // ---------- Animação ----------
  const GIRO_BASE = -0.55; // de três quartos, como na foto de referência
  const alvo = { x: 0, y: 0 };
  const atual = { giro: GIRO_BASE, cabecaY: 0, cabecaZ: 0 };
  let pulo = -1; // progresso do pulo (0..1); -1 = parado
  let tempo = 0;
  let ultimo = performance.now();
  let rodando = false;
  let visivel = true;

  const renderizar = () => renderer.render(scene, camera);

  const suavizar = (atualV: number, alvoV: number, dt: number, velocidade: number) =>
    atualV + (alvoV - atualV) * (1 - Math.exp(-dt * velocidade));

  const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

  function quadro(agora: number) {
    if (!rodando) return;
    const dt = Math.min((agora - ultimo) / 1000, 1 / 20);
    ultimo = agora;
    tempo += dt;

    // O corpo vira pouco (limitado para não ficar de frente nem de costas);
    // a cabeça acompanha o ponteiro mais rápido.
    atual.giro = suavizar(atual.giro, GIRO_BASE + alvo.x * 0.18 + Math.sin(tempo * 0.5) * 0.06, dt, 3);
    atual.cabecaY = suavizar(atual.cabecaY, alvo.x * 0.12 - 0.08, dt, 6);
    atual.cabecaZ = suavizar(atual.cabecaZ, -alvo.y * 0.2 + Math.sin(tempo * 1.3) * 0.03, dt, 6);

    cabeca.rotation.set(0, atual.cabecaY, atual.cabecaZ);
    rabo.rotation.y = Math.sin(tempo * 1.8) * 0.18;
    const respira = 1 + Math.sin(tempo * 2) * 0.015;
    corpo.scale.set(1, respira, respira);

    let altura = 0;
    let achata = 0;
    let giro = 0;

    if (pulo >= 0) {
      pulo += dt / 0.95;
      const p = Math.min(pulo, 1);
      if (p < 0.16) {
        achata = Math.sin((p / 0.16) * Math.PI) * 0.12; // antecipação
      } else if (p < 0.9) {
        const ar = (p - 0.16) / 0.74;
        altura = Math.sin(ar * Math.PI) * 1.0;
        achata = -Math.sin(ar * Math.PI) * 0.05; // estica no ar
        giro = easeInOut(ar) * Math.PI * 2;
      } else {
        achata = Math.sin(((p - 0.9) / 0.1) * Math.PI) * 0.08; // aterrissagem
      }
      if (pulo >= 1) pulo = -1;
    }

    pivo.position.y = BASE_Y + altura;
    pivo.rotation.set(0, atual.giro + giro, 0);
    pivo.scale.set(1 + achata * 0.6, 1 - achata, 1 + achata * 0.6);
    const s = 1 - Math.min(altura, 1) * 0.35;
    sombra.scale.set(s, s * 0.4, s);
    materialSombra.opacity = 0.35 * s;

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
    cabeca.rotation.set(0, 0, 0);
    rabo.rotation.y = 0;
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
    if (pulo < 0) pulo = 0;
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
