import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";

export default function PackageInfo() {
  const { state } = useLocation();
  const { duration, userType, price } = state || {};

  return (
    <Container className="py-5">
      <h2 className="mb-4">สมัครแพ็กเกจ</h2>

      <Card className="p-4 mb-4 shadow-sm">
        <h5>แพ็กเกจที่คุณเลือก</h5>
        <p><strong>ประเภทผู้ใช้:</strong> {userType}</p>
        <p><strong>ระยะเวลา:</strong> {duration}</p>
        <p><strong>ราคา:</strong> {price} บาท</p>
      </Card>

      <Row className="g-4">
        {/* Left — Upload Document */}
        <Col md={6}>
          <Card className="shadow-sm p-3" style={{ borderRadius: "16px" }}>
            <h5 className="mb-3">อัปโหลดเอกสาร</h5>
            <div
              style={{
                width: "100%",
                height: "420px",
                border: "2px dashed #aaa",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#777",
                backgroundColor: "#fafafa",
              }}
            >
              Document Image Preview
            </div>
          </Card>
        </Col>

        {/* Right — Form */}
        <Col md={6}>
          <Card className="shadow-sm p-4" style={{ borderRadius: "16px" }}>
            <h5 className="mb-3">ข้อมูลผู้สมัคร</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your full name" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="text" placeholder="Enter your phone number" />
              </Form.Group>

              <Button variant="dark" className="px-4 py-2 w-100 mt-3 rounded-pill">
                สมัครสมาชิก
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
