import Label from '../../Component/Label';
import Button from '../../Component/Button';
import dictionary from '../../../dictionary/dictionary';
import events from '../../../event/events/events';
import TaskModalWindow from './TaskModalWindow';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default class ListeningTaskModalWindow  extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, images = {}, parentComponent = null) {
        super(top, left, width, height, 'Произнесите слово:', images, parentComponent);

        const textFieldImage = images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;


        const microButtonImage = images.microButtonImage;
        const { naturalWidth: microButtonWidth, naturalHeight: microButtonHeight } = microButtonImage;

        this.word = dictionary[Math.round(Math.random() * (dictionary.length - 1))].word;

        const labelText = `${this.word}: `;

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        this.recognition = recognition;

        const halfHeight = Math.ceil(height / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);

        const expression = new Label(halfHeight - textFieldHeight - 8, 5, halfExpressionWidth * 2, textFieldHeight, labelText);
        const answer = new Label(halfHeight - 15, 5,textFieldWidth, textFieldHeight, '');
        const microButton = new Button(halfHeight - 15, width - 10 - 30, microButtonWidth / 2, microButtonHeight, '');
        microButton.setBackgroundImage(new ImageComponent(microButtonImage, 0, 0, microButtonWidth, microButtonHeight, microButtonWidth, microButtonHeight, 0, 0, microButtonWidth / 2, microButtonHeight));

        answer.setBackgroundImage(new ImageComponent(textFieldImage, 0, 0, textFieldWidth, textFieldHeight, textFieldWidth, textFieldHeight, 0, 0, textFieldWidth, textFieldHeight));
        answer.setTextColor('#FFFF00');
        expression.setBackgroundColor('rgba(0, 0, 0, 0)');
        expression.setTextColor('#ffffff');

        const oneGlyphWidth = Math.ceil(getTextWidthWithCanvas('x', 'monospace', '16px'));

        answer.maxTextLength = Math.floor((width - 10) / oneGlyphWidth);

        microButton.setBackgroundColor('#aaaaaa');

        this.expressionKey = 'expression';
        this.answerKey = 'answer';
        this.microButtonKey = 'microbutton';

        this.addComponent(expression, this.expressionKey);
        this.addComponent(answer, this.answerKey);
        this.addComponent(microButton, this.microButtonKey);
        answer.alignCenter();
        microButton.alignCenter();

        expression.setBoundingClientRect(undefined, answer.getBoundingClientRect().left);
        microButton.setBoundingClientRect(undefined, answer.getBoundingClientRect().right + 5);

        let isWorking = false;

        microButton.addEventListener(events.MOUSE.MOUSE_DOWN, (e) => {
            if (!isWorking) {
                recognition.start();
                isWorking = true;
                microButton.getBackgroundImage().setFrame(0.6);
            } else {
                recognition.stop();
                isWorking = false;
                microButton.getBackgroundImage().setFrame(0);
            }
        });

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
