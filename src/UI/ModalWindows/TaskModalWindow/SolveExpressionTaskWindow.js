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
        charPresentation: 'x',
        perform(first, second) {
            return first * second;
        }
    },
];

export default class SolveExpressionTaskWindow extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, images = {}, parentComponent = null) {
        super(top, left, width, height, 'Решите данное выражение:', images, parentComponent);

        const operation = operations[Math.round(Math.random() * (operations.length - 1))];
        this.operation = operation;

        const textFieldImage = images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;

        let first = 1;
        let second = 1;

        first = Math.round(Math.random() * 1000);

        if (operation.charPresentation === 'x') {
            if (first === 0) {
                second = Math.round(Math.random() * 1000);
            } else {
                const limit = Math.ceil(10000 / first);
                second = Math.floor(Math.random() * limit); 
            }
        } else {
            second = Math.round(Math.random() * 1000);
        }

        this.first = first;
        this.second = second;

        const labelText = `${first} ${operation.charPresentation} ${second} =`;

        const halfWidth = Math.ceil(width / 2);
        const halfHeight = Math.ceil(height / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);
        const halfAnswerWidth = Math.ceil((getTextWidthWithCanvas('9999', 'monospace', '16px') + 1) / 2);
        const halfExpressionWithAnswer = halfAnswerWidth + halfExpressionWidth + 3;

        const expression = new Label(halfHeight - 15, halfWidth - halfExpressionWithAnswer, halfExpressionWidth * 2, 30, labelText);
        const answer = new Label(halfHeight - 15, halfWidth - halfExpressionWithAnswer + halfExpressionWidth * 2 + 3, halfAnswerWidth * 2, textFieldHeight, '');

        expression.setBackgroundColor('rgba(0, 0, 0, 0)');
        expression.setTextColor('#ffffff');

        answer.editable = true;
        answer.setBackgroundColor('rgba(0, 0, 0, 0)');
        answer.setBackgroundImage(new ImageComponent(textFieldImage, 0, 0, textFieldWidth, textFieldHeight, textFieldWidth, textFieldHeight, 0, 0, textFieldWidth, textFieldHeight));
        answer.maxTextLength = 4;
        answer.setTextColor('#FFFF00');
        answer.cursor.setColor('#08B600');

        this.expressionKey = 'expression';
        this.answerKey = 'answer';

        this.addComponent(expression, this.expressionKey);
        this.addComponent(answer, this.answerKey);
    }

    answerIsRight() {
        const answer = parseFloat(this.getChildComponent(this.answerKey).getText());
        return  answer === this.operation.perform(this.first, this.second);
    }
}
