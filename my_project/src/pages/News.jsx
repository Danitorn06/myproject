import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Spinner, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './News.css';

const News = ({ limit, hideFilter }) => {
  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐ เพิ่ม state ใหม่ (Filter + Search + Sort)
  const [selectedType, setSelectedType] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

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

  // ⭐ APPLY FILTER + SEARCH + SORT
  const filteredNews = currentNews
    .filter(news =>
      selectedType === "all" ? true : news.type === selectedType
    )
    .filter(news =>
      news.title.toLowerCase().includes(searchText.toLowerCase()) ||
      news.content.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.publish_date) - new Date(a.publish_date);
      } else {
        return new Date(a.publish_date) - new Date(b.publish_date);
      }
    });

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", padding: "80px 0" }}>
      <section className="container">
        <div className="header-section text-center mb-4">
          <h2>📰 ข่าวสารล่าสุด</h2>
          <p>อัปเดตเรื่องราวใหม่ๆ สำหรับคุณ</p>
        </div>

        {/* ⭐ SECTION: Filter + Search + Sort */}
        {!hideFilter && (
          <div className="d-flex gap-3 mb-4 flex-wrap justify-content-center">

            {/* Search */}
            <Form.Control
              type="text"
              placeholder="🔍 ค้นหาข่าว..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "600px" }}
            />

            {/* Filter */}
            <Form.Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ width: "160px" }}
            >
              <option value="all">ทั้งหมด</option>
              <option value="announcement">ประกาศ</option>
              <option value="event">กิจกรรม</option>
              <option value="promotion">โปรโมชั่น</option>
            </Form.Select>

            {/* Sort */}
            <Form.Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ width: "160px" }}
            >
              <option value="newest">ใหม่ที่สุด</option>
              <option value="oldest">เก่าสุด</option>
            </Form.Select>

          </div>

        )}



        {/* 🔄 Loading */}
        {
          loading && (
            <Card className="text-center shadow-sm border-0 mx-auto" style={{ maxWidth: "400px" }}>
              <Card.Body>
                <Spinner animation="border" variant="warning" className="mb-3" style={{ width: "3rem", height: "3rem" }} />
                <Card.Text className="text-muted">⏳ กำลังโหลดข่าวสาร กรุณารอสักครู่...</Card.Text>
              </Card.Body>
            </Card>
          )
        }

        {/* ⚠️ ไม่มีข้อมูล */}
        {
          !loading && (error || newsList.length === 0) && (
            <Alert variant="warning" className="text-center shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
              {error || "📰 ยังไม่มีข่าวสารในขณะนี้ 🙏"}
            </Alert>
          )
        }

        {/* NEWS LIST */}
        {
          !loading && newsList.length > 0 && (
            <>
              <div className="row g-4">
                {filteredNews.map(news => (
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

              {/* Pagination (เหมือนเดิม) */}
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
          )
        }
      </section >
    </div>
  );
};

export default News;