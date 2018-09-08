import Label from '../../Component/Label';
import TaskModalWindow from './TaskModalWindow';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';
import { Component } from '../../Component/Component';

const colorsName = [
    'black',
    'blue',
    'brown',
    'green',
    'orange',
    'pink',
    'red',
    'white',
    'yellow',
]; 

export default class NameColorTaskModalWindow extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, additionalResources = {}, parentComponent = null) {
        super(top, left, width, height, `Назови цвет на английском:`, additionalResources, parentComponent);

        const textFieldImage = additionalResources.images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;

        const halfHeight = Math.ceil(height / 2);
     
        const halfTextFieldHeight = Math.round(textFieldHeight / 2);
        const answerInput = new Label(halfHeight - halfTextFieldHeight, 5,textFieldWidth, textFieldHeight, '');

        this.colorName = colorsName[Math.round(Math.random() * (colorsName.length - 1))];

        answerInput.tabable = true;
        answerInput.editable = true;
        answerInput.drawBorder = true;
        answerInput.setBackgroundColor('#bb0000');

        const oneGlyphWidth = Math.ceil(getTextWidthWithCanvas('x', 'monospace', '16px'));

        answerInput.maxTextLength = Math.floor(textFieldWidth / oneGlyphWidth) + 1;
        answerInput.setBackgroundImage(new ImageComponent(textFieldImage, 0, 0, textFieldWidth, textFieldHeight, textFieldWidth, textFieldHeight, 0, 0, textFieldWidth, textFieldHeight));
        answerInput.setTextColor('#FFFF00');
        answerInput.cursor.setColor('#08B600');

        this.answerKey = 'answer';

        this.addComponent(answerInput, this.answerKey);
        answerInput.alignCenter();

        const { top: okButtonTop, height: okButtonHeight } = super.getOkButtonComponent().getBoundingClientRect();
        answerInput.setBoundingClientRect(okButtonTop + Math.round((okButtonHeight - textFieldHeight) / 2));
     
        this.taskColorKey = 'task';

        const taskColorComponent = new Component(0, 0, Math.floor(width / 2), Math.floor(height / 2));
        taskColorComponent.setBackgroundColor(this.colorName);
        this.addComponent(taskColorComponent, this.taskColorKey);

        taskColorComponent.alignCenter();
    }

    getDefaultComponent() {
        return this.getChildComponent(this.answerKey);
    }

    answerIsRight() {
        return this.colorName === this.getChildComponent(this.answerKey).getText().trim().toLowerCase();
    }
}
