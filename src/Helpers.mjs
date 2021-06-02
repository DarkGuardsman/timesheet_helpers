
export function formatTime(time) {
    if(time !== '-' && time !== '') {
        const ending = time.substring(time.length - 2, time.length);

        return time.substring(0, time.length - 2) + ":00 " + ending.toUpperCase();
    }
    return time;
}
