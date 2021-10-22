import minimist from 'minimist'
import {loadMultiFileAsObjects} from "./logic/LoadFileAsObjects.mjs";
import writeFileFromObject from "./logic/WriteFileFromObject.mjs";

console.log('Args', process.argv);

const argv = minimist(process.argv.slice(2));

//Arguments
const filesInPath = argv.input.split(","); //Inputs
const inputFilePath = argv.inputPath != null ? argv.inputPath.trim() : ""; //Prefix for inputs
const outputFilePath = argv.outputPath.trim(); //Prefix for output path
const outputFileName = argv.outputName.trim(); //File name prefix for output

if(outputFileName.indexOf("/") !== -1) {
    throw new Error("Output name contains file path '/'");
}

console.log('INPUT', filesInPath);

try {
    const timeEntries = loadMultiFileAsObjects(filesInPath.map(path => `${inputFilePath}${path}`));
    writeFileFromObject(outputFilePath, outputFileName, timeEntries);

} catch (err) {
    console.error(err);
}