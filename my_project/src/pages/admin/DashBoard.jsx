import React, { useEffect, useState } from 'react';
import './DashBoard.css';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import {
  PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const COLORS = [
  '#0088FE', // user ธรรมดา
  '#00C49F', // นักศึกษา
  '#FFBB28', // บุคลากร
  '#FF8042', // บุคคลภายนอก
  '#AA46BE', // นักศึกษาสาธิต
];

const DashBoard = () => {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    totalUsers: 0,
    todayVisits: 0,
  });

  const [userByType, setUserByType] = useState([]);
  const [monthlyMembers, setMonthlyMembers] = useState([]);
  const [dailyVisits, setDailyVisits] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setSummary({
        totalUsers: 312,
        todayVisits: 48,
      });

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
  }, []);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2 text-muted">กำลังโหลด Dashboard...</p>
      </div>
    );
  }

  return (
    <Container className="my-5 dashboard-print">
      {/* ===== Report Header ===== */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="fw-bold">📊 รายงานสถิติการใช้งานระบบฟิตเนส</h3>
          <p className="text-muted mb-0">
            หน่วยงาน: SU.ED FITNESS CENTER<br />
            วันที่จัดทำรายงาน: {new Date().toLocaleDateString('th-TH')}
          </p>
        </Col>
        <Col className="text-end d-print-none">
          <Button variant="outline-primary" onClick={handlePrint}>
            🖨 พิมพ์รายงาน
          </Button>
        </Col>
      </Row>

      {/* ===== Summary ===== */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h6>👥 ผู้ใช้งานทั้งหมด</h6>
              <h2>{summary.totalUsers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h6>📅 ผู้เข้าใช้งานวันนี้</h6>
              <h2>{summary.todayVisits}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ===== Charts Page 1 ===== */}
      <Row>
        <Col md={6}>
          <Card className="shadow-sm p-3 mb-4">
            <h6 className="text-center mb-3">ผู้ใช้งานแยกตามประเภท</h6>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={userByType} dataKey="value" nameKey="name" outerRadius={110} label>
                  {userByType.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm p-3 mb-4">
            <h6 className="text-center mb-3">สมัครสมาชิก (Member) รายเดือน</h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyMembers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="members" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <div className="page-break" />

      {/* ===== Charts Page 2 ===== */}
      <Row>
        <Col md={12}>
          <Card className="shadow-sm p-3">
            <h6 className="text-center mb-3">ผู้เข้าใช้งานรายวัน</h6>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={dailyVisits}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#FF8042" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashBoard;