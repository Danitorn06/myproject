import React, { useEffect, useState } from 'react';
import { Button, Spinner, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import '../Schedule.css';

const AdminSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลคลาสจาก backend
  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get('/classes', { withCredentials: true });
      setClasses(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error('❌ โหลดข้อมูลคลาสล้มเหลว:', err);
      setClasses([]);
      setLoading(false);
      if (err.response?.status === 401) window.location.href = '/login';
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // ลบคลาส
  const handleDelete = async (id) => {
    if (!window.confirm('คุณต้องการลบคลาสนี้หรือไม่?')) return;
    try {
      await axiosInstance.delete(`/classes/${id}`, { withCredentials: true });
      alert('🗑️ ลบคลาสเรียบร้อยแล้ว');
      fetchClasses();
    } catch (err) {
      console.error('❌ ลบคลาสล้มเหลว:', err);
      if (err.response?.status === 401) window.location.href = '/login';
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['07:00', '17:00', '17:45', '18:00', '19:15'];

  const getClassForSlot = (day, time) =>
    classes.find(
      (cls) =>
        cls.day_of_week?.toLowerCase() === day.toLowerCase() &&
        cls.time?.startsWith(time)
    );

  return (
    <Container className="my-5">
      {/* Header */}
      <Row className="mb-3">
        <Col className="d-flex justify-content-between align-items-center">
          <h2>📅 จัดการตารางคลาส</h2>
          <Button variant="success" onClick={fetchClasses}>
            🔄 โหลดข้อมูลใหม่
          </Button>
        </Col>
      </Row>

      {/* Loading state */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="warning" />
          <p className="mt-2 text-muted">⏳ กำลังโหลดตาราง...</p>
        </div>
      ) : (
        <table className="schedule-table table table-bordered shadow-sm">
          <thead className="table-light">
            <tr>
              <th>วัน / เวลา</th>
              {times.map((time) => (
                <th key={time}>{time}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day) => (
              <tr key={day}>
                <td><strong>{day}</strong></td>
                {times.map((time) => {
                  const cls = getClassForSlot(day, time);
                  return (
                    <td
                      key={time}
                      className={cls ? cls.class_type?.toLowerCase() : 'empty-slot'}
                    >
                      <div className="d-flex flex-column align-items-start">
                        {cls ? (
                          <>
                            <span className="fw-semibold">{cls.name}</span>
                            <div className="d-flex gap-1 mt-2">
                              {/* แก้ไขคลาส */}
                              <Button
                                as={Link}
                                to={`/admin/schedule/create?mode=edit&id=${cls.class_id}`}
                                size="sm"
                                variant="warning"
                              >
                                ✏️ แก้ไข
                              </Button>

                              {/* ลบคลาส */}
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleDelete(cls.class_id)}
                              >
                                🗑️ ลบ
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="text-muted">ยังไม่มีคลาส</span>
                            {/* เพิ่มคลาส */}
                            <Button
                              as={Link}
                              to={`/admin/schedule/create?mode=add&day=${day}&time=${time}`}
                              size="sm"
                              variant="success"
                              className="mt-1"
                            >
                              ➕ เพิ่มคลาส
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Container>
  );
};

export default AdminSchedule;
