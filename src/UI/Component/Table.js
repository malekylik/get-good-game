import events from '../../event/events/events';

import { CompositeComponent } from './Component';

export default class Table extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, rowCount = 0, columnCount = 0, cellWidth = 0, cellHeight = 0, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.columnCount = columnCount;
        this.rowCount = rowCount;

        this.arrowKeyHandler = this.arrowKeyHandler.bind(this);

        let totalRowsHeight = 0;
        for (let i = 0; i < rowCount; i++) {
            let totalRowsWidth = 0;
            for (let j = 0; j < columnCount; j++) {
                const cell = new CompositeComponent(totalRowsHeight, totalRowsWidth, cellWidth, cellHeight);
                this.addComponent(cell, String(i * columnCount + j));

                cell.setBackgroundColor('rgba(0, 0, 0, 0)');

                totalRowsWidth += cellWidth;
            }

            totalRowsHeight += cellHeight;
        }

        this.addEventListener(events.KEYBOARD.KEY_DOWN, this.arrowKeyHandler);
    }

    arrowKeyHandler(e) {
        const scrollX = this.scrollX;
        const scrollY = this.scrollY;
        const key = e.payload.key;

        if (scrollX) {
            if (key === 'ArrowLeft') {
                scrollX.prevButtonHandler(e);
            } 

            if (key === 'ArrowRight') {
                scrollX.nextButtonHandler(e);
            } 
        }

        if (scrollY) {
            if (key === 'ArrowUp') {
                scrollY.prevButtonHandler(e);
            }
            if (key === 'ArrowDown') {
                scrollY.nextButtonHandler(e);
            }
        }
    }

    getTableComponent(row = 0, column = 0) {
        const child = this.getChildComponent(String(row * this.columnCount + column));

        return child ? child : null;
    }
}
