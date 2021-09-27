import date from 'date-and-time'

const timeFormatsToTry = [
    'h:mm:ss A', //1:00:00 PM
    'h:mm:ssA', //1:00:00PM
    'h:mm A', //1:00 PM
    'h:mmA', //1:00PM
    'h A', //1 PM
    'hA' //1 PM
]

/**
 * Formats time so it imports into excel like programs properly
 *
 * @param {String} timeIn- time input
 * @return {string} formatted time or original if invalid
 */
export function formatTime(timeIn) {

    //Bad data state
    if(timeIn === undefined || timeIn === null) {
        console.error("Invalid input: " + timeIn);
        return timeIn;
    }

    //Preformat time to cleanup extra leading and trailing... as well convert to upper case for things like 'am -> AM'
    const time = timeIn.trim().toUpperCase();
    if(time !== '-' && time !== '') {
        //Try to parse the time
        const timeObject = tryToParseTime(time);

        if(isNaN(timeObject)) {
            return `Err: ${timeIn}`
        }

        return date.format(timeObject, 'h:mm:ss A');
    }
    return time;
}

/**
 * Uses a series of formats in an attempt to parse the time
 *
 * @param {String} timeIn - string to parse
 * @return {Date} output
 */
function tryToParseTime(timeIn) {
    let timeObject;
    for(const format of timeFormatsToTry) {
        timeObject = date.parse(timeIn, format);
        if(!isNaN(timeObject)) {
            return timeObject;
        }
    }
    return new Date(NaN);
}
