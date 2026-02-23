import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import axiosInstance from '../../axiosInstance';
import 'bootstrap-icons/font/bootstrap-icons.css';

/* 🔹 รูปที่มีใน backend */
const classImages = [
    { label: 'Cardio', value: 'cardio.jpg' },
    { label: 'Strength', value: 'strength.jpg' },
    { label: 'Flexibility', value: 'flexibility.jpg' },
    { label: 'Yoga', value: 'yoga.jpg' }
];

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
        image_url: ''
    });

    useEffect(() => {
        if (mode === 'edit' && classId) {
            axiosInstance
                .get(`/classes/${classId}`)
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

    if (loading) return <Spinner className="m-5" />;

    return (
        <Container className="py-5">
            <h2 className="mb-2" style={{ color: '#FF7F11' }}>
                {mode === 'edit' ? 'Edit Class Schedule' : 'Create Class Schedule'}
            </h2>
            <p className="text-muted mb-4">
                Manage fitness class information and schedule
            </p>

            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card
                        className="shadow-lg"
                        style={{
                            borderRadius: '20px',
                            border: '2px solid #FF7F11'
                        }}
                    >
                        <Card.Body>
                            <h5 className="mb-4" style={{ color: '#FF7F11' }}>
                                <i className="bi bi-calendar-plus me-2"></i>
                                Class Information
                            </h5>

                            <Form onSubmit={handleSubmit}>
                                <Row className="g-3">

                                    {/* Class Name */}
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Class Name</Form.Label>
                                            <Form.Control
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    {/* Class Type */}
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Class Type</Form.Label>
                                            <Form.Select
                                                name="class_type"
                                                value={formData.class_type}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">-- Select --</option>
                                                <option value="Cardio">Cardio</option>
                                                <option value="Strength">Strength</option>
                                                <option value="Flexibility">Flexibility</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    {/* Image Select */}
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Class Image</Form.Label>
                                            <Form.Select
                                                name="image_url"
                                                value={formData.image_url}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">-- Select Image --</option>
                                                {classImages.map(img => (
                                                    <option key={img.value} value={img.value}>
                                                        {img.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    {/* Image Preview */}
                                    {formData.image_url && (
                                        <Col md={6} className="text-center">
                                            <img
                                                src={`http://localhost:8080/uploads/class/${formData.image_url}`}
                                                alt="preview"
                                                style={{ width: 160, borderRadius: 12 }}
                                            />
                                        </Col>
                                    )}

                                    {/* Instructor */}
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Instructor</Form.Label>
                                            <Form.Control
                                                name="instructor_name"
                                                value={formData.instructor_name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    {/* Day */}
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Day</Form.Label>
                                            <Form.Select
                                                name="day_of_week"
                                                value={formData.day_of_week}
                                                onChange={handleChange}
                                            >
                                                <option>Monday</option>
                                                <option>Tuesday</option>
                                                <option>Wednesday</option>
                                                <option>Thursday</option>
                                                <option>Friday</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    {/* Time */}
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Time</Form.Label>
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
                                    </Col>

                                    {/* Description */}
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>

                                </Row>

                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <Button
                                        variant="outline-secondary"
                                        className="rounded-pill px-4"
                                        onClick={() => navigate('/admin/schedule')}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        className="rounded-pill px-4"
                                        style={{ backgroundColor: '#FF7F11', border: 'none' }}
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>
                            </Form>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateSchedule;