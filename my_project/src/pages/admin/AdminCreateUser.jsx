import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function AdminCreateUser() {
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    role: "admin"
  });

  const token = Cookies.get("token");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
      .then((res) => {
        if (res.ok) navigate("/admin/users");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container className="py-5" style={{ maxWidth: 600 }}>
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4">Create Admin</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Form.Group>

          <Button type="submit" className="w-100" variant="primary">
            Create Admin
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
