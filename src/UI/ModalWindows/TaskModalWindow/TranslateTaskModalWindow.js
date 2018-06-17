import Label from '../../Component/Label';
import dictionary from '../../../dictionary/dictionary';
import TaskModalWindow from './TaskModalWindow';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';

export default class TranslateTaskWindow extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, additionalResources = {}, parentComponent = null) {
        super(top, left, width, height, 'Переведите слово:', additionalResources, parentComponent);

        this.wordObj = dictionary[Math.round(Math.random() * (dictionary.length - 1))];

        const textFieldImage = additionalResources.images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;

        const labelText = `${this.wordObj.word}: `;

        const halfHeight = Math.ceil(height / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);
        const expression = new Label(halfHeight - textFieldHeight - 8, 5, halfExpressionWidth * 2, textFieldHeight, labelText);
        const answer = new Label(halfHeight - 15, 5,textFieldWidth, textFieldHeight, '');

        answer.editable = true;
        answer.setBackgroundColor('#bb0000');

        const oneGlyphWidth = Math.ceil(getTextWidthWithCanvas('x', 'monospace', '16px'));

        answer.maxTextLength = Math.floor(textFieldWidth / oneGlyphWidth) + 1;
        answer.setBackgroundImage(new ImageComponent(textFieldImage, 0, 0, textFieldWidth, textFieldHeight, textFieldWidth, textFieldHeight, 0, 0, textFieldWidth, textFieldHeight));
        answer.setTextColor('#FFFF00');
        answer.cursor.setColor('#08B600');
        expression.setBackgroundColor('rgba(0, 0, 0, 0)');
        expression.setTextColor('#ffffff');

        this.descriptionKey = 'description';
        this.expressionKey = 'expression';
        this.answerKey = 'answer';
        this.buttonKey = 'button';

        this.addComponent(expression, this.expressionKey);
        this.addComponent(answer, this.answerKey);
        answer.alignCenter();

        expression.setBoundingClientRect(undefined, answer.getBoundingClientRect().left);
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
