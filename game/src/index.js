class Canvas {
    constructor(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;

        this.htmlComponent = canvas;
        this.context = this.htmlComponent.getContext('2d');

        this.scenes = [];
    }

    clear(color = '#000000') {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    addScene(scene) {
        this.scenes.push(scene);
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

    draw() {
        this.clear();

        for (let o of this.scenes) {
            o.draw(this.context);
        }
    }
};


class Component {
    constructor(top = 0, left = 0, width = 0, height = 0, parentComponent = null) {
        this.parentComponent = parentComponent;
        this.setBoundingClientRect(top, left, width, height);

        this.drawBorder = false;

        this.color = {
            backgroundColor: '#000000',
            borderColor: '#000000',
        };

        this.children = [];
    }

    getBoundingClientRect() {
        return this.boundingClientRect;
    }

    setBoundingClientRect(top = 0, left = 0, width = 0, height = 0) {
        if (this.parentComponent !== null) {
            let { top: topParent, left: leftParent } = this.parentComponent.getBoundingClientRect();

            top += topParent;
            left += leftParent;
        }

        this.boundingClientRect = {
            top,
            left,
            width,
            height,
            right: left + width,
            bottom: top + height
        };
    }

    setBackgroundColor(color = '#000000') {
        this.color.backgroundColor = color;
    }

    setBorderColor(color = '#000000') {
        this.color.borderColor = color;
    }

    setParentComponent(parentComponent) {
        this.parentComponent = parentComponent;
        const { top, left, width, height } = this.getBoundingClientRect();
        this.setBoundingClientRect(top, left, width, height);
    }

    addComponent(component) {
        component.setParentComponent(this);
        this.children.push(component);
    }

    removeComponent(component) {
        const index = this.children.indexOf(component);

        if ((~index) !== 0) {
            this.children.splice(index, 1);
            return true;
        }

        return false;
    }

    getParentComponent() {
        return this.parentComponent;
    }

    draw(context) {
        let { top, left, width, height } = this.getBoundingClientRect();
        
        context.fillStyle = this.color.backgroundColor;
        context.fillRect(top, left, width, height);

        if (this.drawBorder) {
            context.strokeStyle = this.color.borderColor;
            context.strokeRect(top, left, width, height);
        }

        for (let o of this.children) {
            o.draw(context);
        }
    }
};

const canvas = new Canvas(document.getElementsByClassName('canvas')[0]);

const scene = new Component(20, 50, 1000, 750);
const componentItem1 = new Component(20, 20, 200, 200);
const componentItem2 = new Component(5, 5, 100, 100);

scene.setBackgroundColor('#aa0000');
componentItem1.setBackgroundColor('#00aa00');
componentItem2.setBackgroundColor('#0000aa');

scene.drawBorder = true;
componentItem1.drawBorder = true;
componentItem2.drawBorder = true;

scene.setBorderColor('#ffffff');
componentItem1.setBorderColor('#ffffff');
componentItem2.setBorderColor('#aa0000');

scene.addComponent(componentItem1);
componentItem1.addComponent(componentItem2);

canvas.addScene(scene);

const main = () => {
    requestAnimationFrame(main);

    canvas.draw();
};

main();
