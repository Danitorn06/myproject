import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import Cookies from 'js-cookie';
import './Navbar.css';

const Navigation = () => {
  const [username, setUsername] = useState("ผู้ใช้"); // default
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");
  const location = useLocation();

  useEffect(() => {
    const cookieToken = Cookies.get('token') || "";
    const cookieRole = Cookies.get('role') || "";
    const cookieUsername = Cookies.get('username') || "ผู้ใช้";

    setToken(cookieToken);
    setRole(cookieRole);
    setUsername(cookieUsername);
  }, []); // อ่าน cookie ตอน component mount

  //const isAdmin = role.toLowerCase() === 'admin';

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
            <Nav.Link as={Link} to="/" className={`nav-link special-font ${isActive("/") ? "active-link" : ""}`}>หน้าแรก</Nav.Link>
            <Nav.Link as={Link} to="/schedule" className={`nav-link special-font ${isActive("/schedule") ? "active-link" : ""}`}>ตารางเวลา</Nav.Link>
            <Nav.Link as={Link} to="/news" className={`nav-link special-font ${isActive("/news") ? "active-link" : ""}`}>ข่าวสาร</Nav.Link>
            <Nav.Link as={Link} to="/package" className={`nav-link special-font ${isActive("/package") ? "active-link" : ""}`}>สมาชิก</Nav.Link>

            {token ? (
              <NavDropdown title={`สวัสดี, ${username}`} id="user-nav-dropdown" align="end">

                {/* เมนูของ user */}
                {role === "user" && (
                  <>
                    <NavDropdown.Item as={Link} to="/Myprofile">
                      <i className="bi bi-person-circle me-2"></i> ข้อมูลผู้ใช้
                    </NavDropdown.Item>
                  </>
                )}

                {/* เมนูของ admin */}
                {role === "admin" && (
                  <>
                  <NavDropdown.Item as={Link} to="/admin/users">
                      <i className="bi bi-people me-2"></i> จัดการผู้ใช้
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/news">
                      <i className="bi bi-newspaper me-2"></i> จัดการข่าวสาร
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/admin/schedule">
                      <i className="bi bi-calendar-check me-2"></i> จัดการตารางเวลา
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/admin/packages">
                      <i className="bi bi-box-seam me-2"></i> จัดการแพ็กเกจ
                    </NavDropdown.Item>
                    
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      <i className="bi bi-speedometer2 me-2"></i> Dashboard Admin
                    </NavDropdown.Item>

                    <NavDropdown.Divider />
                  </>
                )}

                {/* ปุ่มออกจากระบบ */}
                <NavDropdown.Item as="button" onClick={handleLogout} className="text-danger">
                  <i className="bi bi-box-arrow-right me-1"></i> ออกจากระบบ
                </NavDropdown.Item>

              </NavDropdown>
            ) : (
              <div className="d-flex gap-2 ms-3">
                <Button as={Link} to="/login" className={`login-button ${isActive("/login") ? "active-btn" : ""}`}>Login</Button>
                <Button as={Link} to="/signin" className={`sign-button ${isActive("/signin") ? "active-btn" : ""}`}>Sign In</Button>
              </div>
            )}


          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
