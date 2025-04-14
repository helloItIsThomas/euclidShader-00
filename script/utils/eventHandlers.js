import { sv } from "./variables.js";
import { updateCellData } from "../imgProcessing/imageProcessing.js";
import { fitImageToWindow, downloadCanvas } from "../utils/utils.js";
import { gsap } from "gsap";

export async function recalculateGrid(resizeTo = "bodyRight") {
  console.log("recalculating grid");
  let _imgs = Array.isArray(sv.animUnderImgs)
    ? sv.animUnderImgs
    : [sv.animUnderImgs];

  // Preprocess images
  const processedImages = _imgs.map((img) => {
    img = fitImageToWindow(img, resizeTo);

    const processed = img.get();
    return processed;
  });

  const imgs = processedImages;

  sv.gridW = imgs[0].width;
  sv.gridH = imgs[0].height;

  sv.workerDone = false;

  sv.colCount = sv.gridResolution;
  sv.cellW = sv.gridW / sv.colCount;
  sv.cellH = sv.cellW;
  sv.rowCount = sv.p.floor(sv.gridH / sv.cellH);
  sv.totalCells = sv.rowCount * sv.colCount;
  sv.xExcess = (sv.cellW * sv.colCount) / sv.gridW;
  sv.yExcess = (sv.cellH * sv.rowCount) / sv.gridH;

  return imgs;
}

let resizeTimeout;
let resizingStarted = false;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);

  if (!resizingStarted) resizingStarted = true;

  resizeTimeout = setTimeout(async () => {
    const passMeImgs = await recalculateGrid();
    await updateCellData(passMeImgs);

    resizingStarted = false; // Reset for next resize
  }, 500); // Adjust timeout as needed
});
