import Label from '../../Component/Label';
import Button from '../../Component/Button';
import dictionary from '../../../dictionary/dictionary';
import events from '../../../event/events/events';
import TaskModalWindow from './TaskModalWindow';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default class ListeningTaskModalWindow  extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, parentComponent = null) {
        super(top, left, width, height, 'Произнесите слово:', parentComponent);

        this.word = dictionary[Math.round(Math.random() * (dictionary.length - 1))].word;

        const labelText = `${this.word}: `;

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        this.recognition = recognition;

        const halfHeight = Math.ceil(height / 2);
        const halfExpressionWidth = Math.ceil((getTextWidthWithCanvas(labelText, 'monospace', '16px') + 1) / 2);

        const expression = new Label(halfHeight - 15 - 30 - 5, 5, halfExpressionWidth * 2, 30, labelText);
        const answer = new Label(halfHeight - 15, 5, width - 10 - 30 - 10, 30, '');
        const microButton = new Button(halfHeight - 15, width - 10 - 30, 30, 30, 'mic');

        answer.setBackgroundColor('#bb0000');

        const oneGlyphWidth = Math.ceil(getTextWidthWithCanvas('x', 'monospace', '16px'));

        answer.maxTextLength = Math.floor((width - 10) / oneGlyphWidth);
        expression.setBackgroundColor('#00bb00');

        microButton.setBackgroundColor('#aaaaaa');

        this.expressionKey = 'expression';
        this.answerKey = 'answer';
        this.microButtonKey = 'microbutton';

        this.addComponent(expression, this.expressionKey);
        this.addComponent(answer, this.answerKey);
        this.addComponent(microButton, this.microButtonKey);

        let isWorking = false;

        microButton.addEventListener(events.MOUSE.MOUSE_DOWN, (e) => {
            if (!isWorking) {
                recognition.start();
                isWorking = true;
            } else {
                recognition.stop();
                isWorking = false;
            }
        });

        recognition.onresult = (event) => {
            if (event.results.length > 0) {
                answer.setText(event.results[0][0].transcript);
            }
        };
    
        recognition.onspeechend = () => {
            recognition.stop();
        };

        recognition.onerror = (event) => {
            console.log('Error occurred in recognition: ' + event.error);
        };
    }

    answerIsRight() {
        const answer = this.getChildComponent(this.answerKey).getText().toLowerCase();
        return  answer === this.word;
    }
}
