// flexiTable.js
import { preloadImages, resolveImagePath } from './pathResolver.js';

export class FlexiTable {
    constructor(containerId, dataset, filters = {}) {
        preloadImages().catch(error => {
            console.error("Failed to preload images:", error);
        });
        
        this.container = document.getElementById(containerId);
        this.dataset = dataset; // The entire new dataset including groups and rows
        this.filters = filters || {};
        this.generateTable();

         // Event listeners
         document.addEventListener('filtersUpdated', this.updateFilters.bind(this));
         document.addEventListener('dataUpdated', this.updateData.bind(this));
    }

    generateTable() {
        this.table = document.createElement('table');
        this.table.setAttribute('border', '1');
        this.table.style.width = '100%';
        this.container.appendChild(this.table);
        this.renderHeader();
        this.tbody = document.createElement('tbody');
        this.table.appendChild(this.tbody);
        this.renderRows(this.dataset.rows);
    }


    renderUserName(params) {
        //console.log(params);
        return `<span class="user-icon">👤</span>${params.name}`;
    }

    renderEntityName(params) {
        console.log(params);
        const imageNameMap = {
            'project': {
                'waterfall': 'Waterfall.svg',
                'agile': 'Agile.svg'
            },
            'service': 'Service.svg'
        };

        const entityType = params.EntityType;
        const entitySubType = params.EntitySubType;
        const imageName = imageNameMap[entityType]?.[entitySubType] || imageNameMap[entityType];
        console.log(`imageName: ${imageName}`);
        const imagePath = resolveImagePath(imageName);
        console.log(`imagePath: ${imagePath}`);
        return `<span class="entity-icon"><img src="${imagePath}" alt="${entitySubType || entityType}"></span>${params.name}`;
    }

    renderDuration(params) {
        return params.value ? `${params.value / 60} h.` : '';
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
            cell.classList.add('ftbl-header-group-cell');
        });

        // Second row for individual columns
        const columnRow = header.insertRow();
        // Again, add an empty cell for the first column
        columnRow.insertCell();

        this.dataset.groups.forEach(group => {
            group.columns.forEach(column => {
                const cell = columnRow.insertCell();
                cell.textContent = column.name;
                cell.classList.add('ftbl-header-column-cell');
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
                if (item.render) {
                    const renderFunc = this[item.render.func];
                    if (renderFunc) {
                        // Directly pass the params object to the render function
                        nameCell.innerHTML = renderFunc.call(this, item.render.params);
                    }
                } else {
                    // Fallback to direct content if no render function specified
                    nameCell.innerHTML = item.name || '';
                }
                nameCell.style.paddingLeft = `${5+(level * 20)}px`; // Adjust the level of indentation
                nameCell.classList.add('ftbl-name-cell');
                if (item.children && item.children.length > 0) {
                    this._addToggleIcon(nameCell, true, rowId);
                }

                this.dataset.groups.forEach(group => {
                    const groupValues = item.values.find(value => value.groupId === group.id);
                    if (groupValues) {
                        groupValues.values.forEach(value => {
                            const cell = row.insertCell();
                            if (value.render) {
                                const renderFunc = this[value.render.func];
                                if (renderFunc) {
                                    // Pass the params object for value rendering
                                    cell.innerHTML = renderFunc.call(this, value.render.params);
                                }
                            } else {
                                cell.innerHTML = value.value;
                            }
                            cell.classList.add('ftbl-value-cell');
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
        toggleSpan.innerHTML = isVisible ? this._getDownCaret() : this._getRightCaret();
        toggleSpan.classList.add('ftbl-caret');
        toggleSpan.onclick = () => this.toggleRow(rowId, toggleSpan);
        cell.insertBefore(toggleSpan, cell.firstChild);
    }
    
    _updateToggleIcon(toggleSpan, isVisible) {
        toggleSpan.innerHTML = isVisible ? this._getDownCaret() : this._getRightCaret();
    }
    
    _getDownCaret() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" height="14"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>`;
    }
    
    _getRightCaret() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" height="14"><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>`;
    }
    

    updateData(event) {
        this.dataset = event.detail;
        this.container.innerHTML = '';
        this.generateTable();
    }

    updateFilters(event) {
        this.filters = event.detail;
        this.container.innerHTML = '';
        this.generateTable();
    }
    
}
