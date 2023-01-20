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
    return Number.parseInt(value, 10);
}

export function getMonthArgument(argv) {
    const value = argv.month;
    if(value === undefined || value === null) {
        return new Date().getMonth() + 1;
    }

    // Seems to auto parse args as numeric if possible
    if(Number.isInteger(value)) {
        return value;
    }

    // Mostly exists to fix "XX "
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
    if (configPath === undefined || configPath === null) {
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
        const pathInsert = replacementOptions.PATH.endsWith("/") ? "" : "/";
        const pathSub = outputString.substring(2, outputString.length);
        outputString = `${replacementOptions.PATH}${pathInsert}${pathSub}`;
    }
    Object.keys(replacementOptions).forEach((key) => {
        const value = replacementOptions[key];
        outputString = outputString.replace(`$${key}$`, value);
    });
    return outputString;
}

