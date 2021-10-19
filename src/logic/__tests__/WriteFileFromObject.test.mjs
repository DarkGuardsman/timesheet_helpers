import fileSystem from "fs";
import writeFileFromObject from "../WriteFileFromObject.mjs";

// auto-mock fs
jest.mock('fs');

it('load file', () => {
    const json = [
        {
            "date": "08_14_2021",
            "file": "some/path/on/local/08 - August/08_14_2021.md",
            "outOfOffice": 0,
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
            "outOfOffice": 0,
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
            "outOfOffice": 1,
            "projectHours": [
                {
                    "hours": 0.5,
                    "name": "admin"
                },
                {
                    "hours": 8,
                    "name": "ad-hoc"
                },
                {
                    "hours": 1,
                    "name": "OOO"
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
                    "endTime": "12:35:00 PM",
                    "event": "TASK-1234",
                    "index": 1,
                    "project": "Ad-Hoc",
                    "startTime": "7:30:00 AM",
                    "timeAsHours": 5.083333333333333,
                    "timeAsMinutes": 305,
                    "type": "Work"
                },
                {
                    "date": "08_16_2021",
                    "endTime": "1:35:00 PM",
                    "event": "Lunch",
                    "index": 2,
                    "project": "-",
                    "startTime": "12:35:00 PM",
                    "timeAsHours": 1,
                    "timeAsMinutes": 60,
                    "type": "OOO"
                },
                {
                    "date": "08_16_2021",
                    "endTime": "4:30:00 PM",
                    "event": "TASK-1234",
                    "index": 3,
                    "project": "Ad-Hoc",
                    "startTime": "1:35:00 PM",
                    "timeAsHours": 2.9166666666666665,
                    "timeAsMinutes": 175,
                    "type": "Work"
                }
            ],
            "timeStart": "7:00:00 AM",
            "totalHours": 8.5
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
            "Timesheet generated on 2021-10-19 from parsed note entries\n\n" +
            "**Total Hours:** 37.50\n\n" +
            "**OOO:** 1.00h\n\n" +
            "## Times\n\n" +
            "### 08_14_2021\n\n" +
            "**Total Hours:** 13.50h\n\n" +
            "**OOO:** 0.00h\n\n" +
            "| Project | Hours |\n" +
            "| --- | --- |\n" +
            "| admin | 0.50 |\n" +
            "| ad-hoc | 13.00 |\n\n" +
            "### 08_15_2021\n\n" +
            "**Total Hours:** 15.50h\n\n" +
            "**OOO:** 0.00h\n\n" +
            "| Project | Hours |\n" +
            "| --- | --- |\n" +
            "| admin | 0.50 |\n" +
            "| ad-hoc | 15.00 |\n\n" +
            "### 08_16_2021\n\n" +
            "**Total Hours:** 8.50h\n\n" +
            "**OOO:** 1.00h\n\n" +
            "| Project | Hours |\n" +
            "| --- | --- |\n" +
            "| admin | 0.50 |\n" +
            "| ad-hoc | 8.00 |\n" +
            "| OOO | 1.00 |\n"
        ]
    ]);
})