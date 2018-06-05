const context = document.createElement('canvas').getContext('2d');

export const getTextWidthWithDom = (text, fontFamily, fontSize) => {
    const span = document.createElement('span');

    span.innerText = text;
    span.style.visibility = 'hidden';
    span.style.whiteSpace = 'nowrap';
    span.style.fontFamily = fontFamily;
    span.style.fontSize = fontSize;

    document.body.appendChild(span);

    const textWidth = span.offsetWidth;

    document.body.removeChild(span);

    return textWidth;
};

export const getTextWidthWithCanvas = (text, fontFamily, fontSize) => {
    context.font = `${fontSize} ${fontFamily}`;
    return context.measureText(text).width;
};
