import Label from '../../Component/Label';
import TaskModalWindow from './TaskModalWindow';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';

export default class ContinueNumberSequenceTaskModalWindow extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, additionalResources = {}, parentComponent = null) {
        super(top, left, width, height, 'В этом ряду есть закономерность, закончи его:', additionalResources, parentComponent);

        const textFieldImage = additionalResources.images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;

        this.number = Math.round(Math.random() * (99 - 4)) + 4;

        let maxDif = Math.floor(this.number / 4);
        let dif = 0;

        if (maxDif > 10) {
            dif = Math.round(Math.random() * (9 - 1)) + 1;
        } else {
            dif = Math.round(Math.random() * (maxDif - 1)) + 1;
        }

        let fourthNumber = this.number - dif * 1;
        let thirdNumber = this.number - dif * 2;
        let secondNumber = this.number - dif * 3;
        let firstNumber = this.number - dif * 4;


        const labelText = `${firstNumber}, ${secondNumber}, ${thirdNumber}, ${fourthNumber}, ?:`;

        const halfHeight = Math.ceil(height / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);
        const expression = new Label(halfHeight - textFieldHeight - 8, 5, halfExpressionWidth * 2, textFieldHeight, labelText);
        const answer = new Label(halfHeight - 15, 5,textFieldWidth, textFieldHeight, '');

        answer.editable = true;
        answer.setBackgroundColor('#bb0000');

        answer.maxTextLength = 2;
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
        const answer = parseInt(this.getChildComponent(this.answerKey).getText(), 10);

        return  answer === this.number;
    }
}
