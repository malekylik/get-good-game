const context2D = canvas.getContext('2d');
let { width, height } = canvas;

const clearCanvas = (color = '#000000') => {
    context2D.fillStyle = color;
    context2D.fillRect(0, 0, width, height);
}


class Component {

};

const draw = () => {
    clearCanvas();

    context2D.fillStyle = "green";
    context2D.fillRect(10, 10, 100, 100);
};

const main = () => {
    requestAnimationFrame(main);

    draw();
};

main();
