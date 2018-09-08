import Label from './Label';

import { Component, CompositeComponent } from './Component';
import { getTextWidthWithCanvas } from '../../utils/textWidth';

export default class ProgressBar extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, minValue, maxValue, initialValue, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.currentValue = initialValue;

        this.oneInPixel = (width - 2) / (maxValue - minValue);

        const barComponent = new Component(1, 1, this.oneInPixel * (initialValue - minValue), height - 2);
        barComponent.setBackgroundColor('#aa0000');
        this.setBackgroundColor('#ffffff');

        this.barComponentKey = 'bar';

        const labelText = `${initialValue}/${maxValue}`;

        const textHeight = 16;
        const textWidth = Math.ceil(getTextWidthWithCanvas(labelText,'monospace', textHeight));

        const label = new Label(0 , 0, textWidth, textHeight, labelText);

        this.labelComponentKey = 'label';

        this.addComponent(barComponent, this.barComponentKey);
        this.addComponent(label, this.labelComponentKey);

        label.alignCenter();
    }

    getTextComponent() {
        return this.getChildComponent(this.labelComponentKey);
    }

    getBarComponent() {
        return this.getChildComponent(this.barComponentKey);
    }

    setBarColor(color = '#aa0000') {
        this.getChildComponent(this.barComponentKey).setBackgroundColor(color);
    }

    setValue(value) {
        this.currentValue = value;
        const bar = this.getChildComponent(this.barComponentKey);
        const { top, left, height } = bar.getBoundingClientRect();

        bar.setBoundingClientRect(top, left, Math.floor(value * this.oneInPixel), height);

        const labelText = `${value}/${this.maxValue}`;
        const label = this.getChildComponent(this.labelComponentKey);
        label.setText(labelText);

        const { height: heightLabel } = label.getBoundingClientRect();

        const textWidth = Math.ceil(getTextWidthWithCanvas(labelText, 'monospace', 16)) + 1;

        label.setBoundingClientRect(0, 0, textWidth, heightLabel);
        label.alignCenter();
    }
 }

