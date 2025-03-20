in vec2 aPosition;
in vec2 aUV;
in vec2 aPositionOffset;
in float aIndex;

uniform float vRowCount;
uniform float vColCount;
uniform float vTime;
uniform float manualScale;
uniform float vNoiseLevel;
uniform float vNoisyMin;
uniform float vNoisyMax;
uniform float clipDarkOutliers;
uniform float clipLightOutliers;
uniform int sD;
uniform int sI;
uniform int cO;
uniform sampler2D bTex1;
uniform sampler2D bTex2;
uniform sampler2D noiseTex;
uniform int numBTexes;

uniform float vCellW;
uniform float vCellH;

out vec2 vUV;
out float vIndex;
out float debugF0;
out float debugF1;
out vec2 debugV0;
out vec2 debugV1;

uniform mat3 uProjectionMatrix;
uniform mat3 uWorldTransformMatrix;
uniform mat3 uTransformMatrix;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {

    float clock = vTime;

    float rowCount = vRowCount;
    float colCount = vColCount;

    float totalCells = rowCount * colCount;
    float indexFloat = aIndex * totalCells;
    float x = mod(indexFloat, colCount) / colCount;
    float y = floor(indexFloat / colCount) / rowCount;
    vec2 bTexUV = vec2(x, y);
    float noise = (texture2D(noiseTex, bTexUV).r) * vNoiseLevel;
    vec4 bTexColor = texture2D(bTex1, bTexUV);
    float brightness = bTexColor.r;

    vec2 bTexUV2 = vec2(x, y);
    // bTexUV2 = adjustUV(bTexUV2, bTex2AR);
    vec4 bTexColor2 = texture2D(bTex2, bTexUV2);
    vec4 testLerp = mix(bTexColor, bTexColor2, clock);
    brightness = testLerp.r;

    float scale = 1.;

    // Method 4: Power function for more dramatic curves
    float power = 3.0;  // Try different values for different curves
    float offset = y * 0.25;
    float wave = sign(tan(clock + offset)) * pow(abs(tan(clock + offset)), power);

    // After any of these methods, map to desired range:
    wave = map(wave, -5.0, 5.0, vNoisyMin, vNoisyMax);

    mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;

    vec2 d = (vCellW * 0.5) + (aPosition * scale + (aPositionOffset - (vCellW * 0.5 * scale)));

    vec2 adjustedPosition = vec2(d.x + wave, d.y);

    gl_Position = vec4((mvp * vec3(adjustedPosition, 1.0)).xy, 0.0, 1.0);

    vUV = aUV;
    vIndex = aIndex;
    debugF0 = scale;
    debugV0 = aPosition;
    debugV1 = aPositionOffset;
}