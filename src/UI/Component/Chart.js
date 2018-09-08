import events from '../../event/events/events';

import { Component } from "./Component";

export default class Chart extends Component {
    constructor(top = 0, left = 0, width = 0, height = 0, cellCount, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.properties.cursor = 'pointer';

        const bottom = top + height;
        const right = left + width;

        this.cellCount = cellCount;

        const padding = 20;
        const firstCathetus = 6;
        const secondCathetus = 8;

        this.originCoord = {
            x: left + padding,
            y: bottom - padding
        };

        this.xAxisCoord = {
            x: right - padding / 2,
            y: this.originCoord.y,
        };

        this.yAxisCoord = {
            x: this.originCoord.x,
            y: top + padding / 2,
        };

        this.lastCellXAxisCoord = {
            x: this.xAxisCoord.x - padding,
            y: this.xAxisCoord.y
        };

        this.lastCellYAxisCoord = {
            x: this.yAxisCoord.x,
            y: this.yAxisCoord.y + padding
        };

        this.xAxisArrow = {
            leftPoint: {
                x: this.xAxisCoord.x - firstCathetus,
                y: this.xAxisCoord.y - secondCathetus
            },
            rightPoint: {
                x: this.xAxisCoord.x - firstCathetus,
                y: this.xAxisCoord.y + secondCathetus
            },
        }

        this.yAxisArrow = {
            leftPoint: {
                x: this.yAxisCoord.x - secondCathetus,
                y: this.yAxisCoord.y + firstCathetus
            },
            rightPoint: {
                x: this.yAxisCoord.x + secondCathetus,
                y: this.yAxisCoord.y + firstCathetus
            },
        }

        this.xAxisWidth = this.lastCellXAxisCoord.x - this.originCoord.x;
        this.yAxisWidth = this.originCoord.y - this.lastCellYAxisCoord.y;

        this.oneCellX = this.xAxisWidth / (cellCount + 1);
        this.oneCellY = this.yAxisWidth / (cellCount + 1);

        this.point = null;

        this.onchartchange = null;

        this.addEventListener(events.MOUSE.MOUSE_DOWN, this.handleClick);
    }

    handleClick(e) {
        const target = e.target;
        const { top, left } = target.getAbsoluteCoord();
        const { top: mouseTop, left: mouseLeft } = e.payload.mouseCoord;

        const relativeMouseTop = mouseTop - top  + target.getBoundingClientRect().top;
        const relativeMouseLeft = mouseLeft - left + target.getBoundingClientRect().left;

        if (relativeMouseTop < target.lastCellYAxisCoord.y + target.oneCellY / 2 || relativeMouseTop > target.originCoord.y
        || relativeMouseLeft < target.originCoord.x || relativeMouseLeft > target.lastCellXAxisCoord.x - target.oneCellX / 2) {
            target.point = null;
        } else {
            const y = Math.round((target.originCoord.y - relativeMouseTop) / target.oneCellY);
            const x = Math.round((relativeMouseLeft - target.originCoord.x) / target.oneCellX);

            target.setPoint(x, y);
        }

        if (typeof target.onchartchange === 'function') {
            target.onchartchange(target.point);
        }
    }

    getPoint() {
        if (this.point === null) {
            return null;
        }

        return {
            x: this.point.x,
            y: this.point.y
        };
    }

    paintChartAxises(context, originX, originY) {
        context.strokeStyle = '#000000';

        context.lineWidth = 3;

        context.beginPath();
        context.moveTo(originX, originY);
        context.lineTo(this.xAxisCoord.x, this.xAxisCoord.y);

        context.moveTo(this.xAxisCoord.x, this.xAxisCoord.y);
        context.lineTo(this.xAxisArrow.leftPoint.x, this.xAxisArrow.leftPoint.y);

        context.moveTo(this.xAxisCoord.x, this.xAxisCoord.y);
        context.lineTo(this.xAxisArrow.rightPoint.x, this.xAxisArrow.rightPoint.y);

        context.moveTo(this.yAxisCoord.x, this.yAxisCoord.y);
        context.lineTo(this.yAxisArrow.leftPoint.x, this.yAxisArrow.leftPoint.y);

        context.moveTo(this.yAxisCoord.x, this.yAxisCoord.y);
        context.lineTo(this.yAxisArrow.rightPoint.x, this.yAxisArrow.rightPoint.y);

        context.moveTo(originX, originY);
        context.lineTo(this.yAxisCoord.x, this.yAxisCoord.y);
        context.stroke();

        context.fillStyle = '#000000';
        context.font = `16px monospace`;
        context.textBaseline = 'top';
        context.textAlign = 'center';

        context.fillText('0', originX, originY);
    }

    paintChartGrid(context, originX, originY) {
        context.strokeStyle = '#777777';
        context.lineWidth = 2;

        context.beginPath();

        const lastTenCellY = this.lastCellYAxisCoord.y + this.oneCellY;
        for (let i = 1; i < this.cellCount + 1; i++) {
            const x  = originX + i * this.oneCellX;
            context.moveTo(x, originY);
            context.lineTo(x, lastTenCellY);
            context.fillText(String(i), x, originY);
        }

        context.textBaseline = 'middle';
        context.textAlign = 'right';

        const lastTenCellX = this.lastCellXAxisCoord.x - this.oneCellX;
        for (let i = 1; i < this.cellCount + 1; i++) {
            const y  = originY - (this.cellCount + 1 - i) * this.oneCellY;

            context.moveTo(originX, y);
            context.lineTo(lastTenCellX, y);
            context.fillText(String(this.cellCount + 1 - i), originX - 3, y);
        }

        context.stroke();
    }

    paintPoint(context) {
        context.save();

        context.strokeStyle = '#aa0000';
        context.beginPath();
        context.arc(this.point.pointCoord.x, this.point.pointCoord.y, 5, 0, 2 * Math.PI);
        context.clip();
        context.stroke();
        
        context.fillStyle = '#aa0000';
        context.fillRect(this.point.pointCoord.x - 10, this.point.pointCoord.y - 10, 20, 20);
        context.restore();
    }

    paintComponent(context, elapsedTime) {
        context.save();
        super.paintComponent(context, elapsedTime);

        const { top, left, width, height } = this.getBoundingClientRect();
        const { x: originX, y: originY } = this.originCoord;

        context.fillStyle = '#ffffff';

        context.fillRect(left, top, width, height);

        this.paintChartAxises(context, originX, originY);

        this.paintChartGrid(context, originX, originY);

        if (this.point !== null) {
            this.paintPoint(context);
        }

        context.restore();
    };

    setPoint(x, y) {
        if (x > this.cellCount || x < 0 || y > this.cellCount || y < 0) {
            this.point = null;
        } else {
            this.point = {
                x,
                y,
                pointCoord: {
                    x: this.originCoord.x + this.oneCellX * x,
                    y: this.originCoord.y - this.oneCellY * y
                }
            };
        }
    }
} 
