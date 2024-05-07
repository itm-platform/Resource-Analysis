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
            { svg: '<svg>...</svg>', name: 'Option 1', tooltip: 'Option 1 tooltip' },
            { svg: '<svg>...</svg>', name: 'Option 2', tooltip: 'Option 2 tooltip' }
        ];

        viewSelector = new ViewSelector(options);
    });

    test('should render icon wrappers for each option with SVGs', () => {
        viewSelector.attachTo(parentDiv);
        const iconWrappers = parentDiv.querySelectorAll('.reslysis-iconWrapper');
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

        const firstIconWrapper = parentDiv.querySelector('.reslysis-iconWrapper');
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
        const firstIconWrapper = parentDiv.querySelector('.reslysis-iconWrapper');
        firstIconWrapper.click(); // Simulate a click to select the first option
        
        expect(firstIconWrapper.classList).toContain('reslysis-selected');
    });
});
