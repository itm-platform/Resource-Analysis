import { FilterLineTable } from './FilterLineTable.js';
import { FilterLineField } from './FilterLineField.js';
import { css } from '../Modules/helperFunctions.js';
import { getLang } from './globalState.js'; 

export class FilterLine {
    constructor(filterLine, indexInFilterLines, dataServiceModel) {
        this.filterLine = filterLine;
        this.index = indexInFilterLines;
        this.dataServiceModel = dataServiceModel;
        this.tables = [];
        this.elements = {};

        this.#init();
        this.element = this.#createElement();
        this.#applyStyles();
        this.#setupEventListeners();
        this.render();
    }

    #init() {
        this.tables = this.dataServiceModel.tableListLanguage(getLang());
    }

    #createElement() {
        const filterLine = document.createElement('div');
        filterLine.id = 'filter-line-' + this.index;
        filterLine.className = 'filter-line';
        this.elements.filterLine = filterLine;

        const filterLineTable = new FilterLineTable(this.tables, "projects");
        this.elements.filterLineTable = filterLineTable.element;
        filterLine.appendChild(this.elements.filterLineTable);

        const fields = [
            {
                text: "Status Name",
                value: "Status",
                location: "Status.Name",
                type: "String",
                table: "projects"
            }, 
            {
                text: "Id",
                value: "Id",
                type: "Number",
                table: "projects"
            }
        ];
        const filterLineField = new FilterLineField(fields, "Id");
        this.elements.filterLineField = filterLineField.element;
        filterLine.appendChild(this.elements.filterLineField);

        return filterLine;
    }

    #applyStyles() {
        const style = document.createElement('style');
        style.textContent = this.#getStyles();
        this.element.appendChild(style);
    }

    #setupEventListeners() {
        this.elements.filterLineTable.addEventListener('filterTableUpdated', (event) => {
            this.#updateFilterTable(event.detail);
        });

        this.elements.filterLineField.addEventListener('filterFieldUpdated', (event) => {
            this.#updateFilterField(event.detail);
        });
    }

    render() {
        // If there is any additional render logic required, it can be added here.
    }

    #updateFilterTable(tableName) {
        console.log(`${this.index} tableName: ${tableName}`);
    }

    #updateFilterField(fieldName) {
        console.log(`${this.index} fieldName: ${fieldName}`);
    }

    #getStyles() {
        return css`
            .filter-line {
                display: flex;
            }
        `;
    }
}
