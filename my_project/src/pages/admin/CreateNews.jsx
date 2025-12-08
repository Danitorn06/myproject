import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axiosInstance from '../../axiosInstance';

const CreateNews = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState(null);
  const [type, setType] = useState('general');
  const [publishDate, setPublishDate] = useState('');
  const navigate = useNavigate();

  // ⬆️ เมื่อเลือกรูป จะ Preview และแปลงเป็น Base64 (หรือจะอัปโหลดไป API ก็ได้)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setImageUrl(reader.result); // ส่ง base64 ไปเก็บใน backend
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDate =
      new Date(publishDate).toISOString().split('.')[0] + 'Z';

    try {
      await axiosInstance.post(
        '/news',
        {
          title,
          content,
          image_url: imageUrl,
          type,
          publish_date: formattedDate,
        },
        { withCredentials: true }
      );

      alert('เพิ่มข่าวเรียบร้อยแล้ว');
      navigate('/admin/news');
    } catch (err) {
      console.error('เพิ่มข่าวล้มเหลว:', err.response?.data || err.message);
      alert('เกิดข้อผิดพลาดในการเพิ่มข่าว');
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">เพิ่มข่าว</Card.Title>
              <Form onSubmit={handleSubmit}>

                {/* TITLE */}
                <Form.Group className="mb-3">
                  <Form.Label>หัวข้อ</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="กรอกหัวข้อข่าว"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* IMAGE UPLOAD */}
                <Form.Group className="mb-3">
                  <Form.Label>เลือกรูปภาพ</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                </Form.Group>

                {preview && (
                  <div className="mb-3 text-center">
                    <img
                      src={preview}
                      alt="preview"
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
                    />
                  </div>
                )}

                {/* CONTENT */}
                <Form.Group className="mb-3">
                  <Form.Label>เนื้อหา</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    placeholder="พิมพ์เนื้อหา… "
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* TYPE */}
                <Form.Group className="mb-3">
                  <Form.Label>ประเภทข่าว</Form.Label>
                  <Form.Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="general">ทั่วไป</option>
                    <option value="health">สุขภาพ</option>
                  </Form.Select>
                </Form.Group>

                {/* PUBLISH DATE */}
                <Form.Group className="mb-3">
                  <Form.Label>วันที่เผยแพร่</Form.Label>
                  <Form.Control
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* BUTTONS */}
                <div className="d-flex justify-content-end gap-2">
                  <Button variant="secondary" onClick={() => navigate('/admin/news')}>
                    ยกเลิก
                  </Button>
                  <Button variant="primary" type="submit">
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

export default CreateNews;
