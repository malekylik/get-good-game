import Canvas from '../Canvas/Canvas';
import EventQueue from '../event/EventQueue/EventQueue';
import events from '../event/events/events';
import UI from '../UI/UI';
import Label from '../UI/Component/Label';
import ImageComponent from '../UI/ImageComponent/ImageComponent';
import TextInputModalWindow from '../UI/ModalWindows/TextInputModalWindow/TextInputModalWindow';
import MagicSelectingModalWindow from '../UI/ModalWindows/MagicSelectingModalWindow';
import LoadingScreen from '../UI/LoadingScreen/LoadingScreen';
import StatusBar from '../UI/Component/StatusBar';
import CharacterInfoWindow from '../UI/Component/CharacterInfoWindow';
import Table from '../UI/Component/Table';
import LoadManager from '../Managers/LoadManager';
import StorageManager from '../Managers/StorageManager';
import PATH from '../path/path';
import MonsterFactory from '../Factories/MonsterFactory';
import TaskFactory from '../Factories/TaskFactory';
import MagicFactory from '../Factories/MagicFactory';
import PlayerGraphicComponent from '../GraphicComponent/PlayerGrapchicComponent';
import Character from '../Character/Character';
import nameTaskMap from '../dictionaries/nameTaskMap';
import countryMap from '../dictionaries/countryMap';

import { Button } from '../UI/Component/Component';
import { Component, CompositeComponent } from '../UI/Component/Component';
import { getTextWidthWithCanvas } from '../utils/textWidth';
import { createFilePromise } from '../utils/file';

export default class Game {
    constructor() {
        this.initTextKeys();

        this.loadManager = new LoadManager();
        this.storageManager = new StorageManager();

        this.canvas = new Canvas();
        this.eventQueue = new EventQueue();
        this.ui = new UI(this.canvas);
        this.uiComponents;

        const { width: canvasWidth, height: canvasHeight } = this.canvas.getSize();
        this.background = new Component(0, 0, canvasWidth, canvasHeight);

        this.init();

        this.main = this.main.bind(this);
        this.main(0);
    }

    initTextKeys() {
        this.backgroundImgsKey = 'background';
        this.mainCharImgsKey = 'mainchar';
        this.headImgsKey = 'heads';
        this.bodyImgsKey = 'bodies';
        this.leftArmImgsKey = 'leftarms';
        this.rightArmImgsKey = 'rightarms';
        this.legImgsKey = 'legs';
        this.magicImgsKey = 'magics';
        this.uiImgsKey = 'ui';
        this.taskImgsKey = 'task';

        this.magicSoundKey = 'magics';

        this.statusBarKey = 'statusbar';
    }

    async init() {
        const loadingScreen = await this.showLoadingScreen();
        const loadingProgressBar = loadingScreen.getLoadingProgressBar();

        this.initLoadingPath();

        const loadManager = this.loadManager;

        await loadManager.calculateTotalSize();
        await loadManager.load((loadedPercentage) => loadingProgressBar.setValue(loadedPercentage));

        this.canvas.removeScene(loadingScreen);

        this.initBackgroundImage(loadManager);

        this.setEventListenersToCanvas();

        const heads = loadManager.getImagesByName(this.headImgsKey);
        const bodies = loadManager.getImagesByName(this.bodyImgsKey);
        const leftArms = loadManager.getImagesByName(this.leftArmImgsKey);
        const rightArms = loadManager.getImagesByName(this.rightArmImgsKey);
        const legs = loadManager.getImagesByName(this.legImgsKey);

        this.monsterFactory = new MonsterFactory(heads, leftArms, rightArms, bodies, legs);
        this.taskFactory = new TaskFactory(this.loadManager.getImagesByName(this.uiImgsKey), this.loadManager.getImagesByName(this.taskImgsKey));
        this.magicFactory = new MagicFactory();

        this.magicFactory.addMagicAssets(loadManager.getImagesByName(this.magicImgsKey).slice(0, 4), loadManager.getSoundByName(this.magicSoundKey)[0], 'magicArrow');
        this.magicFactory.addMagicAssets(loadManager.getImagesByName(this.magicImgsKey).slice(4, 4 + 2), loadManager.getSoundByName(this.magicSoundKey)[1], 'implosion');

        this.canvas.getHtml().focus();
        this.setUpUI();
    }
    
