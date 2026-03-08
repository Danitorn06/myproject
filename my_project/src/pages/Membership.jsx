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

  // ⭐ เก็บ membership_id หลังสร้าง
  const [membershipId, setMembershipId] = useState(null);

  // -------------------------------
  // Applicant Info
  // -------------------------------
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "",
    birth_date: "",
    phone: "",
    email: "",
    line_id: "",
    user_type: "",
    faculty: "",
    major: "",
    student_id: "",
    department: "",
    emergency_name: "",
    emergency_phone: "",
    known_from: "",
  });

  // -------------------------------
  // Health Answers
  // -------------------------------
  const [healthAnswers, setHealthAnswers] = useState({});
  const [accepted, setAccepted] = useState(false);

  if (!package_id) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          ไม่พบข้อมูลแพ็กเกจ กรุณากลับไปเลือกแพ็กเกจ
        </Alert>
        <Button onClick={() => navigate("/package")}>
          กลับไปเลือกแพ็กเกจ
        </Button>
      </Container>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleHealthChange = (index, value) => {
    setHealthAnswers((prev) => ({
      ...prev,
      [index + 1]: value,
    }));
  };

  // =====================================================
  // STEP 1️⃣ สมัครสมาชิก (สร้าง membership ก่อน)
  // =====================================================
  const handleCreateMembership = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "http://localhost:8080/api/v1/membership",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ package_id }),
        }
      );

      if (!res.ok) {
        throw new Error("สร้าง membership ไม่สำเร็จ");
      }

      const data = await res.json();
      const id = data.data?.membership_id;

      if (!id) {
        throw new Error("ไม่ได้รับ membership_id จากระบบ");
      }

      setMembershipId(id);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STEP 2️⃣ ส่ง info + health
  // =====================================================
  const handleConfirmAll = async () => {
    setLoading(true);
    setError("");

    try {
      if (!membershipId) {
        throw new Error("กรุณากดสมัครสมาชิกก่อน");
      }

      if (Object.keys(healthAnswers).length !== 7) {
        throw new Error("กรุณาตอบแบบสอบถามให้ครบทุกข้อ");
      }

      if (!accepted) {
        throw new Error("กรุณายอมรับเงื่อนไขก่อนสมัคร");
      }

      // POST membership-info
      // clone ก่อน
      const dataToSend = {
        membership_id: membershipId,
        ...formData,
        birth_date: formData.birth_date
          ? new Date(formData.birth_date).toISOString()
          : null
      };

      const resInfo = await fetch(
        "http://localhost:8080/api/v1/membership-info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend), // 👈 ใช้ตัวนี้แทน
        }
      );

      if (!resInfo.ok) {
        throw new Error("บันทึกข้อมูลผู้สมัครไม่สำเร็จ");
      }

      // POST health-answer
      // แปลงเป็น array
      const healthData = Object.keys(healthAnswers).map((key) => ({
        membership_id: membershipId,
        question_id: Number(key),
        answer: healthAnswers[key],
      }));

      const resHealth = await fetch(
        "http://localhost:8080/api/v1/health-answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            q1: healthAnswers[1],
            q2: healthAnswers[2],
            q3: healthAnswers[3],
            q4: healthAnswers[4],
            q5: healthAnswers[5],
            q6: healthAnswers[6],
            q7: healthAnswers[7],
          }), // 👈 ส่งเป็น array
        }
      );

      if (!resHealth.ok) {
        throw new Error("บันทึกแบบสอบถามสุขภาพไม่สำเร็จ");
      }
      setSuccess(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">สมัครสมาชิกแพ็กเกจ</h2>

      <Card className="p-4 mb-4 shadow-sm">
        <h5>แพ็กเกจที่คุณเลือก</h5>
        <p><strong>ประเภทผู้ใช้:</strong> {userType}</p>
        <p><strong>ระยะเวลา:</strong> {duration}</p>
        <p><strong>ราคา:</strong> {price} บาท</p>

        {membershipId && (
          <Alert variant="info">
            Membership ID: {membershipId}
          </Alert>
        )}
      </Card>

      <Row className="g-4">

        {/* LEFT: Health */}
        <Col md={6}>
          <Card className="shadow-sm p-4">
            <h5>แบบสอบถามสุขภาพ</h5>

            {[
              "แพทย์เคยวินิจฉัยว่ามีปัญหาหัวใจหรือไม่",
              "เจ็บหน้าอกขณะออกกำลังกายหรือไม่",
              "เดือนที่ผ่านมาเจ็บหน้าอกขณะพักหรือไม่",
              "เคยเวียนศีรษะหรือหมดสติหรือไม่",
              "มีปัญหากระดูกหรือข้อต่อหรือไม่",
              "เคยเป็นความดันหรือโรคหัวใจหรือไม่",
              "มีเหตุผลอื่นที่ไม่ควรออกกำลังกายหรือไม่",
            ].map((question, index) => (
              <Form.Group key={index} className="mb-3">
                <Form.Label>{index + 1}. {question}</Form.Label>
                <div className="d-flex gap-4 mt-1">
                  <Form.Check
                    inline
                    type="radio"
                    name={`parq_${index}`}
                    label="ไม่เคย"
                    onChange={() => handleHealthChange(index, false)}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    name={`parq_${index}`}
                    label="เคย"
                    onChange={() => handleHealthChange(index, true)}
                  />
                </div>
              </Form.Group>
            ))}

            <Form.Check
              type="checkbox"
              className="mt-3"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              label="ข้าพเจ้ายอมรับเงื่อนไขทั้งหมด"
            />
          </Card>
        </Col>

        {/* RIGHT: Info */}
        <Col md={6}>
          <Card className="shadow-sm p-4">
            <h5>ข้อมูลผู้สมัคร</h5>

            <Form>

              {/* ชื่อ */}
              <Form.Group className="mb-3">
                <Form.Label>ชื่อ - นามสกุล</Form.Label>
                <Form.Control
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* เพศ */}
              <Form.Group className="mb-3">
                <Form.Label>เพศ</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">เลือกเพศ</option>
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                </Form.Select>
              </Form.Group>

              {/* วันเกิด */}
              <Form.Group className="mb-3">
                <Form.Label>วันเดือนปีเกิด</Form.Label>
                <Form.Control
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}

                />
              </Form.Group>

              {/* โทรศัพท์ */}
              <Form.Group className="mb-3">
                <Form.Label>โทรศัพท์</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* LINE */}
              <Form.Group className="mb-3">
                <Form.Label>LINE ID</Form.Label>
                <Form.Control
                  type="text"
                  name="line_id"
                  value={formData.line_id}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* ประเภทผู้ใช้ */}
              <Form.Group className="mb-3">
                <Form.Label>ประเภทสมาชิก</Form.Label>
                <Form.Select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                >
                  <option value="">เลือกประเภท</option>
                  <option value="student">นักศึกษา</option>
                  <option value="university_staff">บุคลากร</option>
                  <option value="external">บุคคลภายนอก</option>
                </Form.Select>
              </Form.Group>

              {/* คณะ */}
              <Form.Group className="mb-3">
                <Form.Label>คณะ</Form.Label>
                <Form.Control
                  type="text"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* สาขา */}
              <Form.Group className="mb-3">
                <Form.Label>สาขา</Form.Label>
                <Form.Control
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* รหัสนักศึกษา */}
              <Form.Group className="mb-3">
                <Form.Label>รหัสนักศึกษา</Form.Label>
                <Form.Control
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* หน่วยงาน */}
              <Form.Group className="mb-3">
                <Form.Label>หน่วยงาน (กรณีบุคลากร)</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* ผู้ติดต่อฉุกเฉิน */}
              <Form.Group className="mb-3">
                <Form.Label>ชื่อผู้ติดต่อฉุกเฉิน</Form.Label>
                <Form.Control
                  type="text"
                  name="emergency_name"
                  value={formData.emergency_name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>เบอร์ผู้ติดต่อฉุกเฉิน</Form.Label>
                <Form.Control
                  type="text"
                  name="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* รู้จักจากไหน */}
              <Form.Group className="mb-3">
                <Form.Label>รู้จักเราจากไหน</Form.Label>
                <Form.Control
                  type="text"
                  name="known_from"
                  value={formData.known_from}
                  onChange={handleChange}
                />
              </Form.Group>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">สมัครสมาชิกเรียบร้อยแล้ว!</Alert>}

              {!membershipId ? (
                <Button
                  variant="primary"
                  className="w-100 mt-3"
                  onClick={handleCreateMembership}
                  disabled={loading}
                >
                  สมัครสมาชิก
                </Button>
              ) : (
                <Button
                  variant="danger"
                  className="w-100 mt-3"
                  onClick={handleConfirmAll}
                  disabled={loading}
                >
                  ยืนยันข้อมูลทั้งหมด
                </Button>
              )}

            </Form>
          </Card>
        </Col>

      </Row>
    </Container>
  );
}