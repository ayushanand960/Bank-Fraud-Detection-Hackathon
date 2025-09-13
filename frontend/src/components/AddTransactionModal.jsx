// src/components/AddTransactionModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";

export default function AddTransactionModal({ show, handleClose, onTransactionAdded }) {
    const [amount, setAmount] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!amount || !location) {
            setError("Amount and location are required!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await axiosInstance.post("/fraud/add/", { amount, location });
            onTransactionAdded(res.data); // notify parent to update dashboard
            setAmount("");
            setLocation("");
            handleClose();
        } catch (err) {
            console.error(err);
            setError("Failed to add transaction!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Transaction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Add Transaction"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
