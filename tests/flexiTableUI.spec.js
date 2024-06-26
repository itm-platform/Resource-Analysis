// tests/UI/flexiTableUI.spec.js
import { describe, test, expect, beforeEach, beforeAll } from 'vitest';
import { FlexiTable } from '../flexiTable.js';
import { FlexiRowSelector } from '../flexiRowSelector.js';
import data from './dataSamples/intervalsByEntityAndWorkItem.json';

import mockGeneralJS from './mockGeneralJS';

describe('UI Tests for flexiTable', async () => {
    beforeAll(async () => {
        await mockGeneralJS();
    });
    beforeEach(async () => {
        // Setup the initial HTML structure
        document.body.innerHTML = `
      <div id="rowSelectorDiv"></div>
      <div id="tableContainer" style="width: 80%;"></div>
    `;

        // Initialize the components as done in the application
        const flexiRowSelector = new FlexiRowSelector('rowSelectorDiv', {
            project: true, workItem: true, user: true
        });
        const flexiTable = new FlexiTable('tableContainer', data, flexiRowSelector.getRows());
        await new Promise(r => setTimeout(r, 100)); // Wait 100ms for the DOM to update
    });

    test('Filters are present with all options ticked', () => {
        const checkboxes = document.querySelectorAll('#rowSelectorDiv input[type="checkbox"]');
        expect(checkboxes.length).toBe(3); // Check if all filters are present
        checkboxes.forEach(checkbox => {
            expect(checkbox.checked).toBe(true); // Check if each checkbox is ticked
        });
    });

    test('Table is present with correct structure', () => {
        const table = document.querySelector('#tableContainer table');
        expect(table).toBeTruthy(); // Check if table is present

        const headerRows = table.querySelectorAll('thead tr');
        expect(headerRows.length).toBeGreaterThan(0); // Check if header rows are present

        const bodyRows = table.querySelectorAll('tbody tr');
        expect(bodyRows.length).toBeGreaterThan(0); // Check if body rows are present

        // Check for presence of expected columns in the first header row
        const columns = headerRows[0].querySelectorAll('td');
        expect(columns.length).toBeGreaterThan(0); // Check for non-zero number of columns
    });
    test('Table is present with correct structure, including header groups and columns', () => {
        const table = document.querySelector('#tableContainer table');
        expect(table).toBeTruthy(); // Check if table is present

        const groupHeaders = table.querySelectorAll('thead tr:first-child td[class="ftbl-header-group-cell"]');
        expect(groupHeaders.length).toBe(3); // Check that there are exactly three group headers

        // Check that each header group has a colspan of "2"
        groupHeaders.forEach(header => {
            expect(header.getAttribute('colspan')).toBe('2');
        });

        // Check the second row for correct "Estimated" and "Actual" columns under each group header
        const detailHeaders = table.querySelectorAll('thead tr:nth-child(2) td[class="ftbl-header-column-cell"]');
        expect(detailHeaders.length).toBe(6); // There should be 6 detail headers (3 groups * 2 columns each)

        // Verify that the headers alternately read "Estimated" and "Actual"
        const expectedHeaders = ['Estimated', 'Actual'];
        detailHeaders.forEach((header, index) => {
            expect(header.textContent.trim()).toBe(expectedHeaders[index % 2]);
        });
    });
    test('Table is present with correct data rows', () => {
        const table = document.querySelector('#tableContainer table');
        expect(table).toBeTruthy(); // Check if table is present

        const bodyRows = table.querySelectorAll('tbody tr');
        expect(bodyRows.length).toBeGreaterThan(0); // Check if body rows are present

        // Check that each row has a data-id attribute
        bodyRows.forEach(row => {
            expect(row.getAttribute('data-id')).toBeTruthy();
        });

        // Check that each row has a data-type attribute
        bodyRows.forEach(row => {
            expect(row.getAttribute('data-type')).toBeTruthy();
        });
    });

});

