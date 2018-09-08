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

        this.color = '#000000';
    }

    setPosition(top, left) {
        this.metric.top = top;
        this.metric.left = left;
    }

    setColor(color = '#000000') {
        this.color = color;
    }

    draw(context, elapsedTime) {
        context.save();

        if (this.elapsedTime < this.blinkTime) {
            if (context.strokeStyle !== this.color) {
                context.strokeStyle = this.color;
            }

            context.beginPath();
            context.moveTo(this.metric.left, this.metric.top);
            context.lineTo(this.metric.left, Math.round(this.metric.top + this.metric.height + this.metric.height * 0.2));
            context.stroke();
        }

        this.elapsedTime += elapsedTime;

        if (this.elapsedTime > this.blinkTime * 2) {
            this.elapsedTime = 0;
        }

        context.restore();
    }
}