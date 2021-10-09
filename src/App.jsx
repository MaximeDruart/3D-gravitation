import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { CameraShake, Html, Instance, Instances, OrbitControls, useCubeTexture, useTexture } from "@react-three/drei"
import { useRef, Suspense, useEffect } from "react"
import Effects from "./Effects"
import { useControls } from "leva"

const particleData = Array.from({ length: 5 })

const vec3 = new THREE.Vector3()

const Particle = ({ attractor, index }) => {
  const ref = useRef()
  const { scene } = useThree()

  const { G, isWindy } = useControls({
    G: {
      value: 0.01,
      min: 0.0001,
      max: 0.2,
      step: 0.0001,
    },
    isWindy: false,
  })

  const state = useRef({
    pos: new THREE.Vector3(Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20),
    vel: new THREE.Vector3().randomDirection().multiplyScalar(0.2),
    acc: new THREE.Vector3(0, 0, 0),
    speedLimit: 0.8,
    mass: 50,
    light: new THREE.PointLight(0xff0000, 10, 15, 2),
  })

  const applyForce = (force) => {
    state.current.acc.add(force)
  }

  const addGravitationalForce = () => {
    const force = vec3.subVectors(attractor.current.position, state.current.pos)
    let distanceSq = force.lengthSq()
    distanceSq = THREE.MathUtils.clamp(distanceSq, 5000, 50000)

    const strength = (G * (attractor.current.userData.mass * state.current.mass)) / distanceSq
    force.setLength(strength)

    applyForce(force)
  }

  useEffect(() => {
    scene.add(state.current.light)
  }, [])

  useFrame(() => {
    addGravitationalForce()
    isWindy && applyForce(vec3.set(0.002, 0.001, 0))
    state.current.vel.add(state.current.acc)
    state.current.vel.clampLength(0, state.current.speedLimit)
    state.current.pos.add(state.current.vel)
    state.current.acc.multiplyScalar(0)

    ref.current.position.copy(state.current.pos)
    ref.current.lookAt(vec3.copy(state.current.pos).add(state.current.vel))
    ref.current.scale.y = THREE.MathUtils.mapLinear(state.current.vel.length(), 10, state.current.speedLimit, 1, 0.8)

    state.current.light.position.copy(ref.current.position)
  })

  return <Instance ref={ref}></Instance>
}

const Particles = ({ attractor }) => {
  return (
    <Instances>
      <meshStandardMaterial roughness={0} metalness={0.2} emissive="white" />
      <sphereBufferGeometry args={[0.4, 16, 16]} />
      {particleData.map((_, i) => (
        <Particle attractor={attractor} index={i} key={i} />
      ))}
    </Instances>
  )
}

const Scene = () => {
  const attractor = useRef()

  const props = useTexture({
    map: "/maps/Lava_001_COLOR-min.png",
    displacementMap: "/maps/Lava_001_DISP-min.png",
    normalMap: "/maps/Lava_001_NRM-min.png",
  })

  useFrame(({ clock, camera }) => {
    // attractor.current.position.lerp(new THREE.Vector3(0, 10, 0), 0.01)
    // attractor.current.position.lerp(vec3.setFromSphericalCoords(3, clock.getElapsedTime(), clock.getElapsedTime()), 0.1)
    // camera.lookAt(attractor.current.position)
  })
  return (
    <group>
      <mesh userData={{ mass: 100 }} ref={attractor}>
        <sphereBufferGeometry args={[3, 64, 64]} />
        <meshStandardMaterial displacementScale={0.4} {...props} />
      </mesh>
      <Particles attractor={attractor} />
    </group>
  )
}

function App() {
  const orbitRef = useRef()
  return (
    <Canvas
      shadows={false}
      style={{ width: "100vw", height: "100vh" }}
      gl={{ powerPreference: "high-performance", alpha: false, antialias: false, stencil: false, depth: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.outputEncoding = THREE.sRGBEncoding
      }}
      camera={{ position: [0, 0, 30] }}
    >
      <color attach="background" args={["#030303"]} />
      <fog color="#161616" attach="fog" far={80} />
      <Suspense fallback={<Html>Loading</Html>}>
        <CameraShake
          maxYaw={0.03} // Max amount camera can yaw in either direction
          maxPitch={0.03} // Max amount camera can pitch in either direction
          maxRoll={0.03} // Max amount camera can roll in either direction
          yawFrequency={0.3} // Frequency of the the yaw rotation
          pitchFrequency={0.3} // Frequency of the pitch rotation
          rollFrequency={0.3} // Frequency of the roll rotation
          controls={orbitRef}
        />
        <OrbitControls enableZoom={false} ref={orbitRef} />
        <Scene />
        <Effects />
      </Suspense>
    </Canvas>
  )
}

export default App
