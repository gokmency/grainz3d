import * as THREE from 'three';
import { IParameterApi, ISessionApi, IViewportApi } from '@shapediver/viewer';
import { ModelConfig } from './config';

export interface DemoViewerInstance {
  session: ISessionApi;
  viewport: IViewportApi;
  parameters: IParameterApi<unknown>[];
  updateParameter: (id: string, value: string | number | boolean) => void;
  destroy: () => void;
}

export function createDemoViewer(
  container: HTMLElement,
  model: ModelConfig,
  onCustomizingChange?: (isCustomizing: boolean) => void
): DemoViewerInstance {
  const modelId = model.id || 'model-1';

  // 1. Setup Three.js scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x09090b); // Tailwind zinc-950

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  const initialCamPos = { x: 2.2, y: 1.8, z: 2.8 };
  camera.position.set(initialCamPos.x, initialCamPos.y, initialCamPos.z);
  camera.lookAt(0, 0.4, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const canvas = renderer.domElement;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.style.outline = 'none';
  container.appendChild(canvas);

  // 2. Lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xfffaed, 2.0);
  mainLight.position.set(4, 7, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.bias = -0.0001;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 20;
  mainLight.shadow.camera.left = -3;
  mainLight.shadow.camera.right = 3;
  mainLight.shadow.camera.top = 3;
  mainLight.shadow.camera.bottom = -3;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x8bc34a, 0.4);
  fillLight.position.set(-4, 3, -3);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x60a5fa, 0.8);
  rimLight.position.set(0, 5, -5);
  scene.add(rimLight);

  // Ground plane with grid & subtle shadow
  const groundGeo = new THREE.PlaneGeometry(30, 30);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x0f1117,
    roughness: 0.85,
    metalness: 0.1,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.001;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(10, 20, 0x27272a, 0x18181b);
  grid.position.y = 0;
  scene.add(grid);

  // 3. Model Geometry Group
  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  // State values for parameters
  const paramValues: Record<string, any> = {};

  // Define initial parameter specifications based on model
  const rawParams: Array<{
    id: string;
    name: string;
    displayname?: string;
    type: 'Int' | 'Float' | 'Bool' | 'StringList' | 'Color' | 'String';
    value: any;
    min?: number;
    max?: number;
    step?: number;
    choices?: string[];
    group?: { name: string };
    order: number;
    tooltip?: string;
  }> = [];

  if (modelId === 'model-2') {
    // Masa
    rawParams.push(
      { id: 'length', name: 'Masa Uzunluğu', displayname: 'Uzunluk (mm)', type: 'Int', value: 2000, min: 1200, max: 2800, step: 50, group: { name: 'Ölçüler' }, order: 1, tooltip: 'Masa tablası toplam uzunluğu' },
      { id: 'width', name: 'Masa Genişliği', displayname: 'Genişlik (mm)', type: 'Int', value: 950, min: 700, max: 1200, step: 25, group: { name: 'Ölçüler' }, order: 2, tooltip: 'Masa tablası genişliği' },
      { id: 'height', name: 'Masa Yüksekliği', displayname: 'Yükseklik (mm)', type: 'Int', value: 750, min: 650, max: 850, step: 10, group: { name: 'Ölçüler' }, order: 3, tooltip: 'Yerden toplam yükseklik' },
      { id: 'top_thickness', name: 'Tabla Kalınlığı', displayname: 'Tabla Kalınlığı (mm)', type: 'Int', value: 36, min: 20, max: 60, step: 2, group: { name: 'Ölçüler' }, order: 4 },
      { id: 'rounded_corners', name: 'Yuvarlak Köşeler', displayname: 'Yuvarlatılmış Kenarlar', type: 'Bool', value: true, group: { name: 'Tasarım Detayları' }, order: 5 },
      { id: 'metal_inlay', name: 'Metal Kakma Şerit', displayname: 'Pirinç Vurgu Şeridi', type: 'Bool', value: false, group: { name: 'Tasarım Detayları' }, order: 6 },
      { id: 'material', name: 'Ahşap Kaplama', displayname: 'Malzeme Kaplaması', type: 'StringList', value: 'Solid White Oak', choices: ['Solid White Oak', 'Dark American Walnut', 'Smoked Ash', 'Nero Charcoal'], group: { name: 'Malzeme & Renk' }, order: 7 },
      { id: 'accent_color', name: 'Vurgu Rengi', displayname: 'Ayak / Vurgu Rengi', type: 'Color', value: '#1e293b', group: { name: 'Malzeme & Renk' }, order: 8 }
    );
  } else if (modelId === 'model-3') {
    // Vazo
    rawParams.push(
      { id: 'height', name: 'Vazo Yüksekliği', displayname: 'Yükseklik (mm)', type: 'Int', value: 380, min: 200, max: 600, step: 10, group: { name: 'Geometri' }, order: 1 },
      { id: 'base_radius', name: 'Taban Genişliği', displayname: 'Taban Çapı (mm)', type: 'Int', value: 110, min: 60, max: 200, step: 5, group: { name: 'Geometri' }, order: 2 },
      { id: 'waist_ratio', name: 'Boğum Oranı', displayname: 'Gövde Boğum Oranı', type: 'Float', value: 0.72, min: 0.4, max: 1.4, step: 0.02, group: { name: 'Geometri' }, order: 3 },
      { id: 'twist', name: 'Spiral Döndürme', displayname: 'Spiral Kıvrım Açısı (°)', type: 'Int', value: 180, min: 0, max: 360, step: 15, group: { name: 'Heykelsi Form' }, order: 4 },
      { id: 'flutes', name: 'Dikey Çizgi Sayısı', displayname: 'Boğum / Dilim Sayısı', type: 'Int', value: 12, min: 4, max: 24, step: 2, group: { name: 'Heykelsi Form' }, order: 5 },
      { id: 'gloss', name: 'Parlak Sır Kaplama', displayname: 'Yüksek Parlaklık', type: 'Bool', value: true, group: { name: 'Malzeme & Renk' }, order: 6 },
      { id: 'material', name: 'Seramik Türü', displayname: 'Seramik Malzemesi', type: 'StringList', value: 'Glossy Porcelain', choices: ['Glossy Porcelain', 'Matte Sandstone', 'Terracotta Clay', 'Cobalt Glass'], group: { name: 'Malzeme & Renk' }, order: 7 },
      { id: 'color', name: 'Sır Rengi (Glaze)', displayname: 'Sır Renk Tonu', type: 'Color', value: '#0ea5e9', group: { name: 'Malzeme & Renk' }, order: 8 }
    );
  } else {
    // Koltuk (Model-1)
    rawParams.push(
      { id: 'width', name: 'Koltuk Genişliği', displayname: 'Genişlik (mm)', type: 'Int', value: 760, min: 550, max: 950, step: 10, group: { name: 'Ölçüler' }, order: 1, tooltip: 'Oturum toplam genişliği' },
      { id: 'height', name: 'Sırt Yüksekliği', displayname: 'Toplam Yükseklik (mm)', type: 'Int', value: 860, min: 700, max: 1100, step: 10, group: { name: 'Ölçüler' }, order: 2, tooltip: 'Yerden sırt tepesine toplam yükseklik' },
      { id: 'depth', name: 'Koltuk Derinliği', displayname: 'Derinlik (mm)', type: 'Int', value: 800, min: 550, max: 950, step: 10, group: { name: 'Ölçüler' }, order: 3, tooltip: 'Önden arkaya toplam derinlik' },
      { id: 'seat_angle', name: 'Eğim Açısı', displayname: 'Yatış Eğim Açısı (°)', type: 'Int', value: 12, min: 0, max: 25, step: 1, group: { name: 'Ergonomi' }, order: 4, tooltip: 'Sırt ve oturum konfor açısı' },
      { id: 'armrests', name: 'Kolçaklar', displayname: 'Yan Kol Dayama', type: 'Bool', value: true, group: { name: 'Tasarım Detayları' }, order: 5 },
      { id: 'cushion', name: 'Yumuşak Minder', displayname: 'Ekstra Konfor Minderi', type: 'Bool', value: true, group: { name: 'Tasarım Detayları' }, order: 6 },
      { id: 'material', name: 'İskelet Malzemesi', displayname: 'Ahşap / Metal İskelet', type: 'StringList', value: 'Natural Oak', choices: ['Natural Oak', 'Dark Walnut', 'Brushed Titanium', 'Matte Carbon'], group: { name: 'Malzeme & Renk' }, order: 7 },
      { id: 'color', name: 'Döşeme Rengi', displayname: 'Kumaş Rengi', type: 'Color', value: '#365314', group: { name: 'Malzeme & Renk' }, order: 8 }
    );
  }

  rawParams.forEach((p) => {
    paramValues[p.id] = p.value;
  });

  // Material helpers
  function getFrameMaterial(matName: string): THREE.Material {
    switch (matName) {
      case 'Dark Walnut':
      case 'Dark American Walnut':
        return new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.45, metalness: 0.1 });
      case 'Brushed Titanium':
        return new THREE.MeshStandardMaterial({ color: 0x888b90, roughness: 0.25, metalness: 0.85 });
      case 'Matte Carbon':
      case 'Nero Charcoal':
        return new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7, metalness: 0.3 });
      case 'Cobalt Glass':
        return new THREE.MeshPhysicalMaterial({ color: 0x0284c7, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.05, ior: 1.5 });
      case 'Solid White Oak':
      case 'Natural Oak':
      default:
        return new THREE.MeshStandardMaterial({ color: 0xc8a165, roughness: 0.5, metalness: 0.05 });
    }
  }

  // Rebuild 3D Meshes based on paramValues
  function rebuild3DModel() {
    // Clear previous model meshes
    while (modelGroup.children.length > 0) {
      const child = modelGroup.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose());
      } else if (child.material) {
        child.material.dispose();
      }
      modelGroup.remove(child);
    }

    if (modelId === 'model-2') {
      // Build Table
      const lengthM = (paramValues.length || 2000) / 1000;
      const widthM = (paramValues.width || 950) / 1000;
      const heightM = (paramValues.height || 750) / 1000;
      const topThickM = (paramValues.top_thickness || 36) / 1000;
      const rounded = !!paramValues.rounded_corners;
      const mat = getFrameMaterial(paramValues.material);
      const legMat = new THREE.MeshStandardMaterial({
        color: paramValues.accent_color ? new THREE.Color(paramValues.accent_color) : 0x27272a,
        roughness: 0.5,
        metalness: 0.4,
      });

      // Tabletop
      const topGeo = rounded
        ? new THREE.BoxGeometry(lengthM, topThickM, widthM, 4, 2, 4)
        : new THREE.BoxGeometry(lengthM, topThickM, widthM);
      const topMesh = new THREE.Mesh(topGeo, mat);
      topMesh.position.y = heightM - topThickM / 2;
      topMesh.castShadow = true;
      topMesh.receiveShadow = true;
      modelGroup.add(topMesh);

      // Inlay Trim if enabled
      if (paramValues.metal_inlay) {
        const inlayGeo = new THREE.BoxGeometry(lengthM * 0.95, topThickM * 1.02, widthM * 0.95);
        const inlayMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.2, metalness: 0.9 });
        const inlayMesh = new THREE.Mesh(inlayGeo, inlayMat);
        inlayMesh.position.y = heightM - topThickM / 2;
        modelGroup.add(inlayMesh);
      }

      // 4 Legs
      const legRadiusTop = 0.035;
      const legRadiusBottom = 0.02;
      const legHeight = heightM - topThickM;
      const legGeo = new THREE.CylinderGeometry(legRadiusTop, legRadiusBottom, legHeight, 16);

      const legOffsetX = lengthM / 2 - 0.12;
      const legOffsetZ = widthM / 2 - 0.1;

      const legPositions = [
        [legOffsetX, legHeight / 2, legOffsetZ, -0.06, 0.06],
        [-legOffsetX, legHeight / 2, legOffsetZ, -0.06, -0.06],
        [legOffsetX, legHeight / 2, -legOffsetZ, 0.06, 0.06],
        [-legOffsetX, legHeight / 2, -legOffsetZ, 0.06, -0.06],
      ];

      legPositions.forEach(([x, y, z, rotX, rotZ]) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(x, y, z);
        leg.rotation.x = rotX;
        leg.rotation.z = rotZ;
        leg.castShadow = true;
        leg.receiveShadow = true;
        modelGroup.add(leg);
      });

      // Apron beams
      const apronGeoX = new THREE.BoxGeometry(lengthM - 0.25, 0.05, 0.02);
      const apron1 = new THREE.Mesh(apronGeoX, mat);
      apron1.position.set(0, heightM - topThickM - 0.03, legOffsetZ - 0.02);
      apron1.castShadow = true;
      modelGroup.add(apron1);

      const apron2 = new THREE.Mesh(apronGeoX, mat);
      apron2.position.set(0, heightM - topThickM - 0.03, -legOffsetZ + 0.02);
      apron2.castShadow = true;
      modelGroup.add(apron2);
    } else if (modelId === 'model-3') {
      // Build Ceramic Studio Vase
      const heightM = (paramValues.height || 380) / 500;
      const baseR = (paramValues.base_radius || 110) / 500;
      const waistRatio = paramValues.waist_ratio || 0.72;
      const isGloss = !!paramValues.gloss;
      const vaseColor = new THREE.Color(paramValues.color || '#0ea5e9');

      let vaseMat: THREE.Material;
      if (paramValues.material === 'Cobalt Glass') {
        vaseMat = new THREE.MeshPhysicalMaterial({
          color: vaseColor,
          transmission: 0.92,
          roughness: isGloss ? 0.02 : 0.25,
          ior: 1.52,
          thickness: 0.3,
          transparent: true,
        });
      } else if (paramValues.material === 'Terracotta Clay') {
        vaseMat = new THREE.MeshStandardMaterial({
          color: 0xc2410c,
          roughness: 0.85,
          metalness: 0.05,
        });
      } else {
        vaseMat = new THREE.MeshStandardMaterial({
          color: vaseColor,
          roughness: isGloss ? 0.15 : 0.6,
          metalness: isGloss ? 0.1 : 0.02,
        });
      }

      const points: THREE.Vector2[] = [];
      const segments = 40;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const y = t * heightM;
        // Parametric profile curve: flared base -> pinched waist -> bulbous neck -> flared lip
        const r =
          baseR *
          (1 +
            Math.sin(t * Math.PI) * (1.2 - waistRatio) +
            Math.sin(t * Math.PI * 2.5) * 0.35 +
            Math.pow(t, 4) * 0.4);
        points.push(new THREE.Vector2(Math.max(r, 0.05), y));
      }

      const latheGeo = new THREE.LatheGeometry(points, Math.max(8, (paramValues.flutes || 12) * 3));
      const vaseMesh = new THREE.Mesh(latheGeo, vaseMat);
      vaseMesh.castShadow = true;
      vaseMesh.receiveShadow = true;
      modelGroup.add(vaseMesh);
    } else {
      // Build Ergonomic Lounge Chair
      const widthM = (paramValues.width || 760) / 1000;
      const heightM = (paramValues.height || 860) / 1000;
      const depthM = (paramValues.depth || 800) / 1000;
      const reclineDeg = paramValues.seat_angle || 12;
      const hasArmrests = !!paramValues.armrests;
      const hasCushion = !!paramValues.cushion;
      const frameMat = getFrameMaterial(paramValues.material);
      const fabricColor = new THREE.Color(paramValues.color || '#365314');

      const cushionMat = new THREE.MeshStandardMaterial({
        color: fabricColor,
        roughness: 0.75,
        metalness: 0.05,
      });

      const seatHeight = 0.42;
      const seatThick = 0.06;
      const reclineRad = (reclineDeg * Math.PI) / 180;

      // 1. Seat Base Shell
      const seatGeo = new THREE.BoxGeometry(widthM, seatThick, depthM * 0.65);
      const seatShell = new THREE.Mesh(seatGeo, frameMat);
      seatShell.position.set(0, seatHeight, 0);
      seatShell.rotation.x = -reclineRad * 0.35;
      seatShell.castShadow = true;
      seatShell.receiveShadow = true;
      modelGroup.add(seatShell);

      // Seat Cushion
      if (hasCushion) {
        const seatCushionGeo = new THREE.BoxGeometry(widthM * 0.94, 0.08, depthM * 0.62);
        const seatCushion = new THREE.Mesh(seatCushionGeo, cushionMat);
        seatCushion.position.set(0, seatHeight + 0.05, 0);
        seatCushion.rotation.x = -reclineRad * 0.35;
        seatCushion.castShadow = true;
        seatCushion.receiveShadow = true;
        modelGroup.add(seatCushion);
      }

      // 2. Backrest Shell
      const backHeightM = heightM - seatHeight;
      const backGeo = new THREE.BoxGeometry(widthM * 0.95, backHeightM, 0.05);
      const backShell = new THREE.Mesh(backGeo, frameMat);
      backShell.position.set(
        0,
        seatHeight + (backHeightM / 2) * Math.cos(reclineRad) - 0.02,
        -depthM * 0.28 - (backHeightM / 2) * Math.sin(reclineRad)
      );
      backShell.rotation.x = -reclineRad;
      backShell.castShadow = true;
      backShell.receiveShadow = true;
      modelGroup.add(backShell);

      // Backrest Cushion
      if (hasCushion) {
        const backCushionGeo = new THREE.BoxGeometry(widthM * 0.9, backHeightM * 0.92, 0.07);
        const backCushion = new THREE.Mesh(backCushionGeo, cushionMat);
        backCushion.position.set(
          0,
          seatHeight + (backHeightM / 2) * Math.cos(reclineRad) - 0.01,
          -depthM * 0.28 - (backHeightM / 2) * Math.sin(reclineRad) + 0.04
        );
        backCushion.rotation.x = -reclineRad;
        backCushion.castShadow = true;
        backCushion.receiveShadow = true;
        modelGroup.add(backCushion);
      }

      // 3. Armrests
      if (hasArmrests) {
        const armGeo = new THREE.BoxGeometry(0.06, 0.03, depthM * 0.55);
        const armSupportGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 12);
        const armHeight = seatHeight + 0.22;
        const armX = widthM / 2 + 0.03;

        [-armX, armX].forEach((xPos) => {
          const arm = new THREE.Mesh(armGeo, frameMat);
          arm.position.set(xPos, armHeight, -0.05);
          arm.castShadow = true;
          modelGroup.add(arm);

          const supportFront = new THREE.Mesh(armSupportGeo, frameMat);
          supportFront.position.set(xPos, seatHeight + 0.1, 0.12);
          supportFront.castShadow = true;
          modelGroup.add(supportFront);

          const supportBack = new THREE.Mesh(armSupportGeo, frameMat);
          supportBack.position.set(xPos, seatHeight + 0.1, -0.2);
          supportBack.castShadow = true;
          modelGroup.add(supportBack);
        });
      }

      // 4. 4 Angled Legs
      const legRadius = 0.022;
      const legGeo = new THREE.CylinderGeometry(legRadius * 0.7, legRadius, seatHeight, 16);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x1f242d, roughness: 0.35, metalness: 0.8 });

      const legOffsetX = widthM / 2 - 0.08;
      const legOffsetZ = depthM * 0.25;

      const legs = [
        [legOffsetX, seatHeight / 2, legOffsetZ, 0.14, 0.14],
        [-legOffsetX, seatHeight / 2, legOffsetZ, 0.14, -0.14],
        [legOffsetX, seatHeight / 2, -legOffsetZ, -0.16, 0.14],
        [-legOffsetX, seatHeight / 2, -legOffsetZ, -0.16, -0.14],
      ];

      legs.forEach(([x, y, z, rotX, rotZ]) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(x, y, z);
        leg.rotation.x = rotX;
        leg.rotation.z = rotZ;
        leg.castShadow = true;
        leg.receiveShadow = true;
        modelGroup.add(leg);
      });
    }

    renderer.render(scene, camera);
  }

  // Initial build
  rebuild3DModel();

  // 4. Orbit Controls (Mouse & Touch)
  let isDragging = false;
  let isRightDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let spherical = {
    radius: 3.5,
    theta: 0.75, // azimuth
    phi: 1.15, // polar angle
  };
  let target = new THREE.Vector3(0, 0.4, 0);
  let isAutoRotating = false;
  const autoRotateSpeed = 0.6;

  function updateCamera() {
    spherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.02, spherical.phi));
    spherical.radius = Math.max(1.0, Math.min(10.0, spherical.radius));

    camera.position.x = target.x + spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
    camera.position.y = target.y + spherical.radius * Math.cos(spherical.phi);
    camera.position.z = target.z + spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
    camera.lookAt(target);
  }

  updateCamera();

  const onMouseDown = (e: MouseEvent) => {
    isDragging = e.button === 0;
    isRightDragging = e.button === 2;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging && !isRightDragging) return;
    const deltaX = e.clientX - prevMouseX;
    const deltaY = e.clientY - prevMouseY;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;

    if (isDragging) {
      spherical.theta -= deltaX * 0.006;
      spherical.phi -= deltaY * 0.006;
      updateCamera();
    } else if (isRightDragging) {
      const panSpeed = 0.002 * spherical.radius;
      target.x -= deltaX * panSpeed * Math.cos(spherical.theta);
      target.z += deltaX * panSpeed * Math.sin(spherical.theta);
      target.y += deltaY * panSpeed;
      updateCamera();
    }
  };

  const onMouseUp = () => {
    isDragging = false;
    isRightDragging = false;
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    spherical.radius += e.deltaY * 0.003;
    updateCamera();
  };

  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  // Touch controls
  let touchStartDist = 0;
  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      touchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
      spherical.theta -= deltaX * 0.008;
      spherical.phi -= deltaY * 0.008;
      updateCamera();
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const deltaDist = touchStartDist - dist;
      touchStartDist = dist;
      spherical.radius += deltaDist * 0.01;
      updateCamera();
    }
  };

  const onTouchEnd = () => {
    isDragging = false;
  };

  canvas.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('contextmenu', onContextMenu);
  canvas.addEventListener('touchstart', onTouchStart);
  window.addEventListener('touchmove', onTouchMove);
  window.addEventListener('touchend', onTouchEnd);

  // Resize handler
  const handleResize = () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', handleResize);

  // Animation render loop
  let animId = 0;
  const clock = new THREE.Clock();

  function animate() {
    animId = requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (isAutoRotating && !isDragging) {
      spherical.theta += delta * autoRotateSpeed;
      updateCamera();
    }

    renderer.render(scene, camera);
  }
  animate();

  // 5. Outputs live calculation
  function computeOutputs() {
    let price = 18500;
    let weight = 16.5;
    let volume = 0.48;

    if (modelId === 'model-2') {
      const len = paramValues.length || 2000;
      const wid = paramValues.width || 950;
      const hei = paramValues.height || 750;
      volume = parseFloat(((len * wid * hei) / 1e9).toFixed(3));
      weight = parseFloat((volume * 420).toFixed(1));
      price = Math.round(24000 + volume * 18000 + (paramValues.metal_inlay ? 4500 : 0));
    } else if (modelId === 'model-3') {
      const hei = paramValues.height || 380;
      const rad = paramValues.base_radius || 110;
      volume = parseFloat(((Math.PI * Math.pow(rad, 2) * hei) / 1e9).toFixed(3));
      weight = parseFloat((volume * 1800).toFixed(1));
      price = Math.round(3200 + hei * 12 + (paramValues.gloss ? 600 : 0));
    } else {
      const w = paramValues.width || 760;
      const h = paramValues.height || 860;
      const d = paramValues.depth || 800;
      volume = parseFloat(((w * h * d) / 1e9).toFixed(3));
      weight = parseFloat((14.2 + (paramValues.armrests ? 2.4 : 0) + (paramValues.cushion ? 3.1 : 0)).toFixed(1));
      price = Math.round(16800 + (paramValues.material === 'Dark Walnut' ? 6200 : paramValues.material === 'Brushed Titanium' ? 8900 : 0) + (paramValues.cushion ? 2400 : 0));
    }

    return {
      output_price: {
        id: 'output_price',
        name: 'Tahmini Fiyat (₺)',
        content: [{ data: price }],
      },
      output_weight: {
        id: 'output_weight',
        name: 'Hesaplanan Ağırlık (kg)',
        content: [{ data: weight }],
      },
      output_volume: {
        id: 'output_volume',
        name: 'Kutu Hacmi (m³)',
        content: [{ data: volume }],
      },
    };
  }

  // 6. Create ShapeDiver-compatible API Adapters
  const paramApis: Record<string, IParameterApi<unknown>> = {};

  rawParams.forEach((param) => {
    paramApis[param.id] = {
      id: param.id,
      name: param.name,
      displayname: param.displayname || param.name,
      type: param.type,
      value: param.value,
      defval: param.value,
      min: param.min,
      max: param.max,
      step: param.step,
      choices: param.choices,
      group: param.group,
      order: param.order,
      tooltip: param.tooltip,
      hidden: false,
    } as any;
  });

  const exportsMap: Record<string, any> = {
    export_stl: {
      id: 'export_stl',
      name: '3D STL Mesh',
      type: 'stl',
      request: async () => {
        const dummyBlob = new Blob([`DEMO_STL_EXPORT_${model.name}_${Date.now()}`], { type: 'text/plain' });
        const url = URL.createObjectURL(dummyBlob);
        return [{ content: [{ href: url }] }];
      },
    },
    export_obj: {
      id: 'export_obj',
      name: 'Wavefront OBJ',
      type: 'obj',
      request: async () => {
        const dummyBlob = new Blob([`DEMO_OBJ_EXPORT_${model.name}_${Date.now()}`], { type: 'text/plain' });
        const url = URL.createObjectURL(dummyBlob);
        return [{ content: [{ href: url }] }];
      },
    },
    export_gltf: {
      id: 'export_gltf',
      name: 'GLTF / GLB 3D',
      type: 'gltf',
      request: async () => {
        const dummyBlob = new Blob([`DEMO_GLTF_EXPORT_${model.name}_${Date.now()}`], { type: 'text/plain' });
        const url = URL.createObjectURL(dummyBlob);
        return [{ content: [{ href: url }] }];
      },
    },
  };

  const sessionObj: ISessionApi = {
    id: `demo-session-${modelId}`,
    parameters: paramApis,
    outputs: computeOutputs() as any,
    exports: exportsMap,
    customize: async () => {
      onCustomizingChange?.(true);
      rebuild3DModel();
      (sessionObj as any).outputs = computeOutputs();
      setTimeout(() => onCustomizingChange?.(false), 200);
      return [];
    },
    close: async () => {},
  } as any;

  const viewportObj: IViewportApi = {
    id: `demo-viewport-${modelId}`,
    canvas,
    camera: {
      zoomTo: async () => {
        spherical = { radius: 3.5, theta: 0.75, phi: 1.15 };
        target.set(0, 0.4, 0);
        updateCamera();
      },
      reset: async () => {
        spherical = { radius: 3.5, theta: 0.75, phi: 1.15 };
        target.set(0, 0.4, 0);
        updateCamera();
      },
    } as any,
    cameraControls: {
      get autoRotate() {
        return isAutoRotating;
      },
      set autoRotate(val: boolean) {
        isAutoRotating = val;
      },
      autoRotateSpeed: 1.0,
    } as any,
    getScreenshot: async (format?: string) => {
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL(format || 'image/png');
    },
    updateSettingsAsync: async (settings: any) => {
      if (settings?.shadows !== undefined) {
        mainLight.castShadow = !!settings.shadows;
        ground.receiveShadow = !!settings.shadows;
      }
      if (settings?.groundPlane !== undefined) {
        ground.visible = !!settings.groundPlane;
        grid.visible = !!settings.groundPlane;
      }
      renderer.render(scene, camera);
    },
    set environmentMap(env: string) {
      if (env.includes('SUNSET')) {
        mainLight.color.setHex(0xf97316);
        ambientLight.color.setHex(0xfeb272);
        ambientLight.intensity = 0.9;
        scene.background = new THREE.Color(0x180f0c);
      } else if (env.includes('PARK') || env.includes('GREEN')) {
        mainLight.color.setHex(0xdcfce7);
        ambientLight.color.setHex(0x86efac);
        ambientLight.intensity = 0.7;
        scene.background = new THREE.Color(0x051a14);
      } else if (env.includes('NEUTRAL') || env.includes('SNOWY')) {
        mainLight.color.setHex(0xf1f5f9);
        ambientLight.color.setHex(0x94a3b8);
        ambientLight.intensity = 0.8;
        scene.background = new THREE.Color(0x0f172a);
      } else {
        mainLight.color.setHex(0xfffaed);
        ambientLight.color.setHex(0xffffff);
        ambientLight.intensity = 0.7;
        scene.background = new THREE.Color(0x09090b);
      }
      renderer.render(scene, camera);
    },
    close: async () => {},
  } as any;

  return {
    session: sessionObj,
    viewport: viewportObj,
    parameters: Object.values(paramApis),
    updateParameter: (id: string, val: string | number | boolean) => {
      paramValues[id] = val;
      if (paramApis[id]) {
        paramApis[id].value = val;
      }
      onCustomizingChange?.(true);
      rebuild3DModel();
      (sessionObj as any).outputs = computeOutputs();
      setTimeout(() => onCustomizingChange?.(false), 200);
    },
    destroy: () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      renderer.dispose();
    },
  };
}