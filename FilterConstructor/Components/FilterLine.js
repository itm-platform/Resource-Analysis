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
        this.tableFields = [];
        this.elements = {};

        this.#init();
        this.element = this.#createElement();
        this.#applyStyles();
        this.#setupEventListeners();
        this.render();
    }

    /** Perform any initialization logic that doesn't depend on DOM elements. */
    #init() {
        this.tables = this.dataServiceModel.tableListLanguage(getLang());
        this.#feedTableFields();
    }
    /**Create and setup DOM elements*/
    #createElement() {
        const filterLine = document.createElement('div');
        filterLine.id = 'filter-line-' + this.index;
        filterLine.className = 'filter-line';
        this.elements.filterLine = filterLine;

        const filterLineTable = new FilterLineTable(this.tables, this.filterLine.tableName);
        this.elements.filterLineTable = filterLineTable.element;
        filterLine.appendChild(this.elements.filterLineTable);

        const filterLineField = new FilterLineField(this.tableFields, this.filterLine.fieldName);
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

    }

    #feedTableFields() {
        const tableFieldsOptions = {
            tables: [this.filterLine.tableName],
            types: 'all',
            lang: getLang()
        };

        this.tableFields = this.dataServiceModel
            .reshapeAndTranslateFieldsByTableAndType(tableFieldsOptions);
    }

    #updateFilterTable(tableName) {
        const hasTableChanged = this.filterLine.tableName !== tableName;
        if (hasTableChanged) {
            this.filterLine.tableName = tableName;
            this.#feedTableFields(); // Update the fields based on the new table

            // Remove the old FilterLineField element
            this.elements.filterLineField.remove();

            // Create a new FilterLineField with updated fields
            const filterLineField = new FilterLineField(this.tableFields, this.filterLine.fieldName);
            this.elements.filterLineField = filterLineField.element;

            // Append the new FilterLineField to the filter line
            this.elements.filterLine.appendChild(this.elements.filterLineField);
        }
        console.log(`${this.index} tableName changed to: ${this.filterLine.tableName}`);
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
