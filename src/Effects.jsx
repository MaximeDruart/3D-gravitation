import React, { useRef, useEffect, useMemo } from "react"

import { EffectComposer, DepthOfField, Bloom, Noise, Vignette, SMAA } from "@react-three/postprocessing"

const Effects = () => {
  return (
    <EffectComposer>
      <SMAA />
      <DepthOfField focusDistance={0} focalLength={0.2} bokehScale={2} height={480} />
      <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} opacity={1} />
      <Noise opacity={0.025} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  )
}

export default Effects
