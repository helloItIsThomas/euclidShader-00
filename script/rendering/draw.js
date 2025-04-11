import { sv } from "../utils/variables.js";

export function draw() {
  if (sv.triangleMesh && sv.workerDone) {
    const uniforms = sv.triangleMesh.shader.resources.waveUniforms.uniforms;

    if (sv.params.startInvisible) {
      uniforms.time = sv.clock;
      uniforms.vTime = sv.clock;
    } else {
      uniforms.time = sv.clock;
      uniforms.vTime = sv.clock;
    }
  }
}
