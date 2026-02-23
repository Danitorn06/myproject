import React, { useEffect, useState } from 'react';
import './DashBoard.css';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import {
  PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import 'bootstrap-icons/font/bootstrap-icons.css';
const COLORS = ['#FF7F11', '#FDBA74', '#60A5FA', '#34D399', '#C084FC'];

const DashBoard = () => {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    totalUsers: 0,
    todayVisits: 0,
  });

  const [userByType, setUserByType] = useState([]);
  const [monthlyMembers, setMonthlyMembers] = useState([]);
  const [dailyVisits, setDailyVisits] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // ===== mock dashboard data =====
    setTimeout(() => {
      setSummary({ totalUsers: 312, todayVisits: 48 });

      setUserByType([
        { name: 'นักศึกษา', value: 95 },
        { name: 'บุคลากรภายใน', value: 42 },
        { name: 'บุคคลภายนอก', value: 38 },
        { name: 'นักศึกษาสาธิต', value: 17 },
      ]);

      setMonthlyMembers([
        { month: 'Jan', members: 18 },
        { month: 'Feb', members: 25 },
        { month: 'Mar', members: 31 },
        { month: 'Apr', members: 46 },
        { month: 'May', members: 59 },
      ]);

      setDailyVisits([
        { date: '01/12', visits: 42 },
        { date: '02/12', visits: 38 },
        { date: '03/12', visits: 55 },
        { date: '04/12', visits: 61 },
        { date: '05/12', visits: 48 },
        { date: '06/12', visits: 70 },
        { date: '07/12', visits: 66 },
      ]);

      setLoading(false);
    }, 500);

    // ===== fetch user logs =====
    fetch('http://localhost:8080/api/v1/admin/logs?limit=10', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setLogs(data.data || []);
      })
      .catch(err => console.error('Failed to load logs', err));
  }, []);



  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2 text-muted">กำลังโหลด Dashboard...</p>
      </div>
    );
  }

  return (
    <Container  className="py-5 dashboard-print">

      {/* ===== HEADER ===== */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 style={{ color: '#FF7F11' }} className="fw-bold">
            <i className="bi bi-bar-chart-line me-2"></i>
            Fitness Dashboard
          </h2>
          <p className="text-muted mb-0">
            SU.ED FITNESS CENTER<br />
            วันที่จัดทำรายงาน: {new Date().toLocaleDateString('th-TH')}
          </p>
        </Col>

        <Col className="text-end d-print-none">
          <Button
            variant="outline-warning"
            className="rounded-pill px-4"
            onClick={() => window.print()}
          >
            <i className="bi bi-printer me-1"></i>
            พิมพ์รายงาน
          </Button>
        </Col>
      </Row>

      {/* ===== SUMMARY ===== */}
      <Row className="mb-4 g-4">
        <Col md={6}>
          <Card
            className="shadow-lg"
            style={{
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              padding: '1rem',
              border: '2px solid #FF7F11',
              height: 'auto'   // 🔥 สำคัญ
            }}
          >
            <Card.Body>
              <i className="bi bi-people-fill admin-icon"></i>
              <h6 className="mt-2">ผู้ใช้งานทั้งหมด</h6>
              <h2>{summary.totalUsers}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card
            className="shadow-lg"
            style={{
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              padding: '1rem',
              border: '2px solid #FF7F11',
              height: 'auto'   // 🔥 สำคัญ
            }}
          >
            <Card.Body>
              <i className="bi bi-calendar-check admin-icon"></i>
              <h6 className="mt-2">ผู้เข้าใช้งานวันนี้</h6>
              <h2>{summary.todayVisits}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ===== CHARTS ===== */}
      <Row className="g-4">
        <Col md={6}>
          <Card
            className="shadow-lg"
            style={{
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              padding: '1rem',
              border: '2px solid #FF7F11',
              height: 'auto'   // 🔥 สำคัญ
            }}
          >
            <h6 className="text-center mb-3">ผู้ใช้งานแยกตามประเภท</h6>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userByType}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {userByType.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col md={6}>
          <Card
            className="shadow-lg"
            style={{
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              padding: '1rem',
              border: '2px solid #FF7F11',
              height: 'auto'   // 🔥 สำคัญ
            }}
          >
            <h6 className="text-center mb-3">สมัครสมาชิก (รายเดือน)</h6>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlyMembers}
                  margin={{ top: 20, right: 80, left: 40, bottom: 30 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="month"
                    interval={0}
                    tickMargin={10}
                    padding={{ left: 20, right: 20 }}
                  />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="members"
                    fill="#FF7F11"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <div className="page-break" />

      <Row className="mt-4">
        <Col>
          <Card
            className="shadow-lg"
            style={{
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              padding: '1rem',
              border: '2px solid #FF7F11',
              height: 'auto'   // 🔥 สำคัญ
            }}
          >
            <h6 className="text-center mb-3">ผู้เข้าใช้งานรายวัน</h6>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={dailyVisits}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#FF7F11"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ===== USER LOGS ===== */}
      <Row className="mt-5">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h6 className="fw-bold mb-3">🧾 ประวัติการใช้งานระบบ (ล่าสุด)</h6>

              {logs.length === 0 ? (
                <p className="text-muted text-center mb-0">ยังไม่มี log</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>เวลา</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Action</th>
                        <th>รายละเอียด</th>
                        <th>IP</th>
                      </tr>
                    </thead>

                    <tbody>
                      {logs.map(log => (
                        <tr key={log.log_id}>
                          <td>{log.created_at?.replace('T', ' ').split('.')[0]}</td>


                          <td>
                            {log.username ? (
                              <span className="fw-semibold">{log.username}</span>
                            ) : (
                              <span className="text-muted">guest</span>
                            )}
                          </td>

                          <td>
                            <span
                              className={`badge bg-${log.role === 'admin' ? 'danger' : 'primary'
                                }`}
                            >
                              {log.role}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`badge ${log.action === 'delete'
                                ? 'bg-danger'
                                : log.action === 'update'
                                  ? 'bg-warning text-dark'
                                  : log.action === 'create'
                                    ? 'bg-success'
                                    : 'bg-secondary'
                                }`}
                            >
                              {log.action}
                            </span>
                          </td>

                          <td>{log.description}</td>
                          <td>{log.ip_address}</td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
};

export default DashBoard;