class Task {
    constructor(id, name, text, start, end, dom_element) {
        this.id = id;
        this.name = name;
        this.text = text;
        this.start = start;
        this.end = end;
        this.dom_element = dom_element;
    }
}


class Rest {
    constructor(id, name, text, start, end, dom_element) {
        this.id = id;
        this.name = name;
        this.text = text;
        this.start = start;
        this.end = end;
        this.dom_element = dom_element;
    }
}


class TaskManager {
    constructor() {
        this.taskAddBlock = document.getElementById('task-add-block');
        this.addTaskFinalButton = document.getElementById('add-task-final-button');
        this.taskTitleInput = document.getElementById('task-title-input');
        this.taskDescriptionArea = document.getElementById('task-description-area');
        this.taskDeadlineInput = document.getElementById('task-deadline-input');
        this.addedTasksList = [];

        this.addTaskFinalButton.addEventListener('click', (event) => {
            const title = this.taskTitleInput.value;
            const description = this.taskDescriptionArea.value;
            const deadline = this.taskDeadlineInput.value;
            const difficulty = 0;
            const newElem = addTaskToList(title, difficulty, deadline);
            this.hide();
            // TODO: Обращение к бэкенду, получение подтверждения
            this.addedTasksList.push(new Task(0, title, description, 0, 1, newElem));
        });

        this.taskAddBlock.addEventListener('click', (event) => {
            if (!taskAddCard.contains(event.target)) {
                this.hide();
            }
        });
    }

    show(title = '', description = '', deadline = '') {
        this.taskTitleInput.text = title;
        this.taskDescriptionArea.text = description;
        // this.taskDeadlineInput.value = deadline;
        this.taskAddBlock.classList.remove("hidden");
    }

    hide() {
        this.taskAddBlock.classList.add("hidden");
    }
}

class RestManager {
    constructor() {
        this.restAddBlock = document.getElementById('rest-add-block');
        this.addRestFinalButton = document.getElementById('add-rest-final-button');
        this.restTitleInput = document.getElementById('rest-title-input');
        this.restDescriptionArea = document.getElementById('rest-description-area');
        this.restDeadlineInput = document.getElementById('rest-deadline-input');
        this.addedRestsList = [];

        this.addRestFinalButton.addEventListener('click', (event) => {
            const title = this.restTitleInput.value;
            const description = this.restDescriptionArea.value;
            const deadline = this.restDeadlineInput.value;
            const difficulty = 0;
            const newElem = addRestToList(title, difficulty, deadline);
            this.hide();
            // TODO: Обращение к бэкенду, получение подтверждения
            this.addedRestsList.push(new Rest(0, title, description, 0, 1, newElem));
        });

        this.restAddBlock.addEventListener('click', (event) => {
            if (!restAddCard.contains(event.target)) {
                this.hide();
            }
        });
    }

    show(title = '', description = '', deadline = '') {
        this.restTitleInput.text = title;
        this.restDescriptionArea.text = description;
        // this.restDeadlineInput.value = deadline;
        this.restAddBlock.classList.remove("hidden");
    }

    hide() {
        this.restAddBlock.classList.add("hidden");
    }
}

const restManager = new RestManager();

const taskManager = new TaskManager();

const addTaskButton = document.getElementById('add-task-button');
const addRestButton = document.getElementById('add-rest-button');

const addedRestsList = [];

const taskAddCard = document.getElementById('task-add-card');
const restAddCard = document.getElementById('rest-add-card');

addTaskButton.onclick = function() { taskManager.show() };
addRestButton.onclick = function() { restManager.show() };


const taskListEntry = document.getElementById('task-entry-samlpe')
const taskList = document.getElementById('task-list')

function addTaskToList(taskLabel, taskDifficulty, deadline) {
    const newElem = taskList.appendChild(taskListEntry.cloneNode(true));
    newElem.getElementsByClassName('task-label')[0].innerText = taskLabel;
    newElem.getElementsByClassName('task-difficulty')[0].innerText = `${taskDifficulty}`;
    newElem.querySelector('.task-deadline').textContent = deadline;
    newElem.classList.remove("hidden");
    newElem.addEventListener('click', (event) => {
        const task = taskManager.addedTasksList.find(task => task.dom_element === newElem);
        taskManager.show(task.title, task.description, task.deadline);
    });
    return newElem;
}

const restListEntry = document.getElementById('rest-entry-samlpe')
const restList = document.getElementById('rest-list')

function addRestToList(taskLabel, taskDifficulty, deadline) {
    const newElem = restList.appendChild(restListEntry.cloneNode(true));
    newElem.getElementsByClassName('task-label')[0].innerText = taskLabel;
    newElem.getElementsByClassName('task-difficulty')[0].innerText = `${taskDifficulty}`;
    newElem.querySelector('.task-deadline').textContent = deadline;
    newElem.classList.remove("hidden");
    newElem.id = '';
    newElem.addEventListener('click', (event) => {
        const rest = restManager.addedRestsList.find(rest => rest.dom_element === newElem);
        restManager.show(rest.title, rest.description, rest.deadline);
    });
    return newElem;
}


class BalanceScales {
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

const balanceScales = new BalanceScales("#balance-scales");
balanceScales.setValue(0.5);