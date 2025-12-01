import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import './login.css';

const User = () => {
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8080/api/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data.user);
        setMembership(data.membership);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, [token]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2>สวัสดี, {user.full_name}</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Role: {user.role}</p>

      {membership && membership.package_name ? (
        <div className="mt-4">
          <h4>Membership ปัจจุบัน</h4>
          <p>Package: {membership.package_name}</p>
          <p>หมดอายุ: {membership.expire_date}</p>
        </div>
      ) : (
        <div className="mt-4">
          <p>คุณยังไม่มี Membership</p>
          <Link to="/package">
            <button className="btn btn-primary">เลือก Package</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default User;
