import React from "react";
import { Container, Row, Col, Card, Button, Alert, Form } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function AdminSettings() {
    return (
        <Container className="py-5">
            <h2 className="mb-2" style={{ color: '#FF7F11' }}>Admin Settings</h2>
            <p className="text-muted mb-4">Manage system configuration and schedule behavior</p>

            <Row className="g-4">
                {/* LEFT — GENERAL & SCHEDULE */}
                <Col lg={6}>
                    <Card
                        className="shadow-lg h-100"
                        style={{
                            borderRadius: '20px',
                            backgroundColor: '#ffffff',
                            padding: '1rem',
                            border: '2px solid #FF7F11'
                        }}
                    >
                        <Card.Body>
                            {/* General Settings */}
                            <div className="mb-4">
                                <h5 className="mb-3" style={{ color: '#FF7F11' }}>
                                    <i className="bi bi-gear me-2"></i>General Settings
                                </h5>

                                <Form.Group className="mb-3">
                                    <Form.Label>Gym Name</Form.Label>
                                    <Form.Control placeholder="SU.ED Fitness" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Open - Close Time</Form.Label>
                                    <div className="d-flex gap-2">
                                        <Form.Control type="time" />
                                        <Form.Control type="time" />
                                    </div>
                                </Form.Group>
                            </div>

                            {/* Schedule Settings */}
                            <div>
                                <h5 className="mb-3" style={{ color: '#FF7F11' }}>
                                    <i className="bi bi-calendar-week me-2"></i>Schedule Settings
                                </h5>

                                <Form.Group className="mb-3">
                                    <Form.Label>Class Duration (minutes)</Form.Label>
                                    <Form.Select>
                                        <option>45</option>
                                        <option>60</option>
                                        <option>90</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Check
                                    type="switch"
                                    label="Disable schedule system"
                                    className="mb-2"
                                />

                                <Button
                                    className="rounded-pill px-4"
                                    style={{ backgroundColor: '#FF7F11', border: 'none' }}
                                >
                                    Save Settings
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* RIGHT — HOLIDAY & SYSTEM */}
                <Col lg={6}>
                    <Card
                        className="shadow-lg h-100"
                        style={{
                            borderRadius: '20px',
                            backgroundColor: '#ffffff',
                            padding: '1rem',
                            border: '2px solid #FF7F11'
                        }}
                    >
                        <Card.Body>
                            {/* Holiday / Announcement */}
                            <div className="mb-4">
                                <h5 className="mb-3" style={{ color: '#FF7F11' }}>
                                    <i className="bi bi-megaphone me-2"></i>Holiday & Announcement
                                </h5>

                                <Alert variant="warning" className="rounded-3">
                                    Announcement will be shown on Schedule & Home page
                                </Alert>

                                <Form.Group className="mb-2">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control placeholder="Holiday Announcement" />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                    <Form.Label>Message</Form.Label>
                                    <Form.Control as="textarea" rows={2} />
                                </Form.Group>

                                <div className="d-flex gap-2 mb-3">
                                    <Form.Control type="date" />
                                    <Form.Control type="date" />
                                </div>
                            </div>

                            {/* System Control */}
                            <div>
                                <h5 className="mb-3" style={{ color: '#FF7F11' }}>
                                    <i className="bi bi-shield-lock me-2"></i>System Control
                                </h5>

                                <Form.Check
                                    type="switch"
                                    label="Maintenance Mode"
                                    className="mb-2"
                                />

                                <Button
                                    variant="outline-danger"
                                    className="rounded-pill px-4"
                                >
                                    Clear Cache
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}