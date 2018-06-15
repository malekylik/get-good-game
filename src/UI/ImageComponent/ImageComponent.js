export default class ImageComponent {
    constructor(image, dx = 0, dy = 0, naturalWidth, naturalHeight, dWidth, dHeight, sx = 0, sy = 0, sWidth, sHeight) {
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

        this.naturalWidth = naturalWidth;
        this.naturalHeight = naturalHeight;

        this.offsetX = 0;
        this.offsetY = 0;

        this.scrollXOffset = 0;
        this.scrollYOffset = 0;


        this.sx = sx;
        this.sy = sy;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;

        this.recalculateFrames();
    }

    setScrollXOffer(x) {
        this.scrollXOffset = x;
    }

    setScrollYOffer(y) {
        this.scrollYOffset = y;
    }

    setDXPosition(dx, dy) {
        this.x = dx;
        this.y = dy;
    }

    recalculateFrames() {
        if (this.naturalWidth !== undefined) {
            this.xFramesCount = Math.floor((this.naturalWidth - this.sx) / this.sWidth);

            if (this.xFramesCount < 1) {
                this.xFramesCount = 1;
            }
        } else {
            this.xFramesCount = 1;
        }
    
        if (this.naturalHeight !== undefined) {
            this.yFramesCount = Math.floor((this.naturalHeight - this.sy) / this.sHeight);

            if (this.yFramesCount < 1) {
                this.yFramesCount = 1;
            }
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
        return this.xFramesCount * this.yFramesCount;
    }

    getRemainXFramesCount() {
        return this.xFramesCount - this.currentXFrame;
    }

    getRemainYFramesCount() {
        return this.yFramesCount - this.currentYFrame;
    }

    getRemainFramesCount() {
        return (this.xFramesCount - this.currentXFrame) * (this.yFramesCount - this.currentYFrame);
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

        this.offsetX = this.sx + this.sWidth * (this.currentXFrame - 1);
        this.offsetY = this.sy + this.sHeight * (this.currentYFrame - 1);
    }

    setFrame(frame) {
        let framesCount = this.getFramesCount();
        let frameCount = Math.floor(framesCount * frame) + 1;

        if (frameCount > framesCount) {
            frameCount = framesCount;
        }

        let xFrameCount = this.getXFramesCount();

        if (frameCount < xFrameCount) {
            this.currentXFrame = frameCount;
            this.currentYFrame = 1;
        } else {
            this.currentYFrame = Math.ceil(frameCount / xFrameCount);
            this.currentXFrame = frameCount - ((this.currentYFrame - 1) * xFrameCount);
        }

        this.offsetX = this.sx + this.sWidth * (this.currentXFrame - 1);
        this.offsetY = this.sy + this.sHeight * (this.currentYFrame - 1);
    }

    setOffset(frame) {
        let widthOfOneLine = this.naturalWidth - this.sWidth;
        let width = this.getYFramesCount() * widthOfOneLine;

        let newWidth = Math.floor(width * frame);

        let linesCount =  Math.floor(newWidth / this.sWidth);

        this.offsetY = this.sHeight * Math.floor(newWidth / widthOfOneLine);
        this.offsetX = newWidth - linesCount * this.sWidth;
    }

    draw(context, x, y) {
        let left = this.x;
        let top = this.y;

        if (x !== undefined && y !== undefined) {
            left = x;
            top = y;
        }


        if (this.width !== undefined) {
            context.drawImage(this.htmlComponent, this.offsetX, this.offsetY, this.sWidth, this.sHeight, left + this.scrollXOffset, top + this.scrollYOffset, this.width, this.height);
        } else {
            context.drawImage(this.htmlComponent, left + this.scrollXOffset, top + this.scrollYOffset);
        }
    }
}
