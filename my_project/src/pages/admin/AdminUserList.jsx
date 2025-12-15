import React, { useEffect, useState } from "react";
import { Table, Button, Container, Row, Col, Form, Badge } from "react-bootstrap";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching users:", err));
  }, [token]);

  const filteredUsers = users.filter((u) =>
    (u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter ? u.role === roleFilter : true)
  );

  const roleBadge = (role) => {
    switch (role) {
      case "admin": return <Badge bg="danger">Admin</Badge>;
      case "fitness_staff": return <Badge bg="warning">Staff</Badge>;
      default: return <Badge bg="secondary">User</Badge>;
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-3 align-items-center">
        <Col><h2>Manage Users</h2></Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => navigate("/admin/users/create")}>
            + Create Admin
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by name, username, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col md={4}>
          <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="fitness_staff">Staff</option>
            <option value="user">User</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Table */}
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th width="150px">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-muted">No users found</td>
            </tr>
          ) : (
            filteredUsers.map((u, index) => (
              <tr key={u.id}>
                <td>{index + 1}</td>
                <td>{u.full_name}</td>
                <td>@{u.username}</td>
                <td>{u.email}</td>
                <td>{roleBadge(u.role)}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    size="sm"
                    onClick={() => navigate(`/admin/users/edit/${u.id}`)}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}

