export default class Canvas {
    constructor(width, height) {
        this.htmlComponent = document.createElement('canvas');
        this.htmlComponent.setAttribute('tabindex', 0);

        this.context = this.htmlComponent.getContext('2d');

        if (width === undefined) {
            width = 1366;
        }

        if (height === undefined) {
            height = 635;
        }

        this.setSize(width, height);

        document.body.appendChild(this.htmlComponent);

        this.scenes = [];
        this.uis = [];
    }

    getHtml() {
        return this.htmlComponent;
    }

    getContext() {
        return this.context;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;

        this.htmlComponent.style.width = `${width}px`;
        this.htmlComponent.style.height = `${height}px`;

        this.context.canvas.width = width;
        this.context.canvas.height = height;
    }

    getSize() {
        return {
            width: this.width,
            height: this.height
        };
    }

    clear(color = '#000000') {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    addScene(scene) {
        this.scenes.push(scene);
    }

    addUI(ui) {
        this.uis.push(ui);
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

    resetUI() {
        this.uis = [];
    }

    draw(elapseTime) {
        this.clear();

        for (let scene of this.scenes) {
            scene.draw(this.context, elapseTime);
        }

        for (let ui of this.uis) {
            for (let uiComponent of ui.uiComponents) {
                uiComponent.draw(this.context, elapseTime);
            }
        }
    }
}
