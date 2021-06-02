import fileSystem from 'fs';
import minimist from 'minimist'
import {formatTime} from "./Helpers.mjs";

console.log('Args', process.argv);

const argv = minimist(process.argv.slice(2));

//Arguments
const fileIn = argv.input;
const fileOut = argv.output;

console.log('INPUT', fileIn);

try {

    //Load file and convert to lines
    const rawFile = fileSystem.readFileSync(fileIn, 'utf8');
    const lines = rawFile.split("\n");


    //Process lines into file output
    let outputLines = "";
    lines.forEach((line, index) => {

        //Split line and trim to remove extra spaces
        const cells = line.split("|").map(text => text.trim());

        //We only care about the first few cells, cell zero is a non-cell due to split
        const event = cells[1];
        const type = cells[2];
        const project = cells[3];

        //Time units need to be formatted from 10:00pm to 10:00:00 PM
        const startTime = formatTime(cells[4]);
        const endTime = formatTime(cells[5]);

        //Join lines back together
        outputLines += [event, type, project, startTime, endTime].join(',');
        outputLines += "\n";
    });

    fileSystem.writeFileSync(fileOut, outputLines)

} catch (err) {
    console.error(err);
}