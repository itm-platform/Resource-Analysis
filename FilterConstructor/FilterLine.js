// FilterConstructor/FilterLine.js
export class FilterLine {
    constructor(initialFilterLine, indexInFilterLines, dataServiceModel) {
        this.initialFilterLine = initialFilterLine;
        this.index = indexInFilterLines;
        this.dataServiceModel = dataServiceModel;
        this.element = this.createElement();
    }

    createElement() {
        const div = document.createElement('div');
        div.className = 'filterLine';
        div.textContent = JSON.stringify(this.initialFilterLine);
        return div;
    }
}
