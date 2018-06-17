import Label from '../../Component/Label';
import TaskModalWindow from './TaskModalWindow';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';

const operations = [
    {
        charPresentation: '+',
        perform(first, second) {
            return first + second;
        }
    },
    {
        charPresentation: '-',
        perform(first, second) {
            return first - second;
        }
    },
    {
        charPresentation: '*',
        perform(first, second) {
            return first * second;
        }
    },
];

export default class ChoseRightOperationTaskModalWindow extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, additionalResources = {}, parentComponent = null) {
        super(top, left, width, height, 'В выражении пропущен арифметический знак. Выбери подходящий из +, - и *:', additionalResources, parentComponent);

        const operation = operations[Math.round(Math.random() * (operations.length - 1))];

        const textFieldImage = additionalResources.images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;

        let first = 1;
        let second = 1;

        first = Math.round(Math.random() * 50);

        if (operation.charPresentation === '*') {
            if (first === 0) {
                second = Math.round(Math.random() * 50);
            } else {
                const limit = Math.ceil(100 / first);
                second = Math.floor(Math.random() * limit); 
            }
        } else {
            second = Math.round(Math.random() * 50);
        }

        const answerNumber = operation.perform(first, second);

        this.operationCharPresentation = operation.charPresentation;

        const labelText = `${first} ? ${second} = ${answerNumber}`;

        const halfHeight = Math.ceil(height / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);
        const expression = new Label(halfHeight - textFieldHeight - 8, 5, halfExpressionWidth * 2, textFieldHeight, labelText);
        const answer = new Label(halfHeight - 15, 5,textFieldWidth, textFieldHeight, '');

        answer.editable = true;
        answer.setBackgroundColor('#bb0000');

        answer.maxTextLength = 1;
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
        const answer = this.getChildComponent(this.answerKey).getText();
        return  answer === this.operationCharPresentation;
    }
}
