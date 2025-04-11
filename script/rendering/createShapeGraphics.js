import { sv } from "../utils/variables.js";

export function createGraphicsForSingleImage() {
  // create a 5x4 texture atlas, or sprite sheet.
  // const atlasColCount = 5;
  // const atlasRowCount = 5;

  const iconW = sv.cellW;
  const iconH = sv.cellH;
  const resolutionMaybe = 3;
  const atlasW = iconW * resolutionMaybe;
  const atlasH = iconH * resolutionMaybe;

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
