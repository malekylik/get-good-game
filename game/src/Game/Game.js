import Canvas from '../Canvas/Canvas';
import EventQueue from '../event/EventQueue/EventQueue';
import events from '../event/events/events';
import UI from '../UI/UI';
import ImageComponent from '../UI/ImageComponent/ImageComponent';
import TextInputModalWindow from '../UI/ModalWindows/TextInputModalWindow';
import ProgressBar from '../UI/Component/ProgressBar';
import StatusBar from '../UI/Component/StatusBar';
import CharacterInfoWindow from '../UI/Component/CharacterInfoWindow';
import ImageLoadManager from '../LoadManager/ImageLoadManager';
import PATH from '../path/path';
import MonsterFactory from '../Factories/MonsterFactory';
import PlayerGraphicComponent from '../GraphicComponent/PlayerGrapchicComponent';
import Character from '../Character/Character';

import { Component, CompositeComponent } from '../UI/Component/Component';

export default class Game {
    constructor() {
        this.backgroundImgsKey = 'background';
        this.mainCharImgsKey = 'mainchar';
        this.headImgsKey = 'heads';
        this.bodyImgsKey = 'bodies';
        this.leftArmImgsKey = 'leftarms';
        this.rightArmImgsKey = 'rightarms';
        this.legImgsKey = 'legs';
        this.statusBarKey = 'statusbar';

        this.loadManager = new ImageLoadManager();

        this.canvas = new Canvas();
        this.eventQueue = new EventQueue();
        this.ui = new UI();
        this.uiComponents = new CompositeComponent(0, 0, window.innerWidth, window.innerWidth);

        this.background = new Component(0, 0, '100%', '100%');

        this.init();

        this.main = this.main.bind(this);
        this.main(0);
    }

