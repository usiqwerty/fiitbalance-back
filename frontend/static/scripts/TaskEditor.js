import { Task } from './Task.js';


export class TaskEditor {
    constructor(taskManager) {
        this.taskAddBlock = document.getElementById('task-add-block');
        this.addTaskFinalButton = document.getElementById('add-task-final-button');
        this.taskTitleInput = document.getElementById('task-title-input');
        this.taskDescriptionArea = document.getElementById('task-description-area');
        this.taskDeadlineInput = document.getElementById('task-deadline-input');
        this.taskAddCard = document.getElementById('task-add-card');
        this.taskManager = taskManager;

        this.addTaskFinalButton.addEventListener('click', async (event) => {
            const title = this.taskTitleInput.value;
            const description = this.taskDescriptionArea.value;
            const deadline = this.taskDeadlineInput.value;
            const difficulty = 0;
            
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
                        "end": "2023-10-01T12:00:00",
                        "difficulty": 5
                    })
                });
        
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Ошибка при создании задачи');
                }
                const createdTask = await response.json();
                
                const newElem = this.taskManager.addTaskToList(title, difficulty, deadline);
                this.hide();
                this.taskManager.addedTasksList.push(
                    new Task(createdTask.id, title, description, 0, 1, newElem)
                );
                
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

    show(title = '', description = '', deadline = '') {
        this.taskTitleInput.value = title;
        this.taskDescriptionArea.innerText = description;
        // this.taskDeadlineInput.value = deadline;
        this.taskAddBlock.classList.remove("hidden");
    }
}