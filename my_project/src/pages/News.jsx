import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Spinner, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import './News.css';

const News = ({ limit }) => {
  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = limit || 9;

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/news")
      .then(res => {
        const sortedNews = res.data.sort(
          (a, b) => new Date(b.publish_date) - new Date(a.publish_date)
        );
        setNewsList(sortedNews);
        setLoading(false);
      })
      .catch(err => {
        console.error("ดึงข่าวล้มเหลว:", err);
        setError("❌ ไม่สามารถดึงข้อมูลข่าวได้");
        setLoading(false);
      });
  }, []);

  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentNews = newsList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(newsList.length / pageSize);

  return (
    <section className="container my-5">
      <div className="header-section text-center mb-4">
        <h2>📰 ข่าวสารล่าสุด</h2>
        <p>อัปเดตเรื่องราวใหม่ๆ สำหรับคุณ</p>
      </div>

      {/* 🔄 กำลังโหลด */}
      {loading && (
        <Card className="text-center shadow-sm border-0 mx-auto" style={{ maxWidth: "400px" }}>
          <Card.Body>
            <Spinner animation="border" variant="warning" className="mb-3" style={{ width: "3rem", height: "3rem" }} />
            <Card.Text className="text-muted">⏳ กำลังโหลดข่าวสาร กรุณารอสักครู่...</Card.Text>
          </Card.Body>
        </Card>
      )}

      {/* ⚠️ ไม่มีข้อมูลหรือ error */}
      {!loading && (error || newsList.length === 0) && (
        <Alert variant="warning" className="text-center shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
          {error || "📰 ยังไม่มีข่าวสารในขณะนี้ 🙏"}
        </Alert>
      )}

      {/* ✅ แสดงข่าว */}
      {!loading && newsList.length > 0 && (
        <>
          <div className="row g-4">
            {currentNews.map(news => (
              <div className="col-md-6 col-lg-4" key={news.news_id}>
                <Card className="h-100 shadow-sm">
                  {news.image_url && (
                    <Card.Img
                      variant="top"
                      src={news.image_url}
                      alt={news.title}
                      style={{ height: '180px', objectFit: 'cover' }}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{news.title}</Card.Title>
                    <Card.Text className="text-truncate">{news.content}</Card.Text>
                    <Button as={Link} to={`/news/${news.news_id}`} variant="warning" className="mt-auto">
                      อ่านเพิ่มเติม
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>

          {!limit && (
            <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
              <Button
                variant="outline-warning"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ก่อนหน้า
              </Button>
              <span>หน้า {currentPage} / {totalPages}</span>
              <Button
                variant="outline-warning"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                ถัดไป
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default News;
