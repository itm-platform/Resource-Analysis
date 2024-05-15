// TODO - C - If the selectedfield doesn't exist in the list, 
import { css } from '../Modules/helperFunctions.js';
export class FilterLineField {
    /**
     * Return a div containing a dropdown with the list of fields
     * and fieldSelected as the selected one. On change, it emits the event `filterFieldUpdated` with the selected field value.
     * @param {Array} fields Example: [{value: "projects", text: "Projects"}, {value: "tasks", text: "Tasks"}]
     * @param {String} fieldSelected Example: "projects"
     * @emits filterFieldUpdated
     */
    constructor(fields, fieldSelected) {
        this.fields = fields;
        this.fieldSelected = fieldSelected;
        this.elements = {};

        this.#init();
        this.element = this.#createElement();
        this.#applyStyles();
        this.#setupEventListeners();
    }

    #init() {
        const selectedFieldPresentInFields = this.fields.some(field => field.value === this.fieldSelected);
        if (!selectedFieldPresentInFields) {
            this.fieldSelected = null; 
        }
    }

    #createElement() {
        const container = document.createElement('div');
        container.id = 'filter-line-field';
        container.className = 'filter-line-field';
        this.elements.container = container;

        const selectElement = document.createElement('select');
        this.elements.selectElement = selectElement;

        if (!this.fieldSelected) {
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = '<--Select Field-->';
            defaultOption.selected = true;
            selectElement.appendChild(defaultOption);
        }
        this.fields.forEach(field => {
            const option = document.createElement('option');
            option.value = field.value;
            option.text = field.text;
            option.selected = field.value === this.fieldSelected;
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
            this.fieldSelected = event.target.value;
            this.elements.container.dispatchEvent(new CustomEvent('filterFieldUpdated', {
                detail: this.fieldSelected,
                bubbles: true
            }));
        });

    }

    render() {
    }

    #getStyles() {
        return css`
            .filter-line-field {
                display: flex;
                align-items: center;
            }

            .filter-line-field select {
                margin-left: 10px;
                padding: 5px;
            }
        `;
    }
}