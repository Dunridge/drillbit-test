"use client";

/*
### Context

You're building scheduling logic for a home plumbing service. Customers book a "Standard Plumbing Service" that takes 2 hours and can be performed by any available plumber.

### Your Task

Find all possible appointment slots for today.

**Return:** All valid appointment slots with available employee count

```json
[
  {"start_time": "08:00", "available_employees": 1},
  {"start_time": "08:30", "available_employees": 1},
  ...
]
```

### Employee Busy Times

```json
[
  {"employee_id": 1, "start_time": "08:00", "end_time": "09:30"},
  {"employee_id": 1, "start_time": "10:00", "end_time": "11:30"},
  {"employee_id": 1, "start_time": "12:00", "end_time": "13:30"},
  {"employee_id": 1, "start_time": "14:00", "end_time": "17:00"},

  {"employee_id": 2, "start_time": "08:00", "end_time": "10:00"},
  {"employee_id": 2, "start_time": "11:00", "end_time": "13:00"},
  {"employee_id": 2, "start_time": "15:00", "end_time": "17:00"},

  {"employee_id": 3, "start_time": "09:00", "end_time": "11:00"},
  {"employee_id": 3, "start_time": "14:00", "end_time": "17:00"},

  {"employee_id": 4, "start_time": "11:00", "end_time": "13:00"}
]
```

*/

import { useEffect } from "react";

const employeeBusyTimes = [
  // each appt -- 2hr
  // 8am - 5pm -- working hours
  // appt in every 30m
  { employee_id: 1, start_time: "08:00", end_time: "09:30" },
  { employee_id: 1, start_time: "10:00", end_time: "11:30" },
  { employee_id: 1, start_time: "12:00", end_time: "13:30" },
  { employee_id: 1, start_time: "14:00", end_time: "17:00" },

  { employee_id: 2, start_time: "08:00", end_time: "10:00" },
  { employee_id: 2, start_time: "11:00", end_time: "13:00" },
  { employee_id: 2, start_time: "15:00", end_time: "17:00" },

  { employee_id: 3, start_time: "09:00", end_time: "11:00" },
  { employee_id: 3, start_time: "14:00", end_time: "17:00" },

  { employee_id: 4, start_time: "11:00", end_time: "13:00" },
];

export default function Home() {
  /*
  Output: 
  [
  {"start_time": "08:00", "available_employees": 1},
  {"start_time": "08:30", "available_employees": 1},
  ...
  ]
  */

  useEffect(() => {
    const employeeBusyTimesInMilliseconds = employeeBusyTimes.map(
      (timeRange) => ({
        ...timeRange,
        start_time: convertTimeStrToSeconds(timeRange.start_time),
        end_time: convertTimeStrToSeconds(timeRange.end_time),
      })
    );

    // 8:00-17:00
    const startInSeconds = convertTimeStrToSeconds("08:00");
    const endInSeconds = convertTimeStrToSeconds("17:00");
    const increment = convertTimeStrToSeconds("00:30");
    const apptDuration = convertTimeStrToSeconds("02:00");
    const employeeTimeSlotsInMilliseconds = [];

    const busyByEmployee = new Map<
      number,
      { start_time: number; end_time: number }[]
    >();

    for (const b of employeeBusyTimesInMilliseconds) {
      if (!busyByEmployee.has(b.employee_id))
        busyByEmployee.set(b.employee_id, []);
      busyByEmployee.get(b.employee_id)!.push(b);
    }

    for (
      let time = startInSeconds;
      time + apptDuration <= endInSeconds;
      time += increment
    ) {
      let slotStart = time;
      let slotEnd = time + apptDuration;

      let availableEmployees = 0;

      for (const [employeeId, blocks] of busyByEmployee.entries()) {
        const isBusy = blocks.some(
          (b) => b.start_time < slotEnd && b.end_time > slotStart
        );

        if (!isBusy) {
          availableEmployees++;
        }
      }

      employeeTimeSlotsInMilliseconds.push({
        start_time: convertSecondsToTimeStr(time),
        available_employees: availableEmployees,
      });
    }

    console.log(
      "employeeTimeSlotsInMilliseconds",
      employeeTimeSlotsInMilliseconds
    );

    // console.log(
    //   "employeeBusyTimesInMilliseconds",
    //   employeeBusyTimesInMilliseconds
    // );
  }, []);

  // "17:00"
  const convertTimeStrToSeconds = (time: string) => {
    const timeArr = time.split(":");
    const hours = Number(timeArr[0]);
    const minutes = Number(timeArr[1]);
    const totalSeconds = hours * 3600 + minutes * 60;
    return totalSeconds;
  };

  const convertSecondsToTimeStr = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");

    return `${hh}:${mm}`;
  };

  return (
    <div className="w-full flex justify-center">
      <div>Drillbit</div>
    </div>
  );
}
