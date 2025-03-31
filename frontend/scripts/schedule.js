const addTaskButton = document.getElementById('add-task-button');
const addRestButton = document.getElementById('add-rest-button');

const taskAddBlock = document.getElementById('task-add-block');
const restAddBlock = document.getElementById('rest-add-block');

const taskAddCard = document.getElementById('task-add-card');
const restAddCard = document.getElementById('rest-add-card');

addTaskButton.onclick = function() { taskAddBlock.classList.remove("hidden") };
addRestButton.onclick = function() { restAddBlock.classList.remove("hidden") };

taskAddBlock.addEventListener('click', (event) => {
    if (!taskAddCard.contains(event.target)) {
        taskAddBlock.classList.add("hidden");
    }
});
restAddBlock.addEventListener('click', (event) => {
    if (!restAddCard.contains(event.target)) {
        restAddBlock.classList.add("hidden");
    }
});


const taskListEntry = document.getElementById('task-entry-samlpe')
const taskList= document.getElementById('task-list')

function addTaskToList(taskLabel, taskDifficulty, deadline) {
    const newElem = taskList.appendChild(taskListEntry.cloneNode(true));
    newElem.getElementsByClassName('task-label')[0].innerText = taskLabel;
    newElem.getElementsByClassName('task-difficulty')[0].innerText = `${taskDifficulty}`;
    newElem.querySelector('.task-deadline').textContent = deadline;
    newElem.classList.remove("hidden");
    newElem.id = '';
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
}

const addTaskFinalButton = document.getElementById('add-task-final-button');
const taskTitleInput = document.getElementById('task-title-input');
const taskDescriptionArea = document.getElementById('task-description-area');
const taskDeadlineInput = document.getElementById('task-deadline-input');

addTaskFinalButton.addEventListener('click', (event) => {
    const title = taskTitleInput.value;
    const description = taskDescriptionArea.value;
    const deadline = taskDeadlineInput.value;
    const difficulty = 0;
    addTaskToList(title, difficulty, deadline);
    taskAddBlock.classList.add("hidden");
})

const addRestFinalButton = document.getElementById('add-rest-final-button');
const restTitleInput = document.getElementById('rest-title-input');
const restDescriptionArea = document.getElementById('rest-description-area');
const restDeadlineInput = document.getElementById('rest-deadline-input');

addRestFinalButton.addEventListener('click', (event) => {
    const title = restTitleInput.value;
    const description = restDescriptionArea.value;
    const deadline = restDeadlineInput.value;
    const difficulty = 0;
    addRestToList(title, difficulty, deadline);
    restAddBlock.classList.add("hidden");
})