import { Task } from "./Task.js"

function isMobile() {
    return window.innerWidth <= 700
}

export class TaskEditor {
    constructor(date) {
        this.taskAddBlock = document.getElementById("task-add-block");
        this.addTaskFinalButton = document.getElementById("add-task-final-button");
        this.taskTitleInput = document.getElementById("task-title-input");
        this.taskDescriptionArea = document.getElementById("task-description-area");
        this.taskDateInput = document.getElementById("task-date-input");
        this.taskAddCard = document.getElementById("task-add-card");
        this.date = date;
        this.difficulty = 5;
        this.counterLabel = document.getElementById("difficulty-counter");
        this.plusBtn = document.getElementById("difficulty-button-plus");
        this.minusBtn = document.getElementById("difficulty-button-minus");
        this.deleteTaskBtn = document.getElementById("delete-task-final-button");
        this.nextStepBtn = document.getElementById("next-step-btn");

        this.plusBtn.addEventListener("click", () => {
            if (this.difficulty < 10) {
                this.difficulty++;
                this.counterLabel.textContent = `${this.difficulty}/10`;
            }
        })

        this.minusBtn.addEventListener("click", () => {
            if (this.difficulty > 1) {
                this.difficulty--;
                this.counterLabel.textContent = `${this.difficulty}/10`;
            }
        })

        this.addTaskFinalButton.addEventListener("click", this.handleAddTaskButtonClick.bind(this));

        this.deleteTaskBtn.addEventListener("click", () => {
            const isConfirmed = confirm("Please, confirm task delete");
            if (isConfirmed) {
                this.deleteTask();
            }
        })

        this.taskAddBlock.addEventListener("click", (event) => {
            if (!this.taskAddCard.contains(event.target)) {
                this.hide();
            }
        });
        this.stepNumber = 0;
        this.nextStepBtn.addEventListener("click", this.nextStep.bind(this));
    }

    nextStep() {
        const stepElements = this.taskAddCard.querySelectorAll(".input-step");
        if (this.stepNumber === 0 && this.taskTitleInput.value.trim() === "") {
            alert("Название задачи не может быть пустым");
            return
        }
        if (this.stepNumber === stepElements.length - 2) {
            this.nextStepBtn.textContent = "V";
        } else if (this.stepNumber === stepElements.length - 1) {
            this.nextStepBtn.textContent = "->";
            return this.handleAddTaskButtonClick()
        } else {
            this.nextStepBtn.textContent = "->";
        }
        this.showStep(++this.stepNumber);
    }

    showStep(step) {
        const stepElements = this.taskAddCard.querySelectorAll(".input-step")
        this.taskAddCard.querySelectorAll("#next-step-btn, .sign_up_button").forEach((btn) => btn.classList.add("hidden"))

        for (let i = 0; i < stepElements.length; i++) {
            if (i === step) {
                stepElements[i].classList.remove("hidden");
            } else {
                stepElements[i].classList.add("hidden");
            }
        }
    }

    async handleAddTaskButtonClick(event) {
        if (!this.isUpdate) {
            this.addTask(event);
        } else {
            this.updateTask(event);
        }
    }

    async deleteTask() {
        const response = await fetch(`/api/tasks/delete_task?task_id=${this.taskId}`, {
            method: "DELETE",
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Ошибка при удалении задачи")
        } else {
            this.taskManager.deleteTaskFromList(this.taskId);
            this.hide();
        }
    }

    async addTask(event) {
        this.hide();
        const title = this.taskTitleInput.value;
        const description = this.taskDescriptionArea.value;
        const date = this.taskDateInput.value;
        let difficulty = this.difficulty;

        console.log(this);

        if (this.taskManager.isRest) {
            difficulty = -Math.abs(difficulty);
        }

        try {
            if (title.trim() === "") {
                throw new Error("Название задачи не может быть пустым")
            }
            const response = await fetch("/api/tasks/add_task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: title,
                    text: description,
                    start: `${date}T10:00:00`,
                    end: "2023-10-01T12:00:00",
                    difficulty: difficulty,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Ошибка при создании задачи");
            }

            const createdTask = await response.json();
            if (this.date == date) {
                this.taskManager.addTaskToList(new Task(createdTask.id, title, description, difficulty, 0, 1, 0));
            }
        } catch (error) {
            console.error("Ошибка при создании задачи:", error);
            alert(`Не удалось создать задачу: ${error.message}`);
        }
    }

    async updateTask(event) {
        const title = this.taskTitleInput.value;
        const description = this.taskDescriptionArea.value;
        const date = this.taskDateInput.value;
        let difficulty = this.difficulty;

        if (this.taskManager.isRest) {
            difficulty *= -1;
        }

        try {
            if (title.trim() === "") {
                throw new Error("Название задачи не может быть пустым")
            }
            const response = await fetch("/api/tasks/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: this.taskId,
                    name: title,
                    text: description,
                    start: `${date}T10:00:00`,
                    end: "2023-10-01T12:00:00",
                    difficulty: difficulty,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Ошибка при создании задачи")
            }
            if (this.date == date) {
                this.taskManager.updateTaskInList(new Task(this.taskId, title, description, difficulty, 0, 1, 0));
            }
            this.hide()
        } catch (error) {
            console.error("Ошибка при создании задачи:", error);
            alert(`Не удалось создать задачу: ${error.message}`);
        }
    }

    hide() {
        this.taskAddBlock.classList.add("hidden");
    }

    show(taskManager, title = "", description = "", date = "", difficulty = 5, taskId = null, isUpdate = false) {
        if (taskManager.isRest) {
            document.getElementById("difficulty-label").textContent = "степень отдыха";
        } else {
            document.getElementById("difficulty-label").textContent = "сложность";
        }

        const plusButton = document.getElementById("difficulty-button-plus");
        const minusButton = document.getElementById("difficulty-button-minus");
        const plusImg = plusButton.querySelector("img");
        const minusImg = minusButton.querySelector("img");

        if (taskManager.isRest) {
            plusImg.src = "../static/resources/difficulty rest plus.svg";
            minusImg.src = "../static/resources/difficulty rest minus.svg";
        } else {
            plusImg.src = "../static/resources/difficulty task plus.svg";
            minusImg.src = "../static/resources/difficulty task minus.svg";
        }

        this.isUpdate = isUpdate;
        if (isUpdate) {
            this.deleteTaskBtn.classList.remove("hidden");
            document.getElementById("add-task-final-button").textContent = "сохранить изменения";
        } else {
            this.deleteTaskBtn.classList.add("hidden");
            document.getElementById("add-task-final-button").textContent = "добавить";
        }
        this.taskId = taskId;
        this.taskManager = taskManager;
        this.taskTitleInput.value = title;
        this.taskDescriptionArea.value = description;
        this.difficulty = Math.abs(difficulty);
        this.counterLabel.textContent = `${this.difficulty}/10`;
        if (date == "") {
            date = this.date;
        }
        this.taskDateInput.value = date;
        this.taskAddBlock.classList.remove("hidden");
        if (isMobile()) {
            this.stepNumber = 0;
            this.showStep(this.stepNumber);
        }
    }
}
