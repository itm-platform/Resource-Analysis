// FilterLineTable.js
export class FilterLineTable {
    /**
     * Return a div containing a dropdown with the list of tables
        and tableSelected as the selected one. On change, it emits the event `filterTableUpdated` with the selected table value.
     * @param {Array} tables Example: [{"value":"projects","text":"Projects"}, {"value":"services","text":"Services"}]
     * @param {String} tableSelected Example: "projects"
     * @emits filterTableUpdated
     */
    constructor(tables, tableSelected) {
        this.tables = tables;
        this.tableSelected = tableSelected;
        this.#init();
    }

    #init() {
        this.element = this.#render();
    }

    #render() {
        const container = document.createElement('div');
        container.id = 'filter-line-table';
        container.className = 'filter-line-field';

        const selectElement = document.createElement('select');
        this.tables.forEach(table => {
            const option = document.createElement('option');
            option.value = table.value;
            option.text = table.text;
            option.selected = table.value === this.tableSelected;
            selectElement.appendChild(option);
        });

        selectElement.addEventListener('change', (event) => {
            this.tableSelected = event.target.value;
            container.dispatchEvent(new CustomEvent('filterTableUpdated', {
                detail: this.tableSelected,
                bubbles: true
            }));
        });

        container.appendChild(selectElement);
        return container;
    }
}
