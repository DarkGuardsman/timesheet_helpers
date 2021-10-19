import minimist from 'minimist'
import {loadMultiFileAsObjects} from "./logic/LoadFileAsObjects.mjs";
import writeFileFromObject from "./logic/WriteFileFromObject.mjs";

console.log('Args', process.argv);

const argv = minimist(process.argv.slice(2));

//Arguments
const filesInPath = argv.input.split(",");
const outputFilePath = argv.outputPath.trim();
const outputFileName = argv.outputName.trim();

console.log('INPUT', filesInPath);

try {
    const timeEntries = loadMultiFileAsObjects(filesInPath);
    writeFileFromObject(outputFilePath, outputFileName, timeEntries);

} catch (err) {
    console.error(err);
}