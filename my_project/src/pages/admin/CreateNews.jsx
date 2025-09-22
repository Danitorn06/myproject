import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    }
  };

  return (
    <div className="container my-5">
      <h2>เพิ่มข่าว</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>หัวข้อ</label>
          <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>เนื้อหา</label>
          <textarea className="form-control" value={content} onChange={e => setContent(e.target.value)} rows={5} required />
        </div>
        <div className="mb-3">
          <label>URL รูปภาพ</label>
          <input type="text" className="form-control" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        </div>
        <button className="btn btn-primary">บันทึก</button>
      </form>
    </div>
  );
};

export default CreateNews;
