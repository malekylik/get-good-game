import { CompositeComponent } from './Component';

export default class Table extends CompositeComponent {
    constructor(top = 0, left = 0, width = 0, height = 0, rowCount = 0, columnCount = 0, cellWidth = 0, cellHeight = 0, parentComponent = null) {
        super(top, left, width, height, parentComponent);

        this.columnCount = columnCount;
        this.rowCount = rowCount;

        let totalRowsHeight = 0;
        for (let i = 0; i < rowCount; i++) {
            let totalRowsWidth = 0;
            for (let j = 0; j < columnCount; j++) {
                const cell = new CompositeComponent(totalRowsHeight, totalRowsWidth, cellWidth, cellHeight);
                this.addComponent(cell, String(i * columnCount + j));

                totalRowsWidth += cellWidth;

                const red = Math.round(Math.random() * 255).toString(16);
                const green = Math.round(Math.random() * 255).toString(16);
                const blue = Math.round(Math.random() * 255).toString(16);
                cell.setBackgroundColor(`#${red}${green}${blue}`);
            }

            totalRowsHeight += cellHeight;
        }
    }

    getTableComponent(row = 0, column = 0) {
        const child = this.getChildComponent(String(row * this.columnCount + column));

        return child ? child : null;
    }
}
