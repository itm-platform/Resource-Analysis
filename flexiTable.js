// flexiTable.js
import { cacheIconPaths, resolveIconPath, cacheUserImagePaths, pathCache } from './pathResolver.js';

export class FlexiTable {
    constructor(containerId, dataset, filters = {}) {
        cacheIconPaths().catch(error => {
            throw new Error("Failed to preload icons:", error);
        });

        this.container = document.getElementById(containerId);
        this.dataset = dataset;
        this.filters = filters || {};
        
        const uniqueUsers = this._getUniqueUsers(dataset.rows);
        cacheUserImagePaths(uniqueUsers).then(() => {
            this.generateTable();
        });

        // Event listeners
        document.addEventListener('filtersUpdated', this.updateFilters.bind(this));
        document.addEventListener('dataUpdated', this.updateData.bind(this));
    }

    _getUniqueUsers(rows) {
        let userImages = {};
        const extract = (rows) => {
            for (const row of rows) {
                if (row.type === 'user' && row.render && row.render.func === 'renderUserName') {
                    userImages[row.render.params.id] = row.render.params; // Use the user's ID as the key
                }
                if (row.children) {
                    extract(row.children);
                }
            }
        };
        extract(rows);
        return Object.values(userImages); // Convert the object to an array of user image objects
    }
    

    renderUserName(params) {
        const imagePath = pathCache[params.id];
        if (imagePath) {
            return `
            <div class="ftbl-user-wrapper">
                <img src="${imagePath}" alt="${params.name}" class="ftbl-user-placeholder"/>
                <span class="ftbl-user-name">${params.name}</span>
            </div>`;
        }
        const initials = params.name.split(' ').slice(0, 2).map(n => n[0]).join('');
        return `
        <div class="ftbl-user-wrapper">
            <div class="ftbl-user-placeholder ftbl-user-initials" title="${params.name}">${initials.toLowerCase()}</div>
            <span class="ftbl-user-name">${params.name}</span>
        </div>`;
    }

    generateTable() {
        const tableWrapper = document.createElement('div');
        tableWrapper.classList.add('ftbl-table-wrapper');
        this.table = document.createElement('table');
        this.table.classList.add('ftbl-table');
        tableWrapper.appendChild(this.table);
        this.container.appendChild(tableWrapper);
        this.renderHeader();
        this.tbody = document.createElement('tbody');
        this.table.appendChild(this.tbody);
        this.renderRows(this.dataset.rows);
    }


    renderEntityName(params) {
        const imageNameMap = {
            'project': {
                'waterfall': 'Waterfall.svg',
                'agile': 'Agile.svg'
            },
            'service': 'Service.svg'
        };

        const entityType = params.entityType;
        const entitySubType = params.entitySubType;
        const imageName = imageNameMap[entityType]?.[entitySubType] || imageNameMap[entityType];
        const imagePath = resolveIconPath(imageName);
        return `<span class="ftbl-entity-icon"><img src="${imagePath}" alt="${entitySubType || entityType}"></span>${params.name}`;
    }

    renderDuration(params) {
        return params.value ? `${params.value / 60} h.` : '';
    }
    renderHeader() {
        const header = this.table.createTHead();
        header.classList.add('ftbl-header');
        const headerRow = header.insertRow();
        headerRow.classList.add('ftbl-header-row');
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
        columnRow.classList.add('ftbl-header-row');

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
                row.classList.add('ftbl-data-row');
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
                        // Iterate over group values
                        groupValues.values.forEach((value, index, array) => {
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
                            // Check if the current cell is the last in the group
                            if (index === array.length - 1) {
                                cell.classList.add('ftbl-rightmost-cell-in-group');
                            }
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
