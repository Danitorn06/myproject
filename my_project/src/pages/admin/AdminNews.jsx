import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axiosInstance from '../../axiosInstance';
import './AdminNews.css';

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
          <h2 className="mb-2" style={{ color: '#FF7F11' }}>จัดการข่าวสาร</h2>
          <p className="text-muted mb-4">Manage News</p>
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
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {newsList.map((news) => (
            <Col key={news.news_id}>
              <Card className="admin-news-card h-100">
                {news.image && (
                  <Card.Img
                    src={news.image}
                    alt={news.title}
                    className="admin-news-image"
                  />
                )}

                <Card.Body className="d-flex flex-column">
                  <h6 className="fw-semibold text-truncate mb-1">
                    {news.title}
                  </h6>

                  <small className="text-muted mb-3">
                    {new Date(news.publish_date).toLocaleDateString('th-TH')}
                  </small>

                  <div className="d-flex gap-1 mt-2">
                    <Button
                      as={Link}
                      to={`/admin/news/edit/${news.news_id}`}
                      size="sm"
                      className="btn-edit-mini"
                    >
                      แก้ไข
                    </Button>

                    <Button
                      size="sm"
                      className="btn-delete-mini"
                      onClick={() => handleDelete(news.news_id)}
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