// FilterLineTable.js
export class FilterLineTable {
    /**
     * Return a div containing a dropdown with the list of fields
        and fieldSelected as the selected one. On change, it emits the event `filterFieldUpdated` with the selected table value.
     * @param {Array} fields Example: [{name:"Id",labels:{en:"Id",es:"Id",pt:"Id"},type:"Number",primaryKey:!0},{name:"IsActive",labels:{en:"Active",es:"Activo",pt:"Ativo"},type:"Boolean"}]
     * @param {String} fieldSelected Example: "projects"
     * @emits filterTableUpdated
     */
    constructor(fields, fieldSelected) {
        this.fields = fields;
        this.fieldSelected = fieldSelected;
        this.#init();
    }

    #init() {
        this.element = this.#render();
    }

    #render() {
        const container = document.createElement('div');
        container.id = 'filter-line-field';
        container.className = 'filter-line-field';

        const selectElement = document.createElement('select');
        this.fields.forEach(field => {
            const option = document.createElement('option');
            option.value = field.value;
            option.text = field.text;
            option.selected = field.value === this.fieldSelected;
            selectElement.appendChild(option);
        });

        selectElement.addEventListener('change', (event) => {
            this.fieldSelected = event.target.value;
            container.dispatchEvent(new CustomEvent('filterFieldUpdated', {
                detail: this.fieldSelected,
                bubbles: true
            }));
        });

        container.appendChild(selectElement);
        return container;
    }
}
