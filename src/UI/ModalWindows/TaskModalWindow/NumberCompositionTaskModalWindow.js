import Label from '../../Component/Label';
import TaskModalWindow from './TaskModalWindow';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';

export default class NumberCompositionTaskModalWindow extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, additionalResources = {}, parentComponent = null) {
        super(top, left, width, height, 'Одно из слагаемых данно. Напиши второе слагаемое, чтобы сумма давала верное равенство:', additionalResources, parentComponent);

        const textFieldImage = additionalResources.images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;

        const labelText = this.initTask();

        const halfHeight = Math.ceil(height / 2);
        const halfTextFieldHeight = Math.round(textFieldHeight / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);
        const expression = new Label(halfHeight - textFieldHeight - halfTextFieldHeight, 5, halfExpressionWidth * 2, textFieldHeight, labelText);
        const answerInput = new Label(halfHeight - halfTextFieldHeight, 5,textFieldWidth, textFieldHeight, '');

        answerInput.tabable = true;
        answerInput.editable = true;
        answerInput.drawBorder = true;
        answerInput.setBackgroundColor('#bb0000');

        answerInput.maxTextLength = 2;
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

    initTask() {
        const minNumber = 2;
        const maxNumber = 99;

        let resultNumber = Math.round(Math.random() * (maxNumber - minNumber)) + minNumber;
        let compositeNumber = Math.round(Math.random() * (resultNumber - minNumber)) + 1;
        this.number = resultNumber - compositeNumber;

        let labelText;

        if (Math.round(Math.random())) {
            labelText = `? + ${compositeNumber} = ${resultNumber}`;
        } else {
            labelText = `${compositeNumber} + ? = ${resultNumber}`;
        }

        return labelText;
    }

    answerIsRight() {
        const answer = parseInt(this.getChildComponent(this.answerKey).getText());
        return  answer === this.number;
    }
}
