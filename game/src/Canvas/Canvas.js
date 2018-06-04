export default class Canvas {
    constructor(width, height) {
        this.htmlComponent = document.createElement('canvas');
        this.htmlComponent.setAttribute('tabindex', 0);

        this.context = this.htmlComponent.getContext('2d');

        if (width === undefined) {
            width = window.innerWidth;
        }

        if (height === undefined) {
            height = window.innerHeight;
        }

        this.setSize(width, height);

        document.body.appendChild(this.htmlComponent);

        this.scenes = [];
        this.ui = [];
    }

    getHtml() {
        return this.htmlComponent;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;

        this.htmlComponent.style.width = `${width}px`;
        this.htmlComponent.style.height = `${height}px`;

        this.context.canvas.width = width;
        this.context.canvas.height = height;
    }

    clear(color = '#000000') {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    addScene(scene) {
        this.scenes.push(scene);
    }

    addUI(ui) {
        this.ui.push(ui);
    }

    removeScene(scene) {
        const index = this.scenes.indexOf(scene);

        if ((~index) !== 0) {
            this.scenes.splice(index, 1);
            return true;
        }

        return false;
    }

    resetScenes() {
        this.scenes = [];
    }

    draw(elapseTime) {
        this.clear();

        for (let o of this.scenes) {
            o.draw(this.context, elapseTime);
        }

        for (let o of this.ui) {
            for (let i of o.uiComponents) {
                i.draw(this.context, elapseTime);
            }
        }
    }
}
