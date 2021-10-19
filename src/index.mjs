import minimist from 'minimist'
import {loadMultiFileAsObjects} from "./logic/LoadFileAsObjects.mjs";
import writeFileFromObject from "./logic/WriteFileFromObject.mjs";

console.log('Args', process.argv);

const argv = minimist(process.argv.slice(2));

//Arguments
const filesInPath = argv.input.split(",");
const fileOutPath = argv.output;

console.log('INPUT', filesInPath);
console.log('OUTPUT', fileOutPath);

try {
    const timeEntries = loadMultiFileAsObjects(filesInPath);
    writeFileFromObject(fileOutPath, timeEntries);

} catch (err) {
    console.error(err);
}