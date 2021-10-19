# Timesheet helpers

Pulls markdown tables from a specific note format to help improve time tracking.

## Usage

`node run ./index.mjs --input="path/to/input.md,path/to/input2.md,path/to/input3.md" --output="path/to/output.csv"`

### Expected input

Note files should be in the following format:

```
# Date or other header that will be ignored

## Time Tracking

Any random text

| Event | Type | Project | Start | End | Notes |
| - | - | - | - | - | - | - |
| HouseKeeping | Work | Admin | 7:00 AM | 7:30 AM | Email, GitLab, Jira, etc |
| Task1 | Work | Project | 7:30 AM | 10:30 AM | |
| Task2 | Work | Project | 10:30 AM | 12:30 PM | |
| Lunch | OOO | - | 12:30 PM | 1:30 PM | |
| Task1 | Work | Project | 1:30 PM | 5:00 PM | |

## AnyRandomHeader

Other things that will be ignored
```
Concept is that the parser will pull the text from between `## Time Tracking` and the next `##`. Then ignore anything not part of the markdown table itself.

### Expected output

The following is what should be outputted if the input matches the above.

```
Date1,HouseKeeping,Work,Admin,8:00:00 AM,8:30:00 AM
Date1,Touchbase,Meeting,Admin,8:30:00 AM,8:51:00 AM
Date2,HouseKeeping,Work,Admin,8:00:00 AM,8:30:00 AM
Date2,Touchbase,Meeting,Admin,8:30:00 AM,8:51:00 AM
Date3,HouseKeeping,Work,Admin,8:00:00 AM,8:30:00 AM
Date3,Touchbase,Meeting,Admin,8:30:00 AM,8:51:00 AM
```

In this case you can see I remove the ending columns and format the time. Notes and estimated duration are not useful for my purpose. As well time is formatted so Excel can easily handle the data.... no clue why it can't parse `8:00am` as a time unit.