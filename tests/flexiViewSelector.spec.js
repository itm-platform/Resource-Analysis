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
            { svg: 'svg1.svg', name: 'Option 1', tooltip: 'Option 1 tooltip' },
            { svg: 'svg2.svg', name: 'Option 2', tooltip: 'Option 2 tooltip' }
        ];

        viewSelector = new ViewSelector(options);
    });

    test('should render buttons for each option', () => {
        viewSelector.attachTo(parentDiv);
        const buttons = parentDiv.querySelectorAll('button');
        expect(buttons.length).toBe(options.length);
        buttons.forEach((button, index) => {
            expect(button.textContent).toBe(options[index].name);
            expect(button.title).toBe(options[index].tooltip);
        });
    });

    test('should emit "optionSelected" event with option name when an option is clicked', () => {
        const spy = vi.fn();
        parentDiv.addEventListener('optionSelected', spy);
        viewSelector.attachTo(parentDiv);

        const button = parentDiv.querySelector('button');
        button.click();
        
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            detail: options[0].name
        }));
    });

    test('should attach the viewSelector element to a specified parent element', () => {
        viewSelector.attachTo(parentDiv);
        expect(parentDiv.contains(viewSelector.element)).toBe(true);
    });
});
