/** flexiViewSelector.js
 * Renders SVG icons in a toolbar and emits the selected option
 * @param {Object} options - The options to render, such as [{ svg: 'svg1.svg', name: 'Option 1', tooltip: 'Option 1 tooltip', selected: false}]
 * @emits optionSelected - The selected option
 */
export class ViewSelector {
    constructor(options) {
        this.options = options;
        this.element = document.createElement('div');
        this.element.className = 'reslysis-viewIconsContainer';
        // Ensure at least one option is selected (the first one by default if none is specified)
        const selectedOption = this.options.find(opt => opt.selected);
        if (!selectedOption && this.options.length > 0) {
            this.options[0].selected = true; // Select the first option if none are selected
        }
        this.render();
    }

    render() {
        this.element.innerHTML = ''; // Clear existing content before re-rendering
        this.options.forEach(option => {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'reslysis-iconWrapper';
            iconWrapper.innerHTML = option.svg;
            iconWrapper.title = option.tooltip;
            iconWrapper.style.width = '16px';
            iconWrapper.style.height = '16px';
            iconWrapper.onclick = () => this.selectOption(option);
            if (option.selected) {
                iconWrapper.classList.add('reslysis-selected');
            }
            this.element.appendChild(iconWrapper);
        });
    }

    selectOption(option) {
        this.options.forEach(opt => {
            opt.selected = false;
            this.element.children[this.options.indexOf(opt)].classList.remove('reslysis-selected');
        });
        option.selected = true;
        const index = this.options.indexOf(option);
        this.element.children[index].classList.add('reslysis-selected');
        const event = new CustomEvent('optionSelected', { detail: option.name, bubbles: true });
        this.element.dispatchEvent(event);
    }

    attachTo(parent) {
        parent.appendChild(this.element);
    }
}
