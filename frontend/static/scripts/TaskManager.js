import { Task } from './Task.js';


export class TaskManager {
    constructor(listElement, isRest=false) {
        this.listElement = listElement;
        this.addedTasksList = [];

        this.isRest = isRest;
        this.taskList = this.listElement.querySelector('.task-list')
        this.taskListEntry = this.taskList.querySelector('.task-entry-samlpe')

        
        this.addTaskButton = this.listElement.querySelector('.task-plus');

        this.loadTasks();
    }

    async loadTasks() {
        try {
            const response = await fetch('/api/tasks/', {
                method: 'GET',
                credentials: 'include'  
            });
    
            if (!response.ok) {
                throw new Error('Ошибка загрузки задач');
            }
    
            let tasks = await response.json();
            tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            if (!this.isRest){
                tasks = tasks.filter(task => task["difficulty"] > 0);
            }
            else {
                tasks = tasks.filter(task => task["difficulty"] < 0);
            }
            tasks.forEach(task => {
                this.addTaskToList(new Task(task["id"], task["name"], task["text"], task["difficulty"], 0, 1, 0));
            });
    
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    addTaskToList(task) {
        const newElem = this.taskList.appendChild(this.taskListEntry.cloneNode(true));
        newElem.getElementsByClassName('task-label')[0].innerText = task.name;
        newElem.getElementsByClassName('task-difficulty')[0].innerText = `${task.difficulty}`;
        newElem.querySelector('.task-deadline').textContent = task.deadline;
        newElem.classList.remove("hidden");
        newElem.addEventListener('click', (event) => {
            const foundTask = this.addedTasksList.find(searchTask => searchTask === task);
            this.taskEditor.show(this.addTaskToList, foundTask.name, foundTask.text, foundTask.deadline);
        });
        task.domElement = newElem;
        this.addedTasksList.push(task);
    }

    deleteTaskFromList(task) {
        const taskIndex = this.addedTasksList.findIndex(searchTask => searchTask === task);
        task.domElement.remove();
        this.addedTasksList.splice(taskIndex, 1);
    }

    setTaskEditor(taskEditor) {
        this.taskEditor = taskEditor;
        const lll = this;
        this.addTaskButton.onclick = function() { 
            taskEditor.show(lll);
        };
    }

    updateTaskInList(task) {
        // TODO
    }
}