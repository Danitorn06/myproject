import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import axiosInstance from '../../axiosInstance';

const CreateSchedule = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    const mode = params.get('mode');
    const classId = params.get('id');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        class_type: '',
        instructor_name: '',
        description: '',
        day_of_week: 'Monday',
        time: '07:00',
    });

    useEffect(() => {
        if (mode === 'edit' && classId) {
            axiosInstance.get(`/classes/${classId}`)
                .then(res => {
                    setFormData(res.data);
                    setLoading(false);
                })
                .catch(() => navigate('/admin/schedule'));
        } else {
            setLoading(false);
        }
    }, [mode, classId, navigate]);

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSaving(true);

        try {
            if (mode === 'edit') {
                await axiosInstance.put(`/classes/${classId}`, formData);
            } else {
                await axiosInstance.post('/classes', formData);
            }
            navigate('/admin/schedule');
        } catch {
            alert('บันทึกไม่สำเร็จ');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <Container className="my-5">
            <Row><Col><h2>{mode === 'edit' ? 'แก้ไขคลาส' : 'เพิ่มคลาสใหม่'}</h2></Col></Row>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>ชื่อคลาส</Form.Label>
                    <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>ประเภท</Form.Label>
                    <Form.Select name="class_type" value={formData.class_type} onChange={handleChange} required>
                        <option value="">-- เลือก --</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Strength">Strength</option>
                        <option value="Flexibility">Flexibility</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>ชื่อผู้สอน</Form.Label>
                    <Form.Control
                        name="instructor_name"
                        value={formData.instructor_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>รายละเอียด</Form.Label>
                    <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>วัน</Form.Label>
                    <Form.Select name="day_of_week" value={formData.day_of_week} onChange={handleChange}>
                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>เวลา</Form.Label>
                    <Form.Control type="time" name="time" value={formData.time} onChange={handleChange} />
                </Form.Group>

                <Button type="submit" disabled={saving}>
                    {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
            </Form>
        </Container>
    );
};

export default CreateSchedule;
