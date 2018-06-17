import Chart from '../../Component/Chart';
import TaskModalWindow from './TaskModalWindow';

export default class SetPointAtChartTaskModalWindow  extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, additionalResources = {}, parentComponent = null) {
        const point = {
            x: Math.round(Math.random() * 10),
            y: Math.round(Math.random() * 10)
        };

        super(top, left, width, height, `Поставте точку с координатами (${point.x}:${point.y}):`, additionalResources, parentComponent);

        const taskDescriptionBoundingBox = super.getTaskDescriptionComponent().getBoundingClientRect();
        const okButtonBoundingBox = super.getOkButtonComponent().getBoundingClientRect();

        this.chartBoundingClientBox = {
            top: taskDescriptionBoundingBox.bottom + 5,
            left: 20,
            bottom: height - 20,
            right: okButtonBoundingBox.left - 5,
        };

        this.point = point;

        this.chartBoundingClientBox.width = this.chartBoundingClientBox.right - this.chartBoundingClientBox.left;
        this.chartBoundingClientBox.height = this.chartBoundingClientBox.bottom - this.chartBoundingClientBox.top;

        this.chartKey = 'chart';

        const chartComponent = new Chart(this.chartBoundingClientBox.top, this.chartBoundingClientBox.left, this.chartBoundingClientBox.width, this.chartBoundingClientBox.height, 10);
        this.addComponent(chartComponent, this.chartKey);
    }

    answerIsRight() {
        const point = this.getChartComponent().getPoint();

        if (point === null) {
            return false;
        }

        return  this.point.x === point.x && this.point.y === point.y;
    }

    getChartComponent() {
        return this.getChildComponent(this.chartKey);
    }
}
