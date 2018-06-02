export default class Canvas {
    constructor(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;

        this.htmlComponent = canvas;
        this.context = this.htmlComponent.getContext('2d');

        this.scenes = [];
        this.ui = [];
    }

    getHtml() {
        return this.htmlComponent;
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
