import Chart from '../../Component/Chart';
import Button from '../../Component/Button';
import dictionary from '../../../dictionary/dictionary';
import events from '../../../event/events/events';
import TaskModalWindow from './TaskModalWindow';
import ImageComponent from '../../ImageComponent/ImageComponent';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';
import { Component } from '../../Component/Component';


export default class SetPointAtChartTaskModalWindow  extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, images = {}, parentComponent = null) {
        super(top, left, width, height, 'Поставте точку с координатами (:):', images, parentComponent);

        const taskDescriptionBoundingBox = super.getTaskDescriptionComponent().getBoundingClientRect();
        const okButtonBoundingBox = super.getOkButtonComponent().getBoundingClientRect();

        this.chartBoundingClientBox = {
            top: taskDescriptionBoundingBox.bottom + 5,
            left: 20,
            bottom: height - 20,
            right: okButtonBoundingBox.left - 5,
        };

        this.chartBoundingClientBox.width = this.chartBoundingClientBox.right - this.chartBoundingClientBox.left;
        this.chartBoundingClientBox.height = this.chartBoundingClientBox.bottom - this.chartBoundingClientBox.top;

        const chartComponent = new Chart(this.chartBoundingClientBox.top, this.chartBoundingClientBox.left, this.chartBoundingClientBox.width, this.chartBoundingClientBox.height, 10);
        this.addComponent(chartComponent);
    }

    answerIsRight() {
        return  false;
    }
}
