import { sv } from "../utils/variables.js";

import {
  Buffer,
  BufferUsage,
  Mesh,
  Shader,
  Geometry,
  Texture,
  ImageSource,
  Container,
} from "pixi.js";

async function loadFragShader() {
  const vertexLoader = import.meta.glob("../../shader/vert.vert", {
    as: "raw",
  });
  const fragmentLoader = import.meta.glob("../../shader/single.frag", {
    as: "raw",
  });

  const [vertex, fragment] = await Promise.all([
    vertexLoader["../../shader/vert.vert"](),
    fragmentLoader["../../shader/single.frag"](),
  ]);

  return { vertex, fragment };
}

export async function shaderRendering() {
  const { vertex, fragment } = await loadFragShader();
  const gl = { vertex, fragment };

  sv.totalTriangles = sv.totalCells;

  sv.instancePositionBuffer = new Buffer({
    data: new Float32Array(sv.totalTriangles * 2),
    usage: BufferUsage.VERTEX | BufferUsage.COPY_DST,
  });

  sv.triangles = [];

  const offsetWidth = sv.pApp.renderer.width * 0.5 - sv.gridW * 0.5;
  const offsetHeight = sv.pApp.renderer.height * 0.5 - sv.gridH * 0.5;

  for (let i = 0; i < sv.totalTriangles; i++) {
    const cell = sv.stills[0].cells[i];
    sv.triangles[i] = {
      // offsetWidth and offsetHeight center it on the canvas.
      x: cell.x + offsetWidth,
      y: cell.y + offsetHeight,
      speed: 1.0,
    };
  }

  // Create a new buffer for unique IDs
  const instanceIndexBuffer = new Buffer({
    data: new Float32Array(
      [...Array(sv.totalTriangles).keys()].map((i) => i / sv.totalTriangles)
    ),
    usage: BufferUsage.VERTEX | BufferUsage.COPY_DST,
  });

  const geometry = new Geometry({
    topology: "triangle-strip",
    instanceCount: sv.totalTriangles,
    attributes: {
      aPosition: [0.0, 0.0, sv.cellW, 0.0, sv.cellW, sv.cellH, 0.0, sv.cellH],
      aUV: [0, 0, 1, 0, 1, 1, 0, 1],
      aPositionOffset: {
        buffer: sv.instancePositionBuffer,
        instance: true,
      },
      aIndex: {
        buffer: instanceIndexBuffer,
        instance: true,
      },
    },
    indexBuffer: [0, 1, 2, 0, 2, 3],
  });

  sv.noisyMin = 0.0;
  sv.noisyMax = 1.0;

  let resources = {};
  if (resources) {
    Object.keys(resources).forEach((key) => {
      const resource = resources[key];
      if (resource instanceof WebGLBuffer) gl.deleteBuffer(resource);
      else if (resource instanceof HTMLElement) resource.remove();
    });
  }
  resources = {}; // Clears the object reference.
  resources = createResources();

  const shader = Shader.from({
    gl,
    resources,
  });

  sv.triangleMesh = new Mesh({
    geometry,
    shader,
    drawMode: "triangle-list",
  });

  sv.pApp.stage.removeChildren();
  sv.sceneContainer = new Container();
  sv.sceneContainerFrame = new Container();
  sv.sceneContainerFrame.addChild(sv.sceneContainer);
  sv.pApp.stage.addChild(sv.sceneContainerFrame);

  const data = sv.instancePositionBuffer.data;
  let count = 0;
  for (let i = 0; i < sv.totalTriangles; i++) {
    const triangle = sv.triangles[i];
    data[count++] = triangle.x * sv.xExcess;
    data[count++] = triangle.y * sv.yExcess;
  }

  sv.sceneContainer.addChild(sv.triangleMesh);
}

function createResources() {
  const graphics = [sv.iconAtlas.canvas];

  const textures = graphics.map(
    (canvas) => new Texture({ source: new ImageSource({ resource: canvas }) })
  );

  const commonResources = {
    sourceTex: textures[0].source,
    waveUniforms: {
      time: { value: 1.0, type: "f32" },
      vTime: { value: 1.0, type: "f32" },
      vCellW: { value: sv.cellW, type: "f32" },
      vCellH: { value: sv.cellH, type: "f32" },
      cellW: { value: sv.cellW, type: "f32" },
      cellH: { value: sv.cellH, type: "f32" },
      gridResolution: { value: sv.gridResolution, type: "f32" },
      rowCount: { value: sv.rowCount, type: "f32" },
      colCount: { value: 1.0, type: "f32" },
      vRowCount: { value: sv.rowCount, type: "f32" },
      vColCount: { value: 1.0, type: "f32" },
      vNoisyMin: { value: sv.noisyMin, type: "f32" },
      vNoisyMax: { value: sv.noisyMax, type: "f32" },
      iconAR: { value: 1.0, type: "f32" },
    },
  };

  return commonResources;
}
