/**
 * @typedef DayEntry
 *
 * @property {String} file - I/O location the file was loaded from
 * @property {String} date - formatted date
 * @property {Array.<TimeEntry>} timeEntries - array of individual time logs
 * @property {Array.<ProjectEntry>} projectHours - project key to hour string
 * @property {Number} totalHours - total of the entire day, minus '(OOO) Out of Office'
 * @property {Number} outOfOffice - hours taking breaks or not in office between work times
 * @property {String} timeStart - start of day
 * @property {String} timeEnd - end of day
 */