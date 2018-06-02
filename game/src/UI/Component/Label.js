import { merge } from 'lodash';

import { Component } from './Component';

export default class Label extends Component {
    constructor(top = 0, left = 0, width = 0, height = 0, text = '', parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.text = text;
        this.properties.color.textColor = '#000000';
        this.properties.textProperties = {
            textAlign: 'center',
            textBaseline: 'middle',
            fontSize: 16,
            fontFamily: 'Arial'
        };

        this.properties.cursor = 'text';

        merge(this.animations.animatedProperties, this.properties);
        merge(this.hoverProperties, this.properties);

        this.neededToRecalculate = true;
        this.cursorPosition = -1;
    }

    setText(text = '') {
        this.neededToRecalculate = true;
        this.text = text;
    }

    getText() {
        return this.getText();
    }

    setTextColor(color = '#000000') {
        this.color.textColor = color;
    }

    setFont(font) {
        this.textProperties.font = font;
    }

    calculateLines(context, text) {
        if (this.neededToRecalculate) {
            this.textLines = [];

            const width = this.getBoundingClientRect().width;
            let words = this.text.split(' ');
                
            let line = '';
            let lineWidth = 0;
            words.forEach((word) => {
                if (lineWidth !== 0) {
                    word = ' ' + word;
                }
    
                const wordWidth = context.measureText(word).width;
                
                if (lineWidth + wordWidth <= width) {
                    lineWidth += wordWidth;
                    line += word;
    
                    return;
                }
    
                this.textLines.push(line.trim());
                line = word;
                lineWidth = context.measureText(word.trim()).width;
            });
    
            if (line !== '') {
                this.textLines.push(line.trim());
            }

            this.neededToRecalculate = false;
        }
    }

    setContextProperties(context, elapseTime) {
        context.fillStyle = this.animations.animatedProperties.color.textColor;
        context.font = `${this.animations.animatedProperties.textProperties.fontSize}px ${this.animations.animatedProperties.textProperties.fontFamily}`;
        context.textAlign = this.animations.animatedProperties.textProperties.textAlign;
        context.textBaseline = this.animations.animatedProperties.textProperties.textBaseline;     

        super.setContextProperties(context, elapseTime)
    }

    paintComponent(context, elapseTime) { 
        super.paintComponent(context, elapseTime);
        let { width, height, bottom, left } = this.getBoundingClientRect();

        context.translate(left, bottom);

        this.calculateLines(context, this.text);

        this.textLines.forEach((line, i) => {        
            context.fillText(line, width / 2, -height / 2 + i * this.animations.animatedProperties.textProperties.fontSize);
        });
    }
}
