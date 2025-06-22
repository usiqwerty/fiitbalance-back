export class DateManager {
    static LINKS = [
        { id: 'prev-date',         dateKey: 'prevDate'  },
        { id: 'prev-date-mobile',  dateKey: 'prevDate'  },
        { id: 'next-date',         dateKey: 'nextDate'  },
        { id: 'next-date-mobile',  dateKey: 'nextDate'  },
    ];

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
        return new Date(this._currentDate);
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
        DateManager.LINKS.forEach(({ id, dateKey }) => {
            const el = document.getElementById(id);
            if (!el) return;
            const d = this[dateKey];
            el.textContent = this.formatDate(d);
            el.href        = `/schedule?date=${this.formatDateToHrefFormat(d)}`;
        });

        const ws = document.getElementById('week-stats');
        if (ws) {
            ws.href = `/weekStat?date=${this.formatDateToHrefFormat(this.currentDate)}`;
        }
    }

    formatDateToHrefFormat(date) {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    onDateChange(callback) {
        this._dateChangeCallback = callback;
    }

    initDateNavigation() {
        DateManager.LINKS.forEach(({ id, dateKey }) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('click', e => {
                e.preventDefault();
                this._currentDate = this[dateKey];
                this.updateBrowserUrl(this._currentDate);
                this._dateChangeCallback?.();
                this.updateDisplayedDates();
            });
        });
    }

    get apiDate() {
        return this._currentDate.toISOString().split('T')[0];
    }
}
