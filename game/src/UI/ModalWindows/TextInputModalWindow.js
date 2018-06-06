import Label from '../Component/Label';
import Button from '../Component/Button';

import { CompositeComponent } from '../Component/Component';
import { getTextWidthWithCanvas } from '../../utils/textWidth';

export default class TextInputModalWindow extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, descriptionText, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        const halfWidth = Math.ceil(width / 2);
        const halfHeight = Math.ceil(height / 2);
        const halfDescriptionWidth = Math.ceil((getTextWidthWithCanvas(descriptionText, 'monospace', '16px') + 1) / 2);
        const halfUserInputWidth = Math.ceil(halfWidth * 0.6);

        const oneGlyphWidth = Math.ceil(getTextWidthWithCanvas('x', 'monospace', '16px'));

        const description = new Label(halfHeight - 10 - 20 - 3, halfWidth - halfUserInputWidth, halfDescriptionWidth * 2, 20, descriptionText);
        const userInput = new Label(halfHeight - 10, halfWidth - halfUserInputWidth, halfUserInputWidth * 2, 20, '');
        const enterButton = new Button(halfHeight * 2 - 50 - 5, halfWidth * 2 - 100 - 5, 100, 50, 'OK');

        userInput.editable = true;
        userInput.setBackgroundColor('#bb0000');
        userInput.maxTextLength = Math.floor(halfUserInputWidth / oneGlyphWidth * 2);
        description.setBackgroundColor('#00bbbb');

        enterButton.setBackgroundColor('#aaaaaa');

        this.descriptionKey = 'description';
        this.userInputKey = 'userinput';
        this.buttonKey = 'button';

        this.addComponent(description, this.descriptionKey);
        this.addComponent(userInput, this.userInputKey);
        this.addComponent(enterButton, this.buttonKey);
    }

    addButtonEventListener(name, event) {
        this.getChildComponent(this.buttonKey).addEventListener(name, event);
    }

    getInputUser() {
        return this.getChildComponent(this.userInputKey).text;
    }
}