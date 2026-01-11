// utils/dateUtils.js

export const getWeekDates = (baseDate) => {
  const date = new Date(baseDate);
  const monday = new Date(
    date.setDate(date.getDate() - date.getDay() + 1)
  );

  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
};

export const getMonthWeeks = (baseDate) => {
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);

  const weeks = [];
  let current = new Date(start);

  while (current <= end) {
    weeks.push(getWeekDates(current));
    current.setDate(current.getDate() + 7);
  }

  return weeks;
};
