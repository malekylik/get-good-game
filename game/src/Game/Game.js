import Canvas from '../Canvas/Canvas';
import EventQueue from '../event/EventQueue/EventQueue';
import events from '../event/events/events';
import UI from '../UI/UI';
import ImageComponent from '../UI/ImageComponent/ImageComponent';
import TextInputModalWindow from '../UI/ModalWindows/TextInputModalWindow';

import { Component, CompositeComponent } from '../UI/Component/Component';

export default class Game {
    constructor() {
        this.canvas = new Canvas();
        this.eventQueue = new EventQueue();
        this.ui = new UI();

        this.background = new Component(0, 0, '100%', '100%');

        this.init();

        const modalWindow = new TextInputModalWindow((((window.innerHeight / 2) - 300 < 0) ? 0 : (window.innerHeight / 2) - 300), (window.innerWidth / 2) - 300, 600, 300, 'Enter your name:');
        modalWindow.setBackgroundColor('#3c76a7');
        modalWindow.addButtonEventListener(events.MOUSE.MOUSE_DOWN, (e) => {
            console.dir(e.target.getParentComponent().getInputUser());
        });

        this.ui.add(modalWindow);

        this.canvas.addUI(this.ui);

        this.main = this.main.bind(this);
        this.main(0);
    }

    init() {
        let image = new Image();
        image.src = '../assets/dungeon.jpg';
        image.onload = (e) => {
            const target = e.target;
            const { width, height } = this.background.getClippedBoundingClientRect();

            this.background.setBackgroundImage(new ImageComponent(image, 0, 0, target.naturalWidth, target.naturalHeight, width, height, 0, 0,  target.naturalWidth, target.naturalHeight));

            this.canvas.addScene(this.background);
        };


        this.canvas.getHtml().addEventListener('mousedown', (e) => {
            this.eventQueue.add({
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
        
        this.canvas.getHtml().addEventListener('keydown', (e) => {
            this.eventQueue.add({
                type: events.KEYBOARD.KEY_DOWN,
                subtype: 'KEYBOARD',
                payload: {
                    key: e.key
                }
            });
        });
        
        this.canvas.getHtml().addEventListener('keypress', (e) => {
            this.eventQueue.add({
                type: events.KEYBOARD.KEY_PRESS,
                subtype: 'KEYBOARD',
                payload: {
                    key: e.key
                }
            });
        });

        this.canvas.getHtml().addEventListener('mousemove', (e) => {
            this.eventQueue.add({
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
    }

    main(time) {
        requestAnimationFrame(this.main);

        if (time !== undefined) {
            if (this.prevTime === undefined) {
                this.prevTime = time;
            }
    
            this.update();

            this.render(time - this.prevTime)
    
            this.prevTime = time;
        }
    }

    update() {
        while (this.eventQueue.hasNext()) {
            const event = this.eventQueue.getNext();
    
            this.ui.handleEvent(event);
        }
    }

    render(timeStamp) {
        this.canvas.draw(timeStamp);
    }
}
