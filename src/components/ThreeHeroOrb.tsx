import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeHeroOrbProps {
  className?: string;
}

export const ThreeHeroOrb: React.FC<ThreeHeroOrbProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteractive, setIsInteractive] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as per Three.js skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lighting (3-Point Studio + Warm/Cool contrast)
    const ambientLight = new THREE.AmbientLight(0x064e3b, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x34d399, 3.5); // Mint key light
    keyLight.position.set(5, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 2.0); // Cyan fill light
    fillLight.position.set(-5, -3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x10b981, 4.0, 15);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Composite 3-12 Part Procedural Holographic Orb (THREE.Group)
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // Part 1: Central Glowing Energy Nucleus
    const coreGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    heroGroup.add(coreMesh);

    // Part 2: Geometric Outer Crystal Shell (Icosahedron)
    const crystalGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x6ee7b7,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.9,
      wireframe: false,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    heroGroup.add(crystalMesh);

    // Part 3: Holographic Facet Wireframe
    const wireGeo = new THREE.IcosahedronGeometry(1.41, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    heroGroup.add(wireMesh);

    // Part 4 & 5: Concentric Orbital Gyro Rings (Torus)
    const ring1Geo = new THREE.TorusGeometry(2.0, 0.03, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x047857,
      emissiveIntensity: 0.3,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    heroGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    heroGroup.add(ring2);

    // Part 6: Floating Sustainability Nodes (Orbiting Octahedrons)
    const nodesGroup = new THREE.Group();
    heroGroup.add(nodesGroup);
    const nodeGeo = new THREE.OctahedronGeometry(0.18);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xa7f3d0,
      emissive: 0x10b981,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.7,
    });

    const nodeCount = 6;
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 2.6;
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * radius, (Math.sin(i * 2) * 0.4), Math.sin(angle) * radius);
      nodesGroup.add(node);
    }

    // Part 7: Swirling Nano-Particle Cloud
    const particleCount = isSoftwareGl ? 60 : 160;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.8 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    heroGroup.add(particleSystem);

    // Mouse Interaction with Damping
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x * 0.6;
      mouse.targetY = y * 0.4;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with Clock and Smooth Exponential Damping
    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouse.x = THREE.MathUtils.damp(mouse.x, mouse.targetX, 4, delta);
      mouse.y = THREE.MathUtils.damp(mouse.y, mouse.targetY, 4, delta);

      // Rotations
      heroGroup.rotation.y = time * 0.25 + mouse.x * 0.8;
      heroGroup.rotation.x = Math.sin(time * 0.2) * 0.1 + mouse.y * 0.6;

      ring1.rotation.z = time * 0.4;
      ring2.rotation.x = time * 0.35;
      nodesGroup.rotation.y = -time * 0.2;
      crystalMesh.rotation.y = -time * 0.15;
      particleSystem.rotation.y = time * 0.1;

      // Gentle floating levitation
      heroGroup.position.y = Math.sin(time * 1.2) * 0.1;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[280px] pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};
