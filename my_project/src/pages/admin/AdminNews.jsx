import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const AdminNews = () => {
  const [newsList, setNewsList] = useState([]);

  const fetchNews = async () => {
    try {
      const res = await axiosInstance.get('/news');
      const sorted = res.data.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));
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
    <div className="container my-5">
      <h2>จัดการข่าว</h2>
      <Link to="/admin/news/create" className="btn btn-primary mb-3">เพิ่มข่าว</Link>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>หัวข้อ</th>
            <th>วันที่เผยแพร่</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {newsList.map(news => (
            <tr key={news.news_id}>
              <td>{news.title}</td>
              <td>{new Date(news.publish_date).toLocaleDateString()}</td>
              <td>
                <Link to={`/admin/news/edit/${news.news_id}`} className="btn btn-warning me-2">แก้ไข</Link>
                <button onClick={() => handleDelete(news.news_id)} className="btn btn-danger">ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminNews;
