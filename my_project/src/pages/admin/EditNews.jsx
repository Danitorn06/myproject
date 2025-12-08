import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import axiosInstance from '../../axiosInstance';

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [type, setType] = useState('general');
  const [publishDate, setPublishDate] = useState('');

  // ดึงข้อมูลเดิม
  const fetchNews = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/news/${id}`);

      setTitle(res.data.title);
      setContent(res.data.content);
      setImageUrl(res.data.image_url || '');
      setPreviewImage(res.data.image_url || '');
      setType(res.data.type || 'general');

      // แปลงเป็น yyyy-MM-dd
      const date = new Date(res.data.publish_date);
      const formatted = date.toISOString().split('T')[0];
      setPublishDate(formatted);

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) window.location.href = '/login';
    }
  }, [id]);

  useEffect(() => { fetchNews(); }, [fetchNews]);


  // อัปโหลดรูป
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setImageUrl(res.data.url);
      setPreviewImage(res.data.url);

    } catch (err) {
      console.error("อัปโหลดรูปผิดพลาด:", err);
      alert("อัปโหลดรูปไม่สำเร็จ");
    }
  };


  // ส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDate = new Date(publishDate).toISOString().split('.')[0] + 'Z';

    try {
      await axiosInstance.put(`/news/${id}`, {
        title,
        content,
        image_url: imageUrl,
        type,
        publish_date: formattedDate,
      });

      alert("แก้ไขข่าวสำเร็จ");
      navigate("/admin/news");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการแก้ไขข่าว");
    }
  };


  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">แก้ไขข่าว</Card.Title>

              <Form onSubmit={handleSubmit}>
                
                {/* หัวข้อ */}
                <Form.Group className="mb-3">
                  <Form.Label>หัวข้อ</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* เนื้อหา */}
                <Form.Group className="mb-3">
                  <Form.Label>เนื้อหา</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="พิมพ์เนื้อหา สามารถกด Enter เพื่อขึ้นบรรทัดใหม่ได้"
                    required
                  />
                </Form.Group>

                {/* อัปโหลดรูป */}
                <Form.Group className="mb-3">
                  <Form.Label>อัปโหลดรูปภาพ</Form.Label>
                  <Form.Control type="file" onChange={handleImageUpload} accept="image/*" />

                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="preview"
                      className="img-fluid mt-3 rounded"
                      style={{ maxHeight: "250px", objectFit: "cover" }}
                    />
                  )}
                </Form.Group>

                {/* ประเภทข่าว */}
                <Form.Group className="mb-3">
                  <Form.Label>ประเภทข่าว</Form.Label>
                  <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="general">ทั่วไป</option>
                    <option value="health">สุขภาพ</option>
                  </Form.Select>
                </Form.Group>

                {/* วันที่เผยแพร่ */}
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
                  <Button variant="secondary" onClick={() => navigate('/admin/news')}>
                    ยกเลิก
                  </Button>
                  <Button type="submit" variant="primary">
                    บันทึก
                  </Button>
                </div>

              </Form>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditNews;
