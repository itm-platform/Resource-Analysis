// FilterLineTable.js
import { css } from '../Modules/helperFunctions.js';

export class FilterLineTable {
    /**
     * Return a div containing a dropdown with the list of tables
     * and tableSelected as the selected one. On change, it emits the event `filterTableUpdated` with the selected table value.
     * @param {Array} tables Example: [{"value":"projects","text":"Projects"}, {"value":"services","text":"Services"}]
     * @param {String} tableSelected Example: "projects"
     * @emits filterTableUpdated
     */
    constructor(tables, tableSelected) {
        this.tables = tables;
        this.tableSelected = tableSelected;
        this.elements = {};
        this.element = this.#createElement();
        this.#applyStyles();
        this.#setupEventListeners();
    }

    #createElement() {
        const container = document.createElement('div');
        container.id = 'filter-line-table';
        container.className = 'filter-line-table';
        this.elements.container = container;

        const selectElement = document.createElement('select');
        this.elements.selectElement = selectElement;

        this.tables.forEach(table => {
            const option = document.createElement('option');
            option.value = table.value;
            option.text = table.text;
            option.selected = table.value === this.tableSelected;
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

    #getStyles() {
        return css`
            .filter-line-table {
                display: flex;
                align-items: center;
                margin: 5px 0;
            }

            .filter-line-table select {
                margin-left: 10px;
                padding: 5px;
            }
        `;
    }

    #setupEventListeners() {
        this.elements.selectElement.addEventListener('change', (event) => {
            this.tableSelected = event.target.value;
            this.elements.container.dispatchEvent(new CustomEvent('filterTableUpdated', {
                detail: this.tableSelected,
                bubbles: true
            }));
        });

        // Add any additional event listeners here if necessary
    }
}
