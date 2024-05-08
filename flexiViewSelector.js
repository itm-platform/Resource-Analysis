/** flexiViewSelector.js
 * Renders SVG icons in a toolbar and emits the selected option
 * @param {Object} options - The options to render, such as [{ svg: 'svg1.svg', name: 'Option 1', tooltip: 'Option 1 tooltip', selected: false}]
 * @emits optionSelected - The selected option
 */
export class ViewSelector {
    constructor(options) {
        this.options = options;
        this.element = document.createElement('div');
        this.element.className = 'reslysis-view-selector-viewIconsContainer';
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
                separator.className = 'reslysis-view-selector-icon-separator';
                this.element.appendChild(separator);
            }
    
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'reslysis-view-selector-iconWrapper';
            iconWrapper.title = option.tooltip;
            iconWrapper.setAttribute('data-index', index); // Set data-index attribute
            iconWrapper.onclick = () => this.selectOption(option);
            
            const svgContainer = document.createElement('div');
            svgContainer.innerHTML = option.svg;
            const svgElement = svgContainer.firstElementChild;
            if (svgElement) {
                svgElement.classList.add('reslysis-view-selector-icon');
                iconWrapper.appendChild(svgElement);
            }
    
            if (option.selected) {
                iconWrapper.classList.add('reslysis-view-selector-icon-selected');
            }
    
            this.element.appendChild(iconWrapper);
        });
    }
    
    

    selectOption(option) {
        this.options.forEach(opt => {
            opt.selected = false;
        });
    
        // Remove selected class from all icon wrappers
        const iconWrappers = this.element.querySelectorAll('.reslysis-view-selector-iconWrapper');
        iconWrappers.forEach(wrapper => {
            wrapper.classList.remove('reslysis-view-selector-icon-selected');
        });
    
        option.selected = true;
        const selectedIconWrapper = this.element.querySelector(`.reslysis-view-selector-iconWrapper[data-index="${this.options.indexOf(option)}"]`);
        if (selectedIconWrapper) {
            selectedIconWrapper.classList.add('reslysis-view-selector-icon-selected');
        }
    
        console.log(`Selected option: ${option.name} with index: ${this.options.indexOf(option)}`);
        const event = new CustomEvent('optionSelected', { detail: option.name, bubbles: true });
        this.element.dispatchEvent(event);
    }
    

    attachTo(parent) {
        parent.appendChild(this.element);
    }
}