    initBackgroundImage(loadManager) {
        const backgroundImage = loadManager.getImagesByName(this.backgroundImgsKey)[0];

        const { width, height } = this.background.getBoundingClientRect();
        this.background.setBackgroundImage(new ImageComponent(backgroundImage, 0, 0, backgroundImage.naturalWidth, backgroundImage.naturalHeight, width, height, 0, 0,  backgroundImage.naturalWidth, backgroundImage.naturalHeight));

        this.canvas.addScene(this.background);
    }

    setUpUI(name = '') {
        const loadManager = this.loadManager;
        const { width: canvasWidth, height: canvasHeight } = this.canvas.getSize();

        this.uiComponents = new CompositeComponent(0, 0, canvasWidth, canvasHeight);

        const statusBarImg = loadManager.getImagesByName(this.uiImgsKey).slice(5, 5 + 3);

        const statusBarImgObg = {
            back: statusBarImg[0],
            left: statusBarImg[1],
            right: statusBarImg[2],
        };

        const statusBarHeight = 150;
        const statusBar = new StatusBar(canvasHeight - statusBarHeight, 0, canvasWidth, statusBarHeight, statusBarImgObg);
        statusBar.setBackgroundColor('#00ff00');

        const infoWindowImage = loadManager.getImagesByName(this.uiImgsKey)[8];

        const infoWindowWidth = 260;
        const infoWindowHeight = 130;
        const margin = 150;
        const playerInfoWindow = new CharacterInfoWindow(10, Math.ceil(canvasWidth / 2) - infoWindowWidth - margin, infoWindowWidth, infoWindowHeight, '', 0, 100, 0, { back: infoWindowImage });
        const monsterInfoWindow = new CharacterInfoWindow(10, Math.ceil(canvasWidth / 2) + margin, infoWindowWidth, infoWindowHeight, '', 0, 100, 0, { back: infoWindowImage });
        statusBar.setPlayerInfoWindow(playerInfoWindow);
        statusBar.setEnemyInfoWindow(monsterInfoWindow);
        playerInfoWindow.setBackgroundColor('#f4f142');
        monsterInfoWindow.setBackgroundColor('#f4f142');

        this.ui.add(this.uiComponents);

        const enterNameWindow = this.showNameEnter(name);

        const okCallBack = () => {
            const name = enterNameWindow.getInputUser();
            enterNameWindow.getOkButtonComponent().getBackgroundImage().setFrame(0);
            this.uiComponents.removeComponent(enterNameWindow);
            this.canvas.getHtml().style.cursor = 'auto';
    
            this.uiComponents.addComponent(statusBar, this.statusBarKey);
            this.ui.changeSelectedElement(null);

            this.mainLogic(name);
        };

        enterNameWindow.addEventListener(events.KEYBOARD.KEY_PRESS, (e) => {
            if (e.payload.key === 'Enter') {
                okCallBack(e);
            }
        });

        enterNameWindow.addButtonEventListener(events.MOUSE.MOUSE_UP, okCallBack);

        this.uiComponents.addComponent(enterNameWindow);

        this.canvas.addUI(this.ui);
        this.ui.changeSelectedElement(enterNameWindow.getInputUserComponent());
        this.ui.updateTabTree();
        enterNameWindow.getInputUserComponent().setCursorToEnd();
    }

