// TODO - 🔴 - New line have empty operator al undefined value

import { FilterLineTable } from './FilterLineTable.js';
import { FilterLineField } from './FilterLineField.js';
import { FilterLineOperator } from './FilterLineOperator.js';
import { FilterLineValueSingle } from './FilterLineValueSingle.js';
import { FilterLineValueSingleBoolean } from './FilterLineValueSingleBoolean.js';
import { FilterLineValueDate } from './FilterLineValueDate.js';

import OperatorModel from '../Models/OperatorModel.js';
import filterLineModel from '../Models/filterLineModel.js';
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
        this.#render();
    }

    /** Perform any initialization logic that doesn't depend on DOM elements. */
    #init() {
        const filterLineIsNewAndEmpty = Object.keys(this.filterLine).length === 0;
        if (filterLineIsNewAndEmpty) {
            this.filterLine = filterLineModel.addGettersSetters(this.filterLine);
            const firstAvailableTable = Object.keys(this.dataServiceModel.tables)[0];
            this.filterLine.tableName = firstAvailableTable;
        }
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

        // TODO - 🔴 - If only one table, don't show the table dropdown, but also remove the line that has 
        // unwanted tables. Useful for single project, for example
        this.#render('filterLineTable');
        filterLine.appendChild(this.elements.filterLineTable);
        this.#render('filterLineField');
        filterLine.appendChild(this.elements.filterLineField);

        this.#render('filterLineOperator');
        filterLine.appendChild(this.elements.filterLineOperator);

        this.#render('filterLineValue');
        filterLine.appendChild(this.elements.filterLineValue);

        this.#render('filterLineDelete');
        filterLine.appendChild(this.elements.filterLineDelete);
        return filterLine;
    }

    #applyStyles() {
        const style = document.createElement('style');
        style.textContent = this.#getStyles();
        this.element.appendChild(style);
    }

    #render(functionToRender) {
        const renderFunctions = {
            filterLineTable: () => {
                const filterLineTable = new FilterLineTable(this.tables, this.filterLine.tableName);
                filterLineTable.element.addEventListener('filterTableUpdated', (event) => {
                    this.#updateFilterTable(event.detail);
                });

                this.elements.filterLineTable = filterLineTable.element;
            },
            filterLineField: () => {
                const filterLineField = new FilterLineField(this.tableFields, this.filterLine.fieldName);
                filterLineField.element.addEventListener('filterFieldUpdated', (event) => {
                    this.#updateFilterField(event.detail);
                });
                this.elements.filterLineField = filterLineField.element;
            },
            filterLineOperator: () => {
                const filterLineOperator = new FilterLineOperator(this.fieldOperators,
                    this.filterLine.operator ? this.filterLine.operator : 'equality');
                filterLineOperator.element.addEventListener('filterOperatorUpdated', (event) => {
                    this.#updateFilterOperator(event.detail);
                });
                this.elements.filterLineOperator = filterLineOperator.element;
            },
            filterLineValue: () => {
                let filterLineValue;
                //if (['String', 'Number'].includes(this.fieldType)) {
                filterLineValue = new FilterLineValueSingle(this.filterLine.value, this.fieldType);
                //} else 
                if (this.fieldType === 'Boolean') {
                    filterLineValue = new FilterLineValueSingleBoolean(this.filterLine.value);
                }
                else if (this.fieldType === 'Date') {
                    filterLineValue = new FilterLineValueDate(this.filterLine.value);
                }
                else {
                    filterLineValue = new FilterLineValueSingle(this.filterLine.value, this.fieldType);
                    //return;
                }
                filterLineValue.element.addEventListener('filterValueUpdated', (event) => {
                    const value = event.detail;
                    this.#updateFilterValue(value);
                });

                this.elements.filterLineValue = filterLineValue.element;
            },
            filterLineDelete: () => {
                const cross = document.createElement('div');
                cross.innerHTML = this.#getCloseCross();
                cross.addEventListener('click', () => {
                    this.element.dispatchEvent(new CustomEvent('removeFilterLine', 
                    { bubbles: true }));
                });
                this.elements.filterLineDelete = cross;
            }

        };
        if (functionToRender && renderFunctions[functionToRender]) {
            renderFunctions[functionToRender]();
        }

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
            this.#orchestrateUpdates('table', tableName);
        }
    }

    #updateFilterField(fieldName) {
        const hasFieldChanged = this.filterLine.fieldName !== fieldName;
        if (hasFieldChanged) {
            this.#orchestrateUpdates('field', fieldName);
        }
    }

    #updateFilterOperator(operator) {
        const hasOperatorChanged = this.filterLine.operator !== operator;
        if (hasOperatorChanged) {
            this.#orchestrateUpdates('operator', operator);
        }
    }

    #updateFilterValue(value) {
        const hasValueChanged = this.filterLine.value !== value;
        if (hasValueChanged) {
            this.#orchestrateUpdates('value', value);
        }
    }

    /** Update a value in the filterLine object, and request the next component in the hierarchy to update itself.
     * @param {String} componentToUpdate (table, field, operator, value)
     * @param {*} [newValue] Optional. When not provided, the function was called recursively indicating a chain of updates. 
     */
    #orchestrateUpdates(componentToUpdate, newValue) {
        const rerenderField = () => {
            this.elements.filterLineField.remove();
            this.#render('filterLineField');
            this.elements.filterLine.insertBefore(this.elements.filterLineField, this.elements.filterLineOperator);
        };
        const rerenderOperator = () => {
            this.elements.filterLineOperator.remove();
            this.#render('filterLineOperator');
            this.elements.filterLine.insertBefore(this.elements.filterLineOperator, this.elements.filterLineValue);
        };
        const rerenderValue = () => {
            this.elements.filterLineValue.remove();
            this.#render('filterLineValue');
            this.elements.filterLine.appendChild(this.elements.filterLineValue);
        };
        switch (componentToUpdate) {
            case 'table':
                this.filterLine.tableName = newValue;
                this.#feedTableFields();
                this.#orchestrateUpdates('field');
                break;

            case 'field':
                if (newValue !== undefined) {
                    this.filterLine.fieldName = newValue;
                } else {
                    const isCurrentFieldNotPresentInTableFields = !this.tableFields.some(field => field.value === this.filterLine.fieldName);
                    if (isCurrentFieldNotPresentInTableFields) {
                        this.filterLine.fieldName = undefined;
                    }
                    rerenderField();
                }
                this.#feedFieldOperators();
                this.#orchestrateUpdates('operator');
                break;

            case 'operator':
                if (newValue !== undefined) {
                    this.filterLine.operator = newValue;
                } else {
                    const isCurrentOperatorNotPresentInFieldOperators = !this.fieldOperators.some(operator => operator.value === this.filterLine.operator);
                    if (isCurrentOperatorNotPresentInFieldOperators) {
                        this.filterLine.operator = undefined;
                    }
                    rerenderOperator();
                }
                this.#orchestrateUpdates('value');
                break;
            case 'value':
                if (newValue !== undefined) {
                    this.filterLine.value = newValue;
                } else {
                    if (!this.filterLine.operator) { this.filterLine.value = ''; }
                    rerenderValue();
                }
                this.#validateAndEmit();
                break;
            default:
                console.error(`Unknown component to update: ${componentToUpdate}`);
        }


    }

    #validateAndEmit() {
        if (filterLineModel.isValidLine(this.filterLine, this.fieldType)) {
            this.elements.filterLine.dispatchEvent(new CustomEvent('filterLineUpdated', {
                detail: this.filterLine,
                bubbles: true
            }));
        }
        else {
            //console.log(`filterLine is invalid: ${JSON.stringify(this.filterLine)}`);
        }
    }

    #getCloseCross() {
        /* <svg class="dsh-designer-svg-cross" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" width="12" data-v-2a25f290=""><path fill="current" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" data-v-2a25f290=""></path></svg> */
        return `<svg class="dsh-designer-svg-cross" 
        aria-hidden="true" focusable="false" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 352 512" width="12">
        <path fill="current" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" data-v-2a25f290="">
        </path></svg>`;

    }

    #getStyles() {
        return css`
            :root {
                --filter-select-border-radius: 4px;
                --filter-select-border-color: #999;
                --filter-input-border-radius: 4px;
                --filter-standard-value-width: 15em;
                --dsh-fill-cross: #6d7d8f
                --dsh-fill-cross-hover: #3a4a5c
            }
            .dsh-designer-svg-cross{
                fill: var(--dsh-fill-cross);
            }
            .dsh-designer-svg-cross:hover{
                fill: var(--dsh-fill-cross-hover);
            }
            .filter-line {
                display: flex;
            }
            .filter-line-options-wrapper {
                display: flex;
                flex-wrap: wrap;
                border: 1px solid blue;
            }
            .filter-line-table {
                display: flex;
                align-items: center;
                margin: 5px 0;
            }
            .filter-line-field {
                display: flex;
                align-items: center;
                margin: 5px 0;
            }

            .filter-line-field select {
                margin-left: 10px;
                padding: 5px;
                border-color: var(--filter-select-border-color);
                border-radius: var(--filter-select-border-radius);
                width: 15em;
            }
            .filter-line-table select {
                margin-left: 10px;
                padding: 5px;
                border-color: var(--filter-select-border-color);
                border-radius: var(--filter-select-border-radius);
                max-width: 15em;
                min-width: 5em;
            }

            .filter-line-operator {
                display: flex;
                align-items: center;
                margin: 5px 0;
            }

            .filter-line-operator select {
                margin-left: 10px;
                padding: 5px;
                border-color: var(--filter-select-border-color);
                border-radius: var(--filter-select-border-radius);
                width: 10em;
            }
            .filter-line-value {
                display: flex;
                align-items: center;
                margin: 5px 0;
            }
            .filter-line-value input {
                margin-left: 10px;
                padding: 5px;
                border: 1px solid var(--filter-select-border-color);
                border-radius: var(--filter-input-border-radius);
                width: var(--filter-standard-value-width);
            }

            .filter-line-value input[type="date"] {
                width: 8em;
            }
            .filter-line-value select {
                margin-left: 10px;
                padding: 5px;
                border: 1px solid var(--filter-select-border-color);
                border-radius: var(--filter-select-border-radius);
                width: var(--filter-standard-value-width);
            }

            /* hove on select mouse pointer */
            .filter-line-value select:hover, .filter-line-field:hover, .filter-line-operator select:hover, .filter-line-table select:hover, .filter-line-value input[type="date"]:hover{
                cursor: pointer;
            }
            .filter-line-value-boolean select {
                width: 9em;
            }

        `;
    }
}
