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

    get nextDate() {
        const date = new Date(this._currentDate);
        date.setDate(date.getDate() + 1);
        return date;
    }

    _formatDate(date) {
        const day = date.getDate();
        const month = date.toLocaleString('en', { month: 'short' });
        const year = date.getFullYear();

        let suffix = 'th';
        if (day % 10 === 1 && day !== 11) suffix = 'st';
        if (day % 10 === 2 && day !== 12) suffix = 'nd';
        if (day % 10 === 3 && day !== 13) suffix = 'rd';

        return `${day}${suffix} ${month} ${year}`;
    }

    updateDisplayedDates() {
        document.getElementById('prev-date').textContent = `${this._formatDate(this.prevDate)}`;
        document.getElementById('prev-date').href = `/schedule?date=${this.formatDateToHrefFormat(this.prevDate)}`
        console.log(this.formatDateToHrefFormat(this.prevDate));
        // document.getElementById('current-date').textContent = this._formatDate(this._currentDate);
        document.getElementById('next-date').textContent = `${this._formatDate(this.nextDate)}`;
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
