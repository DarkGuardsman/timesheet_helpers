import fileSystem from "fs";

/**
 * Converts the objects into lines and writes them to file
 *
 * @param {String} fileOutPath - path to write towards
 * @param {TimeEntry} entries - objects to write
 * @return {void}
 */
export default function writeFileFromObject(fileOutPath, entries) {
    const outputLines = entries.map(entry => {
        const {event, type, project, startTime, endTime} = entry;
        return `${event},${type},${project},${startTime},${endTime}`;
    }).join("\n");

    fileSystem.writeFileSync(fileOutPath, outputLines);
}