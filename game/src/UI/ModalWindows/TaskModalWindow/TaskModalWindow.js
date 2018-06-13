import Label from '../../Component/Label';
import Button from '../../Component/Button';
import events from '../../../event/events/events';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { CompositeComponent } from '../../Component/Component';
import { getTextWidthWithCanvas } from '../../../utils/textWidth';

export default class TaskModalWindow extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, description = '' , images = {}, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        const halfWidth = Math.ceil(width / 2);
        const halfHeight = Math.ceil(height / 2);
        const halfDescriptionWidth = Math.ceil((getTextWidthWithCanvas(description, 'monospace', '16px') + 1) / 2);
       
        const taskDescription = new Label(10, halfWidth - halfDescriptionWidth, halfDescriptionWidth * 2, 30, description);
        const enterButton = new Button(halfHeight * 2 - 50 - 5, halfWidth * 2 - 100 - 5, 100, 50, '');

        taskDescription.setBackgroundColor('#00bbbb');

        enterButton.setBackgroundColor('#aaaaaa');

        this.descriptionKey = 'description';
        this.buttonKey = 'button';

        this.addComponent(taskDescription, this.descriptionKey);
        this.addComponent(enterButton, this.buttonKey);

        taskDescription.setBackgroundColor('rgba(0, 0, 0, 0)');
        taskDescription.setTextColor('#ffffff');

        const modalWindowImage = images.modalWindowImage;
        const { naturalWidth: modalWidth, naturalHeight: modalHeight } = modalWindowImage;

        const okButtonImage = images.okButtonImage;
        const { naturalWidth: okButtonWidth, naturalHeight: okButtonHeight } = okButtonImage;

        this.setBackgroundImage(new ImageComponent(modalWindowImage, 0, 0, modalWidth, modalHeight, modalWidth, modalHeight, 0, 0, modalWidth, modalHeight));

        enterButton.setBoundingClientRect(modalHeight - 19 - okButtonHeight, modalWidth - 19 - okButtonWidth / 2, okButtonWidth / 2, okButtonHeight);
        enterButton.setBackgroundImage(new ImageComponent(okButtonImage, 0, 0, okButtonWidth, okButtonHeight, okButtonWidth, okButtonHeight, 0, 0, okButtonWidth / 2, okButtonHeight));
    }

    addButtonEventListener(name, event) {
        this.getChildComponent(this.buttonKey).addEventListener(name, event);
    }

    answerIsRight() {
        return  false;
    }

    getResult() {
        return new Promise((resolve) => {
            this.addButtonEventListener(events.MOUSE.MOUSE_DOWN, () => {
                    resolve(this.answerIsRight());
            });
        });
    }
}
