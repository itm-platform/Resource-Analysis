// flexiTable.js
import { cacheIconPaths, resolveIconPath, cacheUserImagePaths, pathCache } from './pathResolver.js';
import { renderUserName, renderEntityName, renderDuration } from './renderFunctions.js';
// TODO - 🔴 - translations
// TODO - 🟡- Export
export class FlexiTable {
    constructor(containerId, dataset, rowFilters = {}, pivotSelector) {
        cacheIconPaths().catch(error => {
            throw new Error("Failed to preload icons:", error);
        });

        this.container = document.getElementById(containerId);
        this.dataset = dataset;
        this.rowFilters = rowFilters || {};
        this.pivotSelector = pivotSelector;

        const uniqueUsers = this.#getUniqueUsers(dataset.rows);
        cacheUserImagePaths(uniqueUsers).then(() => {
            this.generateTable();
        });

        // Event listeners
        document.addEventListener('rowSelectionUpdated', this.updateFilters.bind(this));
        document.addEventListener('dataUpdated', this.updateData.bind(this));
    }

    generateTable() {
        try {
            this.#validateDataset(this.dataset);

            const tableWrapper = document.createElement('div');
            tableWrapper.classList.add('ftbl-table-wrapper');
            this.table = document.createElement('table');
            this.table.classList.add('ftbl-table');
            tableWrapper.appendChild(this.table);
            this.container.appendChild(tableWrapper);
            this.renderHeader();
            this.tbody = document.createElement('tbody');
            this.table.appendChild(this.tbody);
            this.#renderRows(this.dataset.rows);
            this.#updateAllRowClasses();
        }
        catch (error) {
            console.warn('Error generating table:', error.message);
        }

    }
    #renderFuncMap = {
        'renderUserName': renderUserName,
        'renderEntityName': renderEntityName,
        'renderDuration': renderDuration
    };

    #validateDataset(dataset) {
        if (!dataset || !dataset.rows || !Array.isArray(dataset.rows) || dataset.rows.length === 0) {
            throw new Error('Invalid dataset provided to flexiTable', dataset);
        }
        if (!dataset.groups || !Array.isArray(dataset.groups) || dataset.groups.length === 0) {
            throw new Error('Invalid groups provided to FlexiTable', dataset);
        }
    }

    #renderRows(items, parentRowId = '', level = 0, parentVisible = true) {
        items.forEach((item, index) => {
            const isRowNotFilteredOut = !this.rowFilters.hasOwnProperty(item.type) || this.rowFilters[item.type];
            if (isRowNotFilteredOut) {
                const { row, rowId } = this.#createRow(parentRowId, index, item, parentVisible);
                this.#createFirstNameCell(row, item, level, rowId);
                this.#createValueCells(item, row);
                if (item.children) {
                    this.#renderRows(item.children, `${rowId}-`, level + 1, parentVisible && this.rowFilters[item.type]);
                }
            }
        });
    }

    #setRowVisibility(selector, isVisible, updateClasses = false) {
        const rows = this.table.querySelectorAll(selector);
        rows.forEach(row => {
            if (isVisible) {
                row.style.display = '';
            } else {
                if (row.dataset.id.includes('-')) {
                    row.style.display = 'none';
                }
            }
            if (updateClasses) {
                // Updates row classes based on the new visibility state
                this.#updateRowClasses(row, isVisible);
            }
        });
    }
    #toggleChildRows(rowId, toggleCell) {
        const childRows = `tr[data-id^="${rowId}-"]`;
        const isAnyChildVisible = Array.from(this.table.querySelectorAll(childRows)).some(row => row.style.display !== 'none');

        this.#setRowVisibility(childRows, !isAnyChildVisible);

        let parentRow = this.table.querySelector(`tr[data-id="${rowId}"]`);
        if (parentRow) {
            this.#updateRowClasses(parentRow, !isAnyChildVisible);
        }
        this.#updateToggleIcon(toggleCell, !isAnyChildVisible);
    }

    #areChildrenVisible(rowId) {
        const childRows = `tr[data-id^="${rowId}-"]`;
        return Array.from(this.table.querySelectorAll(childRows)).some(row => row.style.display !== 'none');
    }

    #updateAllRowClasses() {
        const rows = this.table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const childrenVisible = this.#areChildrenVisible(row.getAttribute('data-id'));
            this.#updateRowClasses(row, childrenVisible);
        });
    }

    #updateRowClasses(row, childrenVisible) {
        const idParts = row.getAttribute('data-id').split('-');
        if (idParts.length === 1) { // Level 1 row
            row.classList.toggle('ftbl-row-level-1-expanded', childrenVisible);
        } else if (idParts.length === 2) { // Level 2 row
            row.classList.toggle('ftbl-row-level-2-expanded', childrenVisible);
        }
    }

    #getUniqueUsers(rows) {
        if (!rows || rows.length === 0) {
            return [];
        }
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
    renderHeader() {
        const { headerRow, header } = this.#createHeader();
        this.#addToolbarToHeaderFirstCell(headerRow);
        this.#addGroupHeaders(headerRow);
        this.#addColumnsHeaders(header);
        this.#addResizingHandle(headerRow.cells[0]); // Assuming first cell is the name column header
    }

    #addResizingHandle(headerCell) {
        const resizeHandle = document.createElement('div');
        resizeHandle.innerHTML = this.#getResizeArrow();
        resizeHandle.style.cssText = 'position: absolute; right: -6px; top: 0; bottom: 0; width: 12px; cursor: col-resize; user-select: none; display: flex; align-items: center; justify-content: center;';
        headerCell.style.position = 'relative';
        headerCell.appendChild(resizeHandle);

        let startX, startWidth;

        resizeHandle.addEventListener('mousedown', function (e) {
            startX = e.clientX;
            startWidth = headerCell.offsetWidth;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault(); // Prevent text selection during drag
        });

        function onMouseMove(e) {
            const newWidth = startWidth + e.clientX - startX;
            headerCell.style.width = `${newWidth}px`;
            document.querySelectorAll('.ftbl-name-cell').forEach(cell => {
                cell.style.width = `${newWidth}px`;
            });
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }


    #addColumnsHeaders(header) {
        const columnRow = header.insertRow();
        columnRow.classList.add('ftbl-header-row');
        // columnRow.insertCell(); // First empty cell for the first column

        this.dataset.groups.forEach(group => {
            group.columns.forEach(column => {
                const cell = columnRow.insertCell();
                cell.textContent = column.name;
                cell.classList.add('ftbl-header-column-cell');
            });
        });
    }

    #addGroupHeaders(headerRow) {
        this.dataset.groups.forEach(group => {
            const cell = headerRow.insertCell();
            cell.textContent = group.name;
            cell.setAttribute('colspan', group.columns.length);
            cell.classList.add('ftbl-header-group-cell');
        });
    }

    #addExpandCollapseButtons(caretWrapper) {
        // Create the collapse and expand icons wrapped in divs with the appropriate class
        const collapseIconWrapper = document.createElement('div');
        collapseIconWrapper.className = 'ftbl-toolbar-icon';
        const collapseIcon = document.createElement('span');
        collapseIcon.innerHTML = this.#getCaretCollapseAll();
        collapseIconWrapper.appendChild(collapseIcon);

        const expandIconWrapper = document.createElement('div');
        expandIconWrapper.className = 'ftbl-toolbar-icon';
        const expandIcon = document.createElement('span');
        expandIcon.innerHTML = this.#getCaretExpandAll();
        expandIconWrapper.appendChild(expandIcon);

        // Create a separator div
        const separator = document.createElement('div');
        separator.className = 'ftbl-icon-separator';

        // Append icon wrappers and separator to the caretWrapper
        caretWrapper.appendChild(collapseIconWrapper);
        caretWrapper.appendChild(separator);
        caretWrapper.appendChild(expandIconWrapper);

        // Add event listeners for the icons
        collapseIconWrapper.addEventListener('click', () => this.#setRowVisibility('tbody tr', false, true));
        expandIconWrapper.addEventListener('click', () => this.#setRowVisibility('tbody tr', true, true));

        // Add common classes and specific IDs to the icon wrappers
        collapseIconWrapper.classList.add('ftbl-caret-toggle-all');
        collapseIconWrapper.id = 'collapseAll';
        expandIconWrapper.classList.add('ftbl-caret-toggle-all');
        expandIconWrapper.id = 'expandAll';
    }

    #addToolbarToHeaderFirstCell(headerRow) {
        const createViewSelectorWrapper = (headerToolbar) => {
            const viewSelectorWrapper = document.createElement('div');
            viewSelectorWrapper.id = 'pivotSelector';
            viewSelectorWrapper.classList.add('ftbl-toolbar-set-wrapper');
            headerToolbar.appendChild(viewSelectorWrapper);
            this.#attachViewSelector(viewSelectorWrapper);
        };

        const createCollapseExpandAllToolbar = (headerToolbar) => {
            const caretWrapper = document.createElement('div');
            caretWrapper.id = 'caretWrapper';
            caretWrapper.classList.add('ftbl-toolbar-set-wrapper');
            caretWrapper.classList.add('ftbl-caret-wrapper');
            headerToolbar.appendChild(caretWrapper);
            this.#addExpandCollapseButtons(caretWrapper);
        };

        const createHeaderToolbar = () => {
            const headerToolbar = document.createElement('div');
            headerToolbar.id = 'headerToolbar';
            headerToolbar.classList.add('ftbl-header-toolbar');
            toolbarCell.appendChild(headerToolbar);
            return headerToolbar;
        };

        const toolbarCell = headerRow.insertCell();
        // rowspan 2 to make the toolbar cell span two rows
        toolbarCell.setAttribute('rowspan', '2');
        const headerToolbar = createHeaderToolbar();
        createCollapseExpandAllToolbar(headerToolbar);
        createViewSelectorWrapper(headerToolbar);
    }
    #attachViewSelector(viewSelectorWrapper) {
        if (this.pivotSelector) {
            this.pivotSelector.attachTo(viewSelectorWrapper);
        }
    }
    #createHeader() {
        const header = this.table.createTHead();
        header.classList.add('ftbl-header');
        const headerRow = header.insertRow();
        headerRow.classList.add('ftbl-header-row');
        return { headerRow, header };
    }

    #createValueCells(item, row) {
        this.dataset.groups.forEach(group => {
            const groupValues = item.values.find(value => value.groupId === group.id);
            if (groupValues) {
                groupValues.values.forEach((value, index, array) => {
                    const cell = row.insertCell();
                    if (value.render && this.#renderFuncMap[value.render.func]) {
                        const renderFunc = this.#renderFuncMap[value.render.func];
                        // Assuming render functions do not need 'this' from FlexiTable
                        cell.innerHTML = renderFunc(value.render.params);
                    } else {
                        cell.innerHTML = value.value;
                    }
                    cell.classList.add('ftbl-value-cell');
                    if (index === array.length - 1) {
                        cell.classList.add('ftbl-rightmost-cell-in-group');
                    }
                });
            }
        });
    }

    #createFirstNameCell(row, item, level, rowId) {
        const nameCell = row.insertCell();
        const innerDiv = document.createElement('div');
        innerDiv.className = 'ftbl-inner-content';
        innerDiv.style.paddingLeft = `${5 + (level * 20)}px`;

        if (item.render && this.#renderFuncMap[item.render.func]) {
            const renderFunc = this.#renderFuncMap[item.render.func];
            // Assuming render functions do not need 'this' from FlexiTable
            innerDiv.innerHTML = renderFunc(item.render.params);
        } else {
            innerDiv.innerHTML = item.name || '';
        }

        nameCell.appendChild(innerDiv);
        nameCell.classList.add('ftbl-name-cell');
        if (item.children && item.children.length > 0 && !this.#areChildrenFilteredOut(item.type)) {
            this.#addToggleIcon(innerDiv, true, rowId);
        }
    }
    #areChildrenFilteredOut(itemType) {
        const nextKey = (object, key) => {
            const keys = Object.keys(object);
            const index = keys.indexOf(key);
            return index >= 0 && index < keys.length - 1 ? keys[index + 1] : undefined;
        };
        const nextFilter = nextKey(this.rowFilters, itemType);
        return !this.rowFilters.hasOwnProperty(nextFilter) || !this.rowFilters[nextFilter];
    }
    #addToggleIcon(cell, isVisible, rowId) {
        const toggleSpan = document.createElement('span');
        toggleSpan.innerHTML = isVisible ? this.#getDownCaret() : this.#getRightCaret();
        toggleSpan.classList.add('ftbl-caret');
        toggleSpan.onclick = () => this.#toggleChildRows(rowId, toggleSpan);
        cell.insertBefore(toggleSpan, cell.firstChild);
    }
    #createRow(parentRowId, index, item, parentVisible) {
        const rowId = `${parentRowId}${index}`;
        const row = this.tbody.insertRow();
        row.setAttribute('data-id', rowId);
        row.setAttribute('data-type', item.type);
        row.classList.add('ftbl-data-row');
        if (!parentVisible) {
            row.style.display = 'none';
        } else {
            // Automatically apply the correct class based on level and visibility
            this.#updateRowClasses(row, true);
        }
        return { row, rowId };
    }

    #updateToggleIcon(toggleSpan, isVisible) {
        toggleSpan.innerHTML = isVisible ? this.#getDownCaret() : this.#getRightCaret();
    }

    #getDownCaret() {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" height="14">
            <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/>
        </svg>`;
    }

    #getRightCaret() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" height="14"><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>`;
    }
    #getCaretCollapseAll() {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 17" height="14">
            <path d="m5.536 7.344c0.5 0.5 1.312 0.5 1.812 0l5.12-5.12c0.368-0.368 0.476-0.916 0.276-1.396-0.2-0.48-0.664-0.792-1.184-0.792l-10.24 0.0040003c-0.516 0-0.984 0.312-1.184 0.792-0.2 0.48-0.088 1.028 0.276 1.396l5.12 5.12 4e-3 -4e-3z"/>
            <path d="m7.3071 9.375c-0.5-0.5-1.312-0.5-1.812 0l-5.12 5.12c-0.368 0.368-0.476 0.916-0.276 1.396 0.2 0.48 0.664 0.792 1.184 0.792h10.24c0.516 0 0.984-0.312 1.184-0.792s0.088-1.028-0.276-1.396l-5.12-5.12h-4e-3z"/>
        </svg>
        `;
    };
    #getCaretExpandAll() {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 17" height="14">     
            <path d="M5.49823 16.308C5.99823 16.808 6.81023 16.808 7.31023 16.308L12.4302 11.188C12.7982 10.82 12.9062 10.272 12.7062 9.792C12.5062 9.312 12.0422 9 11.5222 9L1.28223 9.004C0.766227 9.004 0.298227 9.316 0.0982268 9.796C-0.101773 10.276 0.0102268 10.824 0.374227 11.192L5.49423 16.312L5.49823 16.308Z"/>
            <path d="M7.30711 0.375C6.80711 -0.125 5.99511 -0.125 5.49511 0.375L0.375111 5.495C0.00711113 5.863 -0.100889 6.411 0.0991111 6.891C0.299111 7.371 0.763111 7.683 1.28311 7.683H11.5231C12.0391 7.683 12.5071 7.371 12.7071 6.891C12.9071 6.411 12.7951 5.863 12.4311 5.495L7.31111 0.375H7.30711Z"/>
        </svg>`;
    };
    #getResizeArrow() {
        return `
        <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_353_21)">
        <path opacity="0.75" d="M12.7613 2.92618C13.0787 3.24357 13.0787 3.759 12.7613 4.07638L10.3238 6.51388C10.0064 6.83126 9.49102 6.83126 9.17363 6.51388C8.85625 6.1965 8.85625 5.68107 9.17363 5.36368L10.2248 4.31251H6.5V2.68751H10.2248L9.17363 1.63634C8.85625 1.31896 8.85625 0.803528 9.17363 0.486145C9.49102 0.168762 10.0064 0.168762 10.3238 0.486145L12.7613 2.92365V2.92618Z" fill="black"/>
        <path opacity="0.4" d="M0.23867 2.92618C-0.0787125 3.24357 -0.0787125 3.759 0.23867 4.07638L2.67617 6.51388C2.99355 6.83126 3.50898 6.83126 3.82637 6.51388C4.14375 6.1965 4.14375 5.68107 3.82637 5.36368L2.77519 4.31251H6.5V2.68751H2.77519L3.82637 1.63634C4.14375 1.31896 4.14375 0.803528 3.82637 0.486145C3.50898 0.168762 2.99355 0.168762 2.67617 0.486145L0.23867 2.92365V2.92618Z" fill="black"/>
        </g><defs><clipPath id="clip0_353_21"><rect width="13" height="7" fill="white"/></clipPath></defs>
        </svg>      
`;
    }

    updateData(event) {
        this.dataset = event.detail;
        this.container.innerHTML = '';
        this.generateTable();
    }

    updateFilters(event) {
        this.rowFilters = event.detail;
        this.container.innerHTML = '';
        this.generateTable();

    }

}
