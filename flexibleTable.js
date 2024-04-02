// flexibleTable.js
import data from './flexibleTableDataSample.js';
function generateTable(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous table
    const table = document.createElement('table');
    table.setAttribute('border', '1');
    container.appendChild(table);

    const generateRows = (items, parentRowId = '', level = 0) => {
        items.forEach((item, index) => {
            const rowId = `${parentRowId}${index}`;
            let row = table.insertRow(-1);
            row.setAttribute('data-id', rowId);
            row.setAttribute('data-type', item.type);
            row.classList.add('indent');
            row.style.paddingLeft = `${level * 20}px`;

            let cell = row.insertCell(0);
            cell.textContent = item.name;
            cell.classList.add('clickable');
            cell.setAttribute('onclick', `toggleRow('${rowId}')`);

            if (item.children && item.children.length > 0) {
                generateRows(item.children, `${rowId}-`, level + 1);
            }
        });
    };

    generateRows(data);
}

function toggleRow(rowId) {
    const rows = document.querySelectorAll(`[data-id^="${rowId}-"]`);
    rows.forEach(row => {
        row.style.display = row.style.display === 'none' ? '' : 'none';
    });
}

function applyFilter(visibilitySettings) {
    document.querySelectorAll('tr[data-type]').forEach(row => {
        const type = row.getAttribute('data-type');
        row.style.display = visibilitySettings[type] ? '' : 'none';
    });
}

window.onload = () => generateTable(data, 'tableContainer');