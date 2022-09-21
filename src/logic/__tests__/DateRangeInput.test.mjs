import {convertRangeIntoDates, daysInMonth, generateDays, parseDateRange} from "../DateRangeInput.mjs";

describe("convertRangeIntoDates", () => {
    test("same day", () => {
        expect(convertRangeIntoDates("8/1", "8/1", 2022)).toEqual([
            {
                day: 1,
                month: 8
            }
        ]);
    });

    test("invalid day input", () => {
        try {
            convertRangeIntoDates("8/10", "8/1", 2022);
            fail("should error");
        } catch (err) {
           expect(err).toEqual(new Error("Invalidate date range; start.day is older than end.day 8/10-8/1"))
        }
    });

    test("invalid month input", () => {
        try {
            convertRangeIntoDates("9/1", "8/3", 2022);
            fail("should error");
        } catch (err) {
            expect(err).toEqual(new Error("Invalidate date range; start is older than end 9/1-8/3"))
        }
    });

    test("same month", () => {
        expect(convertRangeIntoDates("8/16", "8/20", 2022)).toEqual([
            {
                day: 16,
                month: 8
            },
            {
                day: 17,
                month: 8
            },
            {
                day: 18,
                month: 8
            },
            {
                day: 19,
                month: 8
            },
            {
                day: 20,
                month: 8
            }
        ]);
    });

    test("different months", () => {
        expect(convertRangeIntoDates("8/30", "9/05", 2022)).toEqual([
            {
                day: 30,
                month: 8
            },
            {
                day: 31,
                month: 8
            },
            {
                day: 1,
                month: 9
            },
            {
                day: 2,
                month: 9
            },
            {
                day: 3,
                month: 9
            },
            {
                day: 4,
                month: 9
            },
            {
                day: 5,
                month: 9
            }
        ])
    });
});

describe("generateDays", () => {

    test("-1 to 0", () => {
        const out = [];
        generateDays(3, -1, 0, out)
        expect(out).toEqual([
            {
                month: 3,
                day: -1
            },
            {
                month: 3,
                day: 0
            }
        ])
    });

    test("0 to 1", () => {
        const out = [];
        generateDays(3, 0, 1, out)
        expect(out).toEqual([
            {
                month: 3,
                day: 0
            },
            {
                month: 3,
                day: 1
            }
        ])
    });

    test("29 to 30", () => {
        const out = [];
        generateDays(3, 29, 30, out)
        expect(out).toEqual([
            {
                month: 3,
                day: 29
            },
            {
                month: 3,
                day: 30
            }
        ])
    });

    test("0 to 20", () => {
        const out = [];
        generateDays(3, 0, 20, out)
        expect(out).toEqual([
            {
                month: 3,
                day: 0
            },
            {
                month: 3,
                day: 1
            },
            {
                month: 3,
                day: 2
            },
            {
                month: 3,
                day: 3
            },
            {
                month: 3,
                day: 4
            },
            {
                month: 3,
                day: 5
            },
            {
                month: 3,
                day: 6
            },
            {
                month: 3,
                day: 7
            },
            {
                month: 3,
                day: 8
            },
            {
                month: 3,
                day: 9
            },
            {
                month: 3,
                day: 10
            },
            {
                month: 3,
                day: 11
            },
            {
                month: 3,
                day: 12
            },
            {
                month: 3,
                day: 13
            },
            {
                month: 3,
                day: 14
            },
            {
                month: 3,
                day: 15
            },
            {
                month: 3,
                day: 16
            },
            {
                month: 3,
                day: 17
            },
            {
                month: 3,
                day: 18
            },
            {
                month: 3,
                day: 19
            },
            {
                month: 3,
                day: 20
            }
        ])
    });

    test("20 to 10 -> error", () => {
        const out = [];
        try {
            generateDays(3, 20, 10, out);
            fail("should have errored");
        } catch (err) {
            expect(err).toEqual(new Error(`Invalid start(20) and end(10) days; Delta=-10`))
        }
    });
});

describe("parseDateRange", () => {

    test("8/16", () => {
        expect(parseDateRange("8/16", 2022)).toEqual({
            day: 16,
            month: 8,
            maxDays: 31
        });
    });

    test("9/16", () => {
        expect(parseDateRange("9/16", 2022)).toEqual({
            day: 16,
            month: 9,
            maxDays: 30
        });
    });

    test("9/31 -> error max day", () => {

        try {
            parseDateRange("9/31", 2022)
            fail("should have errored")
        } catch (err) {
            expect(err).toEqual(new Error("Invalidate date range; day is outside month max(30); input: 9/31, 2022"))
        }
    });

    test("9/50 -> error max day", () => {

        try {
            parseDateRange("9/50", 2022)
            fail("should have errored")
        } catch (err) {
            expect(err).toEqual(new Error("Invalidate date range; day is outside month max(30); input: 9/50, 2022"))
        }
    });
});

describe("daysInMonth", () => {
    test.each([
        [1, 31],
        [2, 28],
        [3, 31],
        [4, 30],
        [5, 31],
        [6, 30],
        [7, 31],
        [8, 31],
        [9, 30],
        [10, 31],
        [11, 30],
        [12, 31]
    ])("years 2022: month %s has %s days", (month, days) => {
        expect(daysInMonth(month, 2022)).toBe(days);
    });

    test.each([
        [1, 31],
        [2, 29],
        [3, 31],
        [4, 30],
        [5, 31],
        [6, 30],
        [7, 31],
        [8, 31],
        [9, 30],
        [10, 31],
        [11, 30],
        [12, 31]
    ])("year 2024: month %s has %s days", (month, days) => {
        expect(daysInMonth(month, 2024)).toBe(days);
    })
})