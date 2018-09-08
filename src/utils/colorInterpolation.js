const formatValue = (value) => {
    let formatedValue = value;

    if (formatedValue.length < 2) {
        formatedValue = formatedValue.padStart(2, '0');
    }

    return formatedValue;
};

export const rgbColorInterpolation = (first, second, t) => {
    let interpolateR = Math.floor((first.r + (second.r - first.r) * t)).toString(16);
    let interpolateG = Math.floor((first.g + (second.g - first.g) * t)).toString(16);
    let interpolateB = Math.floor((first.b + (second.b - first.b) * t)).toString(16);

    interpolateR = formatValue(interpolateR);
    interpolateG = formatValue(interpolateG);
    interpolateB = formatValue(interpolateB);

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
