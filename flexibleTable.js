// flexibleTable.js
export class FlexibleTable {
    constructor(containerId, data, filters = {}, columns = []) { 
        this.container = document.getElementById(containerId);
        this.data = data;
        this.filters = filters;
        this.columns = columns; // New: Column definitions
        this.generateTable();
    }

    generateTable() {
        this.table = document.createElement('table');
        this.table.setAttribute('border', '1');
        this.container.appendChild(this.table);
        this.renderHeader(); // New: Render the table header based on column definitions
        this.renderRows(this.data);
    }

    renderHeader() {
        const header = this.table.createTHead();
        const headerRow = header.insertRow(0);
        this.columns.forEach(column => {
            if (column.display) {
                const cell = headerRow.insertCell();
                cell.textContent = column.title;
                cell.style.width = column.width;
            }
        });
    }

    // Adjust renderRows to handle dynamic columns
    renderRows(items, parentRowId = '', level = 0, parentVisible = true) {
        items.forEach((item, index) => {
            let isVisible = this.filters.hasOwnProperty(item.type) ? this.filters[item.type] : true;
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

            // Loop through columns for each item
            this.columns.forEach(column => {
                if (column.display) {
                    let cell = row.insertCell();
                    cell.textContent = item[column.field]; // Use column.field to dynamically fill data
                    if (column.field === 'name') {
                        cell.classList.add('clickable');
                    }
                }
            });

            if (item.children && item.children.length > 0) {
                row.cells[0].addEventListener('click', () => this.toggleRow(rowId)); // Assuming the first cell is always 'clickable'
                this.renderRows(item.children, `${rowId}-`, level + 1, isVisible);
            }
        });
    }

    updateFilters(newFilters) {
        this.filters = newFilters;
        this.container.innerHTML = ''; // Clear the container instead of the table
        this.generateTable(); // Regenerate table to reapply header and rows based on new filters
    }
    

    toggleRow(rowId) {
        const rows = this.table.querySelectorAll(`tr[data-id^="${rowId}-"]`);
        rows.forEach(row => {
            row.style.display = row.style.display === 'none' ? '' : 'none';
        });
    }
}
