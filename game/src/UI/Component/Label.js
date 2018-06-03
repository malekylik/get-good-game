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
            textAlign: 'left',
            textBaseline: 'top',
            fontSize: 16,
            fontFamily: 'monospace'
        };

        this.handlers.addEventListener(events.MOUSE.MOUSE_DOWN, this.handleMouseDown);
        this.handlers.addEventListener(events.KEYBOARD.KEY_PRESS, this.handleKeyPress);

        this.linesMetric = [];
        this.textLines = [];

        this.cursorPosition = {};

        this.properties.cursor = 'text';

        merge(this.animations.animatedProperties, this.properties);
        merge(this.hoverProperties, this.properties);

        this.neededToRecalculate = {
            needed: true,
            row: 0,
        };

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
                    target.cursorPosition = {
                        row: i,
                        column: j,
                        index: target.textLines[i].startOfLine + j
                    };
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

                target.cursorPosition = {
                    row: i,
                    column: target.glyphPosition[i].length,
                    index: target.textLines[i].startOfLine + target.glyphPosition[i].length
                };
            }
            }
        }

        if (!isInside) {
            const { top, width } = target.linesMetric[target.linesMetric.length - 1];
            target.cursor.setPosition(top, width);

            target.cursorPosition = {
                row: target.linesMetric.length - 1,
                column: target.glyphPosition[target.glyphPosition.length - 1].length,
                index: target.textLines[target.glyphPosition.length - 1].startOfLine + target.glyphPosition[target.glyphPosition.length - 1].length
            };
        }
    }

    handleKeyPress(e) {
        const target = e.target;
        target.neededToRecalculate.needed = true;

        target.edit = target.editString(e.payload.key, target.cursorPosition.index);
        target.cursorPosition.index += 1;

        // target.textLines[target.cursorPosition.row] = target.textLines[target.cursorPosition.row].slice(0, target.cursorPosition.column) + e.payload.key + target.textLines[target.cursorPosition.row].slice(target.cursorPosition.column);
    }

    editString(key, index) {
        return (string, context) => {
            if (index >= string.length) {
                return string + key;
            }

            if (index === 0) {
                return key + string;
            }

            return string.slice(0, index) + key + string.slice(index);
        };
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

    calculateLines(context, text, row) {
        const width = this.getBoundingClientRect().width;
        const fontSize = this.animations.animatedProperties.textProperties.fontSize;
        this.textLines = [];
        this.linesMetric = [];

        if (this.edit) {
            this.text = this.edit(this.text);
        }

        let glyphs = this.text.split('');

        let lineWidth = 0;
        let glyphWidth = 0;
        let startOfLine = 0;
        let line = '';
        glyphs.forEach((glyph, i) => {
            glyphWidth = context.measureText(glyph).width;

            if (lineWidth + glyphWidth < width) {
                line += glyph;
                lineWidth += glyphWidth;

                return;
            }

            this.linesMetric.push({
                top: this.textLines.length * fontSize,
                left: 0,
                width: lineWidth,
                height: fontSize,
            });
            this.textLines.push({
                startOfLine,
                line
            });

            startOfLine += line.length;

            glyphWidth = context.measureText(glyph).width;
            lineWidth = glyphWidth;
            line = glyph;
        });

        if (line !== '') {
            this.linesMetric.push({
                top: this.textLines.length * fontSize,
                left: 0,
                width: context.measureText(line).width,
                height: fontSize,
            });

            this.textLines.push({
                    startOfLine,
                    line
                });
        }

        this.calculateGlyphPosition(context);
    }

    calculateGlyphPosition(context) {
        this.glyphPosition = [];

        const fontSize = this.animations.animatedProperties.textProperties.fontSize;
        this.textLines.forEach(({ line }, i) => {
            const glyphPosition = [];
            const glyphs = line.split('');

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

        if (this.neededToRecalculate.needed) {
            this.calculateLines(context, this.text, this.neededToRecalculate.row);
            if (this.edit) {
                this.edit = null;

                let row = 0;
                let index =  this.cursorPosition.index;
                for (let i = 0; i < this.textLines.length; i++) {
                    if (this.textLines[i].startOfLine < index) {
                        row = i;
                    } else {
                        break;
                    }
                }

                this.cursorPosition.row = row;
                this.column = index - this.textLines[row].startOfLine;

                if (this.column >= this.glyphPosition[row].length) {
                    this.column = this.glyphPosition[row].length;
                    this.cursor.setPosition(this.glyphPosition[row][this.column - 1].top, this.glyphPosition[row][this.column - 1].left + this.glyphPosition[row][this.column - 1].width);  
                } else {
                    this.cursor.setPosition(this.glyphPosition[row][this.column].top, this.glyphPosition[row][this.column].left);                    
                }
            }

            this.neededToRecalculate.needed = false;
        }

        this.textLines.forEach(({ line }, i) => {        
            context.fillText(line, 0, this.linesMetric[i].top);
        });

        if (this.isSelected) {
            this.cursor.draw(context, elapsedTime);
        }
    }
}
