export class Switch {
    /**
     * @type {HTMLElement}
     */
    _htmlRootElement
    /**
     * @type {HTMLInputElement}
     */
    _htmlInputElement
    /**
     * @type {Array<((checked: boolean) => void)>}
     */
    _listeners


    /**
     * @param {HTMLElement} element 
     */
    constructor(element) {
        this._htmlRootElement = element
        this._htmlInputElement = element.querySelector('input')
        this._listeners = new Array()

        this._htmlInputElement.addEventListener('input', (e) => this._notifyListeners())
    }


    /**
     * @param {(checked: boolean) => void} listener 
     */
    addListener(listener) {
        this._listeners.push(listener)
    }

    /**
     * @param {(checked: boolean) => void} listener 
     */
    removeListener(listener) {
        const index = this._listeners.indexOf(listener)
        if (index < 0)
            return

        this._listeners.splice(index, 1)
    }

    /**
     * @param {boolean} value 
     */
    setChecked(value) {
        this._htmlInputElement.checked = value
        this._notifyListeners()
    }

    getChecked() {
        return this._htmlInputElement.checked
    }

    toggle() {
        const inverse = !this.getChecked()
        this.setChecked(inverse)
    }


    _notifyListeners() {
        const value = this.getChecked()

        for (const listener of this._listeners) {
            listener(value)
        }
    }

}