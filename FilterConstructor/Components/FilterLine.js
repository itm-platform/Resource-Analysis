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
                if (['String', 'Number'].includes(this.fieldType)) {
                    filterLineValue = new FilterLineValueSingle(this.filterLine.value, this.fieldType);
                } else if (this.fieldType === 'Boolean') {
                    filterLineValue = new FilterLineValueSingleBoolean(this.filterLine.value);
                }
                else if (this.fieldType === 'Date') {
                    filterLineValue = new FilterLineValueDate(this.filterLine.value);
                }
                else {
                    console.error(`Field type ${this.fieldType} not supported`);
                    return;
                }
                filterLineValue.element.addEventListener('filterValueUpdated', (event) => {
                    this.#updateFilterValue(event.detail);
                });
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
        console.log(`validating ${JSON.stringify(this.filterLine)}`);
        if (filterLineModel.isValidLine(this.filterLine)) {
            console.log('filterLine is valid');
            this.elements.filterLine.dispatchEvent(new CustomEvent('filterLineUpdated', {
                detail: this.filterLine,
                bubbles: true
            }));
        }
        else {
            console.log('filterLine is invalid');
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
