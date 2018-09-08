import Label from '../../Component/Label';
import dictionary from '../../../dictionaries/dictionary';
import events from '../../../event/events/events';
import TaskModalWindow from './TaskModalWindow';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { Button } from '../../Component/Component';
import { getTextWidthWithCanvas } from '../../../utils/textWidth';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default class ListeningTaskModalWindow  extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, additionalResources = {}, parentComponent = null) {
        super(top, left, width, height, 'Произнесите слово:', additionalResources, parentComponent);

        const textFieldImage = additionalResources.images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;

        const microButtonImage = additionalResources.images.microButtonImage;
        const { naturalWidth: microButtonWidth, naturalHeight: microButtonHeight } = microButtonImage;

        this.word = dictionary[Math.round(Math.random() * (dictionary.length - 1))].word;

        const labelText = `${this.word}: `;

        const halfHeight = Math.ceil(height / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);

        const halfTextFieldHeight = Math.round(textFieldHeight / 2);
        const microButtonRightMargin = 10;

        const expression = new Label(halfHeight - textFieldHeight - halfTextFieldHeight, 5, halfExpressionWidth * 2, textFieldHeight, labelText);
        const answerInput = new Label(halfHeight - halfTextFieldHeight, 5,textFieldWidth, textFieldHeight, '');
        const microButton = new Button(halfHeight - Math.round(microButtonHeight / 2), width - microButtonRightMargin - microButtonWidth, microButtonWidth / 2, microButtonHeight, '');
        microButton.setBackgroundImage(new ImageComponent(microButtonImage, 0, 0, microButtonWidth, microButtonHeight, microButtonWidth, microButtonHeight, 0, 0, microButtonWidth / 2, microButtonHeight));

        answerInput.setBackgroundImage(new ImageComponent(textFieldImage, 0, 0, textFieldWidth, textFieldHeight, textFieldWidth, textFieldHeight, 0, 0, textFieldWidth, textFieldHeight));
        answerInput.setTextColor('#FFFF00');
        answerInput.properties.cursor = 'auto';
        expression.setBackgroundColor('rgba(0, 0, 0, 0)');
        expression.setTextColor('#ffffff');

        const oneGlyphWidth = Math.ceil(getTextWidthWithCanvas('x', 'monospace', '16px'));

        answerInput.maxTextLength = Math.floor((width - 10) / oneGlyphWidth);

        microButton.setBackgroundColor('#aaaaaa');
        microButton.tabable = true;
        microButton.drawBorder = true;

        this.expressionKey = 'expression';
        this.answerKey = 'answer';
        this.microButtonKey = 'microbutton';

        this.addComponent(expression, this.expressionKey);
        this.addComponent(answerInput, this.answerKey);
        this.addComponent(microButton, this.microButtonKey);
        answerInput.alignCenter();
        microButton.alignCenter();

        expression.setBoundingClientRect(undefined, answerInput.getBoundingClientRect().left);
        microButton.setBoundingClientRect(undefined, answerInput.getBoundingClientRect().right + 5);

        this.initSpeechRecognition();
        this.setSpeechEventHandler();
    }

    initSpeechRecognition() {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        this.recognition = recognition;

        return recognition;
    }

    getDefaultComponent() {
        return this.getChildComponent(this.microButtonKey);
    }

    setSpeechEventHandler() {
        const microButton = this.getChildComponent(this.microButtonKey);
        const answer = this.getChildComponent(this.answerKey);
        const recognition = this.recognition;

        let isWorking = false;

        const microHandler = (e) => {
            e.cancelBubble = true;
            
            if (!isWorking) {
                recognition.start();
                isWorking = true;
                microButton.getBackgroundImage().setFrame(1);
            } else {
                recognition.stop();
                isWorking = false;
                microButton.getBackgroundImage().setFrame(0);
            }
        };

        microButton.addEventListener(events.KEYBOARD.KEY_PRESS, microHandler);

        microButton.addEventListener(events.MOUSE.MOUSE_DOWN, microHandler);

        recognition.onresult = (event) => {
            if (event.results.length > 0) {
                answer.setText(event.results[0][0].transcript);
            }
        };
    
        recognition.onspeechend = () => {
            recognition.stop();
            isWorking = false;
            microButton.getBackgroundImage().setFrame(0);
        };

        recognition.onerror = (event) => {
            console.log('Error occurred in recognition: ' + event.error);
            microButton.getBackgroundImage().setFrame(0);
        };
    }

    answerIsRight() {
        const answer = this.getChildComponent(this.answerKey).getText().toLowerCase();
        return  answer === this.word;
    }
}
