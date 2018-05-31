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
        this.overflow = '';

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

    getOverflow() {
        return this.overflow;
    }

    draw(context) {
        context.save();
        let { top, left, right, bottom, width, height } = this.getBoundingClientRect();
        const parent = this.getParentComponent();

        if (parent !== null) {
            context.translate(parent.getBoundingClientRect().left, parent.getBoundingClientRect().top);
        }
        

        context.fillStyle = this.color.backgroundColor;
        context.fillRect(left, top, width, height);

        if (this.drawBorder) {
            context.strokeStyle = this.color.borderColor;
            context.strokeRect(left, top, width, height);
        }

        if (this.overflow === 'hidden') {
            // context.clip();
        }

        for (let o of this.children) {
            o.draw(context);
        }

        context.restore();
    }
};

const canvas = new Canvas(document.getElementsByClassName('canvas')[0]);

const scene = new Component(20, 50, 1000, 750);
const componentItem1 = new Component(10, 10, 200, 200);
const componentItem2 = new Component(10,-5, 250, 100);
const componentItem3 = new Component(250,250, 25, 10);

scene.setBackgroundColor('#aa0000');
componentItem1.setBackgroundColor('#00aa00');
componentItem2.setBackgroundColor('#0000aa');
componentItem3.setBackgroundColor('#aa00aa');

scene.drawBorder = true;
componentItem1.drawBorder = true;
componentItem2.drawBorder = true;

scene.setBorderColor('#ffffff');
componentItem1.setBorderColor('#ffffff');
componentItem2.setBorderColor('#aa0000');

scene.addComponent(componentItem1);
scene.addComponent(componentItem3);
componentItem1.addComponent(componentItem2);

componentItem1.overflow = 'hidden';
scene.overflow = 'hidden';

canvas.addScene(scene);

const main = () => {
    requestAnimationFrame(main);

    canvas.draw();
};

main();
