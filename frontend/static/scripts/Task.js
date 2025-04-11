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
}