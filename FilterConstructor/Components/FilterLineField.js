import { css } from '../Modules/helperFunctions.js';

export class FilterLineField {
    /**
     * Return a div containing a dropdown with the list of fields
     * and fieldSelected as the selected one. On change, it emits the event `filterFieldUpdated` with the selected field value.
     * @param {Array} fields Example: [{name:"Id",labels:{en:"Id",es:"Id",pt:"Id"},type:"Number",primaryKey:true},{name:"IsActive",labels:{en:"Active",es:"Activo",pt:"Ativo"},type:"Boolean"}]
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
    }

    #createElement() {
        const container = document.createElement('div');
        container.id = 'filter-line-field';
        container.className = 'filter-line-field';
        this.elements.container = container;

        const selectElement = document.createElement('select');
        this.elements.selectElement = selectElement;

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
