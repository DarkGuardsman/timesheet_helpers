import fileSystem from "fs";
import dateTime from 'date-and-time'
import lodash from "lodash";
import {formatTime, outputFormat} from "./Helpers.mjs";

/**
 * Loads the list of file from I/O, processes the data, and converts to objects for use.
 * @param {Array.<String>} filesInPath - locations on I/O
 * @return {Array.<DayEntry>} Loaded lines
 */
export function loadMultiFileAsObjects(filesInPath) {
    return filesInPath.map(path => loadFileAsObjects(path));
}

/**
 * Loads the file from I/O, processes the data, and converts to objects for use.
 * @param {String} filePathIn - location on I/O
 * @return {DayEntry} Loaded lines
 */
export function loadFileAsObjects(filePathIn) {
    const rawLines = loadFileAsLines(filePathIn);
    const date = filePathIn.substring(filePathIn.lastIndexOf("/") + 1, filePathIn.lastIndexOf(".md"));

    //Collect entry objects
    const timeEntries = processTimeTracking(date, rawLines);

    //Convert to project entries
    const projectHours = processProjectTimes(timeEntries);

    const oooEntry = projectHours.filter(etr => etr.name === "OOO");
    const outOfOffice = oooEntry.length === 0 ? 0 : oooEntry[0].hours;

    return {
        file: filePathIn,
        date,
        timeEntries,
        projectHours,
        outOfOffice,
        timeStart: timeEntries[0].startTime,
        timeEnd: timeEntries[timeEntries.length - 1].endTime,
        totalHours: lodash.sum(timeEntries.map(entry => entry.timeAsHours)) - outOfOffice
    }
}

/**
 * Summarizes the time entries by project
 *
 * @param {Array.<TimeEntry>} timeEntries
 * @return {Array.<ProjectEntry>} project entries
 */
function processProjectTimes(timeEntries) {
    const asProjects = timeEntries.map(entry => {
        const name = entry.project.toLowerCase();
        return {
            name: name === "-" ? "OOO" : name,
            hours: entry.timeAsHours
        }
    });
    const projectMap = lodash.groupBy(asProjects, "name");
    return Object.keys(projectMap)
        .filter(key => key !== 'gap') //Ignore actual gaps
        .map(key => {
            const hours = lodash.sum(projectMap[key].map(etr => etr.hours));
            return {
                name: key,
                hours
            }
        })
}

/**
 * Processes the time tracking table into usable data
 * @param {String} date - day
 * @param {Array.<String>} lines
 * @return {Array.<TimeEntry>} Loaded lines
 */
function processTimeTracking(date, lines) {

    //Convert string lines into objects for easier processing
    const lineObjects = lines
        .map((line, index) => processTimeTrackingLine(date, line, index))
        .filter(line => line !== undefined);

    //Validate times match
    for (let index = 1; index < lineObjects.length; index++) {
        const prevEntry = lineObjects[index - 1].endTime;
        const entry = lineObjects[index].startTime;

        if (prevEntry !== entry) {
            throw new Error(`Start date of line ${index - 1} doesn't match next line for file with date ${date}. Line: ${prevEntry} .. ${entry}`);
        }
    }

    //TODO process to check for invalid projects
    //TODO check for time bleeding over into the next day Ex: 11:00pm - 1:20 am

    return lineObjects.filter(etr => etr.project.toLowerCase() !== 'gap')
}

/**
 * Converts the line into an object
 *
 * @param {String} date - day
 * @param {String} line - line from table
 * @param {Number} index - position from table
 * @return {TimeEntry} object with data from the line
 */
function processTimeTrackingLine(date, line, index) {

    //Ignore empty lines
    if (line === null || line === undefined || line.trim() === '') {
        return undefined;
    }

    //Split line and trim to remove extra spaces
    const cells = line.split("|")
        .map(text => text.trim());

    //validation to notify user to fix issues with files
    if (cells.length !== 8) { // 6 cells, 1 empty front and 1 empty end due to split of '|'
        throw new Error(`Invalid format for line ${index} for file with date ${date}. Should contain 8 splices but has ${cells.length} cells. Line: ${line}`);
    }

    //We only care about the first few cells, cell zero is a non-cell due to split
    const event = cells[1];
    const type = cells[2];
    const project = cells[3];

    //Time units need to be formatted from 10:00 pm to 10:00:00 PM
    const startTime = formatTime(cells[4]);
    const endTime = formatTime(cells[5]);

    //Calculate time passed as minutes
    const startTimeObject = dateTime.parse(startTime, outputFormat);
    const endTimeObject = dateTime.parse(endTime, outputFormat);
    const timeDelta = (endTimeObject.getTime() - startTimeObject.getTime()) / (1000 * 60); // 1000 -> ms to s, 60 -> s to minutes

    return {
        index,
        event,
        type,
        project,
        date,
        startTime,
        endTime,
        timeAsHours: timeDelta / 60,
        timeAsMinutes: timeDelta
    }
}

/**
 *
 * @param {String} filePathIn - path to file
 * @return {Array.<String>} lines from the file
 */
function loadFileAsLines(filePathIn) {
    const rawFile = fileSystem.readFileSync(filePathIn, 'utf8'); //TODO error handling?

    //Extract just the time entry area
    const trackingHeaderTarget = "## Time Tracking";
    const trackingHeader = rawFile.indexOf(trackingHeaderTarget) + trackingHeaderTarget.length; //Offset by length so we start after
    const nextHeader = rawFile.indexOf("##", trackingHeader);

    if (nextHeader === -1) {
        throw new Error(`Failed to parse time tracking section due to missing second header. File: ${filePathIn}`);
    }

    const timeTrackingArea = rawFile.substring(trackingHeader, nextHeader);

    const tableStart = timeTrackingArea.indexOf("|");
    const tableEnd = timeTrackingArea.lastIndexOf("|");
    const tableText = timeTrackingArea.substring(tableStart, tableEnd + 1);

    const tableLines = tableText.split("\n");

    return tableLines.splice(2, tableLines.length + 1);
}