// import { updateActiveImgBar } from "./eventHandlers.js";
import { downloadCanvas } from "./utils.js";
import { sv } from "./variables.js";

export async function loadSetupImages() {
  // should run once
  const loadASetupImage = (path) => {
    return new Promise((resolve, reject) => {
      sv.p.loadImage(
        path,
        (img) => {
          resolve(img);
        },
        (err) => {
          console.log("Error: " + err);
          reject(err);
        }
      );
    });
  };

  sv.singleImgIconPaths = Array.from(
    { length: 25 },
    (_, i) => `/assets/brightnessSortedSVG/${i}.svg`
  );

  const sourceImgPaths = ["/assets/frame6.png"];
  sv.totalSourceUploadNum = sourceImgPaths.length;

  sv.animUnderImgs = [];

  await Promise.all(
    sourceImgPaths.map(async (path, index) => {
      const img = await loadASetupImage(path);
      sv.animUnderImgs[index] = img;
    })
  );
}
