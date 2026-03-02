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
    todayVisits: 0
  });

  const [userByType, setUserByType] = useState([]);
  const [members, setMembers] = useState([]);
  const [visits, setVisits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [recentVisits, setRecentVisits] = useState([]);
  const [visitSearch, setVisitSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const [memberType, setMemberType] = useState("monthly");
  const [visitType, setVisitType] = useState("monthly");


  // ======================
  // โหลด Summary
  // ======================
  useEffect(() => {
    fetch('http://localhost:8080/api/v1/admin/dashboard-summary', {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log("Summary:", data);
        setSummary(data || {});
        setLoading(false);
      })
      .catch(err => {
        console.error("Summary Error:", err);
        setLoading(false);
      });
  }, []);

  // ======================
  // โหลด User Type
  // ======================
  useEffect(() => {
    fetch('http://localhost:8080/api/v1/admin/user-type', {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log("UserType:", data);
        setUserByType(data.data || []);
      });
  }, []);

  // ======================
  // โหลด Member Stats
  // ======================
  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/admin/dashboard/members?type=${memberType}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log("Members:", data);

        const formatted = (data.data || []).map(item => ({
          period: item.period,
          total: item.total
        }));

        setMembers(formatted);
      });
  }, [memberType]);

  // ======================
  // โหลด Visit Stats
  // ======================
  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/admin/dashboard/visits?type=${visitType}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log("Visits:", data);

        const formatted = (data.data || []).map(item => ({
          period: item.period,
          total: item.total
        }));

        setVisits(formatted);
      });
  }, [visitType]);
  // ======================
  // โหลด Recent Visits
  // ======================
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/admin/visits?limit=10", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log("Recent Visits:", data);
        setRecentVisits(data.data || []);
      });
  }, []);

  // ======================
  // โหลด Logs
  // ======================
  useEffect(() => {
    fetch('http://localhost:8080/api/v1/admin/logs?limit=10', {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log("Logs:", data);
        setLogs(data.data || []);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="warning" />
        <p>กำลังโหลด Dashboard...</p>
      </div>
    );
  }

  return (
    <Container className="py-5">

      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold" style={{ color: '#FF7F11' }}>
            Fitness Admin Dashboard
          </h2>
        </Col>
      </Row>

      {/* SUMMARY */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="p-4 shadow border-warning">
            <h6>ผู้ใช้งานทั้งหมด</h6>
            <h2>{summary.totalUsers}</h2>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-4 shadow border-warning">
            <h6>เข้าใช้วันนี้</h6>
            <h2>{summary.todayVisits}</h2>
          </Card>
        </Col>
      </Row>

      {/* USER TYPE */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="p-4 shadow border-warning">
            <h6 className="text-center mb-3">ผู้ใช้แยกตามประเภท</h6>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={userByType} dataKey="value" nameKey="name" outerRadius={100} label>
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

        {/* MEMBERS */}
        <Col md={6}>
          <Card className="p-4 shadow border-warning">
            <h6>สมัครสมาชิก ({memberType})</h6>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={members}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#FF7F11" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* VISITS */}
      <Row className="mb-4">
        <Col>
          <Card className="p-4 shadow border-warning">
            <h6>การเข้าใช้งาน ({visitType})</h6>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visits}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#FF7F11" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      {/* VISIT TABLE */}
      <Row className="mt-5">
        <Col>
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหา Membership No หรือ ชื่อ..."
                value={visitSearch}
                onChange={(e) => setVisitSearch(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-secondary w-100"
                onClick={() => {
                  setVisitSearch("");
                  setStartDate("");
                  setEndDate("");
                }}
              >
                Reset
              </button>
            </div>
          </div>
          <Card className="shadow-sm">
            <Card.Body>
              <h6 className="fw-bold mb-3">🏋️‍♂️ การเข้าใช้ Fitness (ล่าสุด)</h6>

              {recentVisits.length === 0 ? (
                <p className="text-muted text-center mb-0">ยังไม่มีข้อมูลการเข้าใช้</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>เวลา</th>
                        <th>Membership No</th>
                        <th>ชื่อสมาชิก</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentVisits
                        .filter((visit) => {

                          const membershipNo = visit.Membership?.membership_no?.toLowerCase() || "";
                          const fullName = visit.Membership?.user?.full_name?.toLowerCase() || "";
                          const visitDate = visit.visit_date?.split("T")[0];

                          const searchMatch =
                            membershipNo.includes(visitSearch.toLowerCase()) ||
                            fullName.includes(visitSearch.toLowerCase());

                          let dateMatch = true;

                          if (startDate && endDate) {
                            dateMatch = visitDate >= startDate && visitDate <= endDate;
                          }

                          return searchMatch && dateMatch;
                        })
                        .map((visit) => (
                          <tr key={visit.visit_id}>
                            <td>
                              {visit.visit_date?.replace('T', ' ').split('.')[0]}
                            </td>
                            <td>{visit.Membership?.membership_no}</td>
                            <td>{visit.Membership?.user?.full_name}</td>
                            <td>
                              <span className="badge bg-success">
                                Checked-in
                              </span>
                            </td>
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
      {/* LOG TABLE */}
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
                          <td>{log.username || 'guest'}</td>
                          <td>
                            <span className={`badge bg-${log.role === 'admin' ? 'danger' : 'primary'}`}>
                              {log.role}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${log.action === 'delete' ? 'bg-danger' :
                              log.action === 'update' ? 'bg-warning text-dark' :
                                log.action === 'create' ? 'bg-success' :
                                  'bg-secondary'
                              }`}>
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