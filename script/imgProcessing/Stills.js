import { sv } from "../utils/variables.js";

export class Still {
  constructor() {
    this.processedImage = null;
    this.currentImageIndex = 0;
    this.cells = [];
  }

  calculateCells(image) {
    const originalW = image.width;
    const originalH = image.height;

    const thisCanvas = document.createElement("canvas");
    thisCanvas.width = originalW;
    thisCanvas.height = originalH;
    const thisCtx = thisCanvas.getContext("2d");
    thisCtx.drawImage(image.canvas, 0, 0, originalW, originalH);

    return new Promise((resolve, reject) => {
      const rowCount = sv.rowCount;
      const colCount = sv.colCount;
      const cellW = originalW / colCount;
      const cellH = originalH / rowCount;

      this.cells = [];

      for (let y = 0; y < rowCount; y++) {
        for (let x = 0; x < colCount; x++) {
          const xPos = x * cellW;
          const yPos = y * cellH;

          // Populate cell object
          this.cells.push({
            gridIndex: y * colCount + x,
            x: xPos,
            y: yPos,
            width: cellW,
            height: cellH,
          });
        }
      }

      resolve();
    });
  }
}
