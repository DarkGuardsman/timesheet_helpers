/**
 * Converts the start and end range into usable dates
 *
 * @param {String} start - range start, `month/day`  ex `8/16`
 * @param {String} end - range end, `month/day`  ex `8/20`
 * @param {Number} year - processing year
 * @return {Array.<{month: number, day: number}>} dates
 */
export function convertRangeIntoDates(start, end, year) {
    const startDate = parseDateRange(start, year);
    const endDate = parseDateRange(end, year);

    //Months match, so count days
    if(startDate.month === endDate.month) {
        //Edge case, shouldn't happen as why use a generator
        if(startDate.day === endDate.day) {
            return [{
                day: startDate.day,
                month: startDate.month
            }];
        }
        else if(startDate.day < endDate.day) {
            const out = [];
            generateDays(startDate.month, startDate.day, endDate.day, out);
            return out;
        }
        throw new Error(`Invalidate date range; start.day is older than end.day ${start}-${end}`);
    }
    else if(startDate.month < endDate.month) {
        const months = endDate.month - startDate.month;
        const out = []
        for(let m = 0; m <= months; m++) {
            const month = startDate.month + m;
            const startDay = month === startDate.month ? startDate.day : 1;
            const endDay = month === endDate.month ? endDate.day : daysInMonth(month, year)
            generateDays(month, startDay, endDay, out);
        }
        return out;
    }
    throw new Error(`Invalidate date range; start is older than end ${start}-${end}`);
}

/**
 * Generates an array of days for a given month from start to end point
 *
 * Does not validate max day, only that start and end delta result in a positive value
 *
 * @param {Number} month - month to use
 * @param {Number} startDay - day to start
 * @param {Number} endDay - day to end
 * @param {Array.<{day: Number, month: Number}>} out - array to populate
 */
export function generateDays(month, startDay, endDay, out) {
    const days = endDay - startDay;

    if(days <= 0) {
        throw new Error(`Invalid start(${startDay}) and end(${endDay}) days; Delta=${days}`)
    }

    // Add days, Inclusive of both start and end
    for(let i = 0; i <= days; i++) {
        out.push({
            month: month,
            day: startDay + i
        })
    }
}

/**
 * Converts the string date into a usable object
 *
 * @param {String} range - `month/day`  ex `8/16`
 * @param {Number} year - year of processing
 * @return {{maxDays: number, month: number, day: number}} object for use
 */
export function parseDateRange(range, year) {
    const [monthString, dayString] = range.split("/"); //TODO make handle year as part of split

    const month = Number.parseInt(monthString);
    const day = Number.parseInt(dayString);

    const maxDays = daysInMonth(month, year);
    if(day > maxDays) {
        throw new Error(`Invalidate date range; day is outside month max(${maxDays}); input: ${range}, ${year}`);
    }

    return {
        month,
        day,
        maxDays
    }
}

/**
 * Gets days in the month
 *
 * @param {Number} month - starting at 1 for january
 * @param {Number} year - year
 * @return {number} days in the month
 */
export function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}