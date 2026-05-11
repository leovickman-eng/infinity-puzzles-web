'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NODE_COLORS = [
  '#FF6B35', '#7B2FBE', '#0EC7B4', '#FFD23F', '#FF4B8B',
  '#4BBAFF', '#FF8C42', '#A8EB12', '#F7B731', '#2BCADD',
  '#FF6B6B', '#845EC2', '#00C9A7', '#FFC75F', '#F9F871',
  '#D65DB1', '#FF9671', '#4FFBDF', '#FF8066',
];

const CONNECTION_THRESHOLD = 3.5;

type NodeData = {
  basePos: THREE.Vector3;
  phase: number;
  speed: number;
  ampX: number;
  ampY: number;
  ampZ: number;
};

function buildNodes(): NodeData[] {
  // Arrange 19 nodes in a loose sphere with some intentional clustering
  const positions: [number, number, number][] = [
    [0, 0, 0],
    [-2.5, 1.2, 0.8], [2.5, 1.2, -0.8],
    [-1.8, -2.0, 1.0], [1.8, -2.0, -1.0],
    [0, 2.8, 0.5], [0, -2.8, -0.5],
    [-3.2, 0, -0.5], [3.2, 0, 0.5],
    [-1.2, 2.0, -2.0], [1.2, 2.0, 2.0],
    [-2.8, -1.2, -1.5], [2.8, -1.2, 1.5],
    [0.8, -1.5, 2.8], [-0.8, 1.5, -2.8],
    [-1.5, 0.5, 2.2], [1.5, -0.5, -2.2],
    [2.0, 2.5, 0], [-2.0, -2.5, 0],
  ];

  return positions.map((p, i) => ({
    basePos: new THREE.Vector3(...p),
    phase: (i / 19) * Math.PI * 2,
    speed: 0.25 + (i % 5) * 0.06,
    ampX: 0.25 + (i % 3) * 0.1,
    ampY: 0.2 + (i % 4) * 0.08,
    ampZ: 0.15 + (i % 5) * 0.06,
  }));
}

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Nodes
    const nodeData = buildNodes();
    const nodePositions = nodeData.map((n) => n.basePos.clone());

    const nodeMeshes = nodeData.map((n, i) => {
      const geo = new THREE.SphereGeometry(0.14, 12, 12);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(NODE_COLORS[i]),
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(n.basePos);
      scene.add(mesh);

      // Soft glow ring
      const glowGeo = new THREE.SphereGeometry(0.28, 12, 12);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(NODE_COLORS[i]),
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      mesh.add(glow);

      return mesh;
    });

    // Build connections (pairs within threshold)
    type LinePair = { a: number; b: number; line: THREE.Line };
    const connections: LinePair[] = [];

    for (let i = 0; i < nodeData.length; i++) {
      const neighbors: { j: number; dist: number }[] = [];
      for (let j = i + 1; j < nodeData.length; j++) {
        const dist = nodeData[i].basePos.distanceTo(nodeData[j].basePos);
        if (dist < CONNECTION_THRESHOLD) {
          neighbors.push({ j, dist });
        }
      }
      // Keep at most 3 nearest
      neighbors.sort((a, b) => a.dist - b.dist);
      neighbors.slice(0, 3).forEach(({ j }) => {
        const points = [nodeData[i].basePos.clone(), nodeData[j].basePos.clone()];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.12,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const line = new THREE.Line(geo, mat);
        scene.add(line);
        connections.push({ a: i, b: j, line });
      });
    }

    // Resize
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Animate
    let raf: number;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Update node positions
      nodeData.forEach((n, i) => {
        const px = n.basePos.x + Math.sin(t * n.speed + n.phase) * n.ampX;
        const py = n.basePos.y + Math.cos(t * n.speed * 0.7 + n.phase + 1) * n.ampY;
        const pz = n.basePos.z + Math.sin(t * n.speed * 0.5 + n.phase + 2) * n.ampZ;
        nodeMeshes[i].position.set(px, py, pz);
        nodePositions[i].set(px, py, pz);
      });

      // Update connection line geometry
      connections.forEach(({ a, b, line }) => {
        const posAttr = line.geometry.attributes.position as THREE.BufferAttribute;
        posAttr.setXYZ(0, nodePositions[a].x, nodePositions[a].y, nodePositions[a].z);
        posAttr.setXYZ(1, nodePositions[b].x, nodePositions[b].y, nodePositions[b].z);
        posAttr.needsUpdate = true;

        // Pulse opacity based on distance
        const dist = nodePositions[a].distanceTo(nodePositions[b]);
        const opacity = Math.max(0, 0.22 - dist * 0.04);
        (line.material as THREE.LineBasicMaterial).opacity = opacity;
      });

      // Slow camera orbit
      camera.position.x = Math.sin(t * 0.06) * 1.5;
      camera.position.y = Math.cos(t * 0.04) * 1.0;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