    initLoadingPath() {
        const loadManager = this.loadManager;

        loadManager.addUrl({
            image: [
                `${PATH.IMAGE.UI}/bardata.jpg`,
                `${PATH.IMAGE.UI}/textfield.jpg`,
                `${PATH.IMAGE.UI}/leather.jpg`,
                `${PATH.IMAGE.UI}/okbutton.jpg`,
                `${PATH.IMAGE.UI}/microbutton.jpg`,
                `${PATH.IMAGE.UI}/status.jpg`,
                `${PATH.IMAGE.UI}/statusleft.jpg`,
                `${PATH.IMAGE.UI}/statusright.jpg`,
                `${PATH.IMAGE.UI}/characterinfowindow.jpg`,
                `${PATH.IMAGE.UI}/spellsel.jpg`,
                `${PATH.IMAGE.UI}/table.jpg`,
                `${PATH.IMAGE.UI}/reloadbutton.jpg`,
            ]
        }, {
            image: this.uiImgsKey
        });

        loadManager.addUrl({
            image: [`${PATH.IMAGE.BACKGROUND_IMAGES}/dungeon.jpg`]
        }, {
            image: this.backgroundImgsKey
        });

        loadManager.addUrl({
            image: [`${PATH.IMAGE.MAIN_CHAR}/mainChar.png`]
        }, {
            image: this.mainCharImgsKey
        });

        loadManager.addUrl({
            image: [
                `${PATH.IMAGE.HEAD_IMAGES}/head_1.png`,
                `${PATH.IMAGE.HEAD_IMAGES}/head_2.png`,
                `${PATH.IMAGE.HEAD_IMAGES}/head_3.png`,
                `${PATH.IMAGE.HEAD_IMAGES}/head_4.png`,
            ]
        }, {
            image: this.headImgsKey
        });

        loadManager.addUrl({
            image: [
                `${PATH.IMAGE.BODY_IMAGES}/body_1.png`,
                `${PATH.IMAGE.BODY_IMAGES}/body_2.png`,
                `${PATH.IMAGE.BODY_IMAGES}/body_3.png`,
                `${PATH.IMAGE.BODY_IMAGES}/body_4.png`,
            ]
        }, {
            image: this.bodyImgsKey
        });

        loadManager.addUrl({
            image: [
                `${PATH.IMAGE.LEFT_ARM_IMAGES}/arm_1.png`,
                `${PATH.IMAGE.LEFT_ARM_IMAGES}/arm_2.png`,
                `${PATH.IMAGE.LEFT_ARM_IMAGES}/arm_3.png`,
                `${PATH.IMAGE.LEFT_ARM_IMAGES}/arm_4.png`,
            ]
        }, {
            image: this.leftArmImgsKey
        });

        loadManager.addUrl({
            image: [
                `${PATH.IMAGE.RIGHT_ARM_IMAGES}/arm_1.png`,
                `${PATH.IMAGE.RIGHT_ARM_IMAGES}/arm_2.png`,
                `${PATH.IMAGE.RIGHT_ARM_IMAGES}/arm_3.png`,
                `${PATH.IMAGE.RIGHT_ARM_IMAGES}/arm_4.png`,
            ]
        }, {
            image: this.rightArmImgsKey
        });

        loadManager.addUrl({
            image: [
                `${PATH.IMAGE.LEG_IMAGES}/leg_1.png`,
                `${PATH.IMAGE.LEG_IMAGES}/leg_2.png`,
                `${PATH.IMAGE.LEG_IMAGES}/leg_3.png`,
                `${PATH.IMAGE.LEG_IMAGES}/leg_4.png`,
            ]
        }, {
            image: this.legImgsKey
        });

        loadManager.addUrl({
            image: [
                `${PATH.IMAGE.MAGIC}/magicArrow/magicArrow.png`,
                `${PATH.IMAGE.MAGIC}/magicArrow/magicArrowMotionAnimation.png`,
                `${PATH.IMAGE.MAGIC}/magicArrow/magicArrowMotionAnimationReverse.png`,
                `${PATH.IMAGE.MAGIC}/magicArrow/magicArrowBlowAnimation.png`,
                `${PATH.IMAGE.MAGIC}/decay/decay.png`,
                `${PATH.IMAGE.MAGIC}/decay/decayBlow.png`,
            ],
            sound: [
                `${PATH.SOUND.MAGIC}/magicArrow/MAGICARW.mp3`,
                `${PATH.SOUND.MAGIC}/decay/DECAY.mp3`
            ],
        }, {
            image: this.magicImgsKey,
            sound: this.magicSoundKey
        });

        loadManager.addUrl({
            image: [
                ...nameTaskMap.map(({ image }) => image), 
                ...countryMap.map(({ flagImage }) => flagImage),
            ],
        }, {
            image: this.taskImgsKey,
        });

        return loadManager;
    }

