import fileSystem from "fs";
import writeFileFromObject from "../WriteFileFromObject.mjs";

// auto-mock fs
jest.mock('fs');

it('load file', () => {
    writeFileFromObject("some/path/out", [
        {
            "endTime": "-",
            "event": "-",
            "index": 0,
            "project": "-",
            "startTime": "-",
            "type": "-"
        },
        {
            "endTime": "-",
            "event": "1",
            "index": 1,
            "project": "-",
            "startTime": "-",
            "type": "-"
        },
        {
            "endTime": "7:30:00 AM",
            "event": "HouseKeeping",
            "index": 2,
            "project": "Admin",
            "startTime": "7:00:00 AM",
            "type": "Work"
        },
        {
            "endTime": "8:30:00 PM",
            "event": "TASK-1234",
            "index": 3,
            "project": "Ad-Hoc",
            "startTime": "7:30:00 AM",
            "type": "Work"
        },
        {
            "endTime": "-",
            "event": "-",
            "index": 4,
            "project": "-",
            "startTime": "-",
            "type": "-"
        },
        {
            "endTime": "-",
            "event": "2",
            "index": 5,
            "project": "-",
            "startTime": "-",
            "type": "-"
        },
        {
            "endTime": "8:30:00 AM",
            "event": "HouseKeeping",
            "index": 6,
            "project": "Admin",
            "startTime": "8:00:00 AM",
            "type": "Work"
        },
        {
            "endTime": "9:00:00 PM",
            "event": "Touchbase",
            "index": 7,
            "project": "Admin",
            "startTime": "8:30:00 AM",
            "type": "Meeting"
        }
    ]);

    expect(fileSystem.writeFileSync.mock.calls).toEqual([
        [
            //File path
            "some/path/out",
            //Lines out
            "-,-,-,-,-\n" +
            "1,-,-,-,-\n" +
            "HouseKeeping,Work,Admin,7:00:00 AM,7:30:00 AM\n" +
            "TASK-1234,Work,Ad-Hoc,7:30:00 AM,8:30:00 PM\n" +
            "-,-,-,-,-\n" +
            "2,-,-,-,-\n" +
            "HouseKeeping,Work,Admin,8:00:00 AM,8:30:00 AM\n" +
            "Touchbase,Meeting,Admin,8:30:00 AM,9:00:00 PM"
        ]
    ]);
})