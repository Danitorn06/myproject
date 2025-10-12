import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axiosInstance from '../../axiosInstance';

const CreateNews = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/news', { title, content, image_url: imageUrl });
      alert('เพิ่มข่าวเรียบร้อยแล้ว');
      navigate('/admin/news');
    } catch (err) {
      console.error('เพิ่มข่าวล้มเหลว:', err);
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
                <Form.Group className="mb-3" controlId="newsTitle">
                  <Form.Label>หัวข้อ</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="กรอกหัวข้อข่าว"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="newsContent">
                  <Form.Label>เนื้อหา</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="กรอกเนื้อหาข่าว"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="newsImage">
                  <Form.Label>URL รูปภาพ</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="กรอก URL รูปภาพ (ถ้ามี)"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                  />
                </Form.Group>

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
