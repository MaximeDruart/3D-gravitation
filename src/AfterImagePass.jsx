import React, { forwardRef, useMemo } from "react"
import { Uniform } from "three"
import { Effects } from "@react-three/drei"
import { extend } from "@react-three/fiber"

import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js"

extend({ AfterimagePass })

function AfterImage() {
  return <Effects children={<afterimagePass attachArray="passes" />} />
}

export default AfterImage
