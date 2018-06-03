export default class Cursor {
    constructor(top, left, width, height) {
        this.metric = {
            top,
            left,
            width,
            height
        };

        this.blinkTime = 500;
        this.elapsedTime = 0;
    }

    setPosition(top, left) {
        this.metric.top = top;
        this.metric.left = left;
    }

    draw(context, elapsedTime) {
        context.save();

        if (this.elapsedTime < this.blinkTime) {
            context.beginPath();
            context.moveTo(this.metric.left, this.metric.top);
            context.lineTo(this.metric.left, this.metric.top + this.metric.height);
            context.stroke();
        }

        this.elapsedTime += elapsedTime;

        if (this.elapsedTime > this.blinkTime * 2) {
            this.elapsedTime = 0;
        }

        context.restore();
    }
}