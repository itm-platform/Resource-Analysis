import { FilterLineTable } from './FilterLineTable.js';
import { FilterLineField } from './FilterLineField.js';
import { FilterLineOperator } from './FilterLineOperator.js';
import OperatorModel from '../Models/OperatorModel.js';
import { css } from '../Modules/helperFunctions.js';
import { getLang } from './globalState.js';

export class FilterLine {
    constructor(filterLine, indexInFilterLines, dataServiceModel) {
        this.filterLine = filterLine;
        this.index = indexInFilterLines;
        this.dataServiceModel = dataServiceModel;
        this.operatorModel = new OperatorModel();
        this.tables = [];
        this.tableFields = [];
        this.fieldOperators = [];
        this.fieldType = null;
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
        this.#feedFieldOperators();
    }
    /**Create and setup DOM elements*/
    #createElement() {
        const filterLine = document.createElement('div');
        filterLine.id = 'filter-line-' + this.index;
        filterLine.className = 'filter-line';
        this.elements.filterLine = filterLine;

        // TODO - A - If only one table, don't show the table dropdown, but also remove the line that has 
        // unwanted tables. Useful for single project, for example
        const filterLineTable = new FilterLineTable(this.tables, this.filterLine.tableName);
        this.elements.filterLineTable = filterLineTable.element;
        filterLine.appendChild(this.elements.filterLineTable);

        const filterLineField = new FilterLineField(this.tableFields, this.filterLine.fieldName);
        this.elements.filterLineField = filterLineField.element;
        filterLine.appendChild(this.elements.filterLineField);

        const filterLineOperator = new FilterLineOperator(this.fieldOperators,
            this.filterLine.operator ? this.filterLine.operator : 'equality');
        this.elements.filterLineOperator = filterLineOperator.element;
        filterLine.appendChild(this.elements.filterLineOperator);

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

        this.elements.filterLineOperator.addEventListener('filterOperatorUpdated', (event) => {
            this.#updateFilterOperator(event.detail);
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

    #feedFieldOperators() {
        this.fieldType = this.dataServiceModel.getFieldType(this.filterLine.tableName, this.filterLine.fieldName);
        const validOperators = this.operatorModel.operatorsValidForFieldTypeWithDescriptions(this.fieldType, getLang());
        this.fieldOperators = validOperators;
    }


    #updateFilterTable(tableName) {
        const hasTableChanged = this.filterLine.tableName !== tableName;
        if (hasTableChanged) {
            this.filterLine.tableName = tableName;
            this.#feedTableFields(); // Update the fields based on the new table

            // Remove the old filterLineField element
            this.elements.filterLineField.remove();

            // Create a new filterLineField element with updated fields
            const filterLineField = new FilterLineField(this.tableFields, this.filterLine.fieldName);
            this.elements.filterLineField = filterLineField.element;

            // Insert the new filterLineField element before the filterLineOperator element
            this.elements.filterLine.insertBefore(this.elements.filterLineField, this.elements.filterLineOperator);
        }
        console.log(`${this.index} tableName changed to: ${this.filterLine.tableName}`);
    }



    #updateFilterField(fieldName) {
        const hasFieldChanged = this.filterLine.fieldName !== fieldName;
        if (hasFieldChanged) {
            this.filterLine.fieldName = fieldName;
            this.#feedFieldOperators(); // Update the operators based on the new field

            this.elements.filterLineOperator.remove(); // Remove the old filterLineOperator element
            
            const filterLineOperator = new FilterLineOperator(this.fieldOperators, this.filterLine.operator);
            this.elements.filterLineOperator = filterLineOperator.element;
            
            this.elements.filterLine.appendChild(this.elements.filterLineOperator);
        }
        console.log(`${this.index} fieldName: ${fieldName}`);
    }

    #updateFilterOperator(operator) {
        console.log(`${this.index} operator: ${operator}`);
    }

    #getStyles() {
        return css`
            .filter-line {
                display: flex;
            }
        `;
    }
}
