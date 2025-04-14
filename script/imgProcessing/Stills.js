import { sv } from "../utils/variables.js";

export class Still {
  constructor() {
    this.processedImage = null;
    this.currentImageIndex = 0;
    this.cells = [];
  }

  populateGridWithWorker(image) {
    const originalW = image.width;
    const originalH = image.height;

    const thisCanvas = document.createElement("canvas");
    thisCanvas.width = originalW;
    thisCanvas.height = originalH;
    const thisCtx = thisCanvas.getContext("2d");
    thisCtx.drawImage(image.canvas, 0, 0, originalW, originalH);

    return new Promise((resolve, reject) => {
      const worker = new Worker(
        new URL("/script/workers/populateWorker.js", import.meta.url),
        { type: "module" }
      );

      const imageData = thisCtx.getImageData(0, 0, originalW, originalH);

      const rowCount = sv.rowCount;
      const colCount = sv.colCount;
      const cellW = originalW / colCount;
      const cellH = originalH / rowCount;

      worker.postMessage({ imageData, rowCount, colCount, cellW, cellH });

      worker.onmessage = (e) => {
        this.cells = e.data.cells;
        console.log(e.data);
        resolve();
      };
      worker.onerror = (e) => {
        reject();
        console.error("Worker error:", e.message, e);
      };
    });
  }
}
