export class Task {
    constructor(id, name, text, difficulty, start, end, domElement) {
        this.id = id;
        this.name = name;
        this.text = text;
        this.start = start;
        this.end = end;
        this.difficulty = difficulty;
        this.domElement = domElement;
    }

    updateFields(newTask){
        this.name = newTask.name;
        this.text = newTask.text;
        this.start = newTask.start;
        this.end = newTask.end;
        this.difficulty = newTask.difficulty;
        this.domElement = newTask.domElement;
    }
}