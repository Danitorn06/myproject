import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axiosInstance from '../../axiosInstance';

const AdminNews = () => {
  const [newsList, setNewsList] = useState([]);

  const fetchNews = async () => {
    try {
      const res = await axiosInstance.get('/news');
      const sorted = res.data.sort(
        (a, b) => new Date(b.publish_date) - new Date(a.publish_date)
      );
      setNewsList(sorted);
    } catch (err) {
      console.error('ดึงข่าวล้มเหลว:', err);
      if (err.response?.status === 401) window.location.href = '/login';
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบข่าวนี้หรือไม่?')) {
      try {
        await axiosInstance.delete(`/news/${id}`);
        alert('ลบข่าวเรียบร้อยแล้ว');
        fetchNews();
      } catch (err) {
        console.error('ลบข่าวล้มเหลว:', err);
        if (err.response?.status === 401) window.location.href = '/login';
      }
    }
  };

  return (
    <Container className="my-5">
      <Row className="align-items-center mb-4">
        <Col>
          <h2>จัดการข่าว</h2>
        </Col>
        <Col className="text-end">
          <Button as={Link} to="/admin/news/create" variant="primary">
            เพิ่มข่าว
          </Button>
        </Col>
      </Row>

      {newsList.length === 0 ? (
        <Alert variant="info">ยังไม่มีข่าว</Alert>
      ) : (
        <Row xs={1} sm={2} md={1} lg={1} className="g-3">
          {newsList.map((news) => (
            <Col key={news.news_id}>
              <Card className="h-100 shadow-sm">
                {news.image && (
                  <Card.Img
                    variant="top"
                    src={news.image}
                    alt={news.title}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{news.title}</Card.Title>
                  <Card.Text className="text-muted mb-2">
                    วันที่เผยแพร่: {new Date(news.publish_date).toLocaleDateString()}
                  </Card.Text>
                  <div className="mt-auto d-flex justify-content-end gap-2">
                    <Button
                      as={Link}
                      to={`/admin/news/edit/${news.news_id}`}
                      variant="warning"
                      size="sm"
                    >
                      แก้ไข
                    </Button>
                    <Button
                      onClick={() => handleDelete(news.news_id)}
                      variant="danger"
                      size="sm"
                    >
                      ลบ
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AdminNews;
