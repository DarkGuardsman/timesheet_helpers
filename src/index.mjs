import minimist from 'minimist'
import Lodash from 'lodash';
import {MONTHS} from "./consts.mjs";
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
    const folderPattern = Lodash.get(config, "folderPattern", "./$YEAR$/$MONTH_2$ - $MONTH_NAME$/")
    const filePattern = Lodash.get(config, "filePattern", "./$MONTH_2$_$DAY_2$_$YEAR$.md");
    const outputFolderPattern = Lodash.get(config, "outputFolderPattern", "./$YEAR$/$MONTH_2$ - $MONTH_NAME$/");
    const outputFilePattern = Lodash.get(config, "outputFilePattern", "Timesheet $RANGE_START_MONTH$-$RANGE_START_DAY$ to $RANGE_END_MONTH$-$RANGE_END_DAY$");

    const year = getYearArgument(argv);
    const monthDefault = getMonthArgument(argv);
    const range = getDateRange(argv).split("-");

    if(range.length !== 2) {
        throw new Error("range input should be month/day-month/day2; example: 8/16-9/10");
    }

    const formattingOptions = {
        PATH: logRoot,
        YEAR: year,
        MONTH: monthDefault, // 1
        MONTH_2: `${monthDefault}`.padStart(2, "0"), // 01
        MONTH_NAME: MONTHS[monthDefault - 1], // January
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
            MONTH: day.month, // 1
            MONTH_2: `${day.month}`.padStart(2, "0"), // 01
            MONTH_NAME: MONTHS[day.month - 1], // January
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

    console.log("\nFiles:")
    actualFiles.forEach((filePath) => {
        console.log(`\t${filePath}`);
    })

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

