import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axiosInstance from '../../axiosInstance';

const CreateNews = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [type, setType] = useState('general');
  const [publishDate, setPublishDate] = useState('');

  const navigate = useNavigate();

  // 📷 เลือกรูป + preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('type', type);
    formData.append(
      'publish_date',
      new Date(publishDate).toISOString()
    );

    if (image) {
      formData.append('image', image);
    }

    try {
      await axiosInstance.post('/news', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      alert('เพิ่มข่าวเรียบร้อยแล้ว');
      navigate('/admin/news');
    } catch (err) {
      console.error(err);
      alert('เพิ่มข่าวไม่สำเร็จ');
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>เพิ่มข่าว</Card.Title>

              <Form onSubmit={handleSubmit}>
                {/* TITLE */}
                <Form.Group className="mb-3">
                  <Form.Label>หัวข้อ</Form.Label>
                  <Form.Control
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* IMAGE */}
                <Form.Group className="mb-3">
                  <Form.Label>รูปภาพ</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>

                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                )}

                {/* CONTENT */}
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

                {/* TYPE */}
                <Form.Group className="mb-3">
                  <Form.Label>ประเภท</Form.Label>
                  <Form.Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="general">ทั่วไป</option>
                    <option value="health">สุขภาพ</option>
                  </Form.Select>
                </Form.Group>

                {/* DATE */}
                <Form.Group className="mb-3">
                  <Form.Label>วันที่เผยแพร่</Form.Label>
                  <Form.Control
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button type="submit">บันทึก</Button>
              </Form>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateNews;
