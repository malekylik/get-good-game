const events = {
    MOUSE: {
        MOUSE_MOVE: 'mousemove',
        HOVER: 'hover'
    }
};

const FPS = 60;

const rgbColorInterpolation = (first, second, t) => {
    const interpolateR = (first.r + (second.r - first.r) * t).toString(16);
    const interpolateG = (first.g + (second.g - first.g) * t).toString(16);
    const interpolateB = (first.b + (second.b - first.b) * t).toString(16);
    const interpolateA = (first.a + (second.a - first.a) * t).toString(16);

    return `#${interpolateR}${interpolateG}${interpolateB}`;
}

class EventQueue {
    constructor() {
        this.queue = [];

        this.queueIndex = 0;
    }

    add(event) {
        this.queue.push(event);
    }

    getNext() {
        if (this.queue.length === 0) {
            return null;
        }

        if (this.queueIndex < this.queue.length) {
            const event = this.queue[this.queueIndex];
            this.queueIndex += 1;
            return event;
        }

        this.queueIndex = 0;
        this.queue = [];

        return null;
    }

    hasNext() {
        const hasNext = !!(this.queue.length - this.queueIndex);

        if (!hasNext && this.queue.length !== 0) {
            this.queueIndex = 0;
            this.queue = [];
        }

        return hasNext;
    }

    remain() {
        return this.queue.length - this.queueIndex;
    }
}

class EventHandlers {
    constructor() {
        this[events.MOUSE.MOUSE_MOVE] = [];
        this[events.MOUSE.HOVER] = [];
    }

    handle(event) {
        const handlers = this[event.type];

        if (handlers) {
            for (let handler of handlers) {
                handler(event.payload);
            }
        }
    }

    addEventListener(name, event) {
        if (this[name]) {
            this[name].push(event);
        }
    }
}

class Canvas {
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

class Collision {
    isInside(firstMetric, secondMetric) {
        const keys = Object.keys(firstMetric);

        if (firstMetric.left < secondMetric.left + secondMetric.width &&
            firstMetric.left + firstMetric.width > secondMetric.left &&
            firstMetric.top < secondMetric.top + secondMetric.height &&
            firstMetric.height + firstMetric.top > secondMetric.top) {
                return true;
            }

        return false
    }
}

class Component {
    constructor(top = 0, left = 0, width = 0, height = 0, parentComponent = null) {
        this.parentComponent = parentComponent;

        this.properties = {};

        this.properties.drawBorder = false;
        this.properties.overflow = 'visible';

        this.properties.color = {
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: '#000000',
        };

        this.properties.cursor = 'auto';

        this.collision = new Collision();
        this.animations = new Animatable(this);

        this.handlers = new EventHandlers();
        this.handlers.addEventListener(events.MOUSE.HOVER, this.handleHover.bind(this));
        

        this.setBoundingClientRect(top, left, width, height);
    }

    handleHover(e) {
        if (canvasHTML.style.cursor !== this.properties.cursor) {
            canvasHTML.style.cursor = this.properties.cursor;
        }
    }

    getBoundingClientRect() {
        return this.animations.animatedProperties.boundingClientRect;
    }

    setBoundingClientRect(top = 0, left = 0, width = 0, height = 0) {
        this.properties.boundingClientRect = {
            top,
            left,
            width,
            height,
            right: left + width,
            bottom: top + height
        };

        this.animations.animatedProperties.boundingClientRect = {
            top,
            left,
            width,
            height,
            right: left + width,
            bottom: top + height
        };
    }

    setBackgroundColor(color = '#000000') {
        this.properties.color.backgroundColor = color;
        this.animations.animatedProperties.color.backgroundColor = color;
    }

    setBorderColor(color = '#000000') {
        this.properties.color.borderColor = color;
        this.animations.animatedProperties.color.borderColor = color;
    }

    setParentComponent(parentComponent) {
        this.parentComponent = parentComponent;
    }