describe('Row Interaction Tests', async () => {
    beforeAll(async () => {
        await mockGeneralJS();
    });
    beforeEach(async () => {
        // Setup the initial HTML structure
        document.body.innerHTML = `
      <div id="rowSelectorDiv"></div>
      <div id="tableContainer" style="width: 80%;"></div>
    `;

        // Initialize the components as done in the application
        const flexiRowSelector = new FlexiRowSelector('rowSelectorDiv', {
            project: true, workItem: true, user: true
        });
        const flexiTable = new FlexiTable('tableContainer', data, flexiRowSelector.getRows());
        await new Promise(r => setTimeout(r, 100)); // Wait 100ms for the DOM to update
    });

    test('Clicking on a row toggles its expanded/collapsed state', async () => {
        await new Promise(r => setTimeout(r, 100)); // Wait 100ms for the DOM to update

        const firstRowToggle = document.querySelector('.ftbl-caret');
        expect(firstRowToggle).toBeTruthy();
        const rowId = firstRowToggle.closest('tr').dataset.id;

        const collapseAll = document.getElementById('collapseAll');
        collapseAll.dispatchEvent(new Event('click'));

        // Expand the first row
        firstRowToggle.click();
        let row = document.querySelector(`tr[data-id="${rowId}"]`);
        expect(row.classList.contains('ftbl-row-level-1-expanded')).toBe(true);

        // Click again to collapse
        firstRowToggle.click();
        row = document.querySelector(`tr[data-id="${rowId}"]`);
        expect(row.classList.contains('ftbl-row-level-1-expanded')).toBe(false);
    });

    test('Collapse all sets all rows to collapsed state and updates classes', () => {
        const collapseAll = document.getElementById('collapseAll');
        collapseAll.dispatchEvent(new Event('click')); // Manually dispatch the click event

        const allRows = document.querySelectorAll('tbody tr');
        allRows.forEach(row => {
            const isNotFirstRow = row.getAttribute('data-id').length > 1;
            if (isNotFirstRow) {
                expect(row.style.display).toBe('none');
                expect(row.classList.contains('ftbl-row-level-1-expanded')).toBe(false);
            }
        });
    });

    test('Expand all sets all rows to visible state and updates classes', () => {
        const expandAll = document.getElementById('expandAll');
        expandAll.dispatchEvent(new Event('click')); // Manually dispatch the click event

        const allRows = document.querySelectorAll('tbody tr');
        allRows.forEach(row => {
            expect(row.style.display).toBe('');
            const isFirstRow = row.getAttribute('data-id').length == 1;
            if (row.querySelector('.ftbl-caret') && isFirstRow) {
                expect(row.classList.contains('ftbl-row-level-1-expanded')).toBe(true);
            }
        });
    });


});

describe('Interaction Tests for FlexiTable Filters', () => {
    beforeAll(async () => {
        await mockGeneralJS();
    });
    beforeEach(() => {
        // Set up the DOM structure as it would be in the live environment
        document.body.innerHTML = `
        <div id="rowSelectorDiv"></div>
        <div id="tableContainer" style="width: 80%;"></div>
      `;

        // Initialize components
        const dataRows = [{ type: "project", children: [{ type: "workItem", children: [{ type: "user", children: [] }] }] }];;
        const flexiRowSelector = new FlexiRowSelector('rowSelectorDiv', {
            project: true, workItem: true, user: true
        }, dataRows);
        const flexiTable = new FlexiTable('tableContainer', data, flexiRowSelector.getRows());
    });

    test('Check that users are initially present in the table', async () => {
        await new Promise(r => setTimeout(r, 100)); // Wait a bit for the DOM updates to apply
        const users = document.querySelectorAll('tr[data-type="user"]');
        expect(users.length).toBeGreaterThan(0); // Check that there are user entries
    });

    test('Check that unchecking "user" removes users from the table', async () => {
        await new Promise(r => setTimeout(r, 100));
        const userCheckbox = document.querySelector('#row-selector-user');
        userCheckbox.click(); // Simulate unchecking the "user" checkbox
        await new Promise(r => setTimeout(r, 100)); // Wait a bit for the DOM updates to apply

        const users = document.querySelectorAll('tr[data-type="user"]');
        expect(users.length).toBe(0); // Ensure no user entries are present
    });

    // It doesn't pass
    test('Check that checking "user" again brings back users', async () => {
        await new Promise(r => setTimeout(r, 100)); // Wait a bit for the DOM updates to apply

        let users = document.querySelectorAll('tr[data-type="user"]');
        console.log(`users.length: ${users.length}`);
        
        // Simulate the event to uncheck the "user" checkbox
        let event = new CustomEvent('resourceAnalysisRowSelectionUpdated', { detail: { project: true, workItem: true, user: false } });
        document.dispatchEvent(event);

        await new Promise(r => setTimeout(r, 100)); // Wait a bit for the DOM updates to apply
        console.log(`userCheckbox.checked after first click: false`);
        users = document.querySelectorAll('tr[data-type="user"]');
        console.log(`users.length after first click: ${users.length}`);
        expect(users.length).toBe(0); // Ensure users are removed

        // Simulate the event to check the "user" checkbox again
        event = new CustomEvent('resourceAnalysisRowSelectionUpdated', { detail: { project: true, workItem: true, user: true } });
        document.dispatchEvent(event);

        await new Promise(r => setTimeout(r, 200)); // Increase wait time for DOM updates
        console.log(`userCheckbox.checked after second click: true`);
        
        users = document.querySelectorAll('tr[data-type="user"]');
        console.log(`users.length after second click: ${users.length}`);
        expect(users.length).toBeGreaterThan(0); // Check that user entries are back
    });
    

 

});