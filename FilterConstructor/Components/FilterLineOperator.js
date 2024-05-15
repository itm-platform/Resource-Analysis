import { css } from '../Modules/helperFunctions.js';
export class FilterLineOperator {
    /**
     * Return a div containing a dropdown with the list of operators
     * and operatorSelected as the selected one. On change, it emits the event `filterOperatorUpdated` with the selected operator value.
     * @param {Array} operators Example: [{value: "projects", text: "Projects"}, {value: "tasks", text: "Tasks"}]
     * @param {String} operatorSelected Example: "projects"
     * @emits filterOperatorUpdated
     */
    constructor(operators, operatorSelected) {
        this.operators = operators;
        this.operatorSelected = operatorSelected;
        this.elements = {};

        this.#init();
        this.element = this.#createElement();
        this.#applyStyles();
        this.#setupEventListeners();
    }

    #init() {
        const selectedOperatorPresentInOperators = this.operators.some(operator => operator.value === this.operatorSelected);
        if (!selectedOperatorPresentInOperators) {
            this.operatorSelected = null; 
        }
    }

    #createElement() {
        const container = document.createElement('div');
        container.className = 'filter-line-operator';
        this.elements.container = container;

        const selectElement = document.createElement('select');
        this.elements.selectElement = selectElement;

        if (!this.operatorSelected) {
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = '<--Select Operator-->';
            defaultOption.selected = true;
            selectElement.appendChild(defaultOption);
        }
        this.operators.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator.value;
            option.text = operator.text;
            option.selected = operator.value === this.operatorSelected;
            selectElement.appendChild(option);
        });

        container.appendChild(selectElement);
        return container;
    }

    #applyStyles() {
        const style = document.createElement('style');
        style.textContent = this.#getStyles();
        this.element.appendChild(style);
    }

    #setupEventListeners() {
        this.elements.selectElement.addEventListener('change', (event) => {
            this.operatorSelected = event.target.value;
            this.elements.container.dispatchEvent(new CustomEvent('filterOperatorUpdated', {
                detail: this.operatorSelected,
                bubbles: true
            }));
        });

    }

    render() {
    }

    #getStyles() {
        return css`
            .filter-line-operator {
                display: flex;
                align-items: center;
            }

            .filter-line-operator select {
                margin-left: 10px;
                padding: 5px;
            }
        `;
    }
}