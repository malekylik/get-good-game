import Label from './Label';

import { Component, CompositeComponent } from './Component';
import { getTextWidthWithCanvas } from '../../utils/textWidth';

export default class Progressbar extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, minValue, maxValue, initialValue, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.currentValue = initialValue;

        this.oneInPixel = (width - 2) / (maxValue - minValue);

        const barComponent = new Component(1, 1, this.oneInPixel * (initialValue - minValue), height - 1);
        barComponent.setBackgroundColor('#aa0000');
        this.setBackgroundColor('#ffffff');

        this.barComponentKey = 'bar';

        const labelText = `${initialValue}/${maxValue}`;

        const textWidth = Math.ceil(getTextWidthWithCanvas(labelText,'monospace', 16)) + 1;

        const label = new Label(Math.floor(height / 2 - 8) , Math.ceil(width / 2 - textWidth / 2), textWidth, 16, labelText);

        this.labelComponentKey = 'label';

        this.addComponent(barComponent, this.barComponentKey);
        this.addComponent(label, this.labelComponentKey);
    }

    setBarColor(color = '#aa0000') {
        this.getChildComponent(this.barComponentKey).setBackgroundColor(color);
    }

    setValue(value) {
        this.currentValue = value;
        const labelText = `${value}/${this.maxValue}`;
        this.getChildComponent(this.labelComponentKey).text = labelText;

        const bar = this.getChildComponent(this.barComponentKey);
        const { top, left, height } = bar.getClippedBoundingClientRect();

        bar.setBoundingClientRect(top, left, Math.floor(value * this.oneInPixel), height);

        const label = this.getChildComponent(this.labelComponentKey);
        const { top: topLabel, width: widthLabel, height: heightLabel } = label.getClippedBoundingClientRect();

        const textWidth = Math.ceil(getTextWidthWithCanvas(labelText,'monospace', 16)) + 1;

        const { width: componentWidth } = this.getClippedBoundingClientRect();

        label.setBoundingClientRect(topLabel, Math.ceil(componentWidth / 2 - textWidth / 2), widthLabel, heightLabel);
    }
 }

