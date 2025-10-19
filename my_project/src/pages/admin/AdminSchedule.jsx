import React, { useEffect, useState } from 'react';
import { Button, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import '../Schedule.css';

const AdminSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get('/classes');
      setClasses(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
      setClasses([]);
      setLoading(false);
      if (err.response?.status === 401) window.location.href = '/login';
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบตารางเวลานี้หรือไม่?')) {
      try {
        await axiosInstance.delete(`/schedules/${id}`);
        alert('ลบตารางเวลาเรียบร้อยแล้ว');
        fetchClasses();
      } catch (err) {
        console.error('ลบตารางเวลาล้มเหลว:', err);
        if (err.response?.status === 401) window.location.href = '/login';
      }
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
      {/* Header + ปุ่มเพิ่ม */}
      <Row className="align-items-center mb-3">
        <Col>
          <h2>📅 จัดการตารางเวลา</h2>
        </Col>
        <Col className="text-end">
          <Button as={Link} to="/admin/schedule/create" variant="success">
            + เพิ่มตารางเวลา
          </Button>
        </Col>
      </Row>

      {/* Loading */}
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="warning" />
          <p className="mt-2 text-muted">⏳ กำลังโหลดตาราง...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && classes.length === 0 && (
        <Alert variant="warning" className="text-center">
          📭 ยังไม่มีตารางคลาส
        </Alert>
      )}

      {/* ตาราง */}
      {!loading && classes.length > 0 && (
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
                    <td key={time} className={cls ? cls.class_type?.toLowerCase() : ''}>
                      {cls && (
                        <div className="d-flex flex-column align-items-start">
                          <span>{cls.name}</span>
                          <div className="d-flex gap-1 mt-1">
                            <Button
                              as={Link}
                              to={`/admin/schedule/edit/${cls.schedule_id}`}
                              size="sm"
                              variant="warning"
                            >
                              แก้ไข
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(cls.schedule_id)}
                            >
                              ลบ
                            </Button>
                          </div>
                        </div>
                      )}
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
