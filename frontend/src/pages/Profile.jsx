// src/pages/Profile.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProfileCard from "../components/ProfileCard";

export default function Profile() {
    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <ProfileCard />
                </Col>
            </Row>
        </Container>
    );
}
