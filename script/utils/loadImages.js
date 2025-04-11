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

  const sourceImgPaths = ["/assets/frame6.png"];
  sv.totalSourceUploadNum = sourceImgPaths.length;

  sv.animUnderImgs = [];

  const img = await loadASetupImage(sourceImgPaths);
  sv.animUnderImgs[0] = img;
}
