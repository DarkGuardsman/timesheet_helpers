import fileSystem from "fs";
import loadFileAsObjects from "../LoadFileAsObjects.mjs";

// auto-mock fs
jest.mock('fs');

it('load file', () => {
    fileSystem.readFileSync.mockReturnValue(
        "# Date\n\n" +
        "## Time Tracking\n\n" +

        "Use excel to track duration and hours per project area\n\n" +

        "| Event | Type | Project | Start | End | Notes |\n" +
        "| - | - | - | - | - | - | - |\n" +
        "| HouseKeeping | Work | Admin | 7 AM | 7:30 AM | Email, GitLab, Jira, etc |\n" +
        "| TASK-1234 | Work | Ad-Hoc | 7:30 AM | 8:30 PM | Dropping the previous attempt |\n" +

        "## Up next \n\n" +
        "| Standup | Work | Admin | 8:30 AM | 8:30 AM | |\n" +
        "| Touchbase | Meeting | Admin | 8:30 AM | 9:00 PM |  |\n\n" +

        "## Notes \n\n" +
        "Random text containing words that should be ignored in almost all cases"
    );

    const timeEntries = loadFileAsObjects("some/path/on/local/08 - August/08_14_2021.md");
    expect(timeEntries).toEqual([
        {
            "date": "/08_14_2021.md",
            "endTime": "7:30:00 AM",
            "event": "HouseKeeping",
            "index": 0,
            "project": "Admin",
            "startTime": "7:00:00 AM",
            "type": "Work"
        },
        {
            "date": "/08_14_2021.md",
            "endTime": "8:30:00 PM",
            "event": "TASK-1234",
            "index": 1,
            "project": "Ad-Hoc",
            "startTime": "7:30:00 AM",
            "type": "Work"
        }
    ])
})