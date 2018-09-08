import Label from '../../Component/Label';
import TaskModalWindow from './TaskModalWindow';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';

const triangleTasks = [
    function rightTriangle() {
        const firtsCathetus  = Math.round((Math.random() * 8)) + 2;
        const secondCathetus = Math.round((Math.random() * 8)) + 2;

        this.getTaskText = () => {
            return `Дан прямоугольный треугольник, у которого первый катет равен ${firtsCathetus}, а второй - ${secondCathetus}. Найди его площадь. Ответ округли до целого числа:`;
        };

        this.answer = Math.round(0.5 * firtsCathetus * secondCathetus);
    },
    function anyTriangle() {
        const triangleBase = Math.round((Math.random() * 8)) + 2;
        const triangleHeight = Math.round((Math.random() * 8)) + 2;

        this.getTaskText = () => {
            return `Дан треугольник, у которого основание равно ${triangleBase}, а высота ${triangleHeight}. Найди его площадь. Ответ округли до целого числа:`;
        };

        this.answer = Math.round(0.5 * triangleBase * triangleHeight);
    },
];

export default class CalculateTriangleAreaTaskModalWindow extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, additionalResources = {}, parentComponent = null) {
        super(top, left, width, height, 'Вычисли площадь треугольника:', additionalResources, parentComponent);

        const task = new (triangleTasks[Math.round(Math.random() * (triangleTasks.length - 1))])();

        const textFieldImage = additionalResources.images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;

        this.answer = task.answer;

        const labelText = task.getTaskText();

        const halfHeight = Math.ceil(height / 2);
        const expressionWidth = Math.ceil(getTextWidthWithCanvas(labelText, 'monospace', '16px'));
        const linesCount = Math.ceil(expressionWidth / textFieldWidth);
        const expressionHeight = linesCount * 16;
        const halfTextFieldHeight = Math.round(textFieldHeight / 2);

        const expression = new Label(halfHeight - halfTextFieldHeight - expressionHeight - 8, 5, textFieldWidth, expressionHeight, labelText);
        const answerInput = new Label(halfHeight - halfTextFieldHeight, 5, textFieldWidth, textFieldHeight, '');

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

    answerIsRight() {
        const answer = parseInt(this.getChildComponent(this.answerKey).getText(), 10);
        return  answer === this.answer;
    }
}
