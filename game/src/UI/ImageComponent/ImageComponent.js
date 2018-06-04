export default class ImageComponent {
    constructor(image, dx = 0, dy = 0, dWidth, dHeight, sx = 0, sy = 0, sWidth, sHeight) {
        this.htmlComponent = image;

        this.x = dx;
        this.y = dy;

        if (dWidth !== undefined) {
            this.width = dWidth;
        }

        if (dHeight !== undefined) {
            this.height = dHeight;
        }

        if (sWidth !== undefined) {
            this.sWidth = sWidth;
        }

        if (sHeight !== undefined) {
            this.sHeight = sHeight;
        }


        this.sx = sx;
        this.sy = sy;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        
        this.sWidth = width;
        this.sHidth = height;

        this.recalculateFrames();
    }

    recalculateFrames() {
        if (this.sWidth !== undefined) {
            this.xFramesCount = Math.floor((this.width - this.sx) / this.sWidth);
        } else {
            this.xFramesCount = 1;
        }
    
        if (this.Height !== undefined) {
            this.yFramesCount = Math.floor((this.height - this.sy) / this.sHeight);
        } else {
            this.yFramesCount = 1;
        }

        this.currentXFrame = 1;
        this.currentYFrame = 1;
    }

    getHtml() {
        return this.htmlComponent;
    }

    getXFramesCount() {
        return this.xFramesCount;
    }

    getYFramesCount() {
        return this.yFramesCount;
    }

    getFramesCount() {
        return this.xFramesCount + this.yFramesCount;
    }

    getRemainXFramesCount() {
        return this.xFramesCount - this.currentXFrame;
    }

    getRemainYFramesCount() {
        return this.yFramesCount - this.currentYFrame;
    }

    getRemainFramesCount() {
        return (this.xFramesCount - this.currentXFrame) + (this.yFramesCount - this.currentYFrame);
    }

    setNextFrame() {
        if (this.currentXFrame + 1 > this.xFramesCount) {
            if (this.currentYFrame + 1 > this.yFramesCount) {
                this.currentXFrame = 1;
                this.currentYFrame = 1;
            } else {
                this.currentYFrame += 1;
                this.currentXFrame = 1;
            }
        } else {
            this.currentXFrame += 1;
        }
    }

    draw(context, x, y) {
        let left = this.x;
        let top = this.y;

        if (x !== undefined && y !== undefined) {
            left = x;
            top = y;
        }

        if (this.width !== undefined) {
            context.drawImage(this.htmlComponent, this.sx + this.sWidth * (this.currentXFrame - 1), this.sy + this.sHeight * (this.currentYFrame - 1), this.sWidth, this.sHeight, left, top, this.width, this.height);
        } else {
            context.drawImage(this.htmlComponent, left, top);
        }
    }
}
