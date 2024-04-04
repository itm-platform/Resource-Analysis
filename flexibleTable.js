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
        row.classList.add('indent');
        row.style.paddingLeft = `${level * 20}px`;
        row.style.display = isVisible ? '' : 'none';

        // Add a cell at the beginning for the toggle button if there are children
        let toggleCell = row.insertCell();
        if (item.children && item.children.length > 0) {
            toggleCell.innerHTML = isVisible ? '🔽' : '▶';
            toggleCell.classList.add('toggle-cell');
            toggleCell.addEventListener('click', () => this.toggleRow(rowId, toggleCell));
        }

        // Loop through columns for each item
        this.columns.forEach(column => {
            if (column.display) {
                let cell = row.insertCell();
                cell.textContent = item[column.field];
                if (column.field === 'name') {
                    cell.classList.add('clickable');
                }
            }
        });

        if (item.children && item.children.length > 0) {
            this.renderRows(item.children, `${rowId}-`, level + 1, isVisible);
        }
    });
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
    toggleCell.innerHTML = isAnyVisible ? '▶' : '🔽';
}


    updateFilters(newFilters) {
        this.filters = newFilters;
        this.container.innerHTML = ''; // Clear the container instead of the table
        this.generateTable(); // Regenerate table to reapply header and rows based on new filters
    }
    

}
