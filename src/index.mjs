import minimist from 'minimist'
import {get} from 'lodash';
import {MONTHS} from "./consts.js";
import {
    formatPatternConfig,
    getConfig,
    getDateRange,
    getLogSystemRoot,
    getMonthArgument,
    getYearArgument
} from "./inputs.mjs";
import {convertRangeIntoDates} from "./logic/DateRangeInput.mjs";
import {loadMultiFileAsObjects} from "./logic/LoadFileAsObjects.mjs";
import writeFileFromObject from "./logic/WriteFileFromObject.mjs";
import fs from "fs";

console.log('Args', process.argv);

const argv = minimist(process.argv.slice(2));

//Mode 2: uses a config to auto generate most of the variables based on simplified data range input
if(argv.mode === "2" || argv.mode === null || argv.mode === undefined) {
    const logRoot = getLogSystemRoot(argv);
    const config= getConfig(argv, logRoot);
    const folderPattern = get(config, "folderPattern", "./$YEAR/$MONTH_2 - $MONTH_NAME/")
    const filePattern = get(config, "filePattern", "./$MONTH_2_$DAY_2_$YEAR.md");
    const outputFolderPattern = get(config, "outputFolderPattern", "./$YEAR/$MONTH_2 - $MONTH_NAME/");
    const outputFilePattern = get(config, "outputFilePattern", "Timesheet $RANGE_START - $RANGE_END");

    const year = getYearArgument(argv);
    const month = getMonthArgument(argv);
    const range = getDateRange(argv).split("-");

    if(range.length !== 2) {
        throw new Error("range input should be month/day-month/day2; example: 8/16-9/10");
    }

    const formattingOptions = {
        PATH: logRoot,
        YEAR: year,
        MONTH: month, // 1
        MONTH_2: `${month}`.padStart(2, "0"), // 01
        MONTH_NAME: MONTHS[month - 1], // January
        RANGE: range, // 1/1-1/5
        RANGE_START: range[0],
        RANGE_END: range[1]
    }

    const outputFolderPath = formatPatternConfig(outputFolderPattern, formattingOptions);
    const outputFileName = formatPatternConfig(outputFilePattern, formattingOptions);

    const days = convertRangeIntoDates(range[0], range[1], year);

    const possibleFiles = days.map(day => {
        const formatDayOptions = {
            ...formattingOptions,
            MONTH: month, // 1
            MONTH_2: `${month}`.padStart(2, "0"), // 01
            MONTH_NAME: MONTHS[month - 1], // January
            DAY: day.day,
            DAY_2: `${day.day}`.padStart(2, "0")
        };
        const folder = formatPatternConfig(folderPattern, formatDayOptions);
        return formatPatternConfig(filePattern, {
            ...formatDayOptions,
            PATH: folder
        })
    });

    const actualFiles = possibleFiles.filter(path => fs.existsSync(path));

    try {
        const timeEntries = loadMultiFileAsObjects(actualFiles);
        writeFileFromObject(outputFolderPath, outputFileName, timeEntries);

    } catch (err) {
        console.error(err);
    }
}
//Legacy mode
else if(argv.mode === "1")  {
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
}
else {
    console.error(`unknown mode: ${args.mode}`);
}

