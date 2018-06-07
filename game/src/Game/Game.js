import Canvas from '../Canvas/Canvas';
import EventQueue from '../event/EventQueue/EventQueue';
import events from '../event/events/events';
import UI from '../UI/UI';
import ImageComponent from '../UI/ImageComponent/ImageComponent';
import TextInputModalWindow from '../UI/ModalWindows/TextInputModalWindow';
import Progressbar from '../UI/Component/Progressbar';
import MonsterGraphicComponent from '../GraphicComponent/MonsterGraphicComponent';
import ImageLoadManager from '../LoadManager/ImageLoadManager';
import PATH from '../path/path';

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
        const loadManager = new ImageLoadManager();

        loadManager.addUrl(`${PATH.BACKGROUND_IMAGES}/dungeon.jpg`, 'background');

        loadManager.addUrl([
            `${PATH.HEAD_IMAGES}/head_1.png`,
            `${PATH.HEAD_IMAGES}/head_2.png`,
            `${PATH.HEAD_IMAGES}/head_3.png`,
            `${PATH.HEAD_IMAGES}/head_4.png`,
        ],
            'heads'
        );

        loadManager.addUrl([
            `${PATH.BODY_IMAGES}/body_1.png`,
            `${PATH.BODY_IMAGES}/body_2.png`,
            `${PATH.BODY_IMAGES}/body_3.png`,
            `${PATH.BODY_IMAGES}/body_4.png`,
        ],
            'bodies'
        );

        loadManager.addUrl([
            `${PATH.LEFT_ARM_IMAGES}/arm_1.png`,
            `${PATH.LEFT_ARM_IMAGES}/arm_2.png`,
            `${PATH.LEFT_ARM_IMAGES}/arm_3.png`,
            `${PATH.LEFT_ARM_IMAGES}/arm_4.png`,
        ],
            'leftarms'
        );

        loadManager.addUrl([
            `${PATH.RIGHT_ARM_IMAGES}/arm_1.png`,
            `${PATH.RIGHT_ARM_IMAGES}/arm_2.png`,
            `${PATH.RIGHT_ARM_IMAGES}/arm_3.png`,
            `${PATH.RIGHT_ARM_IMAGES}/arm_4.png`,
        ],
            'rightarms'
        );

        loadManager.addUrl([
            `${PATH.LEG_IMAGES}/leg_1.png`,
            `${PATH.LEG_IMAGES}/leg_2.png`,
            `${PATH.LEG_IMAGES}/leg_3.png`,
            `${PATH.LEG_IMAGES}/leg_4.png`,
        ],
            'legs'
        );


        loadManager.calculateTotalSize().then((total) => {
            console.log(`total: ${total}`);
        });

        loadManager.loadImages().then(() => {
            console.log('loaded');

            const background = loadManager.getImagesByName('background')[0];

            const { width, height } = this.background.getClippedBoundingClientRect();

            this.background.setBackgroundImage(new ImageComponent(background, 0, 0, background.naturalWidth, background.naturalHeight, width, height, 0, 0,  background.naturalWidth, background.naturalHeight));

            this.canvas.addScene(this.background);

            const heads = loadManager.getImagesByName('heads');
            const bodies = loadManager.getImagesByName('bodies');
            const leftArms = loadManager.getImagesByName('leftarms');
            const rightArms = loadManager.getImagesByName('rightarms');
            const legs = loadManager.getImagesByName('legs');

            const monsterGraphic = new MonsterGraphicComponent(50, 150, heads[0], leftArms[0], rightArms[0], bodies[0], legs[0]);
    
            this.canvas.addScene(monsterGraphic);
        }).catch((e) => {
            console.log(e);
        });

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
