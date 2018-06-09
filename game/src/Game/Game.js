import Canvas from '../Canvas/Canvas';
import EventQueue from '../event/EventQueue/EventQueue';
import events from '../event/events/events';
import UI from '../UI/UI';
import Label from '../UI/Component/Label';
import ImageComponent from '../UI/ImageComponent/ImageComponent';
import TextInputModalWindow from '../UI/ModalWindows/TextInputModalWindow';
import SolveExpressionTaskWindow from '../UI/ModalWindows/SolveExpressionTaskWindow';
import MagicSelectingModalWindow from '../UI/ModalWindows/MagicSelectingModalWindow';
import ProgressBar from '../UI/Component/ProgressBar';
import StatusBar from '../UI/Component/StatusBar';
import CharacterInfoWindow from '../UI/Component/CharacterInfoWindow';
import Table from '../UI/Component/Table';
import ImageLoadManager from '../Managers/ImageLoadManager';
import StorageManager from '../Managers/StorageManager';
import PATH from '../path/path';
import MonsterFactory from '../Factories/MonsterFactory';
import MagicGraphicComponent from '../GraphicComponent/MagicGraphicComponent';
import PlayerGraphicComponent from '../GraphicComponent/PlayerGrapchicComponent';
import Character from '../Character/Character';
import Magic from '../Magic/Magic';

import { Component, CompositeComponent } from '../UI/Component/Component';
import { getTextWidthWithCanvas } from '../utils/textWidth';

