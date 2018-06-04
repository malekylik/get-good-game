import events from './event/events/events';
import EventQueue from './event/EventQueue/EventQueue';

import UI from './UI/UI';
import Label from './UI/Component/Label';
import Canvas from './Canvas/Canvas';

import { Component, CompositeComponent } from './UI/Component/Component';

import { parseRGBHexToDecObj, rgbColorInterpolation } from './utils/colorInterpolation';

const FPS = 60;

const canvasHTML = document.querySelector('canvas');
const canvas = new Canvas(canvasHTML);

const scene = new CompositeComponent(50, 100, 1000, 750);
const componentItem1 = new CompositeComponent(10, 10, 200, 200);
const componentItem2 = new CompositeComponent(-5,10, 250, 100);
const componentItem3 = new CompositeComponent(250,250, 25, 10);
const textLabel = new Label(220,10,201,100,'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

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

componentItem1.setOverflow('hidden');
scene.addComponent(textLabel);

componentItem1.handlers.addEventListener(events.MOUSE.MOUSE_MOVE, (e) => {
    console.log(e);
});

textLabel.handlers.addEventListener(events.MOUSE.MOUSE_MOVE, (e) => {
  
});

textLabel.animations.setAnimation('background', 2, (context,initialProperties, properties, elapseTime) => {
    properties.color.backgroundColor = rgbColorInterpolation(
        parseRGBHexToDecObj(initialProperties.color.backgroundColor),
        parseRGBHexToDecObj('#0000ff'),
        elapseTime
    );
});

componentItem1.animations.setAnimation('tranlate', 2, (context,initialProperties, properties, elapseTime) => {
    properties.clippedBoundingClientRect.left = initialProperties.clippedBoundingClientRect.left + 50 * elapseTime;
});

const ui = new UI();
ui.add(scene);

canvas.addUI(ui);

const eventQueue = new EventQueue();

canvas.getHtml().addEventListener('mousemove', (e) => {
    eventQueue.add({
        type: events.MOUSE.MOUSE_MOVE,
        subtype: 'MOUSE',
        payload: {
            mouseCoord: {
                top: e.offsetY,
                left: e.offsetX,
            }
        }
    });
});

canvas.getHtml().addEventListener('mousedown', (e) => {
    eventQueue.add({
        type: events.MOUSE.MOUSE_DOWN,
        subtype: 'MOUSE',
        payload: {
            mouseCoord: {
                top: e.offsetY,
                left: e.offsetX,
            }
        }
    });
});

canvas.getHtml().addEventListener('keydown', (e) => {
    eventQueue.add({
        type: events.KEYBOARD.KEY_DOWN,
        subtype: 'KEYBOARD',
        payload: {
            key: e.key
        }
    });
});

canvas.getHtml().addEventListener('keypress', (e) => {
    eventQueue.add({
        type: events.KEYBOARD.KEY_PRESS,
        subtype: 'KEYBOARD',
        payload: {
            key: e.key
        }
    });
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

