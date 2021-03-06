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
        
        this.maxTextLength = 'infinite';

        this.editable = false;

        this.handlers.addEventListener(events.MOUSE.MOUSE_DOWN, this.handleMouseDown);
        this.handlers.addEventListener(events.KEYBOARD.KEY_PRESS, this.handleKeyPress);
        this.handlers.addEventListener(events.KEYBOARD.KEY_DOWN, this.handleKeyDown);

        this.linesMetric = [];
        this.textLines = [];

        this.cursorPosition = {
            row: 0,
            column: 0,
            index: 0
        };

        this.properties.cursor = 'text';

        merge(this.animations.animatedProperties, this.properties);
        merge(this.hoverProperties, this.properties);

        this.neededToRecalculate = {
            needed: true,
            row: 0,
        };

        this.cursor = new Cursor(0, 0, 1, this.properties.textProperties.fontSize);
    }

    checkCollisionWithGlyphs(topOffset, leftOffset, mouseCoord) {
        let isInside = false;

        for (let i = 0; i < this.glyphPosition.length; i++) {
            const line = this.glyphPosition[i];
            for (let j = 0; j < line.length; j++) {
                const { top, left, width, height } = line[j];

                isInside = this.collision.isInside({
                        top: top + topOffset,
                        left: left + leftOffset,
                        width,
                        height
                    },
                    mouseCoord
                );

                if (isInside) {
                    return {
                        top,
                        left,
                        row: i,
                        column: j,
                        index: this.textLines[i].startOfLine + j
                    };
                }
            }
        }

        return null;
    }

    checkCollisionWithLines(topOffset, leftOffset, mouseCoord) {
        let isInside = false;

        for (let i = 0; i < this.linesMetric.length; i++) { 
            const { top, left, width, height } = this.linesMetric[i];

            isInside = this.collision.isInside({
                    top: top + topOffset,
                    left: left + leftOffset,
                    width: this.getBoundingClientRect().width,
                    height
                },
                mouseCoord
            );

            if (isInside) {
                return {
                    top,
                    width,
                    row: i,
                    column: this.glyphPosition[i].length,
                    index: this.textLines[i].startOfLine + this.glyphPosition[i].length
                };
            }
        }

        return null;
    }

    handleMouseDown(e) {
        if (e.target.editable) {
            const target = e.target;

            if (target.text === '') {
                target.cursor.setPosition(0, 0);

                target.cursorPosition = {
                    row: 0,
                    column: 0,
                    index: 0
                };

                return;
            }

            const mouseCoord = {
                top: e.payload.mouseCoord.top,
                left: e.payload.mouseCoord.left,
                width: 1,
                height: 1
            };

            const { top: topOffset, left: leftOffset } = target.getAbsoluteCoord();
            const glyphInfo = target.checkCollisionWithGlyphs(topOffset, leftOffset, mouseCoord);

            if (glyphInfo !== null) {
                const { top, left, row, column, index } = glyphInfo;
                target.cursor.setPosition(top, left);
                target.cursorPosition = {
                    row,
                    column,
                    index
                };

                return;
            }

            const lineInfo = target.checkCollisionWithLines(topOffset, leftOffset, mouseCoord);

            if (lineInfo !== null) {
                const { top, width, row, column, index } = lineInfo;
                target.cursor.setPosition(top, width);
                target.cursorPosition = {
                    row,
                    column,
                    index
                };

                return;
            }

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
        if (e.target.editable) {
            const target = e.target;

            if (typeof target.maxTextLength === 'number') {
                if (target.text.length >= target.maxTextLength) return;
            }

            if (e.payload.key === 'Delete') return;
            if (e.payload.key === 'Backspace') return;
            if (e.payload.key === 'Enter') return;
     
            target.text = target.insertGlyph(e.payload.key, target.cursorPosition.index, target.text);
            target.cursorPosition.index += 1;
    
            target.neededToRecalculate.needed = true;
        }
    }

    handleKeyDown(e) {
        if (e.target.editable) {
            const target = e.target;
            let key = e.payload.key;
            let index = target.cursorPosition.index;

            if (key === 'Delete') {
                if (index >= target.text.length) return;

                target.text = target.deleteGlyph(index, target.text);
            } else if (key === 'Backspace') {
                if (index === 0) return;

                target.text = target.deleteGlyph(index - 1, target.text);
                index -= 1;
            } else if (key === ' ') {
                target.handleKeyPress(e);
                return;
            } else if (key === 'ArrowRight') {
                if (index >= target.text.length) return;

                index += 1;
            } else if (key === 'ArrowLeft') {
                if (index === 0) return;

                index -= 1;
            } else if (key === 'ArrowUp') {
                if (index === 0) return;

                const prevLineLength = (target.textLines[target.cursorPosition.row - 1] && target.textLines[target.cursorPosition.row - 1].line.length) || -1;
                const currentLineLength = target.textLines[target.cursorPosition.row].line.length;

                index -= Math.max(prevLineLength, currentLineLength);

                if (index < 0) {
                    index = 0;
                }
            } else if (key === 'ArrowDown') {
                if (index >= target.text.length) return;

                const currentLineLength = target.textLines[target.cursorPosition.row].line.length;
                const nextLineLength = (target.textLines[target.cursorPosition.row + 1] && target.textLines[target.cursorPosition.row + 1].line.length) || -1;

                index += Math.max(currentLineLength, nextLineLength);

                if (index >= target.text.length) {
                    index = target.text.length;
                }
            }

            target.cursorPosition.index = index;
            target.neededToRecalculate.needed = true;
        }
    }

    deleteGlyph(index, string) {
        return string.slice(0, index) + string.slice(index + 1);
    }

    insertGlyph(key, index, string) {
        if (index >= string.length) {
            return string + key;
        }

        if (index === 0) {
            return key + string;
        }

        return string.slice(0, index) + key + string.slice(index);
    }

    getText() {
        return this.text;
    }

    setText(text = '') {
        this.neededToRecalculate.needed = true;
        this.text = text;
    }

    setFontSize(fontSize = 16) {
        this.properties.textProperties.fontSize = fontSize;
    }

    setTextColor(color = '#000000') {
        this.properties.color.textColor = color;
    }

    setFont(font) {
        this.textProperties.font = font;
    }

    setCursorPositionFrom2D(row, column) {
        if (this.glyphPosition.length !== 0) {
            if (column >= this.glyphPosition[row].length) {
                this.cursor.setPosition(this.glyphPosition[row][column - 1].top, this.glyphPosition[row][column - 1].left + this.glyphPosition[row][column - 1].width);  
            } else {
                this.cursor.setPosition(this.glyphPosition[row][column].top, this.glyphPosition[row][column].left);                    
            }
        } else {
            this.cursor.setPosition(0, 0);
        }
    }

    setContextProperties(context, elapsedTime) {
        context.fillStyle = this.animations.animatedProperties.color.textColor;
        context.font = `${this.animations.animatedProperties.textProperties.fontSize}px ${this.animations.animatedProperties.textProperties.fontFamily}`;
        context.textAlign = this.animations.animatedProperties.textProperties.textAlign;
        context.textBaseline = this.animations.animatedProperties.textProperties.textBaseline;     

        super.setContextProperties(context, elapsedTime)
    }

    calculateLines(context) {
        const width = this.getBoundingClientRect().width;
        const fontSize = this.animations.animatedProperties.textProperties.fontSize;
        this.textLines = [];
        this.linesMetric = [];

        let glyphs = this.text.split('');

        let lineWidth = 0;
        let glyphWidth = 0;
        let startOfLine = 0;
        let line = '';
        glyphs.forEach((glyph) => {
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

    setCursorToEnd() {
        this.cursorPosition.index = this.text.length;

        this.neededToRecalculate.needed = true;
    }

    convertIndexTo2DPosition(index) {
        let row = 0;
        let column = 0;
        for (let i = 0; i < this.textLines.length; i++) {
            if (this.textLines[i].startOfLine <= index) {
                row = i;
            } else {
                break;
            }
        }

        if (this.textLines.length !== 0) {
            column = index - this.textLines[row].startOfLine;

            if (column >= this.glyphPosition[row].length) {
                column = this.glyphPosition[row].length;
                index = this.textLines[row].startOfLine + column;
            }
        } else {
            column = 0;
            index = 0;
        }

        return {
            row,
            column,
            index
        };
    }

    paintComponent(context, elapsedTime) { 
        super.paintComponent(context, elapsedTime);
        let { top, left } = this.getBoundingClientRect();

        context.save();

        context.translate(left, top);
        if (this.neededToRecalculate.needed) {
            this.calculateLines(context, this.text, this.neededToRecalculate.row);

            const { row, column, index } = this.convertIndexTo2DPosition(this.cursorPosition.index);
            this.cursorPosition.row = row;
            this.cursorPosition.column = column;
            this.cursorPosition.index = index;

            this.setCursorPositionFrom2D(row, column);
            
            this.neededToRecalculate.needed = false;
        }

        context.fillStyle = this.properties.color.textColor;
        context.font = `${this.properties.textProperties.fontSize}px ${this.properties.textProperties.fontFamily}`;

        this.textLines.forEach(({ line }, i) => {        
            context.fillText(line, 0, this.linesMetric[i].top);
        });

        if (this.isSelected && this.editable) {
            this.cursor.draw(context, elapsedTime);
        }

        context.restore();
    }
}
