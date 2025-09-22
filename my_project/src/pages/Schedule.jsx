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

  return (
    <section className="schedule-section">
      {/* 🔹 Header โผล่ตลอด */}
      <div className="header-section">
        <h2>📅 ตารางเวลา</h2>
        <p>อัปเดตคลาสล่าสุดของสัปดาห์นี้</p>
      </div>

      {/* 🔹 ถ้าไม่มีข้อมูล → แสดงโหลด, ถ้ามีข้อมูล → แสดงตาราง */}
      {(!classes || classes.length === 0) ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "250px" }}>
          <div className="card shadow-lg border-0" style={{ borderRadius: "20px", maxWidth: "350px" }}>
            <div
              className="card-header text-white text-center"
              style={{
                background: "linear-gradient(135deg, #ff7e5f, #feb47b)",
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
              }}
            >
              <h5 className="mb-0">⏳ กำลังโหลดตาราง</h5>
            </div>
            <div className="card-body text-center">
              <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mb-0">กรุณารอสักครู่ ข้อมูลกำลังมา...</p>
            </div>
          </div>
        </div>
      ) : (
        <table className="schedule-table table table-bordered">
          <thead className="table-light">
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
                <td><strong>{day}</strong></td>
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
      )}
    </section>
  );
};

export default Schedule;
