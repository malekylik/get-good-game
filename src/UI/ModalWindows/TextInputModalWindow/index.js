import Canvas from '../../../Canvas/Canvas';
import UI from '../../UI';
import EventQueue from '../../../event/EventQueue/EventQueue';
import events from '../../../event/events/events';
import ImageComponent from '../../ImageComponent/ImageComponent';
import TextInputModalWindow from './TextInputModalWindow';

import { Component, CompositeComponent } from '../../Component/Component';
import { createFilePromise } from '../../../utils/file';
import { getTextWidthWithCanvas } from '../../../utils/textWidth';

const tab = 9;
const space = 32;
const leftArrow = 37;
const upArrow = 38;
const rightArrow = 39;
const downArrow = 40;

window.onload = async () => {
    window.addEventListener("keydown", function(e) {
        if([tab, space, leftArrow, upArrow, rightArrow, downArrow].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    const createTextModalWindow = (description = '', windowComponent, linesNumber = 1) => {
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;
        const { naturalWidth: modalWidth, naturalHeight: modalHeight } = backgroundImage;
        const { naturalWidth: okButtonWidth, naturalHeight: okButtonHeight } = okButtonImage;

        const textModalWindow = new TextInputModalWindow(0, 0, modalWidth, modalHeight, description, windowComponent);
        textModalWindow.setBackgroundColor('#3c76a7');
        textModalWindow.alignCenter(800, 600);
        textModalWindow.setBackgroundImage(new ImageComponent(backgroundImage, 0, 0, modalWidth, modalHeight, modalWidth, modalHeight, 0, 0, modalWidth, modalHeight));

        const inputUserComponent = textModalWindow.getInputUserComponent();
        inputUserComponent.setBoundingClientRect(undefined, undefined, textFieldWidth, textFieldHeight * linesNumber);
        inputUserComponent.setBackgroundImage(new ImageComponent(textFieldImage, 0, 0, textFieldWidth, textFieldHeight, textFieldWidth, textFieldHeight * linesNumber, 0, 0, textFieldWidth, textFieldHeight));

        const oneGlyphWidth = Math.ceil(getTextWidthWithCanvas('x', 'monospace', 16));

        textModalWindow.getInputUserComponent().maxTextLength = (Math.floor(textFieldWidth / oneGlyphWidth) + 1) * linesNumber;
        textModalWindow.getDescriptionComponent().setBackgroundColor('rgba(0, 0, 0, 0)');
        textModalWindow.getDescriptionComponent().setTextColor('#ffffff');

        const okButton = textModalWindow.getOkButtonComponent();
        okButton.setBoundingClientRect(modalHeight - 19 - okButtonHeight, modalWidth - 19 - okButtonWidth / 2, okButtonWidth / 2, okButtonHeight);
        okButton.setBackgroundImage(new ImageComponent(okButtonImage, 0, 0, okButtonWidth, okButtonHeight, okButtonWidth, okButtonHeight, 0, 0, okButtonWidth / 2, okButtonHeight));

        return textModalWindow;
    }

    const setEventListenersToCanvas = (canvas, eventQueue) => {
        const canvasHtml = canvas.getHtml();

        canvasHtml.addEventListener('mouseup', (e) => {
            eventQueue.add({
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
            eventQueue.add({
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
            eventQueue.add({
                type: events.KEYBOARD.KEY_DOWN,
                subtype: 'KEYBOARD',
                canvas: canvasHtml,
                payload: {
                    key: e.key
                }
            });
        });
        
        canvasHtml.addEventListener('keypress', (e) => {
            eventQueue.add({
                type: events.KEYBOARD.KEY_PRESS,
                subtype: 'KEYBOARD',
                canvas: canvasHtml,
                payload: {
                    key: e.key
                }
            });
        });

        canvasHtml.addEventListener('mousemove', (e) => {
            eventQueue.add({
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
    }

    const okButtonImage = new Image();
    okButtonImage.src = './assets/images/ui/okbutton.jpg';

    const textFieldImage = new Image();
    textFieldImage.src = './assets/images/ui/textfield.jpg';

    const backgroundImage = new Image();
    backgroundImage.src = './assets/images/ui/leather.jpg';

    await Promise.all([
        createFilePromise(okButtonImage),
        createFilePromise(textFieldImage),
        createFilePromise(backgroundImage),
    ]);

    const eventQueue1 = new EventQueue();
    const uiComponent1 = new CompositeComponent(0, 0, 800, 600);
    const canvas1 = new Canvas(800, 600);
    setEventListenersToCanvas(canvas1, eventQueue1);
    const ui1 = new UI(canvas1);
    ui1.add(uiComponent1);

    canvas1.addUI(ui1);

    const linkEnterModalWindow = createTextModalWindow('Введите ссылку на изображение:', uiComponent1, 3);
    uiComponent1.addComponent(linkEnterModalWindow);

    const okButtonHandler1 = async () => {
        const link = linkEnterModalWindow.getInputUser();

        const image = new Image();
        image.src = link;

        linkEnterModalWindow.getOkButtonComponent().getBackgroundImage().setFrame(1);
        uiComponent1.removeComponent(linkEnterModalWindow);

        await createFilePromise(image);
        const component = new Component (0, 0, 800, 600);

        const { naturalWidth, naturalHeight } = image;
    
        component.setBackgroundImage(new ImageComponent(image, 0, 0, naturalWidth, naturalHeight, 800 , 600, 0, 0, naturalWidth, naturalHeight));
        canvas1.addScene(component);
    };

    linkEnterModalWindow.addButtonEventListener(events.MOUSE.MOUSE_UP, okButtonHandler1);

    const eventQueue2 = new EventQueue();
    const uiComponent2 = new CompositeComponent(0, 0, 800, 600);
    const canvas2 = new Canvas(800, 600);
    setEventListenersToCanvas(canvas2, eventQueue2);
    const ui2 = new UI(canvas2);
    ui2.add(uiComponent2);

    canvas2.addUI(ui2);

    const nameEnterModalWindow = createTextModalWindow('Введите свое имя', uiComponent2, 1);
    uiComponent2.addComponent(nameEnterModalWindow);

    nameEnterModalWindow.addButtonEventListener(events.MOUSE.MOUSE_UP, (e) => {
        alert(e.target.getParentComponent().getInputUser());
    });

    let prevTime = 0;
    const main = (time) => {
        requestAnimationFrame(main);

        if (time !== undefined) {
            if (prevTime === undefined) {
                prevTime = time;
            }

            update();

            render(time - prevTime)

            prevTime = time;
        }
    }

    const update = () => {
        while (eventQueue1.hasNext()) {
            const event = eventQueue1.getNext();
    
            ui1.handleEvent(event);
        }

        while (eventQueue2.hasNext()) {
            const event = eventQueue2.getNext();
    
            ui2.handleEvent(event);
        }
    }

    const render = (timeStamp) => {
        canvas1.draw(timeStamp);
        canvas2.draw(timeStamp);
    }

    main(0);
};
