import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import axiosInstance from '../../axiosInstance';

const CreateSchedule = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    const mode = params.get('mode'); // add หรือ edit
    const classId = params.get('id'); // สำหรับ edit
    const defaultDay = params.get('day'); // สำหรับ add
    const defaultTime = params.get('time'); // สำหรับ add

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        class_type: '',
        description: '',
        day_of_week: defaultDay || 'Monday',
        time: defaultTime || '07:00',
    });

    // โหลดข้อมูลถ้าเป็น edit
    useEffect(() => {
        if (mode === 'edit' && classId) {
            axiosInstance.get(`/classes/${classId}`)
                .then(res => {
                    const cls = res.data;
                    setFormData({
                        name: cls.name || '',
                        class_type: cls.class_type || '',
                        description: cls.description || '',
                        day_of_week: cls.day_of_week || 'Monday',
                        time: cls.time || '07:00',
                    });
                    setLoading(false);
                })
                .catch(err => {
                    console.error('❌ โหลดข้อมูลคลาสล้มเหลว:', err);
                    alert('ไม่สามารถโหลดข้อมูลคลาสได้');
                    navigate('/admin/schedule');
                });
        } else {
            setLoading(false);
        }
    }, [mode, classId, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (mode === 'edit') {
                await axiosInstance.put(`/classes/${classId}`, formData, { withCredentials: true });
                alert('แก้ไขคลาสเรียบร้อยแล้ว');
            } else {
                await axiosInstance.post('/classes', formData, { withCredentials: true });
                alert('เพิ่มคลาสเรียบร้อยแล้ว');
            }
            navigate('/admin/schedule');
        } catch (err) {
            console.error('❌ บันทึกคลาสล้มเหลว:', err);
            alert('เกิดข้อผิดพลาดในการบันทึกคลาส');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="warning" />
                <p className="mt-2 text-muted">⏳ กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    return (
        <Container className="my-5">
            <Row className="mb-3">
                <Col>
                    <h2>{mode === 'edit' ? '✏️ แก้ไขคลาส' : '➕ เพิ่มคลาสใหม่'}</h2>
                </Col>
            </Row>
            <Form onSubmit={handleSubmit}>
                {/* ชื่อคลาส */}
                <Form.Group className="mb-3">
                    <Form.Label>ชื่อคลาส</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* ประเภทคลาส */}
                <Form.Group className="mb-3">
                    <Form.Label>ประเภทคลาส</Form.Label>
                    <Form.Select
                        name="class_type"
                        value={formData.class_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- เลือกประเภท --</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Strength">Strength</option>
                        <option value="Flexibility">Flexibility</option>
                    </Form.Select>
                </Form.Group>

                {/* รายละเอียด */}
                <Form.Group className="mb-3">
                    <Form.Label>รายละเอียด</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="ระบุรายละเอียดคลาส"
                        rows={3}
                    />
                </Form.Group>

                {/* วัน */}
                <Form.Group className="mb-3">
                    <Form.Label>วัน</Form.Label>
                    <Form.Select
                        name="day_of_week"
                        value={formData.day_of_week}
                        onChange={handleChange}
                        required
                    >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                    </Form.Select>
                </Form.Group>

                {/* เวลา */}
                <Form.Group className="mb-3">
                    <Form.Label>เวลา</Form.Label>
                    <Form.Select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    >
                        <option value="07:00">07:00</option>
                        <option value="17:00">17:00</option>
                        <option value="17:45">17:45</option>
                        <option value="18:00">18:00</option>
                        <option value="19:15">19:15</option>
                    </Form.Select>
                </Form.Group>

                {/* ปุ่ม */}
                <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
                <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={() => navigate('/admin/schedule')}
                >
                    ยกเลิก
                </Button>
            </Form>
        </Container>
    );
};

export default CreateSchedule;
