import Label from '../../Component/Label';
import Button from '../../Component/Button';
import events from '../../../event/events/events';

import { CompositeComponent } from '../../Component/Component';
import { getTextWidthWithCanvas } from '../../../utils/textWidth';

export default class TaskModalWindow extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, description = '' , parentComponent = null) {
        super(top, left, width, height, parentComponent);


        const halfWidth = Math.ceil(width / 2);
        const halfHeight = Math.ceil(height / 2);
        const halfDescriptionWidth = Math.ceil((getTextWidthWithCanvas(description, 'monospace', '16px') + 1) / 2);
       
        const taskDescription = new Label(10, halfWidth - halfDescriptionWidth, halfDescriptionWidth * 2, 30, description);
        const enterButton = new Button(halfHeight * 2 - 50 - 5, halfWidth * 2 - 100 - 5, 100, 50, 'OK');

        taskDescription.setBackgroundColor('#00bbbb');

        enterButton.setBackgroundColor('#aaaaaa');

        this.descriptionKey = 'description';
        this.buttonKey = 'button';

        this.addComponent(taskDescription, this.descriptionKey);
        this.addComponent(enterButton, this.buttonKey);
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
