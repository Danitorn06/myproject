import React, { useState } from 'react';

const ForgotPassword = () => {
  const [login, setLogin] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login }), // username หรือ email
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'ไม่สามารถดำเนินการได้');
        return;
      }

      setMessage('ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว');
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundImage: 'url(/images/lgbackground.jpg)' }}
    >
      <div
        className="card shadow-lg p-5 rounded-4"
        style={{ maxWidth: "500px", width: "100%", backgroundColor: "rgba(255,255,255,0.85)" }}
      >
        <h2 className="text-center mb-3 text-primary">ลืมรหัสผ่าน</h2>
        <p className="text-center text-muted mb-4">
          กรอกชื่อผู้ใช้หรืออีเมลที่ใช้สมัคร
        </p>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-danger text-center">{error}</p>}
          {message && <p className="text-success text-center">{message}</p>}

          <div className="mb-4">
            <label className="form-label">ชื่อผู้ใช้ หรือ อีเมล</label>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Username หรือ Email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100"
            disabled={loading}
          >
            {loading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
          </button>

          <p className="text-center mt-4">
            <a href="/login" className="fw-bold">กลับไปหน้าเข้าสู่ระบบ</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;