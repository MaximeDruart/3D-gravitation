function Environment() {
  const { gl, scene } = useThree()

  const cubeMap = useCubeTexture(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"], {
    path: "/cube/",
  })

  useEffect(() => {
    const gen = new THREE.PMREMGenerator(gl)
    gen.compileEquirectangularShader()
    const hdrCubeRenderTarget = gen.fromCubemap(cubeMap)
    cubeMap.dispose()
    gen.dispose()
    scene.environment = hdrCubeRenderTarget.texture
    return () => (scene.environment = scene.background = null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cubeMap])
  return null
}

export default environment
