import Label from '../Component/Label';
import Button from '../Component/Button';

import { CompositeComponent } from '../Component/Component';
import { getTextWidthWithCanvas } from '../../utils/textWidth';

export default class ModalWindow extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        const halfWidth = Math.ceil(width / 2);
        const halfHeight = Math.ceil(height / 2);
        const halfDescriptionWidth = Math.ceil((getTextWidthWithCanvas('Solve the expression:', 'monospace', '16px') + 1) / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas('2 + 5 =', 'monospace', '16px') + 1) / 2);
        const halfAnswerWidth = Math.ceil((getTextWidthWithCanvas('9999', 'monospace', '16px') + 1) / 2);
        const halfExpressionWithAnswer = halfAnswerWidth + halfExpressionWidth + 3;

        const taskDescription = new Label(10, halfWidth - halfDescriptionWidth, halfDescriptionWidth * 2, 30, 'Solve the expression:');
        const expression = new Label(halfHeight - 15, halfWidth - halfExpressionWithAnswer, halfExpressionWidth * 2, 30, '2 + 5 =');
        const answer = new Label(halfHeight - 15, halfWidth - halfExpressionWithAnswer + halfExpressionWidth * 2 + 3, halfAnswerWidth * 2, 30, '');
        const enterButton = new Button(halfHeight * 2 - 60 - 5, halfWidth * 2 - 100 - 5, 100, 50, 'OK');

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
}
