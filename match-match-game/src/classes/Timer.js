class Timer {
    constructor(initialTime = 0) {
        this.initialTime = initialTime;
        this.changeTime = this.changeTime.bind(this);
    }


    changeTime() {
        this.time += 1;
    }

    start() {
        this.time = this.initialTime;
        this.intervalId = setInterval(this.changeTime, 1000);
    }

    terminate() {
        clearInterval(this.intervalId);
    }
}