    async init() {
        const loadingScreen = new CompositeComponent(0, 0, window.innerWidth, window.innerHeight);

        loadingScreen.setBackgroundColor('#000000');

        const loadingProgressBarWidth = 400;
        const loadingProgressBarHeight = 100;

        const loadingProgressBar = new ProgressBar(Math.floor(window.innerHeight / 2 - loadingProgressBarHeight / 2), Math.floor(window.innerWidth / 2 - loadingProgressBarWidth / 2), loadingProgressBarWidth, loadingProgressBarHeight, 0, 100, 0);
        loadingScreen.addComponent(loadingProgressBar);

        this.canvas.addScene(loadingScreen);

        const loadManager = this.loadManager;

        loadManager.addUrl(`${PATH.BACKGROUND_IMAGES}/dungeon.jpg`,  this.backgroundImgsKey);
        loadManager.addUrl(`${PATH.MAIN_CHAR}/mainChar.png`,  this.mainCharImgsKey);

        loadManager.addUrl([
            `${PATH.HEAD_IMAGES}/head_1.png`,
            `${PATH.HEAD_IMAGES}/head_2.png`,
            `${PATH.HEAD_IMAGES}/head_3.png`,
            `${PATH.HEAD_IMAGES}/head_4.png`,
        ],
            this.headImgsKey
        );

        loadManager.addUrl([
            `${PATH.BODY_IMAGES}/body_1.png`,
            `${PATH.BODY_IMAGES}/body_2.png`,
            `${PATH.BODY_IMAGES}/body_3.png`,
            `${PATH.BODY_IMAGES}/body_4.png`,
        ],
            this.bodyImgsKey
        );

        loadManager.addUrl([
            `${PATH.LEFT_ARM_IMAGES}/arm_1.png`,
            `${PATH.LEFT_ARM_IMAGES}/arm_2.png`,
            `${PATH.LEFT_ARM_IMAGES}/arm_3.png`,
            `${PATH.LEFT_ARM_IMAGES}/arm_4.png`,
        ],
            this.leftArmImgsKey
        );

        loadManager.addUrl([
            `${PATH.RIGHT_ARM_IMAGES}/arm_1.png`,
            `${PATH.RIGHT_ARM_IMAGES}/arm_2.png`,
            `${PATH.RIGHT_ARM_IMAGES}/arm_3.png`,
            `${PATH.RIGHT_ARM_IMAGES}/arm_4.png`,
        ],
            this.rightArmImgsKey
        );

        loadManager.addUrl([
            `${PATH.LEG_IMAGES}/leg_1.png`,
            `${PATH.LEG_IMAGES}/leg_2.png`,
            `${PATH.LEG_IMAGES}/leg_3.png`,
            `${PATH.LEG_IMAGES}/leg_4.png`,
        ],
            this.legImgsKey
        );

        const totalSize = await loadManager.calculateTotalSize();

        console.log(`total: ${totalSize}`);

        await loadManager.loadImages((loadedPercentage) => loadingProgressBar.setValue(loadedPercentage));

        console.log('loaded');

        this.canvas.removeScene(loadingScreen);

        const background = loadManager.getImagesByName(this.backgroundImgsKey)[0];

        const { width, height } = this.background.getClippedBoundingClientRect();

        this.background.setBackgroundImage(new ImageComponent(background, 0, 0, background.naturalWidth, background.naturalHeight, width, height, 0, 0,  background.naturalWidth, background.naturalHeight));

        this.canvas.addScene(this.background);

        this.setEventListenersToCanvas();

        const heads = loadManager.getImagesByName(this.headImgsKey);
        const bodies = loadManager.getImagesByName(this.bodyImgsKey);
        const leftArms = loadManager.getImagesByName(this.leftArmImgsKey);
        const rightArms = loadManager.getImagesByName(this.rightArmImgsKey);
        const legs = loadManager.getImagesByName(this.legImgsKey);

        const mainChar = loadManager.getImagesByName(this.mainCharImgsKey)[0];

        this.monsterFactory = new MonsterFactory(heads, leftArms, rightArms, bodies, legs);

        const monster = this.monsterFactory.createMonster('1%', '11%');
        const mainCharGraphic = new PlayerGraphicComponent('1%', '11%', mainChar);

        const { width: playerWidth, height: playerHeight } = mainCharGraphic.getClippedBoundingClientRect();

        mainCharGraphic.setBoundingClientRect(Math.floor((window.innerHeight - 150) / 2 - playerHeight / 2), Math.floor(window.innerWidth / 2 - playerWidth - 100), playerWidth, playerHeight);

        const player = new Character('Man', 100, 65, 40, mainCharGraphic);

        const statusBar = new StatusBar(window.innerHeight - 150, 0, window.innerWidth, 150);
        statusBar.setBackgroundColor('#00ff00');

        const playerInfoWindow = new CharacterInfoWindow(10, Math.ceil(window.innerWidth / 2) - 200 - 150, 200, 130, 'Player', 0, 100, 33);
        const monsterInfoWindow = new CharacterInfoWindow(10, Math.ceil(window.innerWidth / 2) + 150, 200, 130, 'Monster', 0, 100, 66);
        statusBar.setPlayerInfoWindow(playerInfoWindow);
        statusBar.setEnemyInfoWindow(monsterInfoWindow);
        playerInfoWindow.setBackgroundColor('#f4f142');
        monsterInfoWindow.setBackgroundColor('#f4f142');

        this.uiComponents.addComponent(statusBar, this.statusBarKey);

        this.ui.add(this.uiComponents);

        this.setEnemy(monster);
        this.setPlayer(player);

        // const modalWindow = new TextInputModalWindow((((window.innerHeight / 2) - 300 < 0) ? 0 : (window.innerHeight / 2) - 300), (window.innerWidth / 2) - 300, 600, 300, 'Enter your name:');
        // modalWindow.setBackgroundColor('#3c76a7');
        // modalWindow.addButtonEventListener(events.MOUSE.MOUSE_DOWN, (e) => {
        //     this.name = e.target.getParentComponent().getInputUser();
        //     this.ui.remove(modalWindow);
        //     this.canvas.getHtml().style.cursor = 'auto';
        // });



        this.canvas.addUI(this.ui);
    }

    setPlayer(player) {
        if (this.player) {
            this.canvas.removeScene(this.player.getGraphicComponent());
        }

        this.player = player;

        const statusBar = this.uiComponents.getChildComponent(this.statusBarKey);
        statusBar.setPlayerInfo(`${player.getName()}:`, player.getCurrentHP());

        const playerGraphicComponent = player.getGraphicComponent();

        if (playerGraphicComponent !== null) {
            this.canvas.addScene(playerGraphicComponent);
        }
    }

    setEnemy(enemy) {
        if (this.enemy) {
            this.canvas.removeScene(this.enemy.getGraphicComponent());
        }

        this.enemy = enemy;

        const statusBar = this.uiComponents.getChildComponent(this.statusBarKey);
        statusBar.setEnemyInfo(`${enemy.getName()}:`, enemy.getCurrentHP());

        const enemyGraphicComponent = enemy.getGraphicComponent();

        if (enemyGraphicComponent !== null) {
            this.canvas.addScene(enemyGraphicComponent);
        }
    }

    setEventListenersToCanvas() {
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
