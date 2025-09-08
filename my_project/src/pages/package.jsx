import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const Packages = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/packages")
      .then((res) => res.json())
      .then((data) => {
        const grouped = {};
        data.forEach((pkg) => {
          if (!grouped[pkg.duration]) {
            grouped[pkg.duration] = {};
          }
          grouped[pkg.duration][pkg.user_type] = pkg.price;
        });
        setPackages(grouped);
      })
      .catch((err) => console.error("Error fetching packages:", err));
  }, []);

  const durations = [
    { key: "monthly", label: "รายเดือน" },
    { key: "4-month", label: "4 เดือน" },
  ];

  const userTypes = [
    { key: "student", label: "นักเรียน/นักศึกษา" },
    { key: "university_staff", label: "บุคลากรในมหาวิทยาลัย" },
    { key: "external", label: "บุคคลภายนอก" },
  ];

  const handleSubscribe = (durationLabel, userTypeLabel, price) => {
    alert(
      `คุณเลือกสมัครแพ็กเกจ: ${durationLabel} สำหรับ ${userTypeLabel} ราคา ${price} บาท`
    );
  };

  return (
    <div
      style={{
        background: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "80px",
        paddingBottom: "60px",
      }}
    >
      <Container>
        <h2 className="text-center mb-5 fw-bold text-dark display-5">
          แพ็กเกจค่าใช้บริการ
        </h2>

        {/* Header ตาราง */}
        <Row className="mb-4">
          <Col xs={3}></Col>
          {userTypes.map((type) => (
            <Col key={type.key} className="text-center fw-bold fs-5 text-secondary">
              {type.label}
            </Col>
          ))}
        </Row>

        {/* แสดงแพ็กเกจ */}
        {durations.map((duration) => (
          <Row key={duration.key} className="mb-5 align-items-center">
            <Col xs={3} className="fw-bold fs-4 text-secondary text-end pe-4">
              {duration.label}
            </Col>

            {userTypes.map((type) => (
              <Col
                key={type.key}
                className="d-flex justify-content-center mb-3 mb-md-0"
              >
                <Card
                  className="shadow-sm border-0 rounded-4 text-center"
                  style={{
                    minWidth: 180,
                    backgroundColor: "#ffffff",
                    transition: "all 0.3s ease",
                    cursor: packages[duration.key]?.[type.key]
                      ? "pointer"
                      : "not-allowed",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 25px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                  }}
                >
                  <Card.Body>
                    <Card.Text className="fw-bold fs-4 text-dark mb-2">
                      {packages[duration.key]?.[type.key] ?? "-"}{" "}
                      <span className="fs-6 text-muted">บาท</span>
                    </Card.Text>
                    <Button
                      variant="primary"
                      className="rounded-pill px-4 py-2 fw-bold"
                      style={{
                        background: "#ff4500",
                        border: "none",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() =>
                        handleSubscribe(
                          duration.label,
                          type.label,
                          packages[duration.key]?.[type.key]
                        )
                      }
                      disabled={!packages[duration.key]?.[type.key]}
                    >
                      สมัครเลย
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ))}
      </Container>
    </div>
  );
};

export default Packages;
