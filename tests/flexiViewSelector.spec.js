import { describe, test, expect, beforeEach, vi } from 'vitest';
import { ViewSelector } from '../flexiViewSelector'; // Adjust the path as necessary

describe('ViewSelector basics', () => {
    let viewSelector;
    let options;
    let parentDiv;

    beforeEach(() => {
        document.body.innerHTML = '';
        parentDiv = document.createElement('div');
        parentDiv.id = 'viewSelectorDiv';
        document.body.appendChild(parentDiv);

        options = [
            { svg: '<svg class="reslysis-view-selector-icon">...</svg>', name: 'Option 1', tooltip: 'Option 1 tooltip' },
            { svg: '<svg class="reslysis-view-selector-icon">...</svg>', name: 'Option 2', tooltip: 'Option 2 tooltip' }
        ];

        viewSelector = new ViewSelector(options);
    });

    test('should render icon wrappers for each option with SVGs', () => {
        viewSelector.attachTo(parentDiv);
        const iconWrappers = parentDiv.querySelectorAll('.reslysis-view-selector-iconWrapper');
        expect(iconWrappers.length).toBe(options.length);
        iconWrappers.forEach((wrapper, index) => {
            expect(wrapper.innerHTML).toContain(options[index].svg);
            expect(wrapper.title).toBe(options[index].tooltip);
        });
    });

    test('should emit "optionSelected" event with option name when an option is clicked', () => {
        const spy = vi.fn();
        parentDiv.addEventListener('optionSelected', spy);
        viewSelector.attachTo(parentDiv);

        const firstIconWrapper = parentDiv.querySelector('.reslysis-view-selector-iconWrapper');
        firstIconWrapper.click();
        
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            detail: options[0].name
        }));
    });

    test('should attach the viewSelector element to a specified parent element', () => {
        viewSelector.attachTo(parentDiv);
        expect(parentDiv.contains(viewSelector.element)).toBe(true);
    });

    test('should highlight the selected icon when clicked', () => {
        viewSelector.attachTo(parentDiv);
        const firstIconWrapper = parentDiv.querySelector('.reslysis-view-selector-iconWrapper');
        firstIconWrapper.click(); // Simulate a click to select the first option
        
        expect(firstIconWrapper.classList).toContain('reslysis-view-selector-icon-selected');
    });
    test('should render separators between icon wrappers but not before the first or after the last icon', () => {
        viewSelector.attachTo(parentDiv);
        const separators = parentDiv.querySelectorAll('.reslysis-view-selector-icon-separator');
        expect(separators.length).toBe(options.length - 1); // There should be one less separator than there are options
    });
    test('should ensure custom events bubble up the DOM', () => {
        const spy = vi.fn();
        document.addEventListener('optionSelected', spy);
        viewSelector.attachTo(parentDiv);
    
        const firstIconWrapper = parentDiv.querySelector('.reslysis-view-selector-iconWrapper');
        firstIconWrapper.click();
    
        expect(spy).toHaveBeenCalled();
        document.removeEventListener('optionSelected', spy); // Clean up
    });
    test('should handle rapid clicks across different options', () => {
        viewSelector.attachTo(parentDiv);
        const iconWrappers = parentDiv.querySelectorAll('.reslysis-view-selector-iconWrapper');
    
        iconWrappers[0].click();
        expect(iconWrappers[0].classList).toContain('reslysis-view-selector-icon-selected');
        
        iconWrappers[1].click();
        expect(iconWrappers[1].classList).toContain('reslysis-view-selector-icon-selected');
        expect(iconWrappers[0].classList).not.toContain('reslysis-view-selector-icon-selected');
    });
    
    
    
});
