import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NewsDetail.css'; // สำหรับสไตล์เพิ่มเติม

const NewsDetail = () => {
  const { newsId } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/v1/news/${newsId}`)
      .then(res => {
        setNews(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("เกิดข้อผิดพลาดในการโหลดข่าว");
        setLoading(false);
      });
  }, [newsId]);

  if (loading) return <p className="text-center my-5">กำลังโหลดข่าว...</p>;
  if (error) return <p className="text-center my-5 text-danger">{error}</p>;
  if (!news) return <p className="text-center my-5">ไม่พบข่าว</p>;

  return (
    <section className="news-detail-wrapper d-flex justify-content-center my-5 px-2">
      <div className="news-detail-card p-4 shadow-sm rounded">
        {/* กลับไปหน้าข่าว */}
        <Link to="/news" className="btn btn-outline-secondary mb-4">
          ← กลับไปหน้ารายการข่าว
        </Link>

        {news.image_url && (
          <img
            src={news.image_url}
            alt={news.title}
            className="img-fluid rounded mb-3"
            style={{
              maxHeight: '400px',
              width: '100%',
              objectFit: 'contain',
              backgroundColor: '#f5f5f5'
            }}
          />
        )}

        <h2 className="mb-3 text-center">{news.title}</h2>
        <p className="news-content">{news.content}</p>
        <p className="text-muted text-end mt-3">
          เผยแพร่เมื่อ: {new Date(news.publish_date).toLocaleDateString()}
        </p>
      </div>
    </section>
  );
};

export default NewsDetail;
