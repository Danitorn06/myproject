import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaYoutube, FaLine } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light pt-5 pb-4 mt-5">
      <Container>
        <Row className="align-items-start">
          {/* โลโก้ฝั่งซ้าย */}
          <Col xs={12} md={3} className="mb-4 text-center text-md-start">
            <img
              src="/images/logo.png"
              alt="Logo"
              style={{
                width: "140px",
                height: "140px",      // ต้องใส่ height เท่ากับ width
                marginBottom: "20px",
                borderRadius: "50%",   // ทำให้เป็นวงกลม
                objectFit: "cover"     // ครอบรูปให้เต็มวงกลม
              }}
            />
          </Col>

          {/* คอลัมน์ลิงก์ */}
          <Col xs={12} md={6} className="mb-4">
            <Row>
              <Col xs={6} md={4} className="mb-3">
                <h6 className="fw-bold mb-3">คลับ</h6>
                <ul className="list-unstyled footer-links">
                  <li><button className="footer-link-btn">ข่าวสาร</button></li>
                  <li><button className="footer-link-btn">ตารางเวลา</button></li>
                  <li><button className="footer-link-btn">สมาชิก</button></li>
                </ul>
              </Col>

              <Col xs={6} md={4} className="mb-3">
                <h6 className="fw-bold mb-3">ติดต่อเรา</h6>
                <ul className="list-unstyled footer-links">
                  <li><button className="footer-link-btn">พูดคุยกับเรา</button></li>
                </ul>
              </Col>
              <Col xs={6} md={4} className="mb-3">
                <h6 className="fw-bold mb-3">ข้อมูลเพิ่มเติม</h6>
                <ul className="list-unstyled footer-links">
                  <li><button className="footer-link-btn">กฎระเบียบข้อบังคับ</button></li>
                  <li><button className="footer-link-btn">คำถามที่พบบ่อย</button></li>
                </ul>
              </Col>
            </Row>
          </Col>

          {/* โลโก้ + โซเชียลด้านขวา */}
          <Col xs={12} md={3} className="text-center text-md-end">
            <img
              src="/path/to/second-logo.png"
              alt="Logo 2"
              style={{ width: "120px", marginBottom: "20px" }}
            />
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <button className="social-icon"><FaFacebookF /></button>
              <button className="social-icon"><FaInstagram /></button>
              <button className="social-icon"><FaYoutube /></button>
              <button className="social-icon"><FaLine /></button>
            </div>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        <Row>
          <Col className="text-center small text-muted">
            © 2025 SU.ED Fitness Center. สงวนลิขสิทธิ์ |
            <a href="/terms" className="text-light">Terms</a> |
            <a href="/privacy" className="text-light">Privacy</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
