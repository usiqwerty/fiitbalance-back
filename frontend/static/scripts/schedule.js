import { Task } from './Task.js';
import { TaskManager } from './TaskManager.js';
import { TaskEditor } from './TaskEditor.js';
import { BalanceScales } from './BalanceScales.js';


document.addEventListener('DOMContentLoaded', () => {
    const workManager = new TaskManager(document.getElementById('work-list-block'));
    const taskEditor = new TaskEditor(workManager);
    workManager.setTaskEditor(taskEditor);
    console.log(document.getElementById('work-list-block'));
    
    
    const balanceScales = new BalanceScales("#balance-scales");
    balanceScales.setValue(0.5);
});