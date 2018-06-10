import Label from '../Component/Label';
import Button from '../Component/Button';
import dictionary from '../../dictionary/dictionary';

import { CompositeComponent } from '../Component/Component';
import { getTextWidthWithCanvas } from '../../utils/textWidth';

export default class TranslateTaskWindow extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.wordObj = dictionary[Math.round(Math.random() * (dictionary.length - 1))];

        const labelText = `${this.wordObj.word}: `;

        const halfWidth = Math.ceil(width / 2);
        const halfHeight = Math.ceil(height / 2);
        const halfDescriptionWidth = Math.ceil((getTextWidthWithCanvas('Переведите слово:', 'monospace', '16px') + 1) / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);

        const taskDescription = new Label(10, halfWidth - halfDescriptionWidth, halfDescriptionWidth * 2, 30, 'Переведите слово:');
        const expression = new Label(halfHeight - 15 - 30 - 5, 5, halfExpressionWidth * 2, 30, labelText);
        const answer = new Label(halfHeight - 15, 5, width - 10, 30, '');
        const enterButton = new Button(halfHeight * 2 - 50 - 5, halfWidth * 2 - 100 - 5, 100, 50, 'OK');

        answer.editable = true;
        answer.setBackgroundColor('#bb0000');

        const oneGlyphWidth = Math.ceil(getTextWidthWithCanvas('x', 'monospace', '16px'));

        answer.maxTextLength = Math.floor((width - 10) / oneGlyphWidth);
        expression.setBackgroundColor('#00bb00');
        taskDescription.setBackgroundColor('#00bbbb');

        enterButton.setBackgroundColor('#aaaaaa');

        this.descriptionKey = 'description';
        this.expressionKey = 'expression';
        this.answerKey = 'answer';
        this.buttonKey = 'button';

        this.addComponent(taskDescription, this.descriptionKey);
        this.addComponent(expression, this.expressionKey);
        this.addComponent(answer, this.answerKey);
        this.addComponent(enterButton, this.buttonKey);
    }

    addButtonEventListener(name, event) {
        this.getChildComponent(this.buttonKey).addEventListener(name, event);
    }

    answerIsRight() {
        const answer = this.getChildComponent(this.answerKey).text.trim().toLowerCase();
        const translate = this.wordObj.translate;

        let conclusion = false;

        for (let i = 0; i < translate.length; i++) {
            conclusion = answer === translate[i];

            if (conclusion) {
                return conclusion;
            }
        }

        return  conclusion;
    }
}
