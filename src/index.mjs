import minimist from 'minimist'
import loadFileAsObjects from "./logic/LoadFileAsObjects.mjs";
import writeFileFromObject from "./logic/WriteFileFromObject.mjs";

console.log('Args', process.argv);

const argv = minimist(process.argv.slice(2));

//Arguments
const fileInPath = argv.input;
const fileOutPath = argv.output;

console.log('INPUT', fileInPath);

try {
    const timeEntries = loadFileAsObjects(fileInPath);
    writeFileFromObject(fileOutPath, timeEntries);

} catch (err) {
    console.error(err);
}