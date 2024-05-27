import { describe, test, expect, beforeEach, beforeAll, vi } from 'vitest';
import { FlexiRowSelector } from '../flexiRowSelector';
import mockGeneralJS from './mockGeneralJS';

describe('FlexiRowSelector basics', () => {
    let flexiRowSelector;
    let initialFilters;
    let dataRows;
    beforeAll(async () => {
        await mockGeneralJS();
    });
    beforeEach(async () => {
        document.body.innerHTML = '';   
        const div = document.createElement('div');
        div.id = 'rowSelectorDiv';
        document.body.appendChild(div);

        // Setting initial filters state
        initialFilters = { project: true, workItem: true, user: true };
        dataRows = [{type:"project",children:[{type:"workItem",children:[{type:"user",children:[]}]}]}];;
        flexiRowSelector = new FlexiRowSelector('rowSelectorDiv', initialFilters, dataRows);
        await flexiRowSelector._initPromise; // Wait for the initialization to complete
    });

    test('should initialize with the given filter settings', () => {
        expect(flexiRowSelector.getRows()).toEqual(initialFilters, dataRows);
    });

    test('should create filter checkboxes based on initialFilters', async () => {
        await flexiRowSelector._initPromise;
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        console.log(checkboxes.length);
        expect(checkboxes.length).toBe(Object.keys(initialFilters).length);
        Object.keys(initialFilters).forEach(type => {
            const checkbox = document.getElementById(type);
            expect(checkbox.checked).toBe(initialFilters[type]);
        });
    });

    test('should update filter value on checkbox change', async () => {
        await flexiRowSelector._initPromise;
        const checkbox = document.getElementById('workItem');
        checkbox.checked = true;
        checkbox.dispatchEvent(new window.Event('change'));
        
        expect(flexiRowSelector.getRows().workItem).toBe(true);
    });

    test('should dispatch custom event when filters are updated', async () => {
        await flexiRowSelector._initPromise;
        const spy = vi.fn();
        document.addEventListener('resourceAnalysisRowSelectionUpdated', spy);

        const checkbox = document.getElementById('workItem');
        checkbox.checked = true;
        checkbox.dispatchEvent(new window.Event('change'));

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            detail: expect.objectContaining({ workItem: true })
        }));
    });

    
});

describe('FlexiRowSelector integration', () => {
    let flexiRowSelector;
    let initialFilters;
    let dataRows;
    beforeAll(async () => {
        await mockGeneralJS();
    });
    beforeEach(async() => {
        document.body.innerHTML = '';
        const div = document.createElement('div');
        div.id = 'rowSelectorDiv';
        document.body.appendChild(div);

        initialFilters = { project: true, workItem: true, user: true };
        dataRows = [{ type: "project", children: [{ type: "workItem", children: [{ type: "user", children: [] }] }] }];
        flexiRowSelector = new FlexiRowSelector('rowSelectorDiv', initialFilters, dataRows);
        await new Promise(r => setTimeout(r, 100)); // Wait 100ms for the DOM to update
    });

    test('should handle resourceAnalysisDataUpdated event correctly', async() => {
        await flexiRowSelector._initPromise;
        // Simulate new data order
        const newDataRows = [{ type: "user", children: [{ type: "project", children: [{ type: "workItem", children: [] }] }] }];

        // Dispatch the resourceAnalysisDataUpdated event
        const dataUpdatedEvent = new CustomEvent('resourceAnalysisDataUpdated', { detail: { rows: newDataRows } });
        document.dispatchEvent(dataUpdatedEvent);

        // Check if the rowSelectionOrder is updated
        expect(flexiRowSelector.rowSelectionOrder).toEqual(['user', 'project', 'workItem']);

        // Check if the row selection reflects the new order
        expect(flexiRowSelector.getRows()).toEqual({ user: true, project: true, workItem: true });

        // Ensure the checkboxes are reordered accordingly in the UI
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        expect(checkboxes.length).toBe(3);
        expect(checkboxes[0].id).toBe('user');
        expect(checkboxes[1].id).toBe('project');
        expect(checkboxes[2].id).toBe('workItem');
    });
});