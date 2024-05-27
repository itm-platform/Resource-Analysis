import { describe, test, expect, beforeEach, vi } from 'vitest';
import { FlexiRowSelector } from '../flexiRowSelector'; 
describe('FlexiRowSelector basics', () => {
    let flexiRowSelector;
    let initialFilters;
    let dataRows;
    beforeEach(() => {
        document.body.innerHTML = '';   
        const div = document.createElement('div');
        div.id = 'rowSelectorDiv';
        document.body.appendChild(div);

        // Setting initial filters state
        initialFilters = { project: true, workItem: true, user: true };
        dataRows = [{type:"project",children:[{type:"workItem",children:[{type:"user",children:[]}]}]}];;
        flexiRowSelector = new FlexiRowSelector('rowSelectorDiv', initialFilters, dataRows);
    });

    test('should initialize with the given filter settings', () => {
        expect(flexiRowSelector.getRows()).toEqual(initialFilters, dataRows);
    });

    test('should create filter checkboxes based on initialFilters', () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        expect(checkboxes.length).toBe(Object.keys(initialFilters).length);
        Object.keys(initialFilters).forEach(type => {
            const checkbox = document.getElementById(type);
            expect(checkbox.checked).toBe(initialFilters[type]);
        });
    });

    test('should update filter value on checkbox change', () => {
        const checkbox = document.getElementById('workItem');
        checkbox.checked = true;
        checkbox.dispatchEvent(new window.Event('change'));
        
        expect(flexiRowSelector.getRows().workItem).toBe(true);
    });

    test('should dispatch custom event when filters are updated', () => {
        const spy = vi.fn();
        document.addEventListener('rowSelectionUpdated', spy);

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
    beforeEach(() => {
        document.body.innerHTML = '';
        const div = document.createElement('div');
        div.id = 'rowSelectorDiv';
        document.body.appendChild(div);

        initialFilters = { project: true, workItem: true, user: true };
        dataRows = [{ type: "project", children: [{ type: "workItem", children: [{ type: "user", children: [] }] }] }];
        flexiRowSelector = new FlexiRowSelector('rowSelectorDiv', initialFilters, dataRows);
    });

    test('should handle resourceAnalysisDataUpdated event correctly', () => {
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