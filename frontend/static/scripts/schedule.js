import { Task } from './Task.js';
import { TaskManager } from './TaskManager.js';
import { TaskEditor } from './TaskEditor.js';
import { BalanceScales } from './BalanceScales.js';


document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const dateParam = params.get('date');

    const workManager = new TaskManager(document.getElementById('work-list-block'), dateParam, false);
    const taskEditor = new TaskEditor(dateParam);
    workManager.setTaskEditor(taskEditor);

    const restManager = new TaskManager(document.getElementById('rest-list-block'), dateParam, true);
    restManager.setTaskEditor(taskEditor);
    
    
    const balanceScales = new BalanceScales("#balance-scales");
    function updateGlobalBalance() {
        const allTasks = [...workManager.addedTasksList, ...restManager.addedTasksList];
        balanceScales.updateBalance(allTasks);
    }
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
});

const dateInput = document.getElementById('look-date-input');
    dateInput.addEventListener('input', function(event) {
    const selectedDate = event.target.value;
    const redirectUrl = `/schedule?date=${selectedDate}`;
    window.location.href = redirectUrl;
});