export default class Game {
    constructor() {
        this.backgroundImgsKey = 'background';
        this.mainCharImgsKey = 'mainchar';
        this.magicImgsKey = 'magics';
        this.headImgsKey = 'heads';
        this.bodyImgsKey = 'bodies';
        this.leftArmImgsKey = 'leftarms';
        this.rightArmImgsKey = 'rightarms';
        this.legImgsKey = 'legs';

        this.statusBarKey = 'statusbar';

        this.monsterKillCount = 0;

        this.loadManager = new ImageLoadManager();
        this.storageManager = new StorageManager();

        this.canvas = new Canvas();
        this.eventQueue = new EventQueue();
        this.ui = new UI();
        this.uiComponents = new CompositeComponent(0, 0, window.innerWidth, window.innerHeight);

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

        const loadingProgressBar = new ProgressBar(0, 0, loadingProgressBarWidth, loadingProgressBarHeight, 0, 100, 0);
        loadingScreen.addComponent(loadingProgressBar);
        loadingProgressBar.alignCenter();

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

        loadManager.addUrl([
            `${PATH.MAGIC}/magicArrow.png`,
        ],
            this.magicImgsKey
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

        this.monsterFactory = new MonsterFactory(heads, leftArms, rightArms, bodies, legs);

        const statusBar = new StatusBar(window.innerHeight - 150, 0, window.innerWidth, 150);
        statusBar.setBackgroundColor('#00ff00');

        const playerInfoWindow = new CharacterInfoWindow(10, Math.ceil(window.innerWidth / 2) - 200 - 150, 200, 130, '', 0, 100, 0);
        const monsterInfoWindow = new CharacterInfoWindow(10, Math.ceil(window.innerWidth / 2) + 150, 200, 130, '', 0, 100, 0);
        statusBar.setPlayerInfoWindow(playerInfoWindow);
        statusBar.setEnemyInfoWindow(monsterInfoWindow);
        playerInfoWindow.setBackgroundColor('#f4f142');
        monsterInfoWindow.setBackgroundColor('#f4f142');

        this.ui.add(this.uiComponents);

        // const table = new Table(10, 10, 600, 500, 3, 2, 100, 100);
        // table.setBackgroundColor('#ffffff');
        // const tableLabel = new Label(0, 0, 30, 16, 'abc');
        // table.getTableComponent(1, 1).addComponent(tableLabel);
        // tableLabel.alignCenter();

        // this.uiComponents.addComponent(table);

        const modalWindow = new TextInputModalWindow(0, 0, 600, 300, 'Enter your name:');
        modalWindow.setBackgroundColor('#3c76a7');
        modalWindow.alignCenter();
        modalWindow.addButtonEventListener(events.MOUSE.MOUSE_DOWN, (e) => {
            const name = e.target.getParentComponent().getInputUser();
            this.uiComponents.removeComponent(modalWindow);
            this.canvas.getHtml().style.cursor = 'auto';

            this.uiComponents.addComponent(statusBar, this.statusBarKey);

            this.mainLogic(name);
        });

        this.uiComponents.addComponent(modalWindow);

        this.canvas.addUI(this.ui);
    }   

    async mainLogic(name) {
        let selectedMagicPromise = null;
        let answerOutcomePromise = null;
        const loadManager = this.loadManager;
        const monsterFactory = this.monsterFactory;

        const magicArrowImg = loadManager.getImagesByName(this.magicImgsKey)[0];

        const magicArrowGraphicComponent = new MagicGraphicComponent(10, 10, 2, magicArrowImg);
        const magicArrow = new Magic('Magic arrow', 40, magicArrowGraphicComponent);

        const mainChar = loadManager.getImagesByName(this.mainCharImgsKey)[0];

        const mainCharGraphic = new PlayerGraphicComponent('1%', '11%', mainChar);

        const { width: playerWidth, height: playerHeight } = mainCharGraphic.getClippedBoundingClientRect();

        mainCharGraphic.setBoundingClientRect(Math.floor((window.innerHeight - 150) / 2 - playerHeight / 2), Math.floor(window.innerWidth / 2 - playerWidth - 100), playerWidth, playerHeight);

        const player = new Character(name, 100, 100, mainCharGraphic);
        player.addMagic(magicArrow);

        this.setPlayer(player);

        let monster = monsterFactory.createMonster('1%', '11%');
        this.setEnemy(monster);

        let monsterKillCount = 0;

        while(player.isAlive()) {
            if (!monster.isAlive()) {
                monster = this.monsterFactory.createMonster('1%', '11%');
                this.setEnemy(monster);

                monsterKillCount += 1;
            }

            const magicSelecting = new MagicSelectingModalWindow(Math.ceil(window.innerHeight / 2 - (10 + 100) / 2 - 150 / 2), Math.floor(window.innerWidth / 2 - (20 + 136 * 3) / 2), 20 + 136 * 3, 10 + 100, player.getMagic());
            magicSelecting.setBackgroundColor('#a0256b');
    
            this.uiComponents.addComponent(magicSelecting);

            selectedMagicPromise = new Promise((resolve) => {
                magicSelecting.addMagicSelectingEventListener(events.MOUSE.MOUSE_DOWN, (e) => {
                    resolve(e.target.getParentComponent().findMagicByGraphicComponent(e.target));
                });
            });

            const magic = await selectedMagicPromise;

            if (magic === null) {
                console.log('magic selecting error');
                break;
            }

            this.uiComponents.removeComponent(magicSelecting);

            const taskWindow = new SolveExpressionTaskWindow(20, Math.ceil((window.innerWidth - 700) / 2), 700, window.innerHeight - 150 - 40);
            taskWindow.setBackgroundColor('#ffff00');

            answerOutcomePromise = new Promise((resolve) => {
                taskWindow.addButtonEventListener(events.MOUSE.MOUSE_DOWN, (e) => {
                        resolve(e.target.getParentComponent().answerIsRight());
                });
            });

            this.uiComponents.addComponent(taskWindow);

            const answerOutcome = await answerOutcomePromise;

            this.uiComponents.removeComponent(taskWindow);

            if (answerOutcome) {
                player.attack(monster, magic);
            }

            monster.attack(player);
        }

        this.storageManager.saveResult(player.getName(), monsterKillCount);

        const records = this.storageManager.getSortedRecords();

        const recordTable = new Table(0, 0, 600, 300, records.length + 1, 2, 300, 100);
        this.uiComponents.addComponent(recordTable);
        recordTable.alignCenter();

        const firstColumnName = new Label(0, 0, Math.ceil(getTextWidthWithCanvas('Имя:', 'monospace', 16)), 16, 'Имя:');
        const secondColumnName = new Label(0, 0, Math.ceil(getTextWidthWithCanvas('Убито монстров:', 'monospace', 16)), 16, 'Убито монстров:');
        
        recordTable.getTableComponent(0, 0).addComponent(firstColumnName);
        firstColumnName.alignCenter();

        recordTable.getTableComponent(0, 1).addComponent(secondColumnName);
        secondColumnName.alignCenter();

        records.forEach((record, i) => {
            const { name, monsterKilled } = record;

            if (name === undefined) {
                name = '';
            }

            const nameLabel = new Label(0, 0, Math.ceil(getTextWidthWithCanvas(name, 'monospace', 16)), 16, name);
            const monsterKilledLabel = new Label(0, 0, Math.ceil(getTextWidthWithCanvas(monsterKilled, 'monospace', 16)), 16, String(monsterKilled));

            recordTable.getTableComponent(1 + i, 0).addComponent(nameLabel);
            nameLabel.alignCenter();

            recordTable.getTableComponent(1 + i, 1).addComponent(monsterKilledLabel);
            monsterKilledLabel.alignCenter();
        });
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

        const healthBar = this.uiComponents.getChildComponent(this.statusBarKey).getPlayerInfoWindow().getHealthBar();
        
        player.addHPChangeListener(healthBar.setValue.bind(healthBar));
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

        const healthBar = this.uiComponents.getChildComponent(this.statusBarKey).getEnemyInfoWindow().getHealthBar();
        
        enemy.addHPChangeListener(healthBar.setValue.bind(healthBar));
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
