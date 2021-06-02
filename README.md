# Timesheet helpers

Converts markdown table into csv for import into Excel or similar applications.

## Usage

`node run ./index.mjs --input="path/to/input.md" --output="path/to/output.csv"`

### Expected input

In theory any markdown table should work, but I specifically aimed at the following:

```
| - | - | - | - | - | - | - |
| 10 | - | - | - | - | - | - |
| HouseKeeping | Work | Admin | 8:00am | 8:30am  | 0.5 | Email, GitLab, Jira, etc |
| Touchbase | Meeting | Admin | 8:30am | 8:51am  | 0.5 | Random Stuff |
| - | - | - | - | - | - | - |
| 11 | - | - | - | - | - | - |
| HouseKeeping | Work | Admin | 8:00am | 8:30am  | 0.5 | Email, GitLab, Jira, etc |
| JIRA review | Work | Admin | 8:30am | 9:00am  | 0.5 | Reviewed JIRAs for sprint planning |
```

The above is a sample, the normal sheet would be roughly 100-200 lines per week of timesheets. What I do currently is manually copy my timesheet markdown from each day into a new file called data.md. I ignore the headers for each table as this data is known and doesn't match my excel 1:1. I also add two lines of seperation between each and give a number to note day. Then I will point the application at the file to process.

### Expected output

The following is what should be outputted if the input matches the above.

```
-,-,-,-,-
10,-,-,-,-
HouseKeeping,Work,Admin,8:00:00 AM,8:30:00 AM
Touchbase,Meeting,Admin,8:30:00 AM,8:51:00 AM
-,-,-,-,-
11,-,-,-,-
HouseKeeping,Work,Admin,8:00:00 AM,8:30:00 AM
JIRA review,Work,Admin,8:30:00 AM,9:00:00 AM
```

In this case you can see I remove the ending columns and format the time. Notes and estimated duration are not useful for my purpose. As well time is formatted so Excel can easily handle the data.... no clue why it can't parse `8:00am` as a time unit.