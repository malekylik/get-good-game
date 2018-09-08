import Label from '../../Component/Label';
import Chart from '../../Component/Chart';
import TaskModalWindow from './TaskModalWindow';
import ImageComponent from '../../ImageComponent/ImageComponent';
import events from '../../../event/events/events';

import { getTextWidthWithCanvas } from '../../../utils/textWidth';

export default class SetPointAtChartTaskModalWindow  extends TaskModalWindow {
    constructor(top = 0, left = 0, width = 0, height = 0, additionalResources = {}, parentComponent = null) {
        const point = {
            x: Math.round(Math.random() * 10),
            y: Math.round(Math.random() * 10)
        };

        super(top, left, width, height, `Поставте точку с координатами (${point.x}:${point.y}):`, additionalResources, parentComponent);

        this.onChartChange = this.onChartChange.bind(this);
        this.onInputChange = this.onInputChange.bind(this);

        const taskDescriptionBoundingBox = super.getTaskDescriptionComponent().getBoundingClientRect();
        const okButtonBoundingBox = super.getOkButtonComponent().getBoundingClientRect();

        const leftMargin = 20;
        const topMargin = 5;
        const bottomMargin = 20;
        const rightMargin = 5;

        this.chartBoundingClientBox = {
            top: taskDescriptionBoundingBox.bottom + topMargin,
            left: leftMargin,
            bottom: height - bottomMargin,
            right: okButtonBoundingBox.left - rightMargin,
        };

        this.point = point;

        this.chartBoundingClientBox.width = this.chartBoundingClientBox.right - this.chartBoundingClientBox.left;
        this.chartBoundingClientBox.height = this.chartBoundingClientBox.bottom - this.chartBoundingClientBox.top;

        this.chartKey = 'chart';

        const chartComponent = new Chart(this.chartBoundingClientBox.top, this.chartBoundingClientBox.left, this.chartBoundingClientBox.width, this.chartBoundingClientBox.height, 10);
        chartComponent.onchartchange = this.onChartChange;
        this.addComponent(chartComponent, this.chartKey);

        this.initLabels(additionalResources);
    }

    getDefaultComponent() {
        return this.getXInput();
    }

    onChartChange(point) {
        const xInput = this.getXInput();
        const yInput = this.getYInput();

        if (point !== null) {
            xInput.setText(String(point.x));
            yInput.setText(String(point.y));
        } else {
            xInput.setText('');
            yInput.setText('');
        }
    }

    onInputChange() {
        const xInputNumber = parseInt(this.getXInput().getText(), 10);
        const yInputNumber = parseInt(this.getYInput().getText(), 10);
        const chart = this.getChartComponent();

        if (xInputNumber === xInputNumber && yInputNumber === yInputNumber) {
            chart.setPoint(xInputNumber, yInputNumber);
        } else {
            chart.setPoint(-1, -1);
        }
    }

    getXInput() {
        return this.getChildComponent(this.xLabelInputKey);
    }

    getYInput() {
        return this.getChildComponent(this.yLabelInputKey);
    }

    initLabels(additionalResources) {
        const textFieldImage = additionalResources.images.textFieldImage;
        const { naturalWidth: textFieldWidth, naturalHeight: textFieldHeight } = textFieldImage;


        this.xLabelKey = 'xlabel';
        this.xLabelInputKey = 'xlabelinput';
        this.yLabelKey = 'ylabel';
        this.yLabelInputKey = 'ylabelinput';

        const textHeight = textFieldHeight;
        const coordLabelWidth = Math.ceil(getTextWidthWithCanvas('X:', 'monospace', textHeight));

        const xLabel = new Label(this.chartBoundingClientBox.top, this.chartBoundingClientBox.right + 5, coordLabelWidth, textHeight, 'X:');
        xLabel.setTextColor('#ffffff');
        this.addComponent(xLabel, this.xLabelKey);

        const xLabelInput = new Label(this.chartBoundingClientBox.top, xLabel.getBoundingClientRect().right + 3, coordLabelWidth, textHeight, '');
        xLabelInput.editable = true;
        xLabelInput.tabable = true;
        xLabelInput.drawBorder = true;
        xLabelInput.setBackgroundImage(new ImageComponent(textFieldImage, 0, 0, textFieldWidth, textFieldHeight, textFieldWidth, textFieldHeight, 0, 0, textFieldWidth, textFieldHeight));
        xLabelInput.setBackgroundColor('#bb0000');
        xLabelInput.maxTextLength = 2;
        xLabelInput.setTextColor('#FFFF00');
        xLabelInput.cursor.setColor('#08B600');

        this.addComponent(xLabelInput, this.xLabelInputKey);

        const yLabel = new Label(xLabel.getBoundingClientRect().bottom + 5, this.chartBoundingClientBox.right + 5, coordLabelWidth, textHeight, 'Y:');
        yLabel.setTextColor('#ffffff');
        this.addComponent(yLabel, this.yLabelKey);

        const yLabelInput = new Label(yLabel.getBoundingClientRect().top, yLabel.getBoundingClientRect().right + 3, coordLabelWidth, textHeight, '');
        yLabelInput.editable = true;
        yLabelInput.tabable = true;
        yLabelInput.drawBorder = true;
        yLabelInput.setBackgroundImage(new ImageComponent(textFieldImage, 0, 0, textFieldWidth, textFieldHeight, textFieldWidth, textFieldHeight, 0, 0, textFieldWidth, textFieldHeight));
        yLabelInput.setBackgroundColor('#bb0000');
        yLabelInput.maxTextLength = 2;
        yLabelInput.setTextColor('#FFFF00');
        yLabelInput.cursor.setColor('#08B600');

        this.addComponent(yLabelInput, this.yLabelInputKey);

        xLabelInput.addEventListener(events.KEYBOARD.KEY_DOWN, this.onInputChange);
        xLabelInput.addEventListener(events.KEYBOARD.KEY_PRESS, this.onInputChange);
        yLabelInput.addEventListener(events.KEYBOARD.KEY_DOWN, this.onInputChange);
        yLabelInput.addEventListener(events.KEYBOARD.KEY_PRESS, this.onInputChange);
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
