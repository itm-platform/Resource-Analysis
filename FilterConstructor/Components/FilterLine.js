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
            this.filterLine.tableName = tableName;
            this.#feedTableFields();

            this.elements.filterLineField.remove();
            this.#render('filterLineField');
            this.elements.filterLine.insertBefore(this.elements.filterLineField, this.elements.filterLineOperator);
        }
        this.#validateAndEmit('table');
    }

    #updateFilterField(fieldName) {
        console.log(`updating filter field to ${fieldName}`);
        const hasFieldChanged = this.filterLine.fieldName !== fieldName;
        if (!hasFieldChanged) { return; };

        this.filterLine.fieldName = fieldName;
        this.#feedFieldOperators(); 

        this.elements.filterLineOperator.remove(); // Remove the old filterLineOperator element

        this.#render('filterLineOperator');
        this.#updateFilterOperator(this.filterLine.operator);

        this.elements.filterLine.insertBefore(this.elements.filterLineOperator, this.elements.filterLineValue); // Insert the new filterLineOperator element before the filterLineValue element 
        this.#validateAndEmit('field');
    }

    #updateFilterOperator(operator) {
        console.log(`updating filter operator to ${operator}`);
        const hasOperatorChanged = this.filterLine.operator !== operator;
        if (!hasOperatorChanged) { return; };

        this.filterLine.operator = operator;
        this.elements.filterLineValue.remove();
        this.#render('filterLineValue');
        this.#updateFilterValue(this.filterLine.value);
        this.elements.filterLine.appendChild(this.elements.filterLineValue);

        this.#validateAndEmit('operator');
    }

    #updateFilterValue(value) {
        console.log(`updating filter value to ${value}`);
        const hasValueChanged = this.filterLine.value !== value;
        if (!hasValueChanged) { return; };

        this.filterLine.value = value;
        this.#validateAndEmit('value');
    }

    #orchestrateUpdates(componentToUpdate, newValue) {
    /* orchestrateUpdates will update a value (table, field, operator, value) in the filterLine object,
        and request the next component in the hierarchy to update itself.
    
        The component hierarchy of updates is as follows: Table -> Field -> Operator -> Value
        The existing values are always in this.filterLine (.tableName, .fieldName, .operator, .value ).
        The value requested is in the `newValue` parameter. The component is in the `componentName` parameter.
        Value updates must be done to this.filterLine.

        ## Update chain
        Updates can come from the 'Updated' event (a user action), in which case there will be a `newValue`, 
        or requested by the preceding element in which case there will be no newValue.

        ### Table
        1. When the component requested the update (called with orchestrateUpdates('table', newValue)) 
            a) update filterLine.tableName 
            b) repopulate this.tableFields with this.#feedTableFields() 
            c) Request Field update (orchestrateUpdates('field'))
        ### Field
        1. If the parent requested update (no newValue, called with orchestrateUpdates('field')):
            a. If the existing filterLine.fieldName is not in the this.tableFields:
                1. Set filterLine.fieldName undefined.
                2. Rerender Field component (this.#render('filterLineField')).
        2. When the component requested the update (called with orchestrateUpdates('field', newValue)
            a) update filterLine.field 
        3. Always:
            b) repopulate this.fieldOperators with this.#feedFieldOperators()
            c) Request Operator update (call orchestrateUpdates('operator'))
            
        ### Operator
        1. If the parent requested update (no newValue, called with orchestrateUpdates('operator'):
            a. If the existing filterLine.operator is not in this.fieldOperators:
                1. Set filterLine.operator to undefined.
                2. Rerender Operator component (this.#render('filterLineOperator')
        2. When the component requested the update (filterOperatorUpdated)
            a) update filterLine.operator
        3. Always:
            b) Request Value update (call orchestrateUpdates('value'))

        ### Value
        1. If the parent requested update (no newValue, called with orchestrateUpdates('value')
            a. If the existing filterLine.value is not of the this.fieldType: (how?)
                1. Set filterLine.value to undefined.
                2. Rerender Value component.
        2. When the component requested the update (called with orchestrateUpdates('value', newValue)
            a) update filterLine.value
        3. Always:
            b) Validate and emit the filterLine with this.#validateAndEmit()

        */
    }

    #validateAndEmit() {
        console.log(`validating ${JSON.stringify(this.filterLine, null, 2)}`);
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
