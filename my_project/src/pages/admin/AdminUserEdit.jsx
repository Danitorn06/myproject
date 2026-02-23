import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  Spinner
} from "react-bootstrap";
import Cookies from "js-cookie";

const AdminUserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "user",
  });

  const [loadingPage, setLoadingPage] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // ================= FETCH USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/admin/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();

        setForm({
          username: data.username || "",
          email: data.email || "",
          role: data.role || "user",
        });
      } catch (err) {
        alert("ไม่พบข้อมูลผู้ใช้");
        navigate("/admin/users");
      } finally {
        setLoadingPage(false);
      }
    };

    fetchUser();
  }, [id, token, navigate]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const submitEdit = async () => {
    try {
      setLoadingSubmit(true);

      const res = await fetch(
        `http://localhost:8080/api/v1/admin/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error();

      alert("บันทึกการแก้ไขเรียบร้อยแล้ว");
      navigate("/admin/users");
    } catch {
      alert("เกิดข้อผิดพลาดในการแก้ไข");
    } finally {
      setLoadingSubmit(false);
      setShowConfirm(false);
    }
  };

  // ================= LOADING PAGE =================
  if (loadingPage) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card style={{ border: "2px solid #FF7F11" }}>
            <Card.Body>
              <Card.Title>แก้ไขผู้ใช้</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                User ID: {id}
              </Card.Subtitle>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="fitness_staff">Staff</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/admin/users")}
                  >
                    ยกเลิก
                  </Button>
                  <Button type="submit">
                    บันทึก
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CONFIRM MODAL */}
      <Modal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        centered
      >
        <div style={{ border: "2px solid #FF7F11", borderRadius: "8px" }}>
          <Modal.Header closeButton>
            <Modal.Title>ยืนยันการแก้ไข</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            คุณต้องการบันทึกการแก้ไขข้อมูลผู้ใช้นี้ใช่หรือไม่?
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirm(false)}
            >
              ยกเลิก
            </Button>
            <Button
              style={{
                backgroundColor: "#FF7F11",
                borderColor: "#FF7F11",
              }}
              onClick={submitEdit}
              disabled={loadingSubmit}
            >
              {loadingSubmit ? "กำลังบันทึก..." : "ยืนยัน"}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </Container>
  );
};

export default AdminUserEdit;