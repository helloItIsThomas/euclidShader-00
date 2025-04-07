import { downloadCanvas } from "../utils/utils.js";
import { sv } from "../utils/variables.js";

const cDiamMult = 0.5;

export function createGraphicsForSingleImage() {
  // create a 5x4 texture atlas, or sprite sheet.
  const atlasColCount = 5;
  const atlasRowCount = 5;

  // DON'T CHANGE borderScaler WITHOUT REFERRING TO THE COMMENT IN THE VERT SHADER
  const borderScaler = 0.9;
  const iconW = sv.cellW;
  const iconH = sv.cellH;
  const atlasW = iconW * atlasColCount;
  const atlasH = iconH * atlasRowCount;

  if (sv.createGraphicsForSingleImageGraphic) {
    sv.createGraphicsForSingleImageGraphic.remove();
    sv.createGraphicsForSingleImageGraphic = undefined;
  }

  const pg = sv.p.createGraphics(atlasW, atlasH);
  pg.pixelDensity(2);
  sv.createGraphicsForSingleImageGraphic = pg;

  pg.image(sv.animUnderImgs[0], 0, 0, atlasW, atlasH);

  return pg;
}
