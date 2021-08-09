
export function formatTime(time) {
    if(time === undefined || time === null) {
        console.error("Invalid input: " + time)
    }
    else if(time !== '-' && time !== '') {
        const ending = time.substring(time.length - 2, time.length);

        return time.substring(0, time.length - 2).trim() + ":00 " + ending.toUpperCase();
    }
    return time;
}
