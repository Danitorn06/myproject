import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const News = ({ limit }) => { // เพิ่ม prop limit
  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = limit || 9; // ถ้ามี limit ใช้ limit แทน pageSize

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/news")
      .then(res => {
        // เรียงข่าวล่าสุดก่อน
        const sortedNews = res.data.sort(
          (a, b) => new Date(b.publish_date) - new Date(a.publish_date)
        );
        setNewsList(sortedNews);
      })
      .catch(err => console.error("ดึงข่าวล้มเหลว:", err));
  }, []);

  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentNews = newsList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(newsList.length / pageSize);

  return (
    <section className="container my-5">
      <h2 className="text-center mb-4">ข่าวสารล่าสุด</h2>

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

      {/* แสดง pagination เฉพาะหน้าไม่มี limit */}
      {!limit && (
        <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ก่อนหน้า
          </button>
          <span>หน้า {currentPage} / {totalPages}</span>
          <button
            className="btn btn-outline-primary"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ถัดไป
          </button>
        </div>
      )}
    </section>
  );
};

export default News;
