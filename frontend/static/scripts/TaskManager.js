import { Task } from './Task.js';


export class TaskManager {
    constructor(listElement, date, isRest=false) {
        this.date = date;
        this.listElement = listElement;
        this.addedTasksList = [];   

        this.isRest = isRest;// true для отдыха, false для работы
        this.taskList = this.listElement.querySelector('.task-list')
        this.taskListEntry = this.taskList.querySelector('.task-entry-samlpe')

        
        this.addTaskButton = this.listElement.querySelector('.task-plus');
        if (isRest){
            this.addTaskButton2 = document.getElementById('rest_plus');
        }
        else{
            this.addTaskButton2 = document.getElementById("task_plus");
        }
        

        this.loadTasks();
    }

    async loadTasks() {
        try {
            const response = await fetch(`/api/tasks/for_date?date=${this.date}`, {
                method: 'GET',
                credentials: 'include'  
            });
    
            if (!response.ok) {
                throw new Error('Ошибка загрузки задач');
            }
    
            let tasks = await response.json();
            tasks.sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed - b.completed; // Сначала идут невыполненные, а выполненные улетают в конец
                }
                return new Date(a.deadline) - new Date(b.deadline);
            });

            if (!this.isRest){
                tasks = tasks.filter(task => task["difficulty"] > 0);
            }
            else {
                tasks = tasks.filter(task => task["difficulty"] < 0);
            }
            tasks.forEach(task => {
                let newTask = new Task(task["id"], task["name"], task["text"], task["difficulty"], 0, 1, 0, task["completed"])
                this.addTaskToList(newTask);
            });
    
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    addTaskToList(task) {
        const newElem = this.taskList.appendChild(this.taskListEntry.cloneNode(true));
        newElem.getElementsByClassName('task-label')[0].innerText = task.name;
        newElem.getElementsByClassName('task-difficulty')[0].innerText = `${Math.abs(task.difficulty)}`;
        const taskIcon = document.createElement('img');
        taskIcon.className = 'task-icon';
        if (this.isRest) {
            taskIcon.src = '../static/resources/Пальма.svg';
            taskIcon.alt = 'Пальма';
        } else {
            taskIcon.src = '../static/resources/Огонь.svg';
            taskIcon.alt = 'Огонь';
        }
        const iconContainer = newElem.querySelector('.task-icon-container');
        iconContainer.appendChild(taskIcon);
        newElem.querySelector('.task-deadline').textContent = task.deadline;
        newElem.classList.remove("hidden");
        newElem.getElementsByClassName('task-circle')[0].src = task.completed ? '../static/resources/work_ellipse.svg'
                                                                                    : (task.difficulty > 0 ? '../static/resources/red-ellipse.svg' : '../static/resources/green-ellipse.svg');

        if (task.completed) {
            newElem.classList.add('task-completed');
        } else {
            newElem.classList.remove('task-completed');
        }

        newElem.addEventListener('click', async (event) => {
            const foundTask = this.addedTasksList.find(searchTask => searchTask === task);
            if (event.target.classList.contains('task-circle')) {
                const circle = event.target;
                circle.style.opacity = 0.5;

                try {
                    const response = await fetch(`/api/tasks/complete?task_id=${foundTask.id}&completed=${!foundTask.completed}`, {
                        method: 'POST',
                        headers: {
                        }
                    });

                    console.log('Статус ответа:', response.status);
                    if ((circle.src.includes('red') || circle.src.includes('green')) && foundTask.completed === false) {
                        foundTask.completed = true;
                        newElem.classList.add('task-completed');
                        circle.src = '../static/resources/work_ellipse.svg';
                    } else {
                        if (foundTask.difficulty > 0){
                            circle.src = '../static/resources/red-ellipse.svg';
                        } else{
                            circle.src = '../static/resources/green-ellipse.svg';
                        }
                        foundTask.completed = false;
                        newElem.classList.remove('task-completed');
                    }
                } catch (error) {
                    console.error('Ошибка:', error);
                    alert('Не удалось обновить статус задачи');
                }
                finally{
                    circle.style.opacity = 1;
                }
            } else {
                this.taskEditor.show(this, foundTask.name, foundTask.text, foundTask.deadline, foundTask.difficulty, foundTask.id, true);
            }
        });
        task.domElement = newElem;
        this.addedTasksList.push(task);
    }

    updateTaskInList(newTask) {
        console.log(newTask.name);
        const oldTask = this.addedTasksList.find(searchTask => searchTask.id === newTask.id);
        const oldElem = oldTask.domElement;
        newTask.domElement = oldElem;
        oldElem.getElementsByClassName('task-label')[0].innerText = newTask.name;
        oldElem.getElementsByClassName('task-difficulty')[0].innerText = `${Math.abs(newTask.difficulty)}`;
        oldTask.updateFields(newTask);

        if (newTask.completed) {
            oldElem.classList.add('task-completed');
        } else {
            oldElem.classList.remove('task-completed');
        }

    }

    deleteTaskFromList(taskId) {
        const taskIndex = this.addedTasksList.findIndex(searchTask => searchTask.id === taskId);
        const task = this.addedTasksList[taskIndex];
        task.domElement.remove();
        this.addedTasksList.splice(taskIndex, 1);
    }

    setTaskEditor(taskEditor) {
        this.taskEditor = taskEditor;
        const lll = this;
        this.addTaskButton.onclick = function() {
            taskEditor.show(lll);
        };
        this.addTaskButton2.onclick = function() {
            taskEditor.show(lll);
        };
    }
}