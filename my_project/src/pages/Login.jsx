import React, { useState } from 'react';
import Cookies from 'js-cookie';
import './login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        // ✅ เก็บ token, role, username ใน cookie (อายุ 1 วัน)
        Cookies.set('token', data.token, { expires: 1 });
        Cookies.set('role', data.user.role, { expires: 1 });
        Cookies.set('username', data.user.username, { expires: 1 });

        // ✅ เช็ค role ของ user
        if (data.user.role === "admin") {
          window.location.href = '/admin/news';
        } else {
          window.location.href = '/user/home';
        }
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center vh-100 login-bg" 
      style={{ backgroundImage: 'url(/images/lgbackground.jpg)' }}
    >
      <div 
        className="card shadow-lg p-5 rounded-4" 
        style={{ maxWidth: "500px", width: "100%", backgroundColor: "rgba(255,255,255,0.85)", position: "relative", zIndex: 1 }}
      >
        <h2 className="text-center mb-4 text-primary" style={{ fontSize: "2rem" }}>เข้าสู่ระบบ</h2>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-danger text-center">{error}</p>}

          <div className="mb-4">
            <label className="form-label" style={{ fontSize: "1.1rem" }}>อีเมล</label>
            <input 
              type="email" 
              className="form-control form-control-lg" 
              placeholder="example@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label" style={{ fontSize: "1.1rem" }}>รหัสผ่าน</label>
            <input 
              type="password" 
              className="form-control form-control-lg" 
              placeholder="กรอกรหัสผ่าน" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100">เข้าสู่ระบบ</button>

          <p className="text-center mt-4 mb-0" style={{ fontSize: "1rem" }}>
            ยังไม่มีบัญชี? <a href="/signin" className="text-decoration-none text-primary fw-bold">สมัครสมาชิก</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
