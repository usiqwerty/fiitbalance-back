export class BalanceScales {
    constructor(selector, initialEnergy = 20) {
        this.input = document.querySelector(selector);
        this.initialEnergy = initialEnergy;
        this.currentEnergy = initialEnergy;
        this.min = parseFloat(this.input.min); // 0
        this.max = parseFloat(this.input.max); // 450
    }

    //тута вход от -10 до 10 ,если отдых то - иначе +
    updateBalance(tasks) {
        let energy = this.initialEnergy;
        const taskСoefficient=1;
        const restСoefficient=0.8;
        tasks.forEach(task => {
            if (task.difficulty > 0) { 
                energy -= task.difficulty * taskСoefficient;
            } else { 
                energy += Math.abs(task.difficulty) * restСoefficient;
            }
        });

        // Ограничиваем энергию в пределах 0-20
        this.currentEnergy = Math.max(0, Math.min(this.initialEnergy, energy));
        
        // Конвертируем в значение для шкалы (0-450)
        const scaleValue = (this.currentEnergy / this.initialEnergy) * this.max;
        this.input.value = scaleValue;
    }
}