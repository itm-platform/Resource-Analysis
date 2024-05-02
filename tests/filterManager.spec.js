import { describe, test, expect, beforeEach, vi } from 'vitest';
//import { JSDOM } from 'jsdom';
import { FilterManager } from '../filterManager'; // Adjust the path as necessary

//const { window } = new JSDOM('<!doctype html><html><body></body></html>');
// global.window = window;
// global.document = window.document;

describe('FilterManager', () => {
    let filterManager;
    let initialFilters;

    beforeEach(() => {
        document.body.innerHTML = '';   
        const div = document.createElement('div');
        div.id = 'filtersDiv';
        document.body.appendChild(div);

        // Setting initial filters state
        initialFilters = { project: true, workItem: false, user: true };
        filterManager = new FilterManager('filtersDiv', initialFilters);
    });

    test('should initialize with the given filter settings', () => {
        expect(filterManager.getFilters()).toEqual(initialFilters);
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

    test('should update filters and dispatch filtersUpdated event when setFilters is called', () => {
        const newFilters = { user: true, macaroni:{tomato:"parmigiano"}  };
        const spy = vi.fn();
        document.addEventListener('filtersUpdated', spy);

        filterManager.setFilters(newFilters);

        expect(filterManager.getFilters()).toEqual(newFilters);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            detail: newFilters
        }));
    });
});
