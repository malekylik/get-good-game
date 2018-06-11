import Label from '../../Component/Label';
import dictionary from '../../../dictionary/dictionary';
import TaskModalWindow from './TaskModalWindow';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';

export default class TranslateTaskWindow extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, parentComponent = null) {
        super(top, left, width, height, 'Переведите слово:', parentComponent);

        this.wordObj = dictionary[Math.round(Math.random() * (dictionary.length - 1))];

        const labelText = `${this.wordObj.word}: `;

        const halfHeight = Math.ceil(height / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);
        const expression = new Label(halfHeight - 15 - 30 - 5, 5, halfExpressionWidth * 2, 30, labelText);
        const answer = new Label(halfHeight - 15, 5, width - 10, 30, '');

        answer.editable = true;
        answer.setBackgroundColor('#bb0000');

        const oneGlyphWidth = Math.ceil(getTextWidthWithCanvas('x', 'monospace', '16px'));

        answer.maxTextLength = Math.floor((width - 10) / oneGlyphWidth);
        expression.setBackgroundColor('#00bb00');

        this.descriptionKey = 'description';
        this.expressionKey = 'expression';
        this.answerKey = 'answer';
        this.buttonKey = 'button';

        this.addComponent(expression, this.expressionKey);
        this.addComponent(answer, this.answerKey);
    }

    answerIsRight() {
        const answer = this.getChildComponent(this.answerKey).getText().trim().toLowerCase();
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
