import React, { useEffect, useState } from "react";
import { Table, Container, Button, Badge, Spinner } from "react-bootstrap";
import Cookies from "js-cookie";

export default function AdminMembershipList() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");

  // 🔹 Load memberships
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/memberships", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // ✅ เรียงตาม user_id
          const sorted = [...data].sort(
            (a, b) => (a.user?.user_id || 0) - (b.user?.user_id || 0)
          );
          setMemberships(sorted);
        } else {
          setMemberships([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  // 🔹 Cancel membership
  const handleCancel = (membershipId) => {
    if (!window.confirm("ต้องการยกเลิก Membership นี้หรือไม่?")) return;

    fetch(`http://localhost:8080/api/v1/memberships/${membershipId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Cancel failed");
        return res.json();
      })
      .then(() => {
        // update state
        setMemberships((prev) =>
          prev.map((m) =>
            m.membership_id === membershipId
              ? { ...m, status: "cancelled" }
              : m
          )
        );
      })
      .catch((err) => alert(err.message));
  };

  // 🔹 Status badge
  const statusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge bg="success">Active</Badge>;
      case "expired":
        return <Badge bg="secondary">Expired</Badge>;
      case "cancelled":
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="dark">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2>Member Memberships</h2>

      <Table bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>User ID</th>
            <th>Member</th>
            <th>Username</th>
            <th>Package</th>
            <th>Duration</th>
            <th>Start</th>
            <th>Expire</th>
            <th>Status</th>
            <th width="120">Action</th>
          </tr>
        </thead>

        <tbody>
          {memberships.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center text-muted">
                ไม่พบข้อมูล Membership
              </td>
            </tr>
          ) : (
            memberships.map((m, index) => (
              <tr key={m.membership_id}>
                {/* ลำดับ */}
                <td>{index + 1}</td>

                {/* user_id จริง */}
                <td>{m.user?.user_id}</td>

                <td>{m.user?.full_name || "-"}</td>
                <td>@{m.user?.username || "-"}</td>

                <td>{m.package?.user_type || "-"}</td>
                <td>{m.package?.duration || 0} เดือน</td>

                <td>
                  {m.start_date
                    ? new Date(m.start_date).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  {m.end_date
                    ? new Date(m.end_date).toLocaleDateString()
                    : "-"}
                </td>

                <td>{statusBadge(m.status)}</td>

                <td>
                  {m.status === "active" && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancel(m.membership_id)}
                    >
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}
