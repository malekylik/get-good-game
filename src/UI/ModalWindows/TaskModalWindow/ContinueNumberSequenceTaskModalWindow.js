import Label from '../../Component/Label';
import TaskModalWindow from './TaskModalWindow';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';

export default class ContinueNumberSequenceTaskModalWindow extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, additionalResources = {}, parentComponent = null) {
        super(top, left, width, height, 'В этом ряду есть закономерность, закончи его:', additionalResources, parentComponent);

        const textFieldImage = additionalResources.images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;

        const minNumber = 4;
        const maxNumber = 99;
        this.number = Math.round(Math.random() * (maxNumber - minNumber)) + minNumber;

        const labelText = this.createSequenceText();

        const halfTextFieldHeight = Math.round(textFieldHeight / 2);

        const halfHeight = Math.ceil(height / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);
        const expression = new Label(halfHeight - textFieldHeight - halfTextFieldHeight, 5, halfExpressionWidth * 2, textFieldHeight, labelText);
        const answerInput = new Label(halfHeight - halfTextFieldHeight, 5,textFieldWidth, textFieldHeight, '');

        answerInput.editable = true;
        answerInput.tabable = true;
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

    createSequenceText() {
        let maxDif = Math.floor(this.number / 4);
        let dif = 0;
        const minNumber = 1;
        const maxNumber = 9;

        if (maxDif > 10) {
            dif = Math.round(Math.random() * (maxNumber - minNumber)) + minNumber;
        } else {
            dif = Math.round(Math.random() * (maxDif - minNumber)) + minNumber;
        }

        let fourthNumber = this.number - dif * 1;
        let thirdNumber = this.number - dif * 2;
        let secondNumber = this.number - dif * 3;
        let firstNumber = this.number - dif * 4;

        return `${firstNumber}, ${secondNumber}, ${thirdNumber}, ${fourthNumber}, ?:`;
    }

    answerIsRight() {
        const answer = parseInt(this.getChildComponent(this.answerKey).getText(), 10);

        return  answer === this.number;
    }
}
