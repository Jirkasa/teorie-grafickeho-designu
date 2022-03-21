class ColorControl {
    /**
     * @param {string} colorElementId id of element to be controlled
     * @param {[Element]} inputs inputs to control element color
     * @param {function} changeColorFunc function that is called after input change
     */
    constructor(colorElementId, inputs, changeColorFunc) {
        // element whose background color is controlled
        this.element = document.getElementById(colorElementId);

        // bind changeColor method
        this.changeColor = this.changeColor.bind(this);

        const handle = () => {
            // get input values
            let inputValues = inputs.map(i => i.value);
            // call function that is responsible for color change
            // - first parameter is function to change color, others are input values
            changeColorFunc(this.changeColor, ...inputValues);
        };
        // add event listeners to all inputs
        for (let input of inputs)
            input.addEventListener("input", handle);
        
        handle();
    }

    /**
     * changes color of element
     * @param {string} color new color
     */
    changeColor(color) {
        this.element.style.backgroundColor = color;
    }
}

export default ColorControl;