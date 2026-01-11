import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

/* ================= PACKAGE MAP ================= */
const PACKAGE_MAP = {
  // รายเดือน
  1: { userType: "นักเรียน/นักศึกษา", duration: "รายเดือน" },
  3: { userType: "บุคลากรในมหาวิทยาลัย", duration: "รายเดือน" },
  5: { userType: "บุคคลภายนอก", duration: "รายเดือน" },

  // 4 เดือน
  2: { userType: "นักเรียน/นักศึกษา", duration: "4 เดือน" },
  4: { userType: "บุคลากรในมหาวิทยาลัย", duration: "4 เดือน" },
  6: { userType: "บุคคลภายนอก", duration: "4 เดือน" },
};
/* ================================================= */

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUser(data.user);
        setMembership(data.membership);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [token, navigate]);

  if (!user) return <p className="text-center mt-5">Loading...</p>;

  const packageInfo =
    membership?.package_id && PACKAGE_MAP[membership.package_id]
      ? PACKAGE_MAP[membership.package_id]
      : null;

  return (
    <Container className="py-5">
      <h2 className="mb-2" style={{ color: "#FF7F11" }}>
        My Profile
      </h2>
      <p className="text-muted mb-4">
        Manage your account information and membership
      </p>

      <Row className="g-4">
        {/* LEFT — PROFILE INFO */}
        <Col lg={6}>
          <Card
            className="shadow-lg h-100"
            style={{
              borderRadius: "20px",
              border: "2px solid #FF7F11",
            }}
          >
            <Card.Body>
              <div className="text-center mb-4">
                <div
                  className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: 100,
                    height: 100,
                    backgroundColor: "#FF7F11",
                  }}
                >
                  <i
                    className="bi bi-person"
                    style={{ fontSize: 48, color: "#fff" }}
                  />
                </div>
                <h4 className="mb-1">{user.full_name}</h4>
                <p className="text-muted">@{user.username}</p>
              </div>

              {[
                { icon: "bi-envelope", label: "Email", value: user.email },
                { icon: "bi-telephone", label: "Phone", value: user.phone },
                { icon: "bi-shield-lock", label: "Role", value: user.role },
              ].map((item, i) => (
                <div
                  key={i}
                  className="d-flex align-items-center gap-3 p-3 mb-3 rounded-3"
                  style={{ backgroundColor: "#FFF5EE" }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#FF7F11",
                    }}
                  >
                    <i
                      className={`bi ${item.icon}`}
                      style={{ color: "#fff" }}
                    />
                  </div>
                  <div>
                    <small className="text-muted">{item.label}</small>
                    <div>{item.value}</div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT — MEMBERSHIP */}
        <Col lg={6}>
          <Card
            className="shadow-lg h-100"
            style={{
              borderRadius: "20px",
              border: "2px solid #FF7F11",
            }}
          >
            <Card.Body>
              <div className="d-flex align-items-center gap-2 mb-4">
                <i
                  className="bi bi-award"
                  style={{ fontSize: 24, color: "#FF7F11" }}
                />
                <h5 style={{ color: "#FF7F11" }}>Membership Status</h5>
              </div>

              {!membership || membership.status !== "active" ? (
                <>
                  <Alert variant="danger">
                    You currently have no active membership
                  </Alert>
                  <Button
                    className="w-100 rounded-pill"
                    style={{ backgroundColor: "#FF7F11", border: "none" }}
                    onClick={() => navigate("/package")}
                  >
                    สมัครสมาชิก
                  </Button>
                </>
              ) : (
                <>
                  <Alert
                    variant="success"
                    style={{
                      backgroundColor: "#FF7F11",
                      border: "none",
                      color: "#fff",
                    }}
                  >
                    <strong>
                      {packageInfo
                        ? `${packageInfo.userType} • ${packageInfo.duration}`
                        : "ไม่พบข้อมูลแพ็กเกจ"}
                    </strong>
                  </Alert>

                  {/* แสดงวันหมดอายุ + เวลา */}
                  <p className="text-center text-muted">
                    หมดอายุ:{" "}
                    {new Date(membership.end_date).toLocaleString("th-TH", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <div
                    style={{
                      width: 150,
                      height: 150,
                      border: "2px dashed #FF7F11",
                      borderRadius: 12,
                      margin: "0 auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FF7F11",
                    }}
                  >
                    QR Code
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
