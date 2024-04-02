// flexibleTable.js
import data from './flexibleTableDataSample.js';
export class FlexibleTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.initFilters();
        this.generateTable(data);
    }

    initFilters() {
        const filterContainer = document.createElement('div');
        ['Client', 'Manager', 'Employee'].forEach(type => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = type;
            checkbox.checked = true;
            checkbox.addEventListener('change', () => this.applyFilter());
            label.appendChild(checkbox);
            label.append(` ${type}`);
            filterContainer.appendChild(label);
        });
        const button = document.createElement('button');
        button.textContent = 'Apply Filters';
        button.addEventListener('click', () => this.applyFilter());
        filterContainer.appendChild(button);
        this.container.appendChild(filterContainer);
    }

    generateTable() {
        this.table = document.createElement('table');
        this.table.setAttribute('border', '1');
        this.container.appendChild(this.table);
        this.generateRows(this.data);
    }

    generateRows(items, parentRowId = '', level = 0) {
        items.forEach((item, index) => {
            const rowId = `${parentRowId}${index}`;
            let row = this.table.insertRow(-1);
            row.setAttribute('data-id', rowId);
            row.setAttribute('data-type', item.type);
            row.classList.add('indent');
            row.style.paddingLeft = `${level * 20}px`;

            let cell = row.insertCell(0);
            cell.textContent = item.name;
            cell.classList.add('clickable');

            if (item.children && item.children.length > 0) {
                cell.addEventListener('click', () => this.toggleRow(rowId));
                this.generateRows(item.children, `${rowId}-`, level + 1);
            }
        });
    }

    toggleRow(rowId) {
        const rows = this.table.querySelectorAll(`tr[data-id^="${rowId}-"]`);
        rows.forEach(row => {
            row.style.display = row.style.display === 'none' ? '' : 'none';
        });
    }

    applyFilter() {
        const visibilitySettings = {
            Client: document.getElementById('Client').checked,
            Manager: document.getElementById('Manager').checked,
            Employee: document.getElementById('Employee').checked
        };

        this.table.querySelectorAll('tr[data-type]').forEach(row => {
            const type = row.getAttribute('data-type');
            row.style.display = visibilitySettings[type] ? '' : 'none';
        });
    }
}