    async mainLogic(name) {
        const loadManager = this.loadManager;
        const taskFactory = this.taskFactory;
        const magicFactory = this.magicFactory;
        const uiComponents = this.uiComponents;

        const { width: canvasWidth, height: canvasHeight } = this.canvas.getSize();

        const spellSelImg = loadManager.getImagesByName(this.uiImgsKey)[9];
        const mainChar = loadManager.getImagesByName(this.mainCharImgsKey)[0];

        const mainCharGraphic = new PlayerGraphicComponent('1%', '11%', mainChar);

        const { width: playerWidth, height: playerHeight } = mainCharGraphic.getBoundingClientRect();

        mainCharGraphic.setBoundingClientRect(Math.floor((canvasHeight - 150) / 2 - playerHeight / 2), Math.floor(canvasWidth / 2 - playerWidth - 100), playerWidth, playerHeight);

        let monster = null;
        let monsterKilledCount = -1;

        const player = new Character(name, 100, 100, mainCharGraphic);

        player.addMagic(magicFactory.createMagicArrow(40));
        player.addMagic(magicFactory.createImplosionArrow(40));

        this.setPlayer(player);

        while(player.isAlive()) {
            if (monster === null || !monster.isAlive()) {
                monster = this.createMonster(magicFactory, canvasWidth, canvasHeight, 5);

                monsterKilledCount += 1;
            }

            const magicSelecting = new MagicSelectingModalWindow(Math.ceil(canvasHeight / 2 - (10 + 100) / 2 - 150 / 2), Math.floor(canvasWidth / 2 - (20 + 136 * 3) / 2), 20 + 136 * 3, 10 + 100 + 3 + 16 + 3, player.getMagics(), { back: spellSelImg });
            magicSelecting.setBackgroundColor('#a0256b');
            magicSelecting.setOverflow('scroll');
 
            uiComponents.addComponent(magicSelecting);

            this.ui.updateTabTree();
            this.ui.changeSelectedElement(magicSelecting.getMagic(0).getGraphicComponent());
            const magic = await magicSelecting.selectMagic();

            if (magic === null) {
                console.log('magic selecting error');
                break;
            }

            uiComponents.removeComponent(magicSelecting);

            const taskWindow = taskFactory.createTask(Math.ceil(canvasHeight / 2) - 344 / 2 - 50, Math.ceil((canvasWidth - 460) / 2), 460, 344, uiComponents);
            taskWindow.setBackgroundColor('#ffff00');

            uiComponents.addComponent(taskWindow);

            this.ui.updateTabTree();
            this.ui.changeSelectedElement(taskWindow.getDefaultComponent());
            const answerOutcome = await taskWindow.getResult();

            uiComponents.removeComponent(taskWindow);

            if (answerOutcome) {
                await player.attack(monster, magic, this.canvas);
            }

            if (monster.isAlive()) {
                const magics = monster.getMagics();
                const index = Math.round(Math.random() * (magics.length - 1));

                await monster.attack(player, magics[index], this.canvas);
            }
        }

        this.showResultTable(player, monsterKilledCount);
    }

    createMonster(magicFactory, canvasWidth, canvasHeight, damage) {
        const monster = this.monsterFactory.createMonster(canvasWidth, canvasHeight);
        this.setEnemy(monster);

        monster.addMagic(magicFactory.createMagicArrow(damage, true));
        monster.addMagic(magicFactory.createImplosionArrow(damage));

        return monster;
    }

    async showLoadingScreen() {
        const { width: canvasWidth, height: canvasHeight } = this.canvas.getSize();
        const progressBarBackground = new Image();
        progressBarBackground.src = `${PATH.IMAGE.UI}/bardata.jpg`;
        await createFilePromise(progressBarBackground);

        const loadingScreen = new LoadingScreen(0, 0, canvasWidth, canvasHeight, progressBarBackground);

        this.canvas.addScene(loadingScreen);

        return loadingScreen;
    }

    showNameEnter(name = '') {
        const textFieldImage = this.loadManager.getImagesByName(this.uiImgsKey)[1];
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;

        const modalWindowImage = this.loadManager.getImagesByName(this.uiImgsKey)[2];
        const { naturalWidth: modalWidth, naturalHeight: modalHeight } = modalWindowImage;

        const okButtonImage = this.loadManager.getImagesByName(this.uiImgsKey)[3];
        const { naturalWidth: okButtonWidth, naturalHeight: okButtonHeight } = okButtonImage;

        const { width: canvasWidth, height: canvasHeight } = this.canvas.getSize();

        const enterNameWindow = new TextInputModalWindow(0, 0, modalWidth, modalHeight, 'Введите свое имя:', this.uiComponents);
        enterNameWindow.setBackgroundColor('#3c76a7');
        enterNameWindow.alignCenter(canvasWidth, canvasHeight);
        enterNameWindow.setBackgroundImage(new ImageComponent(modalWindowImage, 0, 0, modalWidth, modalHeight, modalWidth, modalHeight, 0, 0, modalWidth, modalHeight));

        const inputUserComponent = enterNameWindow.getInputUserComponent();
        inputUserComponent.setBoundingClientRect(undefined, undefined, textFieldWidth, textFieldHeight);
        inputUserComponent.setBackgroundImage(new ImageComponent(textFieldImage, 0, 0, textFieldWidth, textFieldHeight, textFieldWidth, textFieldHeight, 0, 0, textFieldWidth, textFieldHeight));

        const oneGlyphWidth = Math.ceil(getTextWidthWithCanvas('x', 'monospace', 16));

        enterNameWindow.getInputUserComponent().maxTextLength = Math.floor(textFieldWidth / oneGlyphWidth) + 1;
        enterNameWindow.getDescriptionComponent().setBackgroundColor('rgba(0, 0, 0, 0)');
        enterNameWindow.getDescriptionComponent().setTextColor('#ffffff');

        const okButton = enterNameWindow.getOkButtonComponent();
        okButton.setBoundingClientRect(modalHeight - 19 - okButtonHeight, modalWidth - 19 - okButtonWidth / 2, okButtonWidth / 2, okButtonHeight);
        okButton.setBackgroundImage(new ImageComponent(okButtonImage, 0, 0, okButtonWidth, okButtonHeight, okButtonWidth, okButtonHeight, 0, 0, okButtonWidth / 2, okButtonHeight));

        enterNameWindow.getInputUserComponent().setText(name);

        return enterNameWindow;
    }

