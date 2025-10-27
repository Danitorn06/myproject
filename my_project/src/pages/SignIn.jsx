import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // handle change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      // รวมชื่อ + นามสกุล
      const fullName = `${formData.first_name} ${formData.last_name}`;

      // สมัครสมาชิก
      const res = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,   // ✅ ส่ง full_name ไปแทน
          username: formData.username,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          role: "user"
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      // เก็บ token และ user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError("เซิร์ฟเวอร์ไม่ตอบสนอง");
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center vh-100 login-bg"
      style={{ backgroundImage: 'url(/images/snbg.jpg)' }}
    >
      <div 
        className="card shadow-lg p-5 rounded-4" 
        style={{ maxWidth: "600px", width: "100%", backgroundColor: "rgba(255,255,255,0.85)", position: "relative", zIndex: 1 }}
      >
        <h2 className="text-center mb-4 text-primary" style={{ fontSize: "2rem" }}>
          สมัครสมาชิก
        </h2>
        
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* ชื่อ และ นามสกุล */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">ชื่อ</label>
              <input 
                type="text" 
                name="first_name" 
                className="form-control" 
                placeholder="ชื่อ" 
                value={formData.first_name}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="col">
              <label className="form-label">นามสกุล</label>
              <input 
                type="text" 
                name="last_name" 
                className="form-control" 
                placeholder="นามสกุล" 
                value={formData.last_name}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          {/* ชื่อผู้ใช้ และ เบอร์โทร */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">ชื่อผู้ใช้</label>
              <input 
                type="text" 
                name="username" 
                className="form-control" 
                placeholder="ชื่อผู้ใช้" 
                value={formData.username}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="col">
              <label className="form-label">เบอร์โทร</label>
              <input 
                type="tel" 
                name="phone" 
                className="form-control" 
                placeholder="เบอร์โทร" 
                value={formData.phone}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          {/* อีเมล */}
          <div className="mb-3">
            <label className="form-label">อีเมล</label>
            <input 
              type="email" 
              name="email" 
              className="form-control" 
              placeholder="example@email.com" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          {/* รหัสผ่าน และ ยืนยันรหัสผ่าน */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">รหัสผ่าน</label>
              <input 
                type="password" 
                name="password" 
                className="form-control" 
                placeholder="รหัสผ่าน" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="col">
              <label className="form-label">ยืนยันรหัสผ่าน</label>
              <input 
                type="password" 
                name="confirm_password" 
                className="form-control" 
                placeholder="ยืนยันรหัสผ่าน" 
                value={formData.confirm_password}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            สมัครสมาชิก
          </button>

          <p className="text-center mt-3 mb-0" style={{ fontSize: "1rem" }}>
            มีบัญชีแล้ว? <a href="/login" className="text-decoration-none text-primary fw-bold">เข้าสู่ระบบ</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
