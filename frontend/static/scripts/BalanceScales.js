export class BalanceScales {
    constructor(selector, initialEnergy = 20) {
        this.input = document.querySelector(selector);
        this.initialEnergy = initialEnergy;
        this.currentEnergy = initialEnergy / 2;
        this.min = parseFloat(this.input.min);
        this.max = parseFloat(this.input.max);
        this.input.value = (this.currentEnergy / this.initialEnergy) * this.max;
        this._animationFrame = null;
    }

    updateBalance(tasks) {
        let energy = this.initialEnergy / 2;
        tasks.forEach(task => {
            //Сложность отдыха отрицательна, сложность задачи положительна
            energy -= task.difficulty;
        });

        const targetEnergy = Math.max(0, Math.min(this.initialEnergy, energy));
        const targetValue = (targetEnergy / this.initialEnergy) * this.max;

        this._animateValue(this.input.value, targetValue);
    }

    _animateValue(startValue, targetValue) {
        const duration = 800;
        const startTime = performance.now();
        const initialValue = parseFloat(startValue);

        const animate = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
            const currentValue = initialValue + (targetValue - initialValue) * easedProgress;
            
            this.input.value = currentValue.toFixed(2);

            if (progress < 1) {
                this._animationFrame = requestAnimationFrame(animate);
            }
        };

        if (this._animationFrame) {
            cancelAnimationFrame(this._animationFrame);
        }

        this._animationFrame = requestAnimationFrame(animate);
    }
}