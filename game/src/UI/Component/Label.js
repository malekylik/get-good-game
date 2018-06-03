import { merge } from 'lodash';

import events from '../../event/events/events';
import Cursor from '../Cursor';

import { Component } from './Component';

export default class Label extends Component {
    constructor(top = 0, left = 0, width = 0, height = 0, text = '', parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.text = text;
        this.properties.color.textColor = '#000000';
        this.properties.textProperties = {
            textAlign: 'monospace',
            textBaseline: 'top',
            fontSize: 16,
            fontFamily: 'Arial'
        };

        this.handlers.addEventListener(events.MOUSE.MOUSE_DOWN, this.handleMouseDown);

        this.linesMetric = [];

        this.cursorPosition = {};

        this.properties.cursor = 'text';

        merge(this.animations.animatedProperties, this.properties);
        merge(this.hoverProperties, this.properties);

        this.neededToRecalculate = true;

        this.cursor = new Cursor(0, 0, 1, this.properties.textProperties.fontSize);
    }

    handleMouseDown(e) {
        let isInside = false;
        let line = '';

        const target = e.target;

        const { top, left } = target.getClippedBoundingClientRect();

        let topOffset = top;
        let leftOffset = left;

        let parent = target.getParentComponent();

        while (parent) {
            const { top, left } = parent.getClippedBoundingClientRect();
            topOffset += top;
            leftOffset += left;

            parent = parent.getParentComponent();
        }

        const mouseCoord = {
            top: e.payload.mouseCoord.top,
            left: e.payload.mouseCoord.left,
            width: 1,
            height: 1
        };

        for (let i = 0; i < target.glyphPosition.length && !isInside; i++) {
            const line = target.glyphPosition[i];
            for (let j = 0; j < line.length && !isInside; j++) {
                const { top, left, width, height } = line[j];

            isInside = target.collision.isInside({
                    top: top + topOffset,
                    left: left + leftOffset,
                    width,
                    height
                },
                mouseCoord
            );

            if (isInside) {
                target.cursor.setPosition(top, left);

                target.isSelected = true;
            }
            }
        }

        if (!isInside) {
            for (let i = 0; i < target.linesMetric.length && !isInside; i++) { 
                const { top, left, width, height } = target.linesMetric[i];

            isInside = target.collision.isInside({
                    top: top + topOffset,
                    left: left + leftOffset,
                    width: target.getClippedBoundingClientRect().width,
                    height
                },
                mouseCoord
            );

            if (isInside) {
                target.cursor.setPosition(top, width);

                target.isSelected = true;
            }
            }
        }

        if (!isInside) {
            const { top, left, width, height } = target.linesMetric[target.linesMetric.length - 1];
            target.cursor.setPosition(top, width);

            target.isSelected = true;
        }
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
            const fontSize = this.animations.animatedProperties.textProperties.fontSize;

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

                line = line.trim();
    
                this.linesMetric.push({
                    top: this.textLines.length * fontSize,
                    left: 0,
                    width: context.measureText(line).width,
                    height: fontSize,
                });
                this.textLines.push(line);
                line = word;
                lineWidth = context.measureText(word.trim()).width;
            });
    
            if (line !== '') {
                line = line.trim();

                this.linesMetric.push({
                    top: this.textLines.length * fontSize,
                    left: 0,
                    width: context.measureText(line).width,
                    height: fontSize,
                });

                this.textLines.push(line.trim());
            }

            this.calculateGlyphPosition(context);

            this.neededToRecalculate = false;
        }
    }

    calculateGlyphPosition(context) {
        this.glyphPosition = [];

        const fontSize = this.animations.animatedProperties.textProperties.fontSize;
        this.textLines.forEach((e, i) => {
            const glyphPosition = [];
            const glyphs = e.split('');

            let lineWidth = 0;

            glyphs.forEach((e) => {
                const width = context.measureText(e).width;

                glyphPosition.push({
                    glyph: e,
                    left: lineWidth,
                    top: fontSize * i,
                    width: width,
                    height: fontSize
                });

                lineWidth += width;
            });

            this.glyphPosition.push(glyphPosition);
        });
    }

    setContextProperties(context, elapsedTime) {
        context.fillStyle = this.animations.animatedProperties.color.textColor;
        context.font = `${this.animations.animatedProperties.textProperties.fontSize}px ${this.animations.animatedProperties.textProperties.fontFamily}`;
        context.textAlign = this.animations.animatedProperties.textProperties.textAlign;
        context.textBaseline = this.animations.animatedProperties.textProperties.textBaseline;     

        super.setContextProperties(context, elapsedTime)
    }

    paintComponent(context, elapsedTime) { 
        super.paintComponent(context, elapsedTime);
        let { width, height, top, left } = this.getBoundingClientRect();

        context.translate(left, top);

        this.calculateLines(context, this.text);

        this.textLines.forEach((line, i) => {        
            context.fillText(line, 0, i * this.animations.animatedProperties.textProperties.fontSize);
        });

        if (this.isSelected) {
            this.cursor.draw(context, elapsedTime);
        }
    }
}
