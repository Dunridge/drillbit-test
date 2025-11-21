"use client";

import { useEffect } from "react";

const employeeBusyTimes = [
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
  useEffect(() => {
    const startOfDay = 8 * 60; // 8:00am in minutes
    const endOfDay = 17 * 60; // 5:00pm
    const slotIncrement = 30; // 30 minutes
    const appointmentDuration = 120; // 2 hours

    // Convert busy times to minutes
    const busyTimesInMin = employeeBusyTimes.map((b) => ({
      employee_id: b.employee_id,
      start: timeStrToMin(b.start_time),
      end: timeStrToMin(b.end_time),
    }));

    // Free intervals per employee
    const freeByEmployee: Record<number, { start: number; end: number }[]> = {};

    for (const b of busyTimesInMin) {
      if (!freeByEmployee[b.employee_id]) freeByEmployee[b.employee_id] = [];
    }

    for (const employeeId of Object.keys(freeByEmployee).map(Number)) {
      const busy = busyTimesInMin
        .filter((b) => b.employee_id === employeeId)
        .sort((a, z) => a.start - z.start);

      let free: { start: number; end: number }[] = [];
      let lastEnd = startOfDay;

      for (const b of busy) {
        if (b.start > lastEnd) free.push({ start: lastEnd, end: b.start });
        lastEnd = Math.max(lastEnd, b.end);
      }

      if (lastEnd < endOfDay) free.push({ start: lastEnd, end: endOfDay });

      freeByEmployee[employeeId] = free;
    }

    // Generate all slots
    const slots: { start_time: string; available_employees: number }[] = [];

    for (
      let time = startOfDay;
      time + appointmentDuration <= endOfDay;
      time += slotIncrement
    ) {
      let availableCount = 0;

      for (const freeIntervals of Object.values(freeByEmployee)) {
        if (
          freeIntervals.some(
            (f) => time >= f.start && time + appointmentDuration <= f.end
          )
        ) {
          availableCount++;
        }
      }

      if (availableCount > 0) {
        slots.push({
          start_time: minToTimeStr(time),
          available_employees: availableCount,
        });
      }
    }

    console.log(slots);
  }, []);

  const timeStrToMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const minToTimeStr = (m: number) => {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  return <div className="w-full flex justify-center">Drillbit</div>;
}
