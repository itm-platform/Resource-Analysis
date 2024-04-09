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

        // Add an empty cell at the beginning for the toggle column
        const toggleHeaderCell = headerRow.insertCell();
        toggleHeaderCell.textContent = ''; // This cell is intentionally left blank

        // Now loop through the rest of the columns as usual
        this.columns.forEach(column => {
            if (column.display) {
                const cell = headerRow.insertCell();
                cell.textContent = column.title;
                cell.style.width = column.width;
            }
        });
    }


    // Adjust renderRows to include toggle icons for rows with children
    renderRows(items, parentRowId = '', level = 0, parentVisible = true) {
        items.forEach((item, index) => {
            let isVisible = this.filters.hasOwnProperty(item.type) ? this.filters[item.type] : true;
            isVisible = parentVisible ? isVisible : false;

            const rowId = `${parentRowId}${index}`;
            let row = this.table.insertRow(-1);
            row.setAttribute('data-id', rowId);
            row.setAttribute('data-type', item.type);

            let toggleCell = row.insertCell();
            if (this._itemHasChildren(item)) {
                this._addToggleIcon(toggleCell, isVisible, rowId);
            }

            this.columns.forEach(column => {
                let cell = row.insertCell();
                let cellContent;

                if (item.render && item.render[column.field]) {
                    cellContent = item.render[column.field];
                } else {
                    cellContent = item[column.field] || '';
                }
                cell.innerHTML = typeof cellContent === 'function' ? cellContent() : cellContent;

            });

            if (this._itemHasChildren(item)) {
                this.renderRows(item.children, `${rowId}-`, level + 1, isVisible);
            }
        });
    }

    _itemHasChildren(item) {
        return item.children && item.children.length > 0;
    }

    _addToggleIcon(toggleCell, isVisible, rowId) {
        toggleCell.innerHTML = isVisible ? '🔽' : '▶️';
        toggleCell.classList.add('toggle-cell', 'clickable');
        toggleCell.addEventListener('click', () => this.toggleRow(rowId, toggleCell));
    }

    // Adjust toggleRow to also update the toggle icon
    toggleRow(rowId, toggleCell) {
        const rows = this.table.querySelectorAll(`tr[data-id^="${rowId}-"]`);
        let isAnyVisible = false; // Flag to check if any child row is initially visible
        rows.forEach(row => {
            if (row.style.display !== 'none') isAnyVisible = true;
            row.style.display = row.style.display === 'none' ? '' : 'none';
        });

        // Update the toggle icon based on visibility
        toggleCell.innerHTML = isAnyVisible ? '▶️' : '🔽';
    }


    updateFilters(newFilters) {
        this.filters = newFilters;
        this.container.innerHTML = ''; // Clear the container instead of the table
        this.generateTable(); // Regenerate table to reapply header and rows based on new filters
    }


}
