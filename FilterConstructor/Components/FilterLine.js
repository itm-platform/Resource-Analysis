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
        this.#setupEventListeners();
        this.#render();
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
        this.#render('filterLineTable');
        filterLine.appendChild(this.elements.filterLineTable);

        this.#render('filterLineField');
        filterLine.appendChild(this.elements.filterLineField);

        this.#render('filterLineOperator');
        filterLine.appendChild(this.elements.filterLineOperator);

       this.#render('filterLineValue');
        filterLine.appendChild(this.elements.filterLineValue);

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

        this.elements.filterLineValue.addEventListener('filterValueUpdated', (event) => {
            this.#updateFilterValue(event.detail);
        });
    }

    #render(functionToRender) {
        const renderFunctions = {
            filterLineTable: () => {
                const filterLineTable = new FilterLineTable(this.tables, this.filterLine.tableName);
                this.elements.filterLineTable = filterLineTable.element;
            },
            filterLineField: () => {
                const filterLineField = new FilterLineField(this.tableFields, this.filterLine.fieldName);
                this.elements.filterLineField = filterLineField.element;
            },
            filterLineOperator: () => {
                const filterLineOperator = new FilterLineOperator(this.fieldOperators,
                    this.filterLine.operator ? this.filterLine.operator : 'equality');
                this.elements.filterLineOperator = filterLineOperator.element;
            },
            filterLineValue: () => {
                let filterLineValue;
                if (['String', 'Number'].includes(this.fieldType)) {
                    filterLineValue = new FilterLineValueSingle(this.filterLine.value, this.fieldType);
                } else if (this.fieldType === 'Boolean') {
                    filterLineValue = new FilterLineValueSingleBoolean(this.filterLine.value);
                }
                else if (this.fieldType === 'Date') {
                    filterLineValue = new FilterLineValueDate(this.filterLine.value);
                }
                this.elements.filterLineValue = filterLineValue.element;
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
            this.filterLine.tableName = tableName;
            this.#feedTableFields();

            this.elements.filterLineField.remove();
            this.#render('filterLineField');
            this.elements.filterLine.insertBefore(this.elements.filterLineField, this.elements.filterLineOperator);
        }
        this.#validateAndEmit();
    }

    #updateFilterField(fieldName) {
        const hasFieldChanged = this.filterLine.fieldName !== fieldName;
        if (hasFieldChanged) {
            this.filterLine.fieldName = fieldName;
            this.#feedFieldOperators(); // Update the operators based on the new field

            this.elements.filterLineOperator.remove(); // Remove the old filterLineOperator element

            this.#render('filterLineOperator');

            this.elements.filterLine.insertBefore(this.elements.filterLineOperator, this.elements.filterLineValue); // Insert the new filterLineOperator element before the filterLineValue element 
        }
        this.#validateAndEmit();
    }

    #updateFilterOperator(operator) {
        this.filterLine.operator = operator;
        this.#validateAndEmit();
    }

    #updateFilterValue(value) {
        this.filterLine.value = value;
        this.#validateAndEmit();
    }

    #validateAndEmit(){
        if (filterLineModel.isValidLine(this.filterLine)) {
            this.elements.filterLine.dispatchEvent(new CustomEvent('filterLineUpdated', {
                detail: this.filterLine,
                bubbles: true
            }));
        }
    }

    #getStyles() {
        return css`
            .filter-line {
                display: flex;
            }
        `;
    }
}
