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

        this.addTaskFinalButton.addEventListener('click', async (event) => {
            const title = this.taskTitleInput.value;
            const description = this.taskDescriptionArea.value;
            const deadline = this.taskDeadlineInput.value;
            const difficulty = 0;

            //const newElem = addTaskToList(title, difficulty, deadline);
            //this.hide();
            // TODO: Обращение к бэкенду, получение подтверждения
            //this.addedTasksList.push(new Task(0, title, description, 0, 1, newElem));
            
            try {
                console.log(JSON.stringify({
                    "title": title,
                    "description": description,
                    "deadline": deadline,
                    "difficulty": difficulty
                }));
                const response = await fetch('/api/tasks/add_task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    
                    body: JSON.stringify({
                        "name": title,
                        "text": description,
                        "start": "2023-10-01T10:00:00",
                        "end": "2023-10-01T12:00:00"
                    })
                });
        
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Ошибка при создании задачи');
                }
                const createdTask = await response.json();
        
                const newElem = addTaskToList(title, difficulty, deadline);
                this.hide();
                this.addedTasksList.push(
                    new Task(createdTask.id, title, description, 0, 1, newElem)
                );
        
            } catch (error) {
                console.error('Ошибка при создании задачи:', error);
                alert(`Не удалось создать задачу: ${error.message}`);
            }
        });

        this.taskAddBlock.addEventListener('click', (event) => {
            if (!taskAddCard.contains(event.target)) {
                this.hide();
            }
        });
    }

    show(title = '', description = '', deadline = '') {
        this.taskTitleInput.value = title;
        this.taskDescriptionArea.innerText = description;
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

        this.addRestFinalButton.addEventListener('click', async (event) => {
            const title = this.restTitleInput.value;
            const description = this.restDescriptionArea.value;
            const deadline = this.restDeadlineInput.value;
            const difficulty = 0;
            //const newElem = addRestToList(title, difficulty, deadline);
            //this.hide();
            // TODO: Обращение к бэкенду, получение подтверждения
            //this.addedRestsList.push(new Rest(0, title, description, 0, 1, newElem));

            try {
                const response = await fetch('http://localhost:8000/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: title,
                        description: description,
                        deadline: deadline,
                        difficulty: difficulty
                    })
                });
        
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Ошибка при создании задачи');
                }
        
                const createdTask = await response.json();
        
                const newElem = addRestToList(title, difficulty, deadline);
                this.hide();
                this.addedRestsList.push(
                    new Rest(createdTask.id, title, description, 0, 1, newElem)
                );
        
            } catch (error) {
                console.error('Ошибка:', error);
                alert(`Ошибка: ${error.message}`);
            }
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
        taskManager.show(task.name, task.text, task.deadline);
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


async function loadTasks() {
    try {
        const response = await fetch('/api/tasks/', {
            method: 'GET',
            credentials: 'include'  
        });

        if (!response.ok) {
            throw new Error('Ошибка загрузки задач');
        }

        const tasks = await response.json();
        console.log(tasks);
        tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        
        tasks.forEach(task => {
            const newElem = addTaskToList(task["name"], 5, 0);
            taskManager.addedTasksList.push(
                new Task(task.id, task["name"], task["text"], 0, 1, newElem)
            );
        });

    } catch (error) {
        console.error('Ошибка:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});