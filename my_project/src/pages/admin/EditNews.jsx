import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const EditNews = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  // ใช้ useCallback เพื่อ fix warning
  const fetchNews = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/news/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content);
      setImageUrl(res.data.image_url || '');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) window.location.href = '/login';
    }
  }, [id]);

  useEffect(() => { fetchNews(); }, [fetchNews]); // ใส่ fetchNews ลง dependency

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/news/${id}`, { title, content, image_url: imageUrl });
      navigate('/admin/news');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) window.location.href = '/login';
    }
  };

  return (
    <div className="container my-5">
      <h2>แก้ไขข่าว</h2>
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

export default EditNews;