    getParentComponent() {
        return this.parentComponent;
    }

    getOverflow() {
        return this.properties.overflow;
    }

    addComponent(component) {

    }

    removeComponent(component) {

    }

    setContextProperties(context, elapseTime) {
        this.animations.animate(context, this, elapseTime);
    }

    paintComponent(context, elapseTime) {
        context.save();
        let { top, left, width, height } = this.getBoundingClientRect();

        context.fillStyle = this.animations.animatedProperties.color.backgroundColor;
        context.fillRect(left, top, width, height);
        context.restore();
    }

    drawComponent(context, elapseTime) {
        context.save();

        this.setContextProperties(context, elapseTime);
        this.paintComponent(context, elapseTime);

        context.restore();
    }

    draw(context, elapseTime) {
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
        
        if (this.drawBorder) {
            context.strokeStyle = this.animations.animatedProperties.color.borderColor;
            context.strokeRect(left, top, width, height);
        }

        this.drawComponent(context, elapseTime);

        if (this.children) {
            for (let o of this.children) {
                o.draw(context, elapseTime);
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

    traverse(callback) {
        callback(this);

        if (this.children) {
            for (let o of this.children) {
                if (o.traverse) {
                    o.traverse(callback);
                } else {
                    callback(o);
                }
            } 
        } 
    }

    checkForCollision(objectMetric) {
        const elementInside = [];
        let biggestDepth = 1;

        this.traverse((o) => {
            const { top, left, width, height } = o.getBoundingClientRect();
            const oCoord = {
                width,
                height
            };

            let absoluteTop = top;
            let absoluteLeft = left;

            let depth = 1;

            let parent = o.getParentComponent();

            while (parent !== null) {
                const { top, left } = parent.getBoundingClientRect();
                
                absoluteTop += top;
                absoluteLeft += left;

                depth += 1;

                parent = parent.getParentComponent();
            }

            oCoord.top = absoluteTop;
            oCoord.left = absoluteLeft;

            if (this.collision.isInside(oCoord, objectMetric)) {
                elementInside.push({
                    o,
                    depth
                });

                if (depth > biggestDepth) {
                    biggestDepth = depth;
                }
            }
        });

        if (elementInside.length !== 0) {
            return elementInside;
        }

        return null;
    }
}

class Label extends Component {
    constructor(top = 0, left = 0, width = 0, height = 0, text = '', parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.text = text;
        this.properties.color.textColor = '#000000';
        this.properties.textProperties = {
            textAlign: 'center',
            textBaseline: 'middle',
            fontSize: 16,
            fontFamily: 'Arial'
        };

        this.properties.cursor = 'text';

        _.merge(this.animations.animatedProperties, this.properties);

        this.neededToRecalculate = true;
        this.cursorPosition = -1;
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

    setContextProperties(context, elapseTime) {
        context.fillStyle = this.animations.animatedProperties.color.textColor;
        context.font = `${this.animations.animatedProperties.textProperties.fontSize}px ${this.animations.animatedProperties.textProperties.fontFamily}`;
        context.textAlign = this.animations.animatedProperties.textProperties.textAlign;
        context.textBaseline = this.animations.animatedProperties.textProperties.textBaseline;     

        super.setContextProperties(context, elapseTime)
    }

    paintComponent(context, elapseTime) { 
        super.paintComponent(context, elapseTime);
        let { width, height, bottom, left } = this.getBoundingClientRect();

        context.translate(left, bottom);

        this.calculateLines(context, this.text);

        this.textLines.forEach((line, i) => {        
            context.fillText(line, width / 2, -height / 2 + i * this.animations.animatedProperties.textProperties.fontSize);
        });
    }
}

class Animatable {
    constructor(component) {
        this.animatedProperties = {};
        _.merge(this.animatedProperties, component.properties);

        this.animations = {

        };
    }

    setAnimation(name, time, animationFunc) {
        this.animations[name] = {
            animationFunc,
            time: time * 1000,
            elapseTime: 0,
        };
    }

    animate(context, component, elapseTime) {
        const keys = Object.keys(this.animations);

        for (let i = 0; i < keys.length; i++) {
            const a = this.animations[keys[i]];

            a.animationFunc(context,component.properties, this.animatedProperties, a.elapseTime / a.time);

            a.elapseTime += elapseTime;

            if (a.elapseTime > a.time) {
                a.elapseTime = 0;

                this.animatedProperties = {};
                _.merge(this.animatedProperties, component.properties);
            } 
        }
    }
}

class UI {
    constructor() {
        this.selected = null;
        this.uiComponents = [];
    }

    handleEvent(event) {
        if (events[event.subtype] === events.MOUSE) {
            const elements = scene.checkForCollision({ ...event.payload.mouseCoord, width: 1, height: 1 }); 
            if (elements !== null) {
                let mostDepth = 0;
                let index = -1;
        
                elements.forEach(({ depth }, i) => {
                    if (depth > mostDepth) {
                        mostDepth = depth;
                        index = i;
                    };
                });
                
                const element = elements[index].o;
                element.handlers.handle(event);
            } else {
                if (canvasHTML.style.cursor !== 'auto') {
                    canvasHTML.style.cursor = 'auto';
                }
            }
        }
    }

    add(component) {
        this.uiComponents.push(component);
    }
}

const canvasHTML = document.getElementsByClassName('canvas')[0];
const canvas = new Canvas(canvasHTML);

const scene = new CompositeComponent(50, 100, 1000, 750);
const componentItem1 = new CompositeComponent(10, 10, 200, 200);
const componentItem2 = new CompositeComponent(10,-5, 250, 100);
const componentItem3 = new CompositeComponent(250,250, 25, 10);
const textLabel = new Label(220,10,200,100,'hello   hello hello hello hello hello hello hello');

scene.setBackgroundColor('#aa0000');
componentItem1.setBackgroundColor('#00aa00');
componentItem2.setBackgroundColor('#0000aa');
componentItem3.setBackgroundColor('#aa00aa');
textLabel.setBackgroundColor('#aaaaaa');

scene.drawBorder = true;
componentItem1.drawBorder = true;
componentItem2.drawBorder = true;

componentItem1.overflow = 'hidden';

scene.setBorderColor('#ffffff');
componentItem1.setBorderColor('#ffffff');
componentItem2.setBorderColor('#aa0000');

scene.addComponent(componentItem1);
scene.addComponent(componentItem3);
componentItem1.addComponent(componentItem2);
scene.addComponent(textLabel);

componentItem1.handlers.addEventListener(events.MOUSE_MOVE, (e) => {
    console.log(e.mouseCoord);
});

// scene.animations.setAnimation('background', 2, (context,initialProperties, properties, elapseTime) => {
//     properties.boundingClientRect.left = initialProperties.boundingClientRect.left + 150 * elapseTime;
// });

const ui = new UI();
ui.add(scene);

canvas.addUI(ui);

const eventQueue = new EventQueue();

canvas.getHtml().addEventListener('mousemove', (e) => {
    let event = {
        type: events.MOUSE.MOUSE_MOVE,
        subtype: 'MOUSE',
        payload: {
            mouseCoord: {
                top: e.offsetY,
                left: e.offsetX,
            }
        }
    };

    eventQueue.add(event);

    event.type = events.MOUSE.HOVER;

    eventQueue.add(event);
});

const update = () => {
    while (eventQueue.hasNext()) {
        const event = eventQueue.getNext();

        ui.handleEvent(event);
    }
};

let prevTime;

const main = (time) => {
    requestAnimationFrame(main);

    if (time !== undefined) {
        if (prevTime === undefined) {
            prevTime = time;
        }

        update();

        canvas.draw(time - prevTime);

        prevTime = time;
    }
};

window.onload = () => {
    main();
};

