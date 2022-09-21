import fs from "fs";

export function getLogSystemRoot(argv) {
    let value = argv.logPath;
    if (value === undefined || value === null) {
        throw new Error("variable `logPath` is required")
    }
    value = value.trim();
    if (!value.endsWith("/")) {
        value += "/"
    }
    return value;
}

export function getYearArgument(argv) {
    const value = argv.year;
    if(value === undefined || value === null) {
        return new Date().getFullYear();
    }
    return Number.parseInt(value.trim(), 10);
}

export function getMonthArgument(argv) {
    const value = argv.month;
    if(value === undefined || value === null) {
        return new Date().getMonth();
    }
    return Number.parseInt(value.trim(), 10);
}

export function getDateRange(argv) {
    const value = argv.range;
    if (value === undefined || value === null) {
        throw new Error("variable `range` is required to define dates to generate")
    }
    return value.trim();
}

export function getConfig(argv, rootPath) {
    let configPath = argv.config;
    if (value === undefined || value === null) {
        configPath = `${rootPath}/timesheet-settings.json`;
    }
    else if(configPath.startsWith('./')) {
        configPath = `${rootPath}/${configPath.substring(2, configPath.length).trim()}`
    }
    else {
        configPath = configPath.trim();
    }

    console.log("Config: ", configPath);

    const rawFile = fs.readFileSync(configPath);
    return JSON.parse(rawFile);
}

export function formatPatternConfig(pattern, replacementOptions) {
    let outputString = pattern.trim();
    if(outputString.startsWith("./")) {
        outputString = `${replacementOptions.PATH}/${outputString.substring(2, outputString.length)}`;
    }
    replacementOptions.forEach((option) => {
        const {key, value} = option;
        outputString = value.replaceAll(`$${key}`, value);
    });
    return outputString;
}

