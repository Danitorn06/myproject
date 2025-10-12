import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';
import './Schedule.css';

const Schedule = () => {
  const [classes, setClasses] = useState([]);   // ✅ ตั้งต้นเป็น []
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/classes')
      .then(res => res.json())
      .then(data => {
        // ✅ ถ้าไม่ใช่ array ให้ fallback เป็น []
        setClasses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch classes:", err);
        setClasses([]); // ✅ กัน null จาก error
        setLoading(false);
      });
  }, []);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = ["07:00", "17:00", "17:45", "18:00", "19:15"];

  const getClassForSlot = (day, time) => {
    return classes.find(
      cls => cls.day_of_week?.toLowerCase() === day.toLowerCase() &&
        cls.time?.startsWith(time)
    );
  };

  return (
    <section className="schedule-section container my-5">
      <div className="header-section text-center mb-4">
        <h2>📅 ตารางเวลา</h2>
        <p>อัปเดตคลาสล่าสุดของสัปดาห์นี้</p>
      </div>

      {/* 🔄 กำลังโหลด */}
      {loading && (
        <Card className="text-center shadow-sm border-0 mx-auto" style={{ maxWidth: "400px" }}>
          <Card.Body>
            <Spinner animation="border" variant="warning" className="mb-3" style={{ width: "3rem", height: "3rem" }} />
            <Card.Text className="text-muted">⏳ กำลังโหลดตาราง กรุณารอสักครู่...</Card.Text>
          </Card.Body>
        </Card>
      )}

      {/* ⚠️ ไม่มีข้อมูล */}
      {!loading && (!Array.isArray(classes) || classes.length === 0) && (
        <Alert variant="warning" className="text-center shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
          📅 ยังไม่มีตารางคลาสในขณะนี้🙏
        </Alert>
      )}

      {/* ✅ แสดงตาราง */}
      {!loading && Array.isArray(classes) && classes.length > 0 && (
        <table className="schedule-table table table-bordered shadow-sm">
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
                    <td key={time} className={cls ? cls.class_type?.toLowerCase() : ''}>
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
