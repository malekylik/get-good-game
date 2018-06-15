export default class EventQueue {
    constructor() {
        this.queue = [];

        this.queueIndex = 0;
    }

    add(event) {
        this.queue.push(event);
    }

    getNext() {
        if (this.queue.length === 0) {
            return null;
        }

        if (this.queueIndex < this.queue.length) {
            const event = this.queue[this.queueIndex];
            this.queueIndex += 1;
            return event;
        }

        this.queueIndex = 0;
        this.queue = [];

        return null;
    }

    hasNext() {
        const hasNext = !!(this.queue.length - this.queueIndex);

        if (!hasNext && this.queue.length !== 0) {
            this.queueIndex = 0;
            this.queue = [];
        }

        return hasNext;
    }

    remain() {
        return this.queue.length - this.queueIndex;
    }
}
