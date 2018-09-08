import Label from '../../Component/Label';
import events from '../../../event/events/events';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { Button } from '../../Component/Component';
import { CompositeComponent } from '../../Component/Component';
import { getTextWidthWithCanvas } from '../../../utils/textWidth';

export default class TaskModalWindow extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, description = '' , additionalResources = {}, windowComponent, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        const halfWidth = Math.ceil(width / 2);
        let halfDescriptionWidth = Math.ceil((getTextWidthWithCanvas(description, 'monospace', '16px') ) / 2);


        const descriptionMargin = 20;
        if (halfDescriptionWidth > halfWidth - descriptionMargin) {
            halfDescriptionWidth = halfWidth - descriptionMargin;
        }
       
        const taskDescription = new Label(10, halfWidth - halfDescriptionWidth, halfDescriptionWidth * 2, 30, description);

        const enterWidth = 100;
        const enterHeight = 100;
        const enterButton = new Button(0, 0, enterWidth, enterHeight, '');

        taskDescription.setBackgroundColor('#00bbbb');

        enterButton.setBackgroundColor('#aaaaaa');

        this.descriptionKey = 'description';
        this.buttonKey = 'button';

        this.addComponent(taskDescription, this.descriptionKey);
        this.addComponent(enterButton, this.buttonKey);

        taskDescription.setBackgroundColor('rgba(0, 0, 0, 0)');
        taskDescription.setTextColor('#ffffff');

        const modalWindowImage = additionalResources.images.modalWindowImage;
        const { naturalWidth: modalWidth, naturalHeight: modalHeight } = modalWindowImage;

        const okButtonImage = additionalResources.images.okButtonImage;
        const { naturalWidth: okButtonWidth, naturalHeight: okButtonHeight } = okButtonImage;

        this.setBackgroundImage(new ImageComponent(modalWindowImage, 0, 0, modalWidth, modalHeight, modalWidth, modalHeight, 0, 0, modalWidth, modalHeight));

        const enterButtonMargin = 19;
        enterButton.setBoundingClientRect(modalHeight - enterButtonMargin - okButtonHeight, modalWidth - enterButtonMargin - okButtonWidth / 2, okButtonWidth / 2, okButtonHeight);
        enterButton.setBackgroundImage(new ImageComponent(okButtonImage, 0, 0, okButtonWidth, okButtonHeight, okButtonWidth, okButtonHeight, 0, 0, okButtonWidth / 2, okButtonHeight));
        enterButton.tabable = true;
        enterButton.drawBorder = true;

        this.initEvents(enterButton, windowComponent);
    }

    initEvents(enterButton, windowComponent) {
        const mouseEnterHandler = () => {
            if (enterButton.isSelected) {
                enterButton.getBackgroundImage().setFrame(1);
            }
        };

        const mouseUpHandler = () => {
            enterButton.removeEventListener(events.MOUSE.MOUSE_ENTER, mouseEnterHandler);
        };

        enterButton.addEventListener(events.MOUSE.MOUSE_DOWN, () => {
            enterButton.getBackgroundImage().setFrame(1);

            enterButton.addEventListener(events.MOUSE.MOUSE_ENTER, mouseEnterHandler);
        });

        windowComponent.addEventListener(events.MOUSE.MOUSE_UP, mouseUpHandler);

        enterButton.addEventListener(events.MOUSE.MOUSE_LEAVE, () => {           
            if (enterButton.isSelected) {
                enterButton.getBackgroundImage().setFrame(0);
            }
        });

        this.onremove = () => {
            windowComponent.removeEventListener(events.MOUSE.MOUSE_UP, mouseUpHandler);
        }
    }

    getDefaultComponent() {
        return this.getOkButtonComponent();
    }

    getOkButtonComponent() {
        return this.getChildComponent(this.buttonKey);
    }

    getTaskDescriptionComponent() {
        return this.getChildComponent(this.descriptionKey);
    }

    addButtonEventListener(name, event) {
        this.getChildComponent(this.buttonKey).addEventListener(name, event);
    }

    answerIsRight() {
        return  false;
    }

    getResult() {
        return new Promise((resolve) => {
            this.addButtonEventListener(events.MOUSE.MOUSE_UP, () => {
                    this.getOkButtonComponent().getBackgroundImage().setFrame(0);
                    resolve(this.answerIsRight());
            });

            this.addEventListener(events.KEYBOARD.KEY_PRESS, (e) => {
                if (e.payload.key === 'Enter' && e.cancelBubble !== true) {
                    resolve(this.answerIsRight());
                }
            });
        });
    }
}
