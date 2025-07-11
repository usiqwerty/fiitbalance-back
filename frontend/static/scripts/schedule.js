import { Task } from './Task.js';
import { TaskManager } from './TaskManager.js';
import { TaskEditor } from './TaskEditor.js';
import { BalanceScales } from './BalanceScales.js';
import { DateManager } from './DateManager.js';

document.addEventListener('DOMContentLoaded', () => {

    const dateManager = new DateManager();
    dateManager.updateDisplayedDates()
    dateManager.onDateChange(() => {
        updateGlobalBalance();
    });
    dateManager.initDateNavigation();

    const workManager = new TaskManager(
        document.getElementById('work-list-block'),
        dateManager.apiDate
    );
        
    const restManager = new TaskManager(
        document.getElementById('rest-list-block'),
        dateManager.apiDate,
        true
    );

    const taskEditor = new TaskEditor(dateManager.apiDate);
    workManager.setTaskEditor(taskEditor);
    restManager.setTaskEditor(taskEditor);
        
    const balanceScales = new BalanceScales("#balance-scales");

    const updateGlobalBalance = () => {
        balanceScales.updateBalance([
            ...workManager.addedTasksList,
            ...restManager.addedTasksList
        ]);
    };

    const originalAddTask = TaskManager.prototype.addTaskToList;
    TaskManager.prototype.addTaskToList = function(task) {
        originalAddTask.call(this, task);
        updateGlobalBalance();
    };

    const originalDeleteTask = TaskManager.prototype.deleteTaskFromList;
    TaskManager.prototype.deleteTaskFromList = function(task) {
        originalDeleteTask.call(this, task);
        updateGlobalBalance();
    };

    const originalUpdateTask = TaskManager.prototype.updateTaskInList;
    TaskManager.prototype.updateTaskInList = function(task) {
        originalUpdateTask.call(this, task);
        updateGlobalBalance();
    };

    window.addEventListener('popstate', () => {
        dateManager._currentDate = dateManager._parseUrlDate();
        workManager.loadTasks();
        restManager.loadTasks();
    });
});


const dateInput = document.getElementById('look-date-input');
const dateInputMobile = document.getElementById('look-date-input-mobile');
dateInput.addEventListener('input', calendarClickHandle);
dateInputMobile.addEventListener('input', calendarClickHandle);

function calendarClickHandle(event) {
    const selectedDate = event.target.value;
    const redirectUrl = `/schedule?date=${selectedDate}`;
    window.location.href = redirectUrl;
}


document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = this.href;
    });
});


const descriptionTextarea = document.getElementById('task-description-area');

descriptionTextarea.addEventListener('focus', function () {
    this.setAttribute('data-placeholder', this.placeholder);
    this.placeholder = '';
});

descriptionTextarea.addEventListener('blur', function () {
    if (!this.value) {
        this.placeholder = this.getAttribute('data-placeholder');
    }
});