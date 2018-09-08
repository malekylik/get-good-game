import Label from '../../Component/Label';
import TaskModalWindow from './TaskModalWindow';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { Component } from '../../Component/Component';
import { calculateImageSize } from '../../../utils/image';
import { getTextWidthWithCanvas } from '../../../utils/textWidth';

export default class NameTaskModalWindow extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, additionalResources = {}, parentComponent = null) {
        super(top, left, width, height, `Назови то, что нарисовано на картинке одним словом на английском:`, additionalResources, parentComponent);

        const textFieldImage = additionalResources.images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;

        const taskImage = additionalResources.images.nameImage;
        const { naturalWidth: taskImageWidth, naturalHeight: taskImageHeight } = taskImage;

        const halfHeight = Math.ceil(height / 2);
     
        const halfTextFieldHeight = Math.round(textFieldHeight / 2);
        const answerInput = new Label(halfHeight - halfTextFieldHeight, 5,textFieldWidth, textFieldHeight, '');

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

        const { bottom: descriptionBottom, left: descriptionLeft } = super.getTaskDescriptionComponent().getBoundingClientRect();

        const marginHeight = 20;
        let { taskImageWidthProp, taskImageHeightProp } = calculateImageSize(taskImageWidth, taskImageHeight, width - descriptionLeft * 2, height - (height - okButtonTop) - descriptionBottom - marginHeight);
     
        this.taskImageKey = 'task';

        const taskImageComponent = new Component(0, 0, taskImageWidthProp, taskImageHeightProp);
        taskImageComponent.setBackgroundImage(new ImageComponent(taskImage, 0, 0, taskImageWidth, taskImageHeight, taskImageWidthProp, taskImageHeightProp, 0, 0, taskImageWidth, taskImageHeight));
        this.addComponent(taskImageComponent, this.taskImageKey);

        taskImageComponent.alignCenter();
        taskImageComponent.setBoundingClientRect(descriptionBottom + 10);

        this.imageNames = additionalResources.additional.name.taskNames;
    }

    getDefaultComponent() {
        return this.getChildComponent(this.answerKey);
    }

    answerIsRight() {
        const answer = this.getChildComponent(this.answerKey).getText().trim().toLowerCase();
        const names = this.imageNames;

        let conclusion = false;

        for (let i = 0; i < names.length; i++) {
            conclusion = answer === names[i];

            if (conclusion) {
                return conclusion;
            }
        }

        return  conclusion;
    }
}
