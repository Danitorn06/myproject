import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './News.css';


const News = ({ limit }) => {
  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);   // ✅ state โหลด
  const [error, setError] = useState(null);       // ✅ state error
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
        setError("ไม่สามารถดึงข้อมูลข่าวได้");
        setLoading(false);
      });
  }, []);

  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentNews = newsList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(newsList.length / pageSize);

  return (
    <section className="container my-5">
      {/* ✅ หัวข้อขึ้นตลอด */}
      <div className="header-section">
        <h2>📰 ข่าวสารล่าสุด</h2>
        <p>อัปเดตเรื่องราวใหม่ๆ สำหรับคุณ</p>
      </div>

      {/* ✅ ตอนโหลด */}
      {loading && (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
          <div className="text-center">
            <div className="spinner-border text-warning mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">กำลังโหลดข่าวสาร กรุณารอสักครู่...</p>
          </div>
        </div>
      )}

      {/* ✅ ถ้า error หรือไม่มีข้อมูล */}
      {!loading && (error || newsList.length === 0) && (
        <div className="alert alert-warning text-center shadow-sm">
          {error || "ยังไม่มีข่าวสารในขณะนี้ 🙏"}
        </div>
      )}

      {/* ✅ แสดงข่าวเมื่อโหลดเสร็จและมีข้อมูล */}
      {!loading && newsList.length > 0 && (
        <>
          <div className="row g-4">
            {currentNews.map(news => (
              <div className="col-md-6 col-lg-4" key={news.news_id}>
                <div className="card h-100 shadow-sm">
                  {news.image_url && (
                    <img
                      src={news.image_url}
                      className="card-img-top"
                      alt={news.title}
                      style={{ height: '180px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{news.title}</h5>
                    <p className="card-text text-truncate">{news.content}</p>
                    <Link to={`/news/${news.news_id}`} className="btn btn-warning mt-auto">
                      อ่านเพิ่มเติม
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Pagination (เฉพาะตอนที่ไม่มี limit) */}
          {!limit && (
            <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
              <button
                className="btn btn-outline-warning"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ก่อนหน้า
              </button>
              <span>หน้า {currentPage} / {totalPages}</span>
              <button
                className="btn btn-outline-warning"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                ถัดไป
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default News;
