import TaskModalWindow from './TaskModalWindow';
import Label from '../../Component/Label';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';

export default class ConvertFromDecToBinTaskModalWindow  extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, additionalResources = {}, parentComponent = null) {
        super(top, left, width, height, 'Переведите число из десетичной в двоичную систему счисления:', additionalResources, parentComponent);
        const textFieldImage = additionalResources.images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;

        this.numberToConvert = Math.round(Math.random() * 32);

        const labelText = `Число для перевода ${this.numberToConvert}:`;

        const halfTextFieldHeight = Math.round(textFieldHeight / 2);

        const halfHeight = Math.ceil(height / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);
        const expression = new Label(halfHeight - textFieldHeight - halfTextFieldHeight, 5, halfExpressionWidth * 2, textFieldHeight, labelText);
        const answerInput = new Label(halfHeight - halfTextFieldHeight, 5,textFieldWidth, textFieldHeight, '');

        answerInput.tabable = true;
        answerInput.editable = true;
        answerInput.drawBorder = true;
        answerInput.setBackgroundColor('#bb0000');

        answerInput.maxTextLength = 8;
        answerInput.setBackgroundImage(new ImageComponent(textFieldImage, 0, 0, textFieldWidth, textFieldHeight, textFieldWidth, textFieldHeight, 0, 0, textFieldWidth, textFieldHeight));
        answerInput.setTextColor('#FFFF00');
        answerInput.cursor.setColor('#08B600');
        expression.setBackgroundColor('rgba(0, 0, 0, 0)');
        expression.setTextColor('#ffffff');

        this.descriptionKey = 'description';
        this.expressionKey = 'expression';
        this.answerKey = 'answer';
        this.buttonKey = 'button';

        this.addComponent(expression, this.expressionKey);
        this.addComponent(answerInput, this.answerKey);
        answerInput.alignCenter();

        expression.setBoundingClientRect(undefined, answerInput.getBoundingClientRect().left);
    }

    getDefaultComponent() {
        return this.getChildComponent(this.answerKey);
    }

    answerIsRight() {
        const answer = this.getChildComponent(this.answerKey).getText().trim().toLowerCase();

        return  answer === this.numberToConvert.toString(2);
    }
}
