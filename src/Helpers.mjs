import date from 'date-and-time'

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

        //Try 1: hour, minutes, seconds
        let timeObject = date.parse(time, 'h:mm:ss A');
        if(isNaN(timeObject)) {

            //Try 2: hour, minutes
            timeObject = date.parse(time, 'h:mm A');
            if(isNaN(timeObject)) {

                //Try 3: hour only
                timeObject = date.parse(time, 'h A');
                if(isNaN(timeObject)) {
                    return `Err: ${time}`;
                }
            }
        }

        return date.format(timeObject, 'h:mm:ss A');
    }
    return time;
}
