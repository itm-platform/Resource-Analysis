/** Renders the options in a toolbar and emits the requested option
 * @param {Object} options - The options to render, such as [{ svg: 'svg1.svg', name: 'Option 1', tooltip: 'Option 1 tooltip'}]
 * @emits optionSelected - The selected option
*/
export class ViewSelector {
    constructor(options) {
        this.options = options;
        this.element = document.createElement('div');
        this.render();
    }

    render() {
        this.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.name;
            button.title = option.tooltip;
            button.onclick = () => this.selectOption(option);
            this.element.appendChild(button);
        });
    }

    selectOption(option) {
        const event = new CustomEvent('optionSelected', { detail: option.name });
        this.element.dispatchEvent(event);
    }

    attachTo(parent) {
        parent.appendChild(this.element);
    }
}
