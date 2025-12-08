import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        navigate("/login"); // ถ้าไม่ login ให้เด้งไป login
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include", // ✅ เผื่อ backend อ่านจาก cookie ด้วย
        });

        if (!res.ok) throw new Error("Unauthorized or User not found");

        const data = await res.json();
        setUser(data.user);
        setMembership(data.membership);
      } catch (err) {
        console.error(err);
        navigate("/login"); // ถ้า token พัง ให้กลับไป login
      }
    };

    fetchCurrentUser();
  }, [token, navigate]);

  if (!user) return <p className="text-center mt-5">Loading...</p>;

  return (
    <Container className="py-5">
      <h2 className="mb-2" style={{ color: '#FF7F11' }}>My Profile</h2>
      <p className="text-muted mb-4">Manage your account information and membership</p>

      <Row className="g-4">
        {/* LEFT — PROFILE INFO */}
        <Col lg={6}>
          <Card
            className="shadow-lg h-100"
            style={{
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              padding: '1rem',
              border: '2px solid #FF7F11',
              color: '#1F1F1F'
            }}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0" style={{ color: '#FF7F11' }}>User Profile</h5>
                <Button
                  variant="light"
                  size="sm"
                  className="d-flex align-items-center gap-2 rounded-pill"
                  style={{ backgroundColor: '#FF7F11', color: '#ffffff', fontWeight: 'bold' }}
                >
                  <i className="bi bi-pencil" />
                  Edit
                </Button>
              </div>

              <div className="text-center mb-4">
                <div
                  className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '100px', height: '100px', backgroundColor: '#FF7F11' }}
                >
                  <i className="bi bi-person" style={{ fontSize: '48px', color: '#ffffff' }} />
                </div>
                <h4 className="mb-1">{user.full_name}</h4>
                <p className="text-muted mb-0">@{user.username}</p>
              </div>

              <div className="d-flex flex-column gap-3">
                {[
                  { icon: 'bi-envelope', label: 'Email', value: user.email },
                  { icon: 'bi-person-badge', label: 'Full Name', value: user.full_name },
                  { icon: 'bi-telephone', label: 'Phone', value: user.phone },
                  { icon: 'bi-shield-lock', label: 'Role', value: user.role },
                ].map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: '#FFF5EE' }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, backgroundColor: '#FF7F11' }}>
                      <i className={`bi ${item.icon}`} style={{ fontSize: 20, color: '#fff' }} />
                    </div>
                    <div className="flex-grow-1">
                      <small className="text-muted d-block">{item.label}</small>
                      <span>{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT — MEMBERSHIP STATUS */}
        <Col lg={6}>
          <Card
            className="shadow-lg h-100"
            style={{
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              padding: '1rem',
              border: '2px solid #FF7F11',
              color: '#1F1F1F'
            }}
          >
            <Card.Body>
              <div className="d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-award" style={{ fontSize: 24, color: '#FF7F11' }} />
                <h5 className="mb-0" style={{ color: '#FF7F11' }}>Membership Status</h5>
              </div>

              {/* ❗ ถ้าไม่มี membership */}
              {!membership || !membership.package_name ? (
                <>
                  <Alert variant="danger" className="rounded-3">
                    You currently have no active membership.
                  </Alert>

                  <div className="text-center mb-3">
                    <Button
                      className="px-5 py-2 border-0 rounded-pill w-100"
                      style={{ backgroundColor: '#FF7F11', color: '#ffffff', fontWeight: 'bold' }}
                      onClick={() => navigate("/package")}
                    >
                      สมัครสมาชิก
                    </Button>
                  </div>

                  <Alert variant="warning" className="text-center rounded-3">
                    ⚠️ ต้องสมัครสมาชิกก่อนจึงจะสามารถเข้าถึง QR Code
                  </Alert>
                </>
              ) : (
                /* ✅ ถ้ามี membership */
                <>
                  <Alert variant="success" className="rounded-3" style={{ backgroundColor: '#FF7F11', color: '#fff', border: 'none' }}>
                    You are a <strong>{membership.package_name}</strong> member
                  </Alert>
                  <p className="text-center text-muted mb-3">หมดอายุ: {membership.expire_date}</p>

                  <div
                    style={{
                      width: 150,
                      height: 150,
                      border: "2px dashed #FF7F11",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      fontSize: "0.9rem",
                      color: "#FFA94D",
                    }}
                  >
                    QR Code Preview
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}