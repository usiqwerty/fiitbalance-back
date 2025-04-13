import { Task } from './Task.js';


export class TaskEditor {
    constructor(date) {
        this.taskAddBlock = document.getElementById('task-add-block');
        this.addTaskFinalButton = document.getElementById('add-task-final-button');
        this.taskTitleInput = document.getElementById('task-title-input');
        this.taskDescriptionArea = document.getElementById('task-description-area');
        this.taskDateInput = document.getElementById('task-date-input');
        this.taskAddCard = document.getElementById('task-add-card');
        this.date = date;

        const date_closure = this.date;

        this.addTaskFinalButton.addEventListener('click', async (event) => {
            const title = this.taskTitleInput.value;
            const description = this.taskDescriptionArea.value;
            const date = this.taskDateInput.value;
            let difficulty = 5;

            if (this.taskManager.isRest) {
                difficulty *= -1;
            }
            
            try {
                const response = await fetch('/api/tasks/add_task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    
                    body: JSON.stringify({
                        "name": title,
                        "text": description,
                        "start": `${date}T10:00:00`,
                        "end": "2023-10-01T12:00:00",
                        "difficulty": difficulty
                    })
                });
        
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Ошибка при создании задачи');
                }
                const createdTask = await response.json();
                if (date_closure == date)
                {
                    this.taskManager.addTaskToList(new Task(createdTask.id, title, description, difficulty, 0, 1, 0));
                }
                this.hide();
                
            } catch (error) {
                console.error('Ошибка при создании задачи:', error);
                alert(`Не удалось создать задачу: ${error.message}`);
            }            
        });

        this.taskAddBlock.addEventListener('click', (event) => {
            if (!this.taskAddCard.contains(event.target)) {
                this.hide();
            }
        });
    }

    hide() {
        this.taskAddBlock.classList.add("hidden");
    }

    show(taskManager, title = '', description = '', date = '') {
        this.taskManager = taskManager;
        this.taskTitleInput.value = title;
        this.taskDescriptionArea.innerText = description;
        if (date == ''){
            date = this.date;
        }
        this.taskDateInput.value = date;
        this.taskAddBlock.classList.remove("hidden");
    }
}