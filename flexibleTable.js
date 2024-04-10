// flexibleTable.js
export class FlexibleTable {
    constructor(containerId, dataset, filters = {}) {
        this.container = document.getElementById(containerId);
        this.dataset = dataset; // The entire new dataset including groups and rows
        this.filters = filters;
        this.generateTable();
    }

    generateTable() {
        this.table = document.createElement('table');
        this.table.setAttribute('border', '1');
        this.table.style.width = '100%';
        this.container.appendChild(this.table);

        this.renderHeader();

        // Create and append the tbody element
        this.tbody = document.createElement('tbody');
        this.table.appendChild(this.tbody);

        // Render rows with the new data structure
        this.renderRows(this.dataset.rows);
    }

    renderHeader() {
        const header = this.table.createTHead();
        const headerRow = header.insertRow();

        // Add an empty cell for the first column for the toggle/indentation/name
        headerRow.insertCell();

        // Iterate over each group to create headers
        this.dataset.groups.forEach(group => {
            const cell = headerRow.insertCell();
            cell.textContent = group.name;
            cell.setAttribute('colspan', group.columns.length);
        });

        // Second row for individual columns
        const columnRow = header.insertRow();
        // Again, add an empty cell for the first column
        columnRow.insertCell();

        this.dataset.groups.forEach(group => {
            group.columns.forEach(column => {
                const cell = columnRow.insertCell();
                cell.textContent = column.name;
            });
        });
    }

    renderRows(items, parentRowId = '', level = 0, parentVisible = true) {
        items.forEach((item, index) => {
            if (!this.filters.hasOwnProperty(item.type) || this.filters[item.type]) {
                const rowId = `${parentRowId}${index}`;
                const row = this.tbody.insertRow();
                row.setAttribute('data-id', rowId);
                row.setAttribute('data-type', item.type);
                if (!parentVisible) {
                    row.style.display = 'none';
                }

                // First cell for name with toggle/indentation
                const nameCell = row.insertCell();
                nameCell.innerHTML = item.render || item.name;
                nameCell.style.paddingLeft = `${level * 20}px`; // Adjust the level of indentation
                if (item.children && item.children.length > 0) {
                    this._addToggleIcon(nameCell, true, rowId);
                }

                this.dataset.groups.forEach(group => {
                    const groupValues = item.values.find(value => value.groupId === group.id);
                    if (groupValues) {
                        groupValues.values.forEach(value => {
                            const cell = row.insertCell();
                            cell.innerHTML = value.render || value.value;
                        });
                    }
                });

                if (item.children) {
                    this.renderRows(item.children, `${rowId}-`, level + 1, parentVisible && this.filters[item.type]);
                }
            }
        });
    }

    toggleRow(rowId, toggleCell) {
        const rows = this.table.querySelectorAll(`tr[data-id^="${rowId}-"]`);
        let isAnyVisible = Array.from(rows).some(row => row.style.display !== 'none');

        rows.forEach(row => {
            row.style.display = row.style.display === 'none' ? '' : 'none';
        });

        this._updateToggleIcon(toggleCell, !isAnyVisible);
    }

    _addToggleIcon(cell, isVisible, rowId) {
        const toggleSpan = document.createElement('span');
        toggleSpan.innerHTML = isVisible ? '🔽' : '▶️';
        toggleSpan.style.marginRight = '5px';
        toggleSpan.onclick = () => this.toggleRow(rowId, toggleSpan);
        cell.insertBefore(toggleSpan, cell.firstChild);
    }

    _updateToggleIcon(toggleSpan, isVisible) {
        toggleSpan.innerHTML = isVisible ? '🔽' : '▶️';
    }

    updateFilters(newFilters) {
        this.filters = newFilters;
        this.container.innerHTML = '';
        this.generateTable();
    }
}
