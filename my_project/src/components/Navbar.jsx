import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; 
  };

  return (
    <header className="header">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* โลโก้ */}
        <div className="logo-container">
          <img src="/images/logo.png" alt="Fitness Logo" className="logo-img" />
          <h1 className="logo-text">SU.ED FITNESS CENTER</h1>
        </div>

        {/* เมนู */}
        <nav className="nav">
          <Link className="nav-link" to="/">หน้าแรก</Link>
          <Link className="nav-link" to="/schedule">ตารางเวลา</Link>
          <Link className="nav-link" to="/news">ข่าวสาร</Link>
          <Link className="nav-link" to="/package">สมาชิก</Link>

          <div className="auth-buttons">
            {token ? (
              <>
                <span className="me-3">สวัสดี, {user?.username || "ผู้ใช้"}</span>
                <button className="logout-button" onClick={handleLogout}>
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-button">Login</Link>
                <Link to="/signin" className="sign-button">Sign In</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
