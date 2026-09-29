// Cena 3D do dino (Three.js). Carregada sob demanda pelo componente Dino3D.
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { DINO_PATH } from '../components/DinoPath';

export function iniciarDino(root: HTMLElement, stage: HTMLButtonElement) {
  const reduzirMovimento = matchMedia('(prefers-reduced-motion: reduce)');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.4, 14);
  camera.lookAt(0, 0, 0);

  // Geometria: a silhueta do logo extrudada, com chanfro arredondado.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${DINO_PATH}"/></svg>`;
  const shapes = new SVGLoader().parse(svg).paths.flatMap((p) => p.toShapes());
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 70,
    bevelEnabled: true,
    bevelThickness: 16,
    bevelSize: 10,
    bevelSegments: 6,
    curveSegments: 28,
  });
  geometry.center();
  geometry.rotateX(Math.PI); // SVG tem Y para baixo; girar evita inverter as faces.
  geometry.scale(0.0085, 0.0085, 0.0085);

  // Sombreamento toon em 3 tons, para combinar com o visual flat do site.
  const tons = new Uint8Array([90, 170, 255]);
  const gradiente = new THREE.DataTexture(tons, tons.length, 1, THREE.RedFormat);
  gradiente.minFilter = gradiente.magFilter = THREE.NearestFilter;
  gradiente.needsUpdate = true;

  const corpo = new THREE.Mesh(
    geometry,
    new THREE.MeshToonMaterial({ color: '#e9b63b', gradientMap: gradiente }),
  );
  // Contorno "casco invertido": cópia um pouco maior, só com as faces de trás.
  const contorno = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: '#141613', side: THREE.BackSide }),
  );
  contorno.scale.setScalar(1.045);

  const dino = new THREE.Group();
  dino.add(contorno, corpo);
  const pivo = new THREE.Group(); // pivô na base, para o squash & stretch.
  pivo.add(dino);
  dino.position.y = 1.76;
  pivo.position.y = -1.76;
  scene.add(pivo);

  const materialSombra = new THREE.MeshBasicMaterial({ color: '#0b1f15', transparent: true, opacity: 0.35 });
  const sombra = new THREE.Mesh(new THREE.CircleGeometry(1.9, 48), materialSombra);
  sombra.rotation.x = -Math.PI / 2;
  sombra.scale.y = 0.35;
  sombra.position.y = -1.95;
  scene.add(sombra);

  scene.add(new THREE.AmbientLight('#ffffff', 1.1));
  const sol = new THREE.DirectionalLight('#ffffff', 2.4);
  sol.position.set(4, 5, 6);
  scene.add(sol);

  // Tamanho
  const redimensionar = () => {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Em telas estreitas, afasta a câmera para o dino caber inteiro.
    camera.position.z = camera.aspect < 0.9 ? (14 / camera.aspect) * 0.9 : 14;
    camera.updateProjectionMatrix();
    renderizar();
  };

  // Estado da animação
  const alvo = { x: 0, y: 0 };
  const atual = { x: 0.1, y: -0.3 };
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

    // Olha na direção do ponteiro + balanço leve quando parado.
    const balanco = Math.sin(tempo * 0.7) * 0.22;
    atual.y = suavizar(atual.y, alvo.x * 0.6 - 0.25 + balanco, dt, 5);
    atual.x = suavizar(atual.x, alvo.y * 0.28 + 0.1, dt, 5);

    let altura = Math.sin(tempo * 1.6) * 0.08;
    let achata = 0;
    let giro = 0;

    if (pulo >= 0) {
      pulo += dt / 0.9;
      const p = Math.min(pulo, 1);
      if (p < 0.16) {
        achata = Math.sin((p / 0.16) * Math.PI) * 0.16; // antecipação
      } else if (p < 0.9) {
        const ar = (p - 0.16) / 0.74;
        altura += Math.sin(ar * Math.PI) * 1.05;
        achata = -Math.sin(ar * Math.PI) * 0.07; // estica no ar
        giro = easeInOut(ar) * Math.PI * 2;
      } else {
        achata = Math.sin(((p - 0.9) / 0.1) * Math.PI) * 0.1; // aterrissagem
      }
      if (pulo >= 1) pulo = -1;
    }

    pivo.position.y = -1.76 + altura;
    pivo.rotation.set(atual.x, atual.y + giro, 0);
    pivo.scale.set(1 + achata * 0.6, 1 - achata, 1 + achata * 0.6);
    const s = 1 - Math.min(altura, 1.05) * 0.35;
    sombra.scale.set(s, s * 0.35, s);
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
    pivo.position.y = -1.76;
    pivo.rotation.set(0.1, -0.3, 0);
    pivo.scale.setScalar(1);
    renderizar();
  };

  // Eventos
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
