import Label from './Label';

import { Component } from './Component';
import { getTextWidthWithCanvas } from '../../utils/textWidth';

export default class Button extends Component {
    constructor(top = 0, left = 0, width = 0, height = 0, text = '', parentComponent = null) {
        super(top, left, width, height, parentComponent);

        const textWidth = getTextWidthWithCanvas(text, 'monospace', '16px')

        this.label = new Label(Math.floor(height / 2) - 16 / 2, Math.floor(width / 2) - Math.floor(textWidth / 2), textWidth + 1, 16, text);
        this.properties.cursor = 'pointer';
    }

    paintComponent(context, elapsedTime) { 
        super.paintComponent(context, elapsedTime);

        const { top, left } = this.getBoundingClientRect();
   
        context.save();

        context.translate(left, top);

        this.label.draw(context, elapsedTime);

        context.restore();
    }
}
