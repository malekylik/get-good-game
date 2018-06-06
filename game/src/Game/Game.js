import Canvas from '../Canvas/Canvas';
import EventQueue from '../event/EventQueue/EventQueue';
import events from '../event/events/events';
import UI from '../UI/UI';
import ImageComponent from '../UI/ImageComponent/ImageComponent';
import TextInputModalWindow from '../UI/ModalWindows/TextInputModalWindow';
import Progressbar from '../UI/Component/Progressbar';
import MonsterGraphicComponent from '../GraphicComponent/MonsterGraphicComponent';

import { Component, CompositeComponent } from '../UI/Component/Component';


const createImgPromise = (img) => {
    return new Promise((resolve) => {
        img.onload = (i) => {
            resolve(i.srcElement);
        } 
    })
}

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
            this.name = e.target.getParentComponent().getInputUser();
            this.ui.remove(modalWindow);
            this.canvas.getHtml().style.cursor = 'auto';
        });

        const progress = new Progressbar((window.innerHeight / 2) + 200, (window.innerWidth / 2), 150, 20, 0, 100, 28);
        progress.setValue(88);

        this.ui.add(modalWindow);
        this.ui.add(progress);

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

            const headImg = new Image();
            const bodyImg = new Image();
            const leftImg = new Image();
            const rightImg = new Image();
            const legImg = new Image();
    
            headImg.src = '../assets/monsters/heads/head_3.png';
            bodyImg.src = '../assets/monsters/bodies/body_4.png';
            leftImg.src = '../assets/monsters/arms/left/arm_2.png';
            rightImg.src = '../assets/monsters/arms/right/arm_2.png';
            legImg.src = '../assets/monsters/legs/leg_2.png';
            Promise.all([
                createImgPromise(headImg),
                createImgPromise(bodyImg),
                createImgPromise(leftImg),
                createImgPromise(rightImg),
                createImgPromise(legImg),
            ]).then((result) => {  
                const monsterGraphic = new MonsterGraphicComponent(50, 150, result[0], result[2], result[3], result[1], result[4]);

                this.canvas.addScene(monsterGraphic);
            }).catch((e) => {
                console.log(e);
            });
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

        // this.canvas.getContext().drawImage(this.image, 10, 10);
    }
}
