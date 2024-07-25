// src/components/LiverAnimation.js
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function LiverModel(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/liver_model.gltf');

  useFrame((state, delta) => {
    group.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Liver.geometry} material={materials.Material} />
    </group>
  );
}

export default function LiverAnimation() {
  return (
    <Canvas style={{ flex: 1 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} />
      <Suspense fallback={null}>
        <LiverModel />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}
