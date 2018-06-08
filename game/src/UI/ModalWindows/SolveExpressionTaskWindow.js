import Label from '../Component/Label';
import Button from '../Component/Button';

import { CompositeComponent } from '../Component/Component';
import { getTextWidthWithCanvas } from '../../utils/textWidth';

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

export default class SolveExpressionTaskWindow extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        const operation = operations[Math.round(Math.random() * (operations.length - 1))];
        this.operation = operation;

        let first = 1;
        let second = 1;

        first = Math.round(Math.random() * 1000);

        if (operation.charPresentation === 'x') {
            const limit = Math.ceil(10000 / first);
            second = Math.floor(Math.random() * limit);
        } else {
            second = Math.round(Math.random() * 1000);
        }

        this.first = first;
        this.second = second;

        const labelText = `${first} ${operation.charPresentation} ${second} =`;

        const halfWidth = Math.ceil(width / 2);
        const halfHeight = Math.ceil(height / 2);
        const halfDescriptionWidth = Math.ceil((getTextWidthWithCanvas('Solve the expression:', 'monospace', '16px') + 1) / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);
        const halfAnswerWidth = Math.ceil((getTextWidthWithCanvas('9999', 'monospace', '16px') + 1) / 2);
        const halfExpressionWithAnswer = halfAnswerWidth + halfExpressionWidth + 3;

        const taskDescription = new Label(10, halfWidth - halfDescriptionWidth, halfDescriptionWidth * 2, 30, 'Solve the expression:');
        const expression = new Label(halfHeight - 15, halfWidth - halfExpressionWithAnswer, halfExpressionWidth * 2, 30, labelText);
        const answer = new Label(halfHeight - 15, halfWidth - halfExpressionWithAnswer + halfExpressionWidth * 2 + 3, halfAnswerWidth * 2, 30, '');
        const enterButton = new Button(halfHeight * 2 - 50 - 5, halfWidth * 2 - 100 - 5, 100, 50, 'OK');

        answer.editable = true;
        answer.setBackgroundColor('#bb0000');
        answer.maxTextLength = 4;
        expression.setBackgroundColor('#00bb00');
        taskDescription.setBackgroundColor('#00bbbb');

        enterButton.setBackgroundColor('#aaaaaa');

        this.descriptionKey = 'description';
        this.expressionKey = 'expression';
        this.answerKey = 'answer';
        this.buttonKey = 'button';

        this.addComponent(taskDescription, this.descriptionKey);
        this.addComponent(expression, this.expressionKey);
        this.addComponent(answer, this.answerKey);
        this.addComponent(enterButton, this.buttonKey);
    }

    addButtonEventListener(name, event) {
        this.getChildComponent(this.buttonKey).addEventListener(name, event);
    }

    answerIsRight() {
        const answer = parseFloat(this.getChildComponent(this.answerKey).text);
        return  answer === this.operation.perform(this.first, this.second);
    }
}
