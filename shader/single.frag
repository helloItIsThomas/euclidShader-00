precision highp float;

in vec2 vUV;
in float vIndex;

uniform float rowCount;
uniform float colCount;

uniform sampler2D sourceTex;

void main() {

    float atlasColCount = 5.0;
    float atlasRowCount = 5.0;

    float totalCells = rowCount * colCount;
    float indexFloat = vIndex * totalCells;

    float x = mod(indexFloat, colCount) / colCount;
    float y = floor(indexFloat / colCount) / rowCount;

    float unitW = vUV.x / atlasColCount;
    float unitH = vUV.y / atlasRowCount;

    vec2 test = vec2(unitW + x, unitH + y);

    gl_FragColor = texture2D(sourceTex, test);
}