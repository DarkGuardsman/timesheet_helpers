import fileSystem from "fs";
import {loadFileAsObjects, loadMultiFileAsObjects} from "../LoadFileAsObjects.mjs";

// auto-mock fs
jest.mock('fs');

it('load single file', () => {
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
    expect(timeEntries).toEqual(
        {
            "date": "08_14_2021",
            "file": "some/path/on/local/08 - August/08_14_2021.md",
            "projectHours": [
                {
                    "hours": 0.5,
                    "name": "admin"
                },
                {
                    "hours": 13,
                    "name": "ad-hoc"
                }
            ],
            "timeEnd": "8:30:00 PM",
            "timeEntries": [
                {
                    "date": "08_14_2021",
                    "endTime": "7:30:00 AM",
                    "event": "HouseKeeping",
                    "index": 0,
                    "project": "Admin",
                    "startTime": "7:00:00 AM",
                    "timeAsHours": 0.5,
                    "timeAsMinutes": 30,
                    "type": "Work"
                },
                {
                    "date": "08_14_2021",
                    "endTime": "8:30:00 PM",
                    "event": "TASK-1234",
                    "index": 1,
                    "project": "Ad-Hoc",
                    "startTime": "7:30:00 AM",
                    "timeAsHours": 13,
                    "timeAsMinutes": 780,
                    "type": "Work"
                }
            ],
            "timeStart": "7:00:00 AM",
            "totalHours": 13.5
        }
    );
});

