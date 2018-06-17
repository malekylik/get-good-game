import Label from '../../Component/Label';
import TaskModalWindow from './TaskModalWindow';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';
import { Component } from '../../Component/Component';

export default class NameTaskModalWindow  extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, additionalResources = {}, parentComponent = null) {

        super(top, left, width, height, `Назови то, что нарисовано на картинке одним словом на английском:`, additionalResources, parentComponent);

        const textFieldImage = additionalResources.images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;

        const taskImage = additionalResources.images.nameImage;
        const { naturalWidth: taskImageWidth, naturalHeight: taskImageHeight } = taskImage;

        const halfHeight = Math.ceil(height / 2);
     
        const answer = new Label(halfHeight - 15, 5,textFieldWidth, textFieldHeight, '');

        answer.editable = true;
        answer.setBackgroundColor('#bb0000');

        const oneGlyphWidth = Math.ceil(getTextWidthWithCanvas('x', 'monospace', '16px'));

        answer.maxTextLength = Math.floor(textFieldWidth / oneGlyphWidth) + 1;
        answer.setBackgroundImage(new ImageComponent(textFieldImage, 0, 0, textFieldWidth, textFieldHeight, textFieldWidth, textFieldHeight, 0, 0, textFieldWidth, textFieldHeight));
        answer.setTextColor('#FFFF00');
        answer.cursor.setColor('#08B600');

        this.answerKey = 'answer';

        this.addComponent(answer, this.answerKey);
        answer.alignCenter();

        const { top: okButtonTop, height: okButtonHeight } = super.getOkButtonComponent().getBoundingClientRect();
        answer.setBoundingClientRect(okButtonTop + Math.round((okButtonHeight - textFieldHeight) / 2));

        const { bottom: descriptionBottom, left: descriptionLeft } = super.getTaskDescriptionComponent().getBoundingClientRect();

        let taskImageWidthProp = taskImageWidth;
        let taskImageHeightProp = taskImageHeight;
        let ration;

        const maxTaskImageWidth = width - descriptionLeft * 2;
        const maxTaskImageHeight = height - (height - okButtonTop) - descriptionBottom - 20;

        if ((taskImageWidthProp / maxTaskImageWidth) > (taskImageHeightProp / maxTaskImageHeight)) {
            if (taskImageWidthProp > maxTaskImageWidth) {
                taskImageWidthProp = maxTaskImageWidth;
            }

            ration = taskImageWidthProp / taskImageWidth;

            taskImageHeightProp = Math.round(taskImageHeight * ration);

            if (taskImageHeightProp > maxTaskImageHeight) {
                taskImageHeightProp = maxTaskImageHeight;
            }
        } else {
            if (taskImageHeightProp > maxTaskImageHeight) {
                taskImageHeightProp = maxTaskImageHeight;
            }

            ration = taskImageHeightProp / taskImageHeight;

            taskImageWidthProp = Math.round(taskImageWidth * ration);

            if (taskImageWidthProp > maxTaskImageWidth) {
                taskImageWidthProp = maxTaskImageWidth;
            }
        }

        this.taskImageKey = 'task';

        const taskImageComponent = new Component(0, 0, taskImageWidthProp, taskImageHeightProp);
        taskImageComponent.setBackgroundImage(new ImageComponent(taskImage, 0, 0, taskImageWidth, taskImageHeight, taskImageWidthProp, taskImageHeightProp, 0, 0, taskImageWidth, taskImageHeight));
        this.addComponent(taskImageComponent, this.taskImageKey);

        taskImageComponent.alignCenter();
        taskImageComponent.setBoundingClientRect(descriptionBottom + 10);

        this.imageNames = additionalResources.additional.name.taskNames;
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
