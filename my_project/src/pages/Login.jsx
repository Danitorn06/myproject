import React, { useState } from 'react';
import Cookies from 'js-cookie';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState(''); // ยังใช้ตัวแปรเดิม แต่ส่งเป็น login
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: email,  // ✅ username หรือ email ใช้ช่องนี้
          password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // ✅ เก็บ cookie
      Cookies.set('token', data.token, { expires: 1 });
      Cookies.set('role', data.user.role, { expires: 1 });
      Cookies.set('username', data.user.username, { expires: 1 });

      // ✅ redirect ตาม role
      if (data.user.role === "admin") {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/';
      }

    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 login-bg"
      style={{ backgroundImage: 'url(/images/lgbackground.jpg)' }}
    >
      <div className="card shadow-lg p-5 rounded-4"
        style={{ maxWidth: "500px", width: "100%", backgroundColor: "rgba(255,255,255,0.85)", zIndex: 1 }}
      >
        <h2 className="text-center mb-4 text-primary">เข้าสู่ระบบ</h2>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-danger text-center">{error}</p>}

          <div className="mb-4">
            <label className="form-label">ชื่อผู้ใช้ หรือ อีเมล</label>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Username หรือ Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">รหัสผ่าน</label>
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

          <p className="text-center mt-4">
            ยังไม่มีบัญชี? <a href="/signin" className="fw-bold">สมัครสมาชิก</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
