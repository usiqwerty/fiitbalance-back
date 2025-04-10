import { Task } from './Task.js';


export class TaskManager {
    constructor(listElement) {
        this.listElement = listElement;
        this.addedTasksList = [];
        
        this.taskList = this.listElement.querySelector('.task-list')
        this.taskListEntry = this.taskList.querySelector('.task-entry-samlpe')

        
        this.addTaskButton = document.getElementById('add-task-button');

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
    
            const tasks = await response.json();
            console.log(tasks);
            tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    
            
            tasks.forEach(task => {
                const newElem = this.addTaskToList(task["name"], 5, 0);
                this.addedTasksList.push(
                    new Task(task.id, task["name"], task["text"], 0, 1, newElem)
                );
            });
    
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    addTaskToList(taskLabel, taskDifficulty, deadline) {
        const newElem = this.taskList.appendChild(this.taskListEntry.cloneNode(true));
        newElem.getElementsByClassName('task-label')[0].innerText = taskLabel;
        newElem.getElementsByClassName('task-difficulty')[0].innerText = `${taskDifficulty}`;
        newElem.querySelector('.task-deadline').textContent = deadline;
        newElem.classList.remove("hidden");
        newElem.addEventListener('click', (event) => {
            const task = this.addedTasksList.find(task => task.dom_element === newElem);
            this.taskEditor.show(task.name, task.text, task.deadline);
        });
        return newElem;
    }

    deleteTaskFromList(task){
        const taskIndex = this.addedTasksList.findIndex(searchTask => searchTask === task);
        task.domElement.remove();
        this.addedTasksList.splice(taskIndex, 1);
    }

    setTaskEditor(taskEditor) {
        this.taskEditor = taskEditor;
        this.addTaskButton.onclick = function() { taskEditor.show() };
    }

    updateTaskInList(task){
        // TODO
    }
}