it('load several files', () => {
    fileSystem.readFileSync
        .mockReturnValueOnce(
            "# Date\n\n" +
            "## Time Tracking\n\n" +

            "Use excel to track duration and hours per project area\n\n" +

            "| Event | Type | Project | Start | End | Notes |\n" +
            "| - | - | - | - | - | - | - |\n" +
            "| HouseKeeping | Work | Admin | 7 AM | 7:30 AM | Email, GitLab, Jira, etc |\n" +
            "| TASK-1234 | Work | Ad-Hoc | 7:30 AM | 4:30 PM | Dropping the previous attempt |\n" +
            "| TASK-1235 | Work | Ad-Hoc | 4:30 PM | 8:30 PM | Dropping the previous attempt |\n" +

            "## Up next \n\n" +
            "| Standup | Work | Admin | 8:30 AM | 8:30 AM | |\n" +
            "| Touchbase | Meeting | Admin | 8:30 AM | 9:00 PM |  |\n\n" +

            "## Notes \n\n" +
            "Random text containing words that should be ignored in almost all cases"
        )
        .mockReturnValueOnce(
            "# Date\n\n" +
            "## Time Tracking\n\n" +

            "Use excel to track duration and hours per project area\n\n" +

            "| Event | Type | Project | Start | End | Notes |\n" +
            "| - | - | - | - | - | - | - |\n" +
            "| HouseKeeping | Work | Admin | 7 AM | 7:30 AM | Email, GitLab, Jira, etc |\n" +
            "| TASK-1234 | Work | Ad-Hoc | 7:30 AM | 10:30 PM |  |\n" +

            "## Up next \n\n" +
            "| Standup | Work | Admin | 8:30 AM | 8:30 AM | |\n" +
            "| Touchbase | Meeting | Admin | 8:30 AM | 9:00 PM |  |\n\n" +

            "## Notes \n\n" +
            "Random text containing words that should be ignored in almost all cases"
        )
        .mockReturnValueOnce(
            "# Date\n\n" +
            "## Time Tracking\n\n" +

            "Use excel to track duration and hours per project area\n\n" +

            "| Event | Type | Project | Start | End | Notes |\n" +
            "| - | - | - | - | - | - | - |\n" +
            "| HouseKeeping | Work | Admin | 7 AM | 7:30 AM | Email, GitLab, Jira, etc |\n" +
            "| TASK-1234 | Work | Ad-Hoc | 7:30 AM | 4:30 PM |  |\n" +

            "## Up next \n\n" +
            "| Standup | Work | Admin | 8:30 AM | 8:30 AM | |\n" +
            "| Touchbase | Meeting | Admin | 8:30 AM | 9:00 PM |  |\n\n" +

            "## Notes \n\n" +
            "Random text containing words that should be ignored in almost all cases"
        );


    const timeEntries = loadMultiFileAsObjects([
            "some/path/on/local/08 - August/08_14_2021.md",
            "some/path/on/local/08 - August/08_15_2021.md",
            "some/path/on/local/08 - August/08_16_2021.md"
        ]
    );
    expect(timeEntries).toEqual(
        [
            {
                "date": "08_14_2021",
                "file": "some/path/on/local/08 - August/08_14_2021.md",
                "projectHours": [
                    {
                        "hours": 0.5,
                        "name": "admin"
                    },
                    {
                        "hours": 13,
                        "name": "ad-hoc"
                    }
                ],
                "timeEnd": "8:30:00 PM",
                "timeEntries": [
                    {
                        "date": "08_14_2021",
                        "endTime": "7:30:00 AM",
                        "event": "HouseKeeping",
                        "index": 0,
                        "project": "Admin",
                        "startTime": "7:00:00 AM",
                        "timeAsHours": 0.5,
                        "timeAsMinutes": 30,
                        "type": "Work"
                    },
                    {
                        "date": "08_14_2021",
                        "endTime": "4:30:00 PM",
                        "event": "TASK-1234",
                        "index": 1,
                        "project": "Ad-Hoc",
                        "startTime": "7:30:00 AM",
                        "timeAsHours": 9,
                        "timeAsMinutes": 540,
                        "type": "Work"
                    },
                    {
                        "date": "08_14_2021",
                        "endTime": "8:30:00 PM",
                        "event": "TASK-1235",
                        "index": 2,
                        "project": "Ad-Hoc",
                        "startTime": "4:30:00 PM",
                        "timeAsHours": 4,
                        "timeAsMinutes": 240,
                        "type": "Work"
                    }
                ],
                "timeStart": "7:00:00 AM",
                "totalHours": 13.5
            },
            {
                "date": "08_15_2021",
                "file": "some/path/on/local/08 - August/08_15_2021.md",
                "projectHours": [
                    {
                        "hours": 0.5,
                        "name": "admin"
                    },
                    {
                        "hours": 15,
                        "name": "ad-hoc"
                    }
                ],
                "timeEnd": "10:30:00 PM",
                "timeEntries": [
                    {
                        "date": "08_15_2021",
                        "endTime": "7:30:00 AM",
                        "event": "HouseKeeping",
                        "index": 0,
                        "project": "Admin",
                        "startTime": "7:00:00 AM",
                        "timeAsHours": 0.5,
                        "timeAsMinutes": 30,
                        "type": "Work"
                    },
                    {
                        "date": "08_15_2021",
                        "endTime": "10:30:00 PM",
                        "event": "TASK-1234",
                        "index": 1,
                        "project": "Ad-Hoc",
                        "startTime": "7:30:00 AM",
                        "timeAsHours": 15,
                        "timeAsMinutes": 900,
                        "type": "Work"
                    }
                ],
                "timeStart": "7:00:00 AM",
                "totalHours": 15.5
            },
            {
                "date": "08_16_2021",
                "file": "some/path/on/local/08 - August/08_16_2021.md",
                "projectHours": [
                    {
                        "hours": 0.5,
                        "name": "admin"
                    },
                    {
                        "hours": 9,
                        "name": "ad-hoc"
                    }
                ],
                "timeEnd": "4:30:00 PM",
                "timeEntries": [
                    {
                        "date": "08_16_2021",
                        "endTime": "7:30:00 AM",
                        "event": "HouseKeeping",
                        "index": 0,
                        "project": "Admin",
                        "startTime": "7:00:00 AM",
                        "timeAsHours": 0.5,
                        "timeAsMinutes": 30,
                        "type": "Work"
                    },
                    {
                        "date": "08_16_2021",
                        "endTime": "4:30:00 PM",
                        "event": "TASK-1234",
                        "index": 1,
                        "project": "Ad-Hoc",
                        "startTime": "7:30:00 AM",
                        "timeAsHours": 9,
                        "timeAsMinutes": 540,
                        "type": "Work"
                    }
                ],
                "timeStart": "7:00:00 AM",
                "totalHours": 9.5
            }
        ]
    );
})