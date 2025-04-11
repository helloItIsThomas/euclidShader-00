import { sv } from "../utils/variables.js";

export function draw() {
  if (sv.triangleMesh && sv.workerDone) {
    const uniforms = sv.triangleMesh.shader.resources.waveUniforms.uniforms;

    uniforms.time = sv.clock;
    uniforms.vTime = sv.clock;
  }
}
