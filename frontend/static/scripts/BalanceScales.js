export class BalanceScales {
    constructor(selector, initialEnergy = 20) {
        this.input = document.querySelector(selector);
        this.initialEnergy = initialEnergy;
        this.currentEnergy = initialEnergy/2;
        this.min = parseFloat(this.input.min); // 0
        this.max = parseFloat(this.input.max); // 450
        this.input.value = (this.currentEnergy / this.initialEnergy) * this.max;
    }

    //тута вход от -10 до 10 ,если отдых то - иначе +
    updateBalance(tasks) {
        let energy = this.initialEnergy/2;
        const taskCoefficient=1;
        const restCoefficient=1;
        tasks.forEach(task => {
            console.log(task);
            if (task.difficulty > 0) { 
                energy -= task.difficulty * taskCoefficient;
            } else { 
                energy += Math.abs(task.difficulty) * restCoefficient;
            }
        });
        
        // Ограничиваем энергию в пределах 0-20
        this.currentEnergy = Math.max(0, Math.min(this.initialEnergy, energy));
        
        // Конвертируем в значение для шкалы (0-450)
        const scaleValue = (this.currentEnergy / this.initialEnergy) * this.max;
        this.input.value = scaleValue;
    }
}