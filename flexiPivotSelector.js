/** flexiPivotSelector.js
 * Renders SVG icons in a toolbar and emits the selected option
 * @param {Object} options - The options to render, such as [{ svg: 'svg1.svg', name: 'Option 1', tooltip: 'Option 1 tooltip', selected: false}]
 * @emits flexiTablePivotOptionSelected - The selected option
 */
export class PivotSelector {
    constructor(options) {
        this.options = options;
        this.element = document.createElement('div');
        this.element.className = 'reslysis-pivot-selector-pivotIconsContainer';
        // Ensure at least one option is selected (the first one by default if none is specified)
        const selectedOption = this.options.find(opt => opt.selected);
        if (!selectedOption && this.options.length > 0) {
            this.options[0].selected = true; // Select the first option if none are selected
        }
        this.render();
    }

    render() {
        this.element.innerHTML = ''; // Clear existing content
    
        this.options.forEach((option, index) => {
            if (index > 0) {
                const separator = document.createElement('div');
                separator.className = 'reslysis-pivot-selector-icon-separator';
                this.element.appendChild(separator);
            }
    
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'reslysis-pivot-selector-iconWrapper';
            iconWrapper.title = option.tooltip;
            iconWrapper.setAttribute('data-index', index); // Set data-index attribute
            iconWrapper.onclick = () => this.selectOption(option);
            
            const svgContainer = document.createElement('div');
            svgContainer.innerHTML = option.svg;
            const svgElement = svgContainer.firstElementChild;
            if (svgElement) {
                svgElement.classList.add('reslysis-pivot-selector-icon');
                iconWrapper.appendChild(svgElement);
            }
    
            if (option.selected) {
                iconWrapper.classList.add('reslysis-pivot-selector-icon-selected');
            }
    
            this.element.appendChild(iconWrapper);
        });
    }
    
    

    selectOption(option) {
        this.options.forEach(opt => {
            opt.selected = false;
        });
    
        // Remove selected class from all icon wrappers
        const iconWrappers = this.element.querySelectorAll('.reslysis-pivot-selector-iconWrapper');
        iconWrappers.forEach(wrapper => {
            wrapper.classList.remove('reslysis-pivot-selector-icon-selected');
        });
    
        option.selected = true;
        const selectedIconWrapper = this.element.querySelector(`.reslysis-pivot-selector-iconWrapper[data-index="${this.options.indexOf(option)}"]`);
        if (selectedIconWrapper) {
            selectedIconWrapper.classList.add('reslysis-pivot-selector-icon-selected');
        }
    
        const event = new CustomEvent('flexiTablePivotOptionSelected', { detail: option.name, bubbles: true });
        this.element.dispatchEvent(event);
    }
    

    attachTo(parent) {
        parent.appendChild(this.element);
    }
}
