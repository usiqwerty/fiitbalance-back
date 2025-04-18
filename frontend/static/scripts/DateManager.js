export class DateManager {
    constructor() {
        this._currentDate = this._parseUrlDate();
    }


    _parseUrlDate() {
        const params = new URLSearchParams(window.location.search);
        const dateStr = params.get('date');
        return dateStr ? new Date(dateStr) : new Date();
    }


    get apiDate() {
        return this._currentDate.toISOString().split('T')[0];
    }


    get formattedDate() {
        const day = this._currentDate.getDate();
        const month = this._currentDate.toLocaleString('en', { month: 'long' });
        
        let suffix = 'th';
        if (day % 10 === 1 && day !== 11) suffix = 'st';
        if (day % 10 === 2 && day !== 12) suffix = 'nd';
        if (day % 10 === 3 && day !== 13) suffix = 'rd';

        return `${day}${suffix} Of ${month}`;
    }


    get navigationDates() {
        return {
            prev: new Date(this._currentDate.setDate(this._currentDate.getDate() - 1)),
            next: new Date(this._currentDate.setDate(this._currentDate.getDate() + 2))
        };
    }

    updateBrowserUrl(date) {
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('date', date.toISOString().split('T')[0]);
        window.history.pushState({}, '', newUrl);
    }
    initDateNavigation() {
        document.getElementById('prev-date').addEventListener('click', (e) => {
            e.preventDefault();
            this._currentDate.setDate(this._currentDate.getDate() - 1);
            this.updateBrowserUrl(this._currentDate);
            this.onDateChange();
        });

        document.getElementById('next-date').addEventListener('click', (e) => {
            e.preventDefault();
            this._currentDate.setDate(this._currentDate.getDate() + 1);
            this.updateBrowserUrl(this._currentDate);
            this.onDateChange();
        });
    }

    onDateChange(callback) {
        this._dateChangeCallback = callback;
    }
}
