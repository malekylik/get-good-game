import TaskModalWindow from './TaskModalWindow';
import Label from '../../Component/Label';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';

export default class ConvertFromDecToBinTaskModalWindow  extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, images = {}, parentComponent = null) {
        super(top, left, width, height, 'Переведите число из десетичной в двоичную систему счисления:', images, parentComponent);
        const textFieldImage = images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;

        this.numberToConvert = Math.round(Math.random() * 100);

        const labelText = `Число для перевода ${this.numberToConvert}:`;

        const halfHeight = Math.ceil(height / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);
        const expression = new Label(halfHeight - textFieldHeight - 8, 5, halfExpressionWidth * 2, textFieldHeight, labelText);
        const answer = new Label(halfHeight - 15, 5,textFieldWidth, textFieldHeight, '');

        answer.editable = true;
        answer.setBackgroundColor('#bb0000');

        answer.maxTextLength = 8;
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

        return  answer === this.numberToConvert.toString(2);
    }
}
