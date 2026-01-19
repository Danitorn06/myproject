import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Alert, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function MembershipPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const { duration, userType, price, package_id } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!package_id) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          ไม่พบข้อมูลแพ็กเกจ กรุณากลับไปเลือกแพ็กเกจ
        </Alert>
        <Button onClick={() => navigate("/package")}>กลับไปเลือกแพ็กเกจ</Button>
      </Container>
    );
  }

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/v1/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ package_id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "สมัครสมาชิกไม่สำเร็จ");
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">สมัครสมาชิกแพ็กเกจ</h2>

      {/* ข้อมูลแพ็กเกจ */}
      <Card className="p-4 mb-4 shadow-sm">
        <h5>แพ็กเกจที่คุณเลือก</h5>
        <p><strong>ประเภทผู้ใช้:</strong> {userType}</p>
        <p><strong>ระยะเวลา:</strong> {duration}</p>
        <p><strong>ราคา:</strong> {price} บาท</p>
      </Card>

      <Row className="g-4">
        {/* Left — Upload Document + PAR-Q */}
        <Col md={6}>
          <Card className="shadow-sm p-3" style={{ borderRadius: "16px" }}>
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

          <Card className="shadow-sm p-4 mt-4" style={{ borderRadius: "16px" }}>
            <h5 className="mb-3">แบบสอบถามความพร้อมในการออกกำลังกาย</h5>
            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
              โปรดตอบคำถามต่อไปนี้ (ถ้าไม่ตอบ ถือว่าท่านไม่เคย)
            </p>

            {[
              "แพทย์เคยวินิจฉัยว่ามีความผิดปกติของหัวใจ และควรออกกำลังกายภายใต้คำแนะนำของแพทย์หรือไม่",
              "ท่านมีอาการเจ็บหน้าอก ขณะออกกำลังกายหรือไม่",
              "ในเดือนที่ผ่านมา ท่านมีอาการเจ็บหน้าอก ขณะพักอยู่โดยไม่ได้ออกกำลังกายหรือไม่",
              "ท่านมีอาการสูญเสียการทรงตัว (เช่น เวียนศีรษะ) หรือหมดสติหรือไม่",
              "ท่านมีปัญหากระดูกหรือข้อต่อ ซึ่งจะมีอาการแย่ลงเมื่อออกกำลังกายหรือไม่",
              "แพทย์เคยวินิจฉัยว่าท่านมีภาวะความดันโลหิตสูง หรือโรคหัวใจหรือไม่",
              "ท่านทราบหรือไม่ว่ามีเหตุผลอื่นใดที่ทำให้ท่านไม่สามารถออกกำลังกายได้",
            ].map((question, index) => (
              <Form.Group key={index} className="mb-3">
                <Form.Label>{index + 1}. {question}</Form.Label>
                <div className="d-flex gap-4 mt-1">
                  <Form.Check inline type="radio" name={`parq_${index}`} label="ไม่เคย" />
                  <Form.Check inline type="radio" name={`parq_${index}`} label="เคย" />
                </div>
              </Form.Group>
            ))}

            <hr />

            <Form.Check
              type="checkbox"
              label="ข้าพเจ้ายอมรับและรับรองว่าข้อมูลดังกล่าวเป็นความจริงทุกประการ และยินยอมปฏิบัติตามระเบียบของศูนย์ SU.ED Fitness Center"
            />
          </Card>
        </Col>

        {/* Right — ข้อมูลผู้สมัคร + สมัคร */}
        <Col md={6}>
          <Card className="shadow-sm p-4" style={{ borderRadius: "16px" }}>
            <h5 className="mb-3">ข้อมูลผู้สมัคร</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>ชื่อ - นามสกุล</Form.Label>
                <Form.Control type="text" placeholder="กรอกชื่อและนามสกุล" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>วันเดือนปีเกิด</Form.Label>
                <Form.Control type="date" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>ที่อยู่ปัจจุบัน</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="กรอกที่อยู่ปัจจุบัน" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>เพศ</Form.Label>
                <Form.Select>
                  <option value="">-- เลือกเพศ --</option>
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                  <option value="other">อื่น ๆ</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>โทรศัพท์</Form.Label>
                <Form.Control type="tel" placeholder="กรอกเบอร์โทรศัพท์" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>E-mail</Form.Label>
                <Form.Control type="email" placeholder="example@email.com" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>LINE ID</Form.Label>
                <Form.Control type="text" placeholder="กรอก LINE ID" />
              </Form.Group>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">สมัครสมาชิกเรียบร้อยแล้ว!</Alert>}

              {!success && (
                <Button
                  variant="danger"
                  className="w-100 rounded-pill mt-3"
                  onClick={handleSubscribe}
                  disabled={loading}
                >
                  {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
                </Button>
              )}

              {success && (
                <Button
                  variant="primary"
                  className="w-100 rounded-pill mt-3"
                  onClick={() => navigate("/Myprofile")}
                >
                  ไปที่โปรไฟล์ของฉัน
                </Button>
              )}

              <Button
                variant="dark"
                className="w-100 rounded-pill mt-3"
                onClick={() => window.print()}
              >
                Print Document
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
