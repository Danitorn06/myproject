import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import axiosInstance from '../../axiosInstance';

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('general');
  const [publishDate, setPublishDate] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ดึงข่าวเดิม
  const fetchNews = useCallback(async () => {
    const res = await axiosInstance.get(`/news/${id}`);

    setTitle(res.data.title);
    setContent(res.data.content);
    setType(res.data.type || 'general');
    setPreviewImage(res.data.image_url || '');

    const date = new Date(res.data.publish_date);
    setPublishDate(date.toISOString().split('T')[0]);
  }, [id]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  // เลือกรูป
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // เปิด confirm modal
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  // submit จริง
  const submitEdit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("type", type);
    formData.append(
      "publish_date",
      new Date(publishDate).toISOString()
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axiosInstance.put(`/news/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      navigate("/admin/news");
    } catch (err) {
      console.error(err);
      alert("แก้ไขข่าวไม่สำเร็จ");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card style={{
            border: "2px solid #FF7F11"
          }}>
            <Card.Body>
              <Card.Title>แก้ไขข่าว</Card.Title>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>หัวข้อ</Form.Label>
                  <Form.Control
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>เนื้อหา</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>รูปภาพ</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="preview"
                      className="img-fluid mt-3 rounded"
                      style={{ maxHeight: 250 }}
                    />
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>ประเภทข่าว</Form.Label>
                  <Form.Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="general">ทั่วไป</option>
                    <option value="health">สุขภาพ</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>วันที่เผยแพร่</Form.Label>
                  <Form.Control
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/admin/news')}
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

      {/* Confirm Modal */}
      <Modal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        centered
      >
        <div
          style={{
            border: "2px solid #FF7F11",
            borderRadius: "8px"
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>ยืนยันการแก้ไข</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            คุณต้องการบันทึกการแก้ไขข่าวนี้ใช่หรือไม่?
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
                borderColor: "#FF7F11"
              }}
              onClick={submitEdit}
              disabled={loading}
            >
              {loading ? "กำลังบันทึก..." : "ยืนยัน"}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

    </Container>
  );
};

export default EditNews;