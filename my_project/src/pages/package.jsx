import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";   // ← เพิ่ม
import "./package.css";

const Packages = () => {
  const [packages, setPackages] = useState({});
  const navigate = useNavigate(); // ← เพิ่ม

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/packages")
      .then((res) => res.json())
      .then((data) => {
        const grouped = {};
        data.forEach((pkg) => {
          if (!grouped[pkg.duration]) grouped[pkg.duration] = {};
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

  // 👉 เมื่อกดปุ่มสมัคร จะส่งข้อมูลไปหน้า PackageInfo
  const handleSubscribe = (durationLabel, userTypeLabel, price) => {
    navigate("/membership", {
      state: {
        duration: durationLabel,
        userType: userTypeLabel,
        price: price,
      },
    });
  };

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", padding: "80px 0" }}>
      <Container>
        <div className="header-section text-center mb-4">
          <h2>💳 สมาชิกสำหรับทุกคน</h2>
          <p>เลือกแพ็กเกจที่เหมาะกับคุณ</p>
        </div>

        {durations.map((duration) => (
          <div key={duration.key} className="mb-5">
            <h3 className="fw-bold text-center mb-4">{duration.label}</h3>
            <Row className="justify-content-center">
              {userTypes.map((type) => {
                const price = packages[duration.key]?.[type.key];
                return (
                  <Col key={type.key} xs={12} md={6} lg={4} className="mb-4">
                    <Card
                      className="shadow-lg border-0 rounded-4 h-100 card-hover"
                    >
                      <div
                        style={{
                          background: "#ff4500",
                          height: "120px",
                          borderTopLeftRadius: "1rem",
                          borderTopRightRadius: "1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <h2 className="text-white fw-bold m-0">{type.label}</h2>
                      </div>

                      <Card.Body className="text-center d-flex flex-column justify-content-between">
                        <div>
                          <Card.Title className="fw-bold fs-4 text-dark">
                            {price ? `${price} บาท` : "-"}
                          </Card.Title>
                          <Card.Text className="text-muted fs-6">
                            ราคาเริ่มต้น / {duration.label}
                          </Card.Text>
                        </div>

                        <Button
                          variant="danger"
                          className="rounded-pill px-4 py-2 fw-bold mt-3"
                          disabled={!price}
                          onClick={() =>
                            handleSubscribe(duration.label, type.label, price)
                          }
                        >
                          สมัครเลย
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default Packages;
