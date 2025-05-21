export class BalanceScales {
    constructor(selector, initialEnergy = 20) {
        this.input = document.querySelector(selector);
        this.initialEnergy = initialEnergy;
        this.currentEnergy = initialEnergy / 2;
        this.min = parseFloat(this.input.min);
        this.max = parseFloat(this.input.max);
        this.input.value = (this.currentEnergy / this.initialEnergy) * this.max;
        this._animationFrame = null; // Для управления анимацией
    }
    //тута вход от -10 до 10 ,если отдых то - иначе +
    updateBalance(tasks) {
        let energy = this.initialEnergy / 2;
        tasks.forEach(task => {
            task.difficulty > 0 
                ? energy -= task.difficulty 
                : energy += Math.abs(task.difficulty);
        });

        const targetEnergy = Math.max(0, Math.min(this.initialEnergy, energy));
        const targetValue = (targetEnergy / this.initialEnergy) * this.max;

        // Запускаем анимацию
        this._animateValue(this.input.value, targetValue);
    }

    _animateValue(startValue, targetValue) {
        const duration = 800; // Длительность анимации в мс
        const startTime = performance.now();
        const initialValue = parseFloat(startValue);

        const animate = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Плавное движение с easing
            const easedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
            const currentValue = initialValue + (targetValue - initialValue) * easedProgress;
            
            this.input.value = currentValue.toFixed(2);

            if (progress < 1) {
                this._animationFrame = requestAnimationFrame(animate);
            }
        };

        // Отменяем предыдущую анимацию
        if (this._animationFrame) {
            cancelAnimationFrame(this._animationFrame);
        }
        this._animationFrame = requestAnimationFrame(animate);
    }
}