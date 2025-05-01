import React, { useState, useEffect } from "react";
import "./Calendar.css";

const Calendar = (props) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  // Initialize selected dates to today and today + 10 days
  const initialFrom = { day: today.getDate(), month: today.getMonth() };
  const initialToDate = new Date(today);
  initialToDate.setDate(today.getDate() + 10);
  const initialTo = {
    day: initialToDate.getDate(),
    month: initialToDate.getMonth(),
  };

  const [selectedDateFrom, setSelectedDateFrom] = useState(initialFrom);
  const [selectedDateTo, setSelectedDateTo] = useState(initialTo);
  const [selectedDates, setSelectedDates] = useState([]);

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const getRange = (start, end, year) => {
    const range = [];
    let current = new Date(year, start.month, start.day);
    const endDate = new Date(year, end.month, end.day);

    while (current <= endDate) {
      range.push({
        day: current.getDate(),
        month: current.getMonth(),
      });
      current.setDate(current.getDate() + 1);
    }
    return range;
  };

  useEffect(() => {
    const range = getRange(initialFrom, initialTo, today.getFullYear());
    setSelectedDates(range);
    props.calendarHandler?.(range);
  }, []);

  const resetSelectedDates = () => {
    setSelectedDateFrom(null);
    setSelectedDateTo(null);
    setSelectedDates([]);
  };

  const prevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
    resetSelectedDates();
  };

  const nextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
    resetSelectedDates();
  };

  const getDaysArray = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysArray = [];

    for (let i = 0; i < firstDay; i++) daysArray.push(null);
    for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

    return daysArray;
  };

  const isPastDate = (day, month) => {
    const selected = new Date(currentDate.getFullYear(), month, day);
    return (
      selected <
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
  };

  const handleDayClick = (day, monthOffset = 0) => {
    if (day === null) return;

    const year = currentDate.getFullYear();
    const baseMonth = currentDate.getMonth();
    const actualMonth = baseMonth + monthOffset;

    if (actualMonth < 0 || actualMonth > 11) return;
    if (isPastDate(day, actualMonth)) return;

    const clickedDate = { day, month: actualMonth };

    if (!selectedDateFrom) {
      setSelectedDateFrom(clickedDate);
      setSelectedDateTo(null);
      setSelectedDates([]);
    } else if (!selectedDateTo) {
      setSelectedDateTo(clickedDate);

      const from = selectedDateFrom;
      const to = clickedDate;

      const start =
        from.month < to.month || (from.month === to.month && from.day <= to.day)
          ? from
          : to;
      const end = start === from ? to : from;

      const range = getRange(start, end, year);
      setSelectedDates(range);
      props.calendarHandler?.(range);
    } else {
      setSelectedDateFrom(clickedDate);
      setSelectedDateTo(null);
      setSelectedDates([]);
    }
  };

  const getClassNameForDay = (day, month) => {
    if (day === null) return "untouchable";
    if (isPastDate(day, month)) return "untouchable";

    const isFrom =
      selectedDateFrom?.day === day && selectedDateFrom?.month === month;
    const isTo = selectedDateTo?.day === day && selectedDateTo?.month === month;
    const isBetween = selectedDates.some(
      (d) => d.day === day && d.month === month
    );

    return isFrom ? "from" : isTo ? "to" : isBetween ? "between" : "";
  };

  const year = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const nextMonthIndex = (currentMonth + 1) % 12;
  const nextMonthYear = currentMonth === 11 ? year + 1 : year;

  const daysArrayCurrentMonth = getDaysArray(year, currentMonth);
  const daysArrayNextMonth = getDaysArray(nextMonthYear, nextMonthIndex);

  return (
    <div className="table">
      {/* Current Month */}
      <div>
        <div id="table-header">
          <div className="arrow" id="prev-month" onClick={prevMonth}>
            <i className="fa fa-arrow-left"></i>
          </div>
          <h1>
            {months[currentMonth]} {year}
          </h1>
        </div>
        <table>
          <thead>
            <tr>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <td key={d}>{d}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(Math.ceil(daysArrayCurrentMonth.length / 7))].map(
              (_, i) => (
                <tr key={i}>
                  {daysArrayCurrentMonth
                    .slice(i * 7, i * 7 + 7)
                    .map((day, j) => (
                      <td
                        key={j}
                        className={getClassNameForDay(day, currentMonth)}
                        onClick={() => handleDayClick(day, 0)}
                      >
                        {day || ""}
                      </td>
                    ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Next Month */}
      <div>
        <div id="table-header">
          <h1>
            {months[nextMonthIndex]} {nextMonthYear}
          </h1>
          <div className="arrow" id="next-month" onClick={nextMonth}>
            <i className="fa fa-arrow-right"></i>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <td key={d}>{d}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(Math.ceil(daysArrayNextMonth.length / 7))].map(
              (_, i) => (
                <tr key={i}>
                  {daysArrayNextMonth.slice(i * 7, i * 7 + 7).map((day, j) => (
                    <td
                      key={j}
                      className={getClassNameForDay(day, nextMonthIndex)}
                      onClick={() => handleDayClick(day, 1)}
                    >
                      {day || ""}
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
