import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // ✅ เพิ่ม useLocation
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import Cookies from 'js-cookie';
import './Navbar.css';

const Navigation = () => { // ✅ เปลี่ยนชื่อ Component ให้ตรงกับ export
  const token = Cookies.get('token');
  const role = Cookies.get('role');
  const username = Cookies.get('username');
  const isAdmin = role === 'admin';
  const location = useLocation(); // ✅ ใช้เช็ค path ปัจจุบัน

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    Cookies.remove('username');
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar expand="lg" sticky="top" className="custom-navbar shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center logo-container">
          <img src="/images/logo.png" alt="Fitness Logo" className="logo-img" />
          <span className="logo-text">SU.ED FITNESS CENTER</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-link special-font ${isActive("/") ? "active-link" : ""}`}
            >
              หน้าแรก
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/schedule"
              className={`nav-link special-font ${isActive("/schedule") ? "active-link" : ""}`}
            >
              ตารางเวลา
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/news"
              className={`nav-link special-font ${isActive("/news") ? "active-link" : ""}`}
            >
              ข่าวสาร
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/package"
              className={`nav-link special-font ${isActive("/package") ? "active-link" : ""}`}
            >
              สมาชิก
            </Nav.Link>

            {/* ✅ เมนูเฉพาะ admin */}
            {isAdmin && (
              <Nav.Link
                as={Link}
                to="/admin/news"
                className={`nav-link special-font ${isActive("/admin/news") ? "active-link" : ""}`}
              >
                จัดการข่าวสาร
              </Nav.Link>
            )}

            {token ? (
              <NavDropdown title={`สวัสดี, ${username || "ผู้ใช้"}`} id="user-nav-dropdown" align="end">
                <NavDropdown.Item onClick={handleLogout}>ออกจากระบบ</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex gap-2 ms-3">
                <Button as={Link} to="/login" className={`login-button ${isActive("/login") ? "active-btn" : ""}`}>
                  Login
                </Button>
                <Button as={Link} to="/signin" className={`sign-button ${isActive("/signin") ? "active-btn" : ""}`}>
                  Sign In
                </Button>
              </div>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; // ✅ แก้ตรงนี้ให้ตรงกับชื่อ Component
