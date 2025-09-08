import React, { useEffect, useState } from 'react';
import './Schedule.css';

const Schedule = () => {
const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/classes')
      .then(res => res.json())
      .then(data => setClasses(data))
      .catch(err => console.error("Failed to fetch classes:", err));
  }, []);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = ["07:00", "17:00", "17:45", "18:00", "19:15"];

  const getClassForSlot = (day, time) => {
    return classes.find(
      cls => cls.day_of_week.toLowerCase() === day.toLowerCase() &&
             cls.time.startsWith(time)
    );
  };

  if (!classes || classes.length === 0) return <p>กำลังโหลดตาราง...</p>;


  return (
    <section className="schedule-section">
      <h2 className="schedule-title">ตารางเวลา</h2>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>วัน / เวลา</th>
            {times.map(time => (
              <th key={time}>{time}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map(day => (
            <tr key={day}>
              <td>{day}</td>
              {times.map(time => {
                const cls = getClassForSlot(day, time);
                return (
                  <td key={time} className={cls ? cls.class_type.toLowerCase() : ''}>
                    {cls ? cls.name : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Schedule;
