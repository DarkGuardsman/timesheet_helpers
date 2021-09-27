import fileSystem from "fs";
import {formatTime} from "./Helpers.mjs";

/**
 * Loads the file from I/O, processes the data, and converts to objects for use.
 * @param {String} filePathIn - location on I/O
 *
 */
export default function loadFileAsObjects(filePathIn) {
    const lines = loadFileAsLines(filePathIn);
    //TODO write logic to extract time table from normal notes
    return processTimeTracking(lines);
}

/**
 * Processes the time tracking table into usable data
 * @param {String} lines
 */
function processTimeTracking(lines) {
    //TODO process to look for missing time gaps
    //TODO process to check for invalid projects
    return lines
        .map(processTimeTrackingLine)
        .filter(line => line !== undefined);
}

/**
 * Converts the line into an object
 *
 * @param {String} line - line from table
 * @param {Number} index - position from table
 * @return {TimeEntry} object with data from the line
 */
function processTimeTrackingLine(line, index) {

    //Ignore empty lines
    if(line === null || line === undefined || line.trim() === '') {
        return undefined;
    }

    //Split line and trim to remove extra spaces
    const cells = line.split("|").map(text => text.trim());

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
    return rawFile.split("\n");
}