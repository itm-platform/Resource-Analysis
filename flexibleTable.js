// flexibleTable.js
import data from './flexibleTableDataSample.js';

export class FlexibleTable {
    constructor(containerId, filters) {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.filters = filters;
        this.generateTable();
    }

    generateTable() {
        this.table = document.createElement('table');
        this.table.setAttribute('border', '1');
        this.container.appendChild(this.table);
        this.renderRows(this.data);
    }

    renderRows(items, parentRowId = '', level = 0, parentVisible = true) {
        items.forEach((item, index) => {
            let isVisible = this.filters[item.type];
            if (!parentVisible && isVisible === false) {
                isVisible = false;
            } else if (parentVisible && isVisible !== false) {
                isVisible = true;
            }

            const rowId = `${parentRowId}${index}`;
            let row = this.table.insertRow(-1);
            row.setAttribute('data-id', rowId);
            row.setAttribute('data-type', item.type);
            row.classList.add('indent');
            row.style.paddingLeft = `${level * 20}px`;
            row.style.display = isVisible ? '' : 'none';

            let cell = row.insertCell(0);
            cell.textContent = item.name;
            cell.classList.add('clickable');

            if (item.children && item.children.length > 0) {
                cell.addEventListener('click', () => this.toggleRow(rowId));
                // Pass down the visibility status to child rows
                this.renderRows(item.children, `${rowId}-`, level + 1, isVisible);
            }
        });
    }

    updateFilters(newFilters) {
        this.filters = newFilters;
        this.table.innerHTML = ''; // Clear existing table
        this.renderRows(this.data); // Re-render table with new filters
    }

    toggleRow(rowId) {
        const rows = this.table.querySelectorAll(`tr[data-id^="${rowId}-"]`);
        rows.forEach(row => {
            row.style.display = row.style.display === 'none' ? '' : 'none';
        });
    }
}
