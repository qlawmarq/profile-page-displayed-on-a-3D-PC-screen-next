import * as THREE from 'three'
import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Environment, useGLTF, ContactShadows, OrbitControls, SpotLight } from '@react-three/drei'
import { GLTF } from 'three-stdlib';
import { useSpring } from '@react-spring/core'
import { animated as AnimatedtThree } from '@react-spring/three'

export type DreiGLTF = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.MeshStandardMaterial>;
};

const Model: React.FC = (props) => {
  const group = useRef() as any
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const spring = useSpring({ open: Number(isOpen) })
  // Load model
  const { nodes, materials } = useGLTF('/mac-draco.glb') as DreiGLTF
  // Make it float
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.cos(t / 2) / 10 + 0.25, 0.1)
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t / 4) / 10, 0.1)
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, Math.sin(t / 4) / 20, 0.1)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, (-5 + Math.sin(t)) / 5, 0.1)
  })
  // The jsx graph was auto-generated by: https://github.com/pmndrs/gltfjsx
  return (
    <group
      ref={group} 
      dispose={null}
      onClick={(e)=>{
        // setIsOpen(!isOpen);
        setIsOpen(true);
        e.stopPropagation();
      }}
      {...props}
    >
      <AnimatedtThree.group rotation-x={spring.open.to([0, 1], [1.575, -0.425])} position={[0, -0.04, 0.41]}>
        <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={materials.aluminium} geometry={nodes['Cube008'].geometry} />
          <mesh material={materials['matte.001']} geometry={nodes['Cube008_1'].geometry} />
          <mesh geometry={nodes['Cube008_2'].geometry}>
            {isOpen &&
              <Html className="content" rotation-x={-Math.PI / 2} position={[0, 0.05, -0.09]} transform occlude>
                <div className="wrapper">
                  {props.children}
                </div>
              </Html>
            }
          </mesh>
        </group>
      </AnimatedtThree.group>
      <mesh material={materials.keys} geometry={nodes.keyboard.geometry} position={[1.79, 0, 3.45]} />
      <group position={[0, -0.1, 3.39]}>
        <mesh material={materials.aluminium} geometry={nodes['Cube002'].geometry} />
        <mesh material={materials.trackpad} geometry={nodes['Cube002_1'].geometry} />
      </group>
      <mesh material={materials.touchbar} geometry={nodes.touchbar.geometry} position={[0, -0.03, 1.2]} />
    </group>
  )
}

export const PcCanvas: React.FC = (props) => {
  return (
    <main className="h-screen w-screen">
      <Canvas dpr={[1, 2]} camera={{ position: [-10, 0, -25], fov: 25 }}>
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Suspense fallback={null}>
          <group rotation={[0, Math.PI, 0]}>
            <Model>
                {props.children}
            </Model>
          </group>
          <Environment preset="city" />
        </Suspense>
        <ContactShadows rotation-x={Math.PI / 2} position={[0, -4.5, 0]} opacity={1} width={20} height={20} blur={2} far={4.5} />
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </main>
  )
}
