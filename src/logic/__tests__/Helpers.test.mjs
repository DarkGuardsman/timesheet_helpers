import {formatTime} from "../Helpers.mjs";
import {consoleErrorsMatches, mockConsoleError, unmockConsoleError} from "../../test_setup";

describe('formatTime', () => {
    const testCases = [
        //msg, input, output, error console out

        //Bad data
        [null, null, [["Invalid input: null"]]],
        [undefined, undefined, [["Invalid input: undefined"]]],

        //Edge case
        ["", "", []],
        ["-", "-", []],

        //Checking it can handle different sizes
        ["1 PM", "1:00:00 PM", []],
        ["1:01 PM", "1:01:00 PM", []],
        ["1:02:34 PM", "1:02:34 PM", []],

        //Checking uppercase
        ["1:00 am", "1:00:00 AM", []],
        ["1:00 pm", "1:00:00 PM", []],

        //Checking trimming
        ["   1:00 am   ", "1:00:00 AM", []],
        ["   1:00 pm   ", "1:00:00 PM", []],

        //Check it can handle lack of spacing between time and AM/PM
        ["1am", "1:00:00 AM", []],
        ["1pm", "1:00:00 PM", []],
        ["1:00am", "1:00:00 AM", []],
        ["1:00pm", "1:00:00 PM", []],
        ["1:00:00am", "1:00:00 AM", []],
        ["1:00:00pm", "1:00:00 PM", []],

        //Actual examples
        [" 7:00 AM ", "7:00:00 AM", []],
        [" 1:15 PM ", "1:15:00 PM", []],
        [" 11:45 AM ", "11:45:00 AM", []],
        [" 12:13 PM ", "12:13:00 PM", []]

];

    beforeEach(mockConsoleError);
    afterEach(unmockConsoleError);

    it.each(testCases)("'%s' -> '%s'", (input, output, consoleOut) => {
        expect(formatTime(input)).toEqual(output);
        consoleErrorsMatches(consoleOut);
    });
})