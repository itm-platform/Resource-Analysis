// FilterConstructor/FilterLine.js
import {FilterLineTable} from './FilterLineTable.js';
export class FilterLine {
    constructor(initialFilterLine, indexInFilterLines, dataServiceModel) {
        this.initialFilterLine = initialFilterLine;
        this.index = indexInFilterLines;
        this.dataServiceModel = dataServiceModel;
        this.#init();

    }

    #init() {
        this.element = this.#render();
    }
    #render() {
        const filterLine = document.createElement('div');
        filterLine.id = 'filter-line-' + this.index;
        filterLine.className = 'filter-line';

        const tables = [
            {value: "projects", text: "Projects"},
            {value: "services", text: "Services"}
        ];
        const tableSelected = "projects";
        const filterLineTable = new FilterLineTable(tables, tableSelected);
        
        filterLineTable.element.addEventListener('filterTableUpdated', (event) => {
            this.#updateFilterTable(event.detail);
        });

        filterLine.appendChild(filterLineTable.element);

            // Add the field dropdown

        // filterLine.textContent =
        //     this.initialFilterLine.tableName + ' '
        //     + this.initialFilterLine.fieldName + ' '
        //     + this.initialFilterLine.operator + ' '
        //     + this.initialFilterLine.value;
        return filterLine;
    }
    #updateFilterTable(tableName) {
        console.log(`${this.index} tableName: ${tableName}`);
    }
}
