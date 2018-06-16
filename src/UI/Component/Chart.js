import events from '../../event/events/events';

import { Component } from "./Component";

export default class Chart extends Component {
    constructor(top = 0, left = 0, width = 0, height = 0, cellCount, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.properties.cursor = 'pointer';

        const bottom = top + height;
        const right = left + width;

        this.cellCount = cellCount;

        this.originCoord = {
            x: left + 20,
            y: bottom - 20
        };

        this.xAxisCoord = {
            x: right - 10,
            y: this.originCoord.y,
        };

        this.yAxisCoord = {
            x: this.originCoord.x,
            y: top + 10,
        };

        this.lastCellXAxisCoord = {
            x: this.xAxisCoord.x - 20,
            y: this.xAxisCoord.y
        };

        this.lastCellYAxisCoord = {
            x: this.yAxisCoord.x,
            y: this.yAxisCoord.y + 20
        };

        this.xAxisArrow = {
            leftPoint: {
                x: this.xAxisCoord.x - 6,
                y: this.xAxisCoord.y - 8
            },
            rightPoint: {
                x: this.xAxisCoord.x - 6,
                y: this.xAxisCoord.y + 8
            },
        }

        this.yAxisArrow = {
            leftPoint: {
                x: this.yAxisCoord.x - 8,
                y: this.yAxisCoord.y + 6
            },
            rightPoint: {
                x: this.yAxisCoord.x + 8,
                y: this.yAxisCoord.y + 6
            },
        }

        this.xAxisWidth = this.lastCellXAxisCoord.x - this.originCoord.x;
        this.yAxisWidth = this.originCoord.y - this.lastCellYAxisCoord.y;

        this.oneCellX = this.xAxisWidth / (cellCount + 1);
        this.oneCellY = this.yAxisWidth / (cellCount + 1);

        this.point = null;

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
    }

    paintComponent(context, elapsedTime) {
        context.save();
        super.paintComponent(context, elapsedTime);

        const { top, left, width, height } = this.getBoundingClientRect();
        const { x: originX, y: originY } = this.originCoord;

        context.fillStyle = '#ffffff';

        context.fillRect(left, top, width, height);

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

        context.strokeStyle = '#777777';
        context.lineWidth = 2;

        context.beginPath();

        const lastCellX = this.lastCellXAxisCoord.x;
        const lastCellY = this.lastCellYAxisCoord.y;

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

        if (this.point !== null) {
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

        context.restore();
    };

    setPoint(x, y) {
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
