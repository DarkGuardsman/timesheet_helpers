import fileSystem from "fs";
import writeFileFromObject from "../WriteFileFromObject.mjs";

// auto-mock fs
jest.mock('fs');

it('load file', () => {
    const json = [
        {
            "file": "some/path/on/local/08 - August/08_14_2021.md",
            "date" : "08_14_2021",
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
            "projectHours": [
                {
                    "name": "Admin",
                    "hours": 0.5
                },
                {
                    "name": "Ad-Hoc",
                    "hours": 13
                }
            ],
            "timeStart": "7:00:00 AM",
            "totalHours": 13.5
        },
        {
            "file": "some/path/on/local/08 - August/08_15_2021.md",
            "date" : "08_15_2021",
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
            "projectHours": [
                {
                    "name": "Admin",
                    "hours": 0.5
                },
                {
                    "name": "Ad-Hoc",
                    "hours": 15
                }
            ],
            "timeStart": "7:00:00 AM",
            "totalHours": 15.5
        },
        {
            "file": "some/path/on/local/08 - August/08_16_2021.md",
            "date" : "08_16_2021",
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
            "projectHours": [
                {
                    "name": "Admin",
                    "hours": 0.5
                },
                {
                    "name": "Ad-Hoc",
                    "hours": 9
                }
            ],
            "timeStart": "7:00:00 AM",
            "totalHours": 9.5
        }
    ];
    writeFileFromObject("some/path/out", "Timesheet 8-14 to 8-20", json);

    expect(fileSystem.writeFileSync.mock.calls).toEqual([
        [
            "some/path/out/Timesheet 8-14 to 8-20_metadata.json",
            JSON.stringify(json, null, 2)
        ],
        [
            //File path
            "some/path/out/Timesheet 8-14 to 8-20.md",
            //Lines out
            "# Timesheet 8-14 to 8-20\n\n" +
            `Timesheet generated on ${new Date().toISOString().slice(0, 10)} from parsed note entries\n\n` +
            "## Times\n\n" +
            "### 08_14_2021\n\n" +
            "| Project | Hours |\n" +
            "| Admin | 0.5 |\n" +
            "| Ad-Hoc | 13 |\n" +
            "### 08_15_2021\n\n" +
            "| Project | Hours |\n" +
            "| Admin | 0.5 |\n" +
            "| Ad-Hoc | 15 |\n" +
            "### 08_16_2021\n\n" +
            "| Project | Hours |\n" +
            "| Admin | 0.5 |\n" +
            "| Ad-Hoc | 9 |\n"
        ]
    ]);
})