// Cena 3D do tricerátops (Three.js). Carregada sob demanda pelo componente Dino3D.
// Feito só com formas primitivas, sombreamento toon e contorno escuro,
// para combinar com o visual flat do site.
import * as THREE from 'three';

const CORES = {
  corpo: '#e9b63b',
  gola: '#c8562f',
  chifre: '#f5f2ea',
  olho: '#141613',
  contorno: '#141613',
};

export function iniciarDino(root: HTMLElement, stage: HTMLButtonElement) {
  const reduzirMovimento = matchMedia('(prefers-reduced-motion: reduce)');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 1.2, 14);
  camera.lookAt(0, 0, 0);

  // Sombreamento toon em 3 tons.
  const tons = new Uint8Array([90, 170, 255]);
  const gradiente = new THREE.DataTexture(tons, tons.length, 1, THREE.RedFormat);
  gradiente.minFilter = gradiente.magFilter = THREE.NearestFilter;
  gradiente.needsUpdate = true;

  const materiais = new Map<string, THREE.Material>();
  const toon = (cor: string) => {
    if (!materiais.has(cor)) materiais.set(cor, new THREE.MeshToonMaterial({ color: cor, gradientMap: gradiente }));
    return materiais.get(cor)!;
  };
  const materialContorno = new THREE.MeshBasicMaterial({ color: CORES.contorno, side: THREE.BackSide });

  /** Malha com contorno "casco invertido": cópia um pouco maior, só com as faces de trás. */
  function peca(geo: THREE.BufferGeometry, cor: string, espessura = 0.06) {
    const mesh = new THREE.Mesh(geo, toon(cor));
    geo.computeBoundingSphere();
    const raio = geo.boundingSphere?.radius ?? 1;
    const contorno = new THREE.Mesh(geo, materialContorno);
    contorno.scale.setScalar(1 + espessura / raio);
    mesh.add(contorno);
    return mesh;
  }

  // ---------- Modelo (olhando para +x, patas em y = 0) ----------
  const tri = new THREE.Group();

  // Corpo
  const corpo = peca(new THREE.SphereGeometry(1, 40, 28), CORES.corpo);
  corpo.scale.set(1.8, 1.1, 1.15);
  corpo.position.set(0, 1.6, 0);
  tri.add(corpo);

  // Patas
  const geoPata = new THREE.CylinderGeometry(0.3, 0.26, 1.1, 20);
  for (const [x, z] of [
    [0.95, 0.62],
    [0.95, -0.62],
    [-0.95, 0.62],
    [-0.95, -0.62],
  ]) {
    const pata = peca(geoPata, CORES.corpo);
    pata.position.set(x, 0.55, z);
    tri.add(pata);
  }

  // Rabo (pivô na base para balançar)
  const rabo = new THREE.Group();
  rabo.position.set(-1.55, 1.7, 0);
  const cone = peca(new THREE.ConeGeometry(0.46, 1.7, 24), CORES.corpo);
  cone.rotation.z = Math.PI / 2 + 0.28; // aponta para trás e um pouco para baixo
  cone.position.set(-0.75, -0.2, 0);
  rabo.add(cone);
  tri.add(rabo);

  // Cabeça (pivô no pescoço para olhar e acenar)
  const cabeca = new THREE.Group();
  cabeca.position.set(1.55, 1.85, 0);
  tri.add(cabeca);

  const cranio = peca(new THREE.SphereGeometry(0.8, 32, 24), CORES.corpo);
  cranio.scale.set(1.25, 0.95, 1);
  cranio.position.set(0.6, -0.05, 0);
  cabeca.add(cranio);

  const bico = peca(new THREE.ConeGeometry(0.34, 0.75, 20), CORES.corpo);
  bico.rotation.z = -Math.PI / 2 - 0.25;
  bico.position.set(1.6, -0.28, 0);
  cabeca.add(bico);

  // Gola (frill): disco inclinado para trás, com pontas na borda.
  const gola = new THREE.Group();
  gola.position.set(0.05, 0.35, 0);
  gola.rotation.z = 0.4;
  const disco = peca(new THREE.CylinderGeometry(1.35, 1.35, 0.18, 48), CORES.gola);
  disco.rotation.z = Math.PI / 2;
  gola.add(disco);
  const geoPonta = new THREE.ConeGeometry(0.14, 0.34, 12);
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i / 6) * Math.PI; // meia-volta na parte de cima
    const ponta = peca(geoPonta, CORES.gola, 0.04);
    ponta.position.set(0, Math.cos(a) * 1.42, Math.sin(a) * 1.42);
    ponta.rotation.x = a;
    gola.add(ponta);
  }
  cabeca.add(gola);

  // Chifres: dois grandes sobre os olhos, um pequeno no nariz.
  const geoChifre = new THREE.ConeGeometry(0.13, 1.05, 16);
  for (const z of [0.3, -0.3]) {
    const chifre = peca(geoChifre, CORES.chifre, 0.04);
    chifre.position.set(1.0, 0.78, z);
    chifre.rotation.z = -0.95;
    chifre.rotation.x = z > 0 ? 0.12 : -0.12;
    cabeca.add(chifre);
  }
  const nasal = peca(new THREE.ConeGeometry(0.1, 0.42, 14), CORES.chifre, 0.04);
  nasal.position.set(1.42, 0.25, 0);
  nasal.rotation.z = -0.45;
  cabeca.add(nasal);

  // Olhos
  const geoOlho = new THREE.SphereGeometry(0.11, 16, 12);
  for (const z of [0.68, -0.68]) {
    const olho = new THREE.Mesh(geoOlho, toon(CORES.olho));
    olho.position.set(1.02, 0.2, z);
    cabeca.add(olho);
  }

  // Centraliza o modelo em x e reduz para caber no quadro.
  tri.position.x = -0.35;
  tri.scale.setScalar(0.92);

  const pivo = new THREE.Group(); // pivô nas patas, para o squash & stretch.
  pivo.add(tri);
  const BASE_Y = -1.55;
  pivo.position.y = BASE_Y;
  scene.add(pivo);

  const materialSombra = new THREE.MeshBasicMaterial({ color: '#0b1f15', transparent: true, opacity: 0.35 });
  const sombra = new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), materialSombra);
  sombra.rotation.x = -Math.PI / 2;
  sombra.scale.y = 0.4;
  sombra.position.y = BASE_Y - 0.01;
  scene.add(sombra);

  scene.add(new THREE.AmbientLight('#ffffff', 1.1));
  const sol = new THREE.DirectionalLight('#ffffff', 2.4);
  sol.position.set(4, 6, 6);
  scene.add(sol);

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
  const GIRO_BASE = -0.95; // de três quartos, com a cabeça virada para a câmera
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

    // O corpo vira devagar na direção do ponteiro; a cabeça acompanha mais rápido.
    // O giro fica limitado para ele nunca ficar de perfil total (a gola sumiria).
    atual.giro = suavizar(atual.giro, GIRO_BASE + alvo.x * 0.28 + Math.sin(tempo * 0.5) * 0.1, dt, 3);
    atual.cabecaY = suavizar(atual.cabecaY, alvo.x * 0.3, dt, 6);
    atual.cabecaZ = suavizar(atual.cabecaZ, -alvo.y * 0.25 + Math.sin(tempo * 1.3) * 0.04, dt, 6);

    cabeca.rotation.set(0, atual.cabecaY, atual.cabecaZ);
    rabo.rotation.y = Math.sin(tempo * 2.4) * 0.3;
    corpo.scale.y = 1.1 * (1 + Math.sin(tempo * 2) * 0.02); // respiração

    let altura = 0;
    let achata = 0;
    let giro = 0;

    if (pulo >= 0) {
      pulo += dt / 0.95;
      const p = Math.min(pulo, 1);
      if (p < 0.16) {
        achata = Math.sin((p / 0.16) * Math.PI) * 0.16; // antecipação
      } else if (p < 0.9) {
        const ar = (p - 0.16) / 0.74;
        altura = Math.sin(ar * Math.PI) * 1.1;
        achata = -Math.sin(ar * Math.PI) * 0.07; // estica no ar
        giro = easeInOut(ar) * Math.PI * 2;
      } else {
        achata = Math.sin(((p - 0.9) / 0.1) * Math.PI) * 0.1; // aterrissagem
      }
      if (pulo >= 1) pulo = -1;
    }

    pivo.position.y = BASE_Y + altura;
    pivo.rotation.set(0, atual.giro + giro, 0);
    pivo.scale.set(1 + achata * 0.6, 1 - achata, 1 + achata * 0.6);
    const s = 1 - Math.min(altura, 1.1) * 0.35;
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
