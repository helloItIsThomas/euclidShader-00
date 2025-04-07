import { sv } from "./variables.js";

export function createInput() {
  if (sv.inputElement) sv.inputElement.remove();

  sv.inputElement = sv.p.createFileInput(function (_file) {
    sv.totalSourceUploadNum = sv.inputElement.elt.files.length;

    sv.tempUploadFiles.push(_file);
    if (sv.tempUploadFiles.length === sv.totalSourceUploadNum) {
      sv.tempUploadFiles = [];
    }
  }, true);
}