    showResultTable(player, killedMonster) {
        const tableImg = this.loadManager.getImagesByName(this.uiImgsKey)[10];
        const reloadButtonImg = this.loadManager.getImagesByName(this.uiImgsKey)[11];

        const { naturalWidth: tableImageWidth, naturalHeight: tableImageHeight } = tableImg;
        const tableImageComponent = new ImageComponent(tableImg, 0, 0, tableImageWidth, tableImageHeight, tableImageWidth, tableImageHeight, 0, 0, tableImageWidth, tableImageHeight);

        const { naturalWidth: reloadButtonWidth, naturalHeight: reloadButtonHeight } = reloadButtonImg;
        const reloadButtonImageComponent = new ImageComponent(reloadButtonImg, 0, 0, reloadButtonWidth, reloadButtonHeight, reloadButtonWidth / 2, reloadButtonHeight, 0, 0, reloadButtonWidth / 2, reloadButtonHeight);

        this.storageManager.saveResult(player.getName(), killedMonster);

        const records = this.storageManager.getSortedRecords();

        const oneSellHeight = 25;
        const recordTable = new Table(0, 0, tableImageWidth, tableImageHeight - oneSellHeight, records.length + 1, 2, Math.floor(tableImageWidth / 2), oneSellHeight);
        this.uiComponents.addComponent(recordTable);
        recordTable.alignCenter();
        recordTable.setBackgroundImage(tableImageComponent);
        recordTable.getBackgroundImage().setSize(tableImageWidth, tableImageHeight);

        this.fillTable(recordTable, records);

        recordTable.setOverflow('scroll');

        const { top: topTable, right: rightTable } = recordTable.getBoundingClientRect();

        const restartButton = new Button(topTable, rightTable + 5, reloadButtonWidth / 2, reloadButtonHeight, '');
        restartButton.setBackgroundImage(reloadButtonImageComponent);

        restartButton.tabable = true;
        restartButton.drawBorder = true;
        recordTable.tabable = true;
        recordTable.drawBorder = true;

        this.initTableHandlers(recordTable, restartButton);
        
        this.uiComponents.addComponent(restartButton, 'restart');
        this.ui.changeSelectedElement(recordTable);
        this.ui.updateTabTree();

        return recordTable;
    }

    initTableHandlers(recordTable, restartButton) {
        const okCallback = () => {
            this.ui.dropUI();

            const name = this.player.getName();

            this.setPlayer(null);
            this.setEnemy(null);

            this.canvas.getHtml().style.cursor = 'auto';

            this.canvas.resetUI();
            this.setUpUI(name);
        };

        const mouseEnterHandler = () => {
            if (restartButton.isSelected) {
                restartButton.getBackgroundImage().setFrame(1);
            }
        };

        const mouseUpHandler = () => {
            restartButton.removeEventListener(events.MOUSE.MOUSE_ENTER, mouseEnterHandler);
        };

        restartButton.addEventListener(events.MOUSE.MOUSE_DOWN, () => {
            restartButton.getBackgroundImage().setFrame(1);
        });

        restartButton.addEventListener(events.MOUSE.MOUSE_DOWN, () => {
            restartButton.getBackgroundImage().setFrame(1);

            restartButton.addEventListener(events.MOUSE.MOUSE_ENTER, mouseEnterHandler);
        });

        this.uiComponents.addEventListener(events.MOUSE.MOUSE_UP, mouseUpHandler);

        restartButton.onremove = () => {
            this.uiComponents.removeEventListener(events.MOUSE.MOUSE_UP, mouseUpHandler);
        }

        restartButton.addEventListener(events.MOUSE.MOUSE_LEAVE, () => {           
            if (restartButton.isSelected) {
                restartButton.getBackgroundImage().setFrame(0);
            }
        });

        restartButton.addEventListener(events.MOUSE.MOUSE_UP, () => {
            restartButton.getBackgroundImage().setFrame(0);
            okCallback();
        });

        restartButton.addEventListener(events.KEYBOARD.KEY_PRESS, (e) => {
            if (e.payload.key === 'Enter') {
                okCallback();
            }
        });

        recordTable.addEventListener(events.KEYBOARD.KEY_PRESS, (e) => {
            if (e.payload.key === 'Enter') {
                okCallback();
            }
        });
    }

