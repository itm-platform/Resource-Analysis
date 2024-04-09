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
        this.table.style.width = '100%';
        this.container.appendChild(this.table);
        this.renderHeader(); // New: Render the table header based on column definitions
        this.renderRows(this.data);
    }

    renderHeader() {
        const header = this.table.createTHead();
        const groupRow = header.insertRow();
        let hasGroups = false; // Flag to track if we have any groups

        // Check if we have groups with more than one column
        this.columns.forEach(group => {
            if (group.columns.length > 1) {
                hasGroups = true;
            }
        });

        // Only create the group headers if we have groups with more than one column
        if (hasGroups) {
            this.columns.forEach(group => {
                if (group.columns.length > 1) {
                    const groupCell = groupRow.insertCell();
                    groupCell.textContent = group.group;
                    groupCell.setAttribute('colspan', group.columns.length);
                } else {
                    // For groups with one column, insert an empty cell to maintain structure
                    groupRow.insertCell();
                }
            });
        }

        // Always create the individual column headers
        const headerRow = header.insertRow();
        this.columns.forEach(group => {
            group.columns.forEach(column => {
                if (column.display) {
                    const cell = headerRow.insertCell();
                    cell.textContent = column.title;
                    cell.style.width = column.width;
                }
            });
        });
    }

    renderRows(items, parentRowId = '', level = 0, parentVisible = true) {
        items.forEach((item, index) => {
            let isVisible = this.filters.hasOwnProperty(item.type) ? this.filters[item.type] : true;
            isVisible = parentVisible && isVisible;

            const rowId = `${parentRowId}${index}`;
            let row = this.table.insertRow(-1);
            row.setAttribute('data-id', rowId);
            row.setAttribute('data-type', item.type);

            if (!isVisible) {
                row.style.display = 'none'; // Directly apply 'display: none' for hidden rows.
            }

            this.columns.forEach((group, groupIndex) => {
                group.columns.forEach((column, columnIndex) => {
                    let cell = row.insertCell();

                    let cellContent = '';
                    const isFirstColumn = columnIndex === 0 && groupIndex === 0;
                    if (isFirstColumn && this._itemHasChildren(item)) {
                        // Toggle icon for items with children, in the "name" column
                        let toggleSpan = document.createElement('span');
                        toggleSpan.className = 'toggle-icon';
                        toggleSpan.style.marginLeft = `${5 * level}px`;
                        toggleSpan.innerHTML = isVisible ? '🔽' : '▶️';
                        toggleSpan.onclick = () => this.toggleRow(rowId, toggleSpan); // Attach event listener
                        cell.appendChild(toggleSpan);
                    }

                    // Rendering cell content, considering custom render functions
                    if (item.render && item.render[column.field]) {
                        cellContent = item.render[column.field];
                    } else {
                        cellContent += item[column.field] || '';
                    }

                    // Apply indentation if no toggle icon
                    if (isFirstColumn && !this._itemHasChildren(item)) {
                        cellContent = `<span style="margin-left: ${5 * level + 20}px">${cellContent}</span>`; // Adjusted indentation
                    }

                    // Create a container span for content to ensure consistent styling
                    let contentSpan = document.createElement('span');
                    contentSpan.innerHTML = cellContent;
                    cell.appendChild(contentSpan);
                });
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
    toggleRow(rowId, toggleIcon) {
        const rows = this.table.querySelectorAll(`tr[data-id^="${rowId}-"]`);
        let isAnyVisible = Array.from(rows).some(row => row.style.display !== 'none');

        rows.forEach(row => {
            row.style.display = row.style.display === 'none' ? '' : 'none';
        });

        // Update the toggle icon based on visibility
        toggleIcon.innerHTML = isAnyVisible ? '▶️' : '🔽';
    }



    updateFilters(newFilters) {
        this.filters = newFilters;
        this.container.innerHTML = ''; // Clear the container instead of the table
        this.generateTable(); // Regenerate table to reapply header and rows based on new filters
    }


}
