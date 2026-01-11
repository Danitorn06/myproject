import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';
import './Schedule.css';

const Schedule = ({ showGuide = true }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch('http://localhost:8080/api/v1/classes')
      .then(res => res.json())
      .then(data => {
        setClasses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch classes:", err);
        setClasses([]);
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
            <Card.Text className="text-muted">
              ⏳ กำลังโหลดตาราง กรุณารอสักครู่...
            </Card.Text>
          </Card.Body>
        </Card>
      )}

      {/* ⚠️ ไม่มีข้อมูล */}
      {!loading && classes.length === 0 && (
        <Alert variant="warning" className="text-center shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
          📅 ยังไม่มีตารางคลาสในขณะนี้ 🙏
        </Alert>
      )}

      {/* ✅ ตารางเวลา */}
      {!loading && classes.length > 0 && (
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
                      {cls ? cls.name : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= คู่มือการใช้งาน ================= */}
      {showGuide && (
        <div className="schedule-guide mt-5">
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">📘 คู่มือการใช้งานตารางเวลา</h5>

              <ul className="guide-list">
                <li>
                  ตารางนี้แสดง <strong>คลาสออกกำลังกายประจำสัปดาห์</strong> แยกตามวันและช่วงเวลา
                </li>
                <li>
                  แต่ละช่องจะแสดง <strong>ชื่อคลาส</strong> หากมีการเปิดสอนในช่วงเวลานั้น
                </li>
                <li>
                  สีของช่องตารางแสดง <strong>ประเภทของคลาส</strong> เพื่อช่วยให้เข้าใจได้ง่าย
                </li>
              </ul>

              <div className="legend mt-3">
                <p className="mb-2"><strong>ความหมายของสี:</strong></p>
                <div className="legend-item cardio">Cardio – คลาสคาร์ดิโอ</div>
                <div className="legend-item strength">Strength – คลาสสร้างกล้ามเนื้อ</div>
                <div className="legend-item flexibility">Flexibility – คลาสยืดเหยียด</div>
              </div>

              <p className="text-muted mt-3 mb-0">
                หมายเหตุ: ตารางอาจมีการเปลี่ยนแปลงตามความเหมาะสม กรุณาตรวจสอบข้อมูลล่าสุดก่อนเข้าใช้งาน
              </p>
            </Card.Body>
          </Card>
        </div>
      )}
    </section>
  );
};

export default Schedule;