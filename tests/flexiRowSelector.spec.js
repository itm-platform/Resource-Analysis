import { describe, test, expect, beforeEach, vi } from 'vitest';
import { FlexiRowSelector } from '../flexiRowSelector'; // Adjust the path as necessary
// LEFT OFF fix these tests with the new implementation
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
        console.log(checkboxes);
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
        document.addEventListener('filtersUpdated', spy);

        const checkbox = document.getElementById('workItem');
        checkbox.checked = true;
        checkbox.dispatchEvent(new window.Event('change'));

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            detail: expect.objectContaining({ workItem: true })
        }));
    });

    
});