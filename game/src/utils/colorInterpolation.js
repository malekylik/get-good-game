export const rgbColorInterpolation = (first, second, t) => {
    let interpolateR = Math.floor((first.r + (second.r - first.r) * t)).toString(16);
    let interpolateG = Math.floor((first.g + (second.g - first.g) * t)).toString(16);
    let interpolateB = Math.floor((first.b + (second.b - first.b) * t)).toString(16);
    const interpolateA = Math.floor((first.a + (second.a - first.a) * t)).toString(16);

    if (interpolateR.length < 2) {
        interpolateR = interpolateR.padStart(2, '0');
    }

    if (interpolateG.length < 2) {
        interpolateG = interpolateG.padStart(2, '0');
    }

    if (interpolateB.length < 2) {
        interpolateB = interpolateB.padStart(2, '0');
    }

    return `#${interpolateR}${interpolateG}${interpolateB}`;
}

export const parseRGBHexToDecObj = (color) => {
    let colorArr = color.slice(1, color.length).match(/.{1,2}/g);

    return {
        r: parseInt(colorArr[0], 16),
        g: parseInt(colorArr[1], 16),
        b: parseInt(colorArr[2], 16),
    };
};
