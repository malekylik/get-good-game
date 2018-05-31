class Canvas {
    constructor(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;

        this.htmlComponent = canvas;
        this.context = this.htmlComponent.getContext('2d');
    }

    clear(color = '#000000') {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    draw() {
        this.clear();

        this.context.fillStyle = "red";
        this.context.fillRect(10, 10, 100, 100);
    }
};


class Component {

};

const canvas = new Canvas(document.getElementsByClassName('canvas')[0]);

const main = () => {
    requestAnimationFrame(main);

    canvas.draw();
};

main();