    fillTable(recordTable, records) {
        const firstColumnName = new Label(0, 0, Math.ceil(getTextWidthWithCanvas('Имя:', 'monospace', 16)), 16, 'Имя:');
        const secondColumnName = new Label(0, 0, Math.ceil(getTextWidthWithCanvas('Убито монстров:', 'monospace', 16)), 16, 'Убито монстров:');
               
        firstColumnName.setTextColor('#ffffff');
        secondColumnName.setTextColor('#ffffff');

        secondColumnName.setFontSize(14);

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

            nameLabel.setTextColor('#ffffff');
            monsterKilledLabel.setTextColor('#ffffff');

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

        if (player === null) {
            return;
        }

        const statusBar = this.uiComponents.getChildComponent(this.statusBarKey);
        statusBar.setPlayerInfo(`${player.getName()}:`, player.getCurrentHP());

        const playerGraphicComponent = player.getGraphicComponent();

        if (playerGraphicComponent !== null) {
            this.canvas.addScene(playerGraphicComponent);
        }

        const healthBar = statusBar.getPlayerInfoWindow().getHealthBar();
        
        player.addHPChangeListener(healthBar.setValue.bind(healthBar));
    }

    setEnemy(enemy) {
        if (this.enemy) {
            this.canvas.removeScene(this.enemy.getGraphicComponent());
        }

        if (enemy === null) {
            return;
        }

        this.enemy = enemy;

        const statusBar = this.uiComponents.getChildComponent(this.statusBarKey);
        statusBar.setEnemyInfo(`${enemy.getName()}:`, enemy.getCurrentHP());

        const enemyGraphicComponent = enemy.getGraphicComponent();

        if (enemyGraphicComponent !== null) {
            this.canvas.addScene(enemyGraphicComponent);
        }

        const healthBar = statusBar.getEnemyInfoWindow().getHealthBar();
        
        enemy.addHPChangeListener(healthBar.setValue.bind(healthBar));
    }

    setEventListenersToCanvas() {
        const canvasHtml = this.canvas.getHtml();

        canvasHtml.addEventListener('mouseup', (e) => {
            this.eventQueue.add({
                type: events.MOUSE.MOUSE_UP,
                subtype: 'MOUSE',
                canvas: canvasHtml,
                payload: {
                    mouseCoord: {
                        top: e.offsetY,
                        left: e.offsetX,
                    }
                }
            });
        });

        canvasHtml.addEventListener('mousedown', (e) => {
            this.eventQueue.add({
                type: events.MOUSE.MOUSE_DOWN,
                subtype: 'MOUSE',
                canvas: canvasHtml,
                payload: {
                    mouseCoord: {
                        top: e.offsetY,
                        left: e.offsetX,
                    }
                }
            });
        });
        
        canvasHtml.addEventListener('keydown', (e) => {
            this.eventQueue.add({
                type: events.KEYBOARD.KEY_DOWN,
                subtype: 'KEYBOARD',
                payload: {
                    key: e.key
                }
            });
        });
        
        canvasHtml.addEventListener('keypress', (e) => {
            this.eventQueue.add({
                type: events.KEYBOARD.KEY_PRESS,
                subtype: 'KEYBOARD',
                payload: {
                    key: e.key
                }
            });
        });

        canvasHtml.addEventListener('mousemove', (e) => {
            this.eventQueue.add({
                type: events.MOUSE.MOUSE_MOVE,
                subtype: 'MOUSE',
                canvas: canvasHtml,
                payload: {
                    mouseCoord: {
                        top: e.offsetY,
                        left: e.offsetX,
                    }
                }
            });
        });

        canvasHtml.addEventListener('blur', () => {
            this.ui.changeSelectedElement(null);
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
