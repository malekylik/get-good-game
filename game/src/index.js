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
}


class Component {
    constructor(top = 0, left = 0, width = 0, height = 0, parentComponent = null) {
        this.parentComponent = parentComponent;
        this.setBoundingClientRect(top, left, width, height);

        this.drawBorder = false;
        this.overflow = 'visible';

        this.color = {
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: '#000000',
        };
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

    getParentComponent() {
        return this.parentComponent;
    }

    getOverflow() {
        return this.overflow;
    }

    addComponent(component) {

    }

    removeComponent(component) {

    }

    drawComponent(context) {
        
    }

    draw(context) {
        context.save();

        let { top, left, width, height } = this.getBoundingClientRect();
        const parent = this.getParentComponent();

        if (parent !== null) {
            context.translate(parent.getBoundingClientRect().left, parent.getBoundingClientRect().top);
        }

        if (this.overflow === 'hidden') {
            const path = new Path2D();
            path.rect(left, top, width, height);
            context.clip(path, "nonzero");
        }
        

        context.fillStyle = this.color.backgroundColor;
        context.fillRect(left, top, width, height);

        if (this.drawBorder) {
            context.strokeStyle = this.color.borderColor;
            context.strokeRect(left, top, width, height);
        }

        this.drawComponent(context);

        if (this.children) {
            for (let o of this.children) {
                o.draw(context);
            }
        }

        context.restore();
    }
}

class CompositeComponent extends Component {
    constructor(top = 0, left = 0, width = 0, height = 0, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.children = [];
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
}

class Label extends Component {
    constructor(top = 0, left = 0, width = 0, height = 0, text = '', parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.text = text;
        this.color.textColor = '#000000';
        this.textProperties = {
            textAlign: 'center',
            textBaseline: 'middle',
            fontSize: 16,
            fontFamily: 'Arial'
        };

        this.neededToRecalculate = true;
    }

    setText(text = '') {
        this.neededToRecalculate = true;
        this.text = text;
    }

    getText() {
        return this.getText();
    }

    setTextColor(color = '#000000') {
        this.color.textColor = color;
    }

    setFont(font) {
        this.textProperties.font = font;
    }

    calculateLines(context, text) {
        if (this.neededToRecalculate) {
            this.textLines = [];

            const width = this.getBoundingClientRect().width;
            let words = this.text.split(' ');
                
            let line = '';
            let lineWidth = 0;
            words.forEach((word) => {
                if (lineWidth !== 0) {
                    word = ' ' + word;
                }
    
                const wordWidth = context.measureText(word).width;
                
                if (lineWidth + wordWidth <= width) {
                    lineWidth += wordWidth;
                    line += word;
    
                    return;
                }
    
                this.textLines.push(line.trim());
                line = word;
                lineWidth = context.measureText(word.trim()).width;
            });
    
            if (line !== '') {
                this.textLines.push(line.trim());
            }

            this.neededToRecalculate = false;
        }
    }

    drawComponent(context) {
        context.save();

        let { bottom, left, width, height } = this.getBoundingClientRect();

        context.translate(left, bottom);

        context.fillStyle = this.color.textColor;
        context.font = `${this.textProperties.fontSize}px ${this.textProperties.fontFamily}`;
        context.textAlign = this.textProperties.textAlign;
        context.textBaseline = this.textProperties.textBaseline;

        this.calculateLines(context, this.text);

        this.textLines.forEach((line, i) => {        
            context.fillText(line, width / 2, -height / 2 + i * this.textProperties.fontSize);
        });
       
        context.restore();
    }
}

const canvas = new Canvas(document.getElementsByClassName('canvas')[0]);

const scene = new CompositeComponent(50, 100, 1000, 750);
const componentItem1 = new CompositeComponent(10, 10, 200, 200);
const componentItem2 = new CompositeComponent(10,-5, 250, 100);
const componentItem3 = new CompositeComponent(250,250, 25, 10);
const textLabel = new Label(220,10,200,100,'hello   hello hello hello hello hello hello');

scene.setBackgroundColor('#aa0000');
componentItem1.setBackgroundColor('#00aa00');
componentItem2.setBackgroundColor('#0000aa');
componentItem3.setBackgroundColor('#aa00aa');
textLabel.setBackgroundColor('#aaaaaa');


scene.drawBorder = true;
componentItem1.drawBorder = true;
componentItem2.drawBorder = true;

scene.setBorderColor('#ffffff');
componentItem1.setBorderColor('#ffffff');
componentItem2.setBorderColor('#aa0000');

scene.addComponent(componentItem1);
scene.addComponent(componentItem3);
componentItem1.addComponent(componentItem2);
scene.addComponent(textLabel);

// scene.overflow = 'hidden';
// componentItem1.overflow = 'hidden';

canvas.addScene(scene);

const main = () => {
    requestAnimationFrame(main);

    canvas.draw();
};

main();
