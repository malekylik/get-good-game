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

        const { firstOperand, secondOperand } = this.getOperands(operation);

        const answerNumber = operation.perform(firstOperand, secondOperand);

        this.operationCharPresentation = operation.charPresentation;

        const labelText = `${firstOperand} ? ${secondOperand} = ${answerNumber}`;

        const halfTextFieldHeight = Math.round(textFieldHeight / 2);

        const halfHeight = Math.ceil(height / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);
        const expression = new Label(halfHeight - textFieldHeight - halfTextFieldHeight, 5, halfExpressionWidth * 2, textFieldHeight, labelText);
        const answerInput = new Label(halfHeight - halfTextFieldHeight, 5,textFieldWidth, textFieldHeight, '');

        answerInput.editable = true;
        answerInput.tabable = true;
        answerInput.drawBorder = true;
        answerInput.setBackgroundColor('#bb0000');

        answerInput.maxTextLength = 1;
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

    getOperands(operation) {
        let firstOperand = 1;
        let secondOperand = 1;

        firstOperand = Math.round(Math.random() * 50);

        if (operation.charPresentation === '*') {
            if (firstOperand === 0) {
                secondOperand = Math.round(Math.random() * 50);
            } else {
                const limit = Math.ceil(100 / firstOperand);
                secondOperand = Math.floor(Math.random() * limit); 
            }
        } else {
            secondOperand = Math.round(Math.random() * 50);
        }

        return {
            firstOperand,
            secondOperand
        }
    }

    answerIsRight() {
        const answer = this.getChildComponent(this.answerKey).getText();
        return  answer === this.operationCharPresentation;
    }
}
