import fileSystem from "fs";

/**
 * Converts the objects into lines and writes them to file
 *
 * @param {String} outputFilePath - path to write files toward
 * @param {String} outputFileName - prefix name of the file
 * @param {Array.<DayEntry>} entries - objects to write
 * @return {void}
 */
export default function writeFileFromObject(outputFilePath, outputFileName, entries) {

    const prefixPath = `${outputFilePath}${outputFilePath.endsWith("/") ? "" : "/"}${outputFileName}`
    //Output json
    const jsonOutput = JSON.stringify(entries, null, 2);
    fileSystem.writeFileSync(`${prefixPath}_metadata.json`, jsonOutput);

    //Output timesheet file
    const outputLines = entries.map(dayEntry => {
            const lines = convertProjectHoursIntoLines(dayEntry.projectHours);
            return "### " + dayEntry.date + "\n\n"
                + "| Project | Hours |\n"
                + lines.join("\n")
        }
    );
    const outputText = `# ${outputFileName}\n\n`
        + `Timesheet generated on ${new Date().toISOString().slice(0, 10)} from parsed note entries\n\n`
        + "## Times\n\n"
        + outputLines.join("\n")
        + "\n";

    fileSystem.writeFileSync(`${prefixPath}.md`, outputText);
}

function convertProjectHoursIntoLines(projectHours) {
    return projectHours.map((projectEntry) => {
        return `| ${projectEntry.name} | ${projectEntry.hours} |`;
    });
}