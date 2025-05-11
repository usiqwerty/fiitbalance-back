export class DateManager {
    constructor() {
        const parsedDate = this._parseUrlDate();
        if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
            console.error("Invalid date, falling back to current date");
            this._currentDate = new Date();
        } else {
            this._currentDate = parsedDate;
        }
    }

    _parseUrlDate() {
        const urlParams = new URLSearchParams(window.location.search);
        let dateStr = urlParams.get('date');

        if (!dateStr) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            dateStr = hashParams.get('date');
        }

        const parsedDate = dateStr ? new Date(dateStr) : new Date();

        return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    }

    updateBrowserUrl(date) {
        const newUrl = new URL(window.location);
        newUrl.hash = '';
        newUrl.searchParams.set('date', date.toISOString().split('T')[0]);
        window.history.pushState({}, '', newUrl);
    }

    get prevDate() {
        const date = new Date(this._currentDate);
        date.setDate(date.getDate() - 1);
        return date;
    }
    get currentDate() {
        return new Date(this._currentDate);;
    }

    get nextDate() {
        const date = new Date(this._currentDate);
        date.setDate(date.getDate() + 1);
        return date;
    }

    formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0'); // День с ведущим нулём
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц с ведущим нулём (+1, так как месяцы начинаются с 0)
        const year = date.getFullYear();
    
        return `${day}.${month}.${year}`;
    }
    

    updateDisplayedDates() {
        document.getElementById('prev-date').textContent = `${this.formatDate(this.prevDate)}`;
        document.getElementById('prev-date').href = `/schedule?date=${this.formatDateToHrefFormat(this.prevDate)}`
        console.log(this.formatDateToHrefFormat(this.prevDate));
        document.getElementById('week-stats').href = `/weekStat?date=${this.formatDateToHrefFormat(this.currentDate)}`
        document.getElementById('next-date').textContent = `${this.formatDate(this.nextDate)}`;
        document.getElementById('next-date').href = `/schedule?date=${this.formatDateToHrefFormat(this.nextDate)}`
    }

    formatDateToHrefFormat(date) {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    onDateChange(callback) {
        this._dateChangeCallback = callback;
    }

    initDateNavigation() {
        document.getElementById('prev-date').addEventListener('click', (e) => {
            e.preventDefault();
            this._currentDate = this.prevDate;
            this.updateBrowserUrl(this._currentDate);
            this._dateChangeCallback?.();
            this.updateDisplayedDates();
        });

        document.getElementById('next-date').addEventListener('click', (e) => {
            e.preventDefault();
            this._currentDate = this.nextDate;
            this.updateBrowserUrl(this._currentDate);
            this._dateChangeCallback?.();
            this.updateDisplayedDates();
        });
    }

    get apiDate() {
        return this._currentDate.toISOString().split('T')[0];
    }
}
