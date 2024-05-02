import { describe, test, expect, beforeEach, vi } from 'vitest';
import { FilterManager } from '../filterManager'; // Adjust the path as necessary
// LEFT OFF fix these tests with the new implementation
describe('FilterManager basics', () => {
    let filterManager;
    let initialFilters;
    let dataRows;
    beforeEach(() => {
        document.body.innerHTML = '';   
        const div = document.createElement('div');
        div.id = 'filtersDiv';
        document.body.appendChild(div);

        // Setting initial filters state
        initialFilters = { project: true, workItem: true, user: true };
        dataRows = [{type:"project",children:[{type:"workItem",children:[{type:"user",children:[]}]}]}];;
        filterManager = new FilterManager('filtersDiv', initialFilters, dataRows);
    });

    test('should initialize with the given filter settings', () => {
        expect(filterManager.getFilters()).toEqual(initialFilters, dataRows);
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
        
        expect(filterManager.getFilters().workItem).toBe(true);
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
