export class BalanceScales {
    constructor(selector) {
        this.input = document.querySelector(selector);
        if (!this.input) {
            throw new Error("Элемент не найден");
        }
        this.min = parseFloat(this.input.min);
        this.max = parseFloat(this.input.max);
    }

    setValue(value) {
        if (value < 0 || value > 1) {
            throw new Error("Значение должно быть в диапазоне от 0 до 1");
        }
        const rangeValue = this.min + value * (this.max - this.min);
        this.input.value = rangeValue;
    }
}