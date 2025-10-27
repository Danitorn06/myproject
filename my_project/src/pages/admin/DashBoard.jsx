import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashBoard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    news: 0,
    classes: 0,
    memberships: 0,
    packages: 0,
  });

  // โหลด mock data
  useEffect(() => {
    setTimeout(() => {
      setStats({
        news: 12,
        classes: 8,
        memberships: 25,
        packages: 5,
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2 text-muted">⏳ กำลังโหลด Dashboard...</p>
      </div>
    );
  }

  // แปลง stats เป็น array สำหรับ PieChart
  const data = [
    { name: 'ข่าวสาร', value: stats.news },
    { name: 'คลาส', value: stats.classes },
    { name: 'สมาชิก', value: stats.memberships },
    { name: 'แพ็กเกจ', value: stats.packages },
  ];

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">📊 Admin Dashboard (Mock)</h2>
      <Row className="justify-content-center">
        <Col md={6}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default DashBoard;