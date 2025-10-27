import React, { useEffect, useState } from "react";
import { Table, Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import axiosInstance from "../../axiosInstance";
import "../package.css";

const AdminPackage = () => {
  const [packages, setPackages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");

  // ✅ โหลดข้อมูลแพ็กเกจทั้งหมด
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axiosInstance.get("/packages", { withCredentials: true });
        setPackages(res.data);
      } catch (err) {
        console.error("โหลดแพ็กเกจล้มเหลว:", err);
        alert("❌ ไม่สามารถโหลดข้อมูลแพ็กเกจได้");
      }
    };
    fetchPackages();
  }, []);

  // ✅ แปล user_type เป็นภาษาไทย
  const translateUserType = (type) => {
    switch (type) {
      case "student":
        return "นักเรียน/นักศึกษา";
      case "university_staff":
        return "บุคลากรในมหาวิทยาลัย";
      case "external":
        return "บุคคลภายนอก";
      default:
        return type;
    }
  };

  // ✅ แก้ไขราคา
  const handleEdit = (pkg) => {
    setEditingId(pkg.package_id);
    setEditedPrice(pkg.price);
  };

  // ✅ บันทึกราคาใหม่
const handleSave = async (pkgId) => {
  try {
    await axiosInstance.put(
      `/packages/${pkgId}`,
      { price: parseFloat(editedPrice) },
      { withCredentials: true }
    );

    // ✅ อัปเดตราคาเฉพาะในรายการเดิมโดยไม่เปลี่ยนลำดับ
    setPackages((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((p) => p.package_id === pkgId);
      if (index !== -1) {
        updated[index] = { ...updated[index], price: editedPrice };
      }
      return updated;
    });

    setEditingId(null);
    alert("✅ อัปเดตราคาเรียบร้อยแล้ว");
  } catch (err) {
    console.error("อัปเดตราคาล้มเหลว:", err);
    alert("❌ ไม่สามารถอัปเดตราคาได้");
  }
};
  // ✅ ยกเลิกการแก้ไข
  const handleCancel = () => {
    setEditingId(null);
    setEditedPrice("");
  };

  // ✅ ลบแพ็กเกจ
  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบแพ็กเกจนี้?")) return;
    try {
      await axiosInstance.delete(`/packages/${id}`, { withCredentials: true });
      setPackages(packages.filter((pkg) => pkg.package_id !== id));
      alert("🗑️ ลบแพ็กเกจเรียบร้อยแล้ว");
    } catch (err) {
      console.error("ลบแพ็กเกจล้มเหลว:", err);
      alert("❌ เกิดข้อผิดพลาดในการลบแพ็กเกจ");
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">📦 จัดการแพ็กเกจ</h4>
                <Button variant="success" onClick={() => window.location.reload()}>
                  🔄 โหลดข้อมูลใหม่
                </Button>
              </div>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ระยะเวลา</th>
                    <th>ประเภทผู้ใช้</th>
                    <th>ราคา (บาท)</th>
                    <th>การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.length > 0 ? (
                    packages.map((pkg, index) => (
                      <tr key={pkg.package_id}>
                        <td>{index + 1}</td>
                        <td>{pkg.duration}</td>
                        <td>{translateUserType(pkg.user_type)}</td>
                        <td>
                          {editingId === pkg.package_id ? (
                            <Form.Control
                              type="number"
                              value={editedPrice}
                              onChange={(e) => setEditedPrice(e.target.value)}
                              min="0"
                            />
                          ) : (
                            `${pkg.price} บาท`
                          )}
                        </td>
                        <td className="text-center">
                          {editingId === pkg.package_id ? (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                className="me-2"
                                onClick={() => handleSave(pkg.package_id)}
                              >
                                💾 บันทึก
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleCancel}
                              >
                                ❌ ยกเลิก
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleEdit(pkg)}
                              >
                                ✏️ แก้ไข
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(pkg.package_id)}
                              >
                                🗑️ ลบ
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        ไม่มีข้อมูลแพ็กเกจ
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPackage;
