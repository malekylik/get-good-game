import Label from '../../Component/Label';
import events from '../../../event/events/events';

import { Button } from '../../Component/Component';
import { CompositeComponent } from '../../Component/Component';
import { getTextWidthWithCanvas } from '../../../utils/textWidth';

export default class TextInputModalWindow extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, descriptionText, windowComponent, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        const halfWidth = Math.ceil(width / 2);
        const halfHeight = Math.ceil(height / 2);
        const halfDescriptionWidth = Math.ceil((getTextWidthWithCanvas(descriptionText, 'monospace', 16) + 1) / 2);
        const halfUserInputWidth = Math.ceil(halfWidth * 0.6);

        const oneGlyphWidth = Math.ceil(getTextWidthWithCanvas('x', 'monospace', 16));

        const description = new Label(halfHeight - 10 - 20 - 3, halfWidth - halfUserInputWidth, halfDescriptionWidth * 2, 20, descriptionText);
        const userInput = new Label(halfHeight - 10, halfWidth - halfUserInputWidth, halfUserInputWidth * 2, 20, '');
        const enterButton = new Button(halfHeight * 2 - 50 - 5, halfWidth * 2 - 100 - 5, 100, 50, '');

        userInput.editable = true;
        userInput.tabable = true;
        userInput.drawBorder = true;
        userInput.setBackgroundColor('#bb0000');
        userInput.maxTextLength = Math.floor(halfUserInputWidth / oneGlyphWidth * 2);
        description.setBackgroundColor('#00bbbb');

        enterButton.setBackgroundColor('#aaaaaa');
        enterButton.tabable = true;
        enterButton.drawBorder = true;

        userInput.setTextColor('#FFFF00');
        userInput.cursor.setColor('#08B600');

        this.descriptionKey = 'description';
        this.userInputKey = 'userinput';
        this.buttonKey = 'button';

        this.addComponent(description, this.descriptionKey);
        this.addComponent(userInput, this.userInputKey);
        this.addComponent(enterButton, this.buttonKey);

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
            enterButton.getBackgroundImage().setFrame(0);
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

    addButtonEventListener(name, event) {
        this.getChildComponent(this.buttonKey).addEventListener(name, event);
    }

    removeButtonEventListener(name, event) {
        this.getChildComponent(this.buttonKey).removeEventListener(name, event);
    }

    getOkButtonComponent() {
        return this.getChildComponent(this.buttonKey);
    }

    getDescriptionComponent() {
        return this.getChildComponent(this.descriptionKey);
    }

    getInputUserComponent() {
        return this.getChildComponent(this.userInputKey);
    }

    getInputUser() {
        return this.getChildComponent(this.userInputKey).text;
    }
}
