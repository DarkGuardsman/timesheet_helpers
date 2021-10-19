import fileSystem from "fs";
import {formatTime} from "./Helpers.mjs";

/**
 * Loads the file from I/O, processes the data, and converts to objects for use.
 * @param {String} filePathIn - location on I/O
 * @return {Array.<TimeEntry>} Loaded lines
 */
export default function loadFileAsObjects(filePathIn) {
    const rawLines = loadFileAsLines(filePathIn);
    const date = filePathIn.substring(filePathIn.lastIndexOf("/"), filePathIn.length);
    //TODO write logic to extract time table from normal notes
    return processTimeTracking(date, rawLines);
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
            throw new Error(`Start date of line ${index - 1} doesn't match next line for file with date ${date}`);
        }
    }

    //TODO process to check for invalid projects

    return lineObjects
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

    return {
        index,
        event,
        type,
        project,
        date,
        startTime,
        endTime
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