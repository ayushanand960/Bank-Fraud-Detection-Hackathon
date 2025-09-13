// src/components/DashboardSummary.jsx
import React, { useMemo } from "react";
import { Row, Col, Card } from "react-bootstrap";

export default function DashboardSummary({ transactions = [] }) {
    const stats = useMemo(() => {
        const total = transactions.length;
        const fraudCount = transactions.filter((t) => t.fraud === true).length;
        const safeCount = total - fraudCount;
        const fraudPercent = total === 0 ? 0 : Math.round((fraudCount / total) * 100);
        const lastTx = transactions[0] || null; // ordered by timestamp desc from backend
        return { total, fraudCount, safeCount, fraudPercent, lastTx };
    }, [transactions]);

    return (
        <Row>
            <Col md={3} className="mb-2">
                <Card className="p-3 text-center">
                    <small>Total Transactions</small>
                    <h4>{stats.total}</h4>
                </Card>
            </Col>
            <Col md={3} className="mb-2">
                <Card className="p-3 text-center">
                    <small>Fraud Transactions</small>
                    <h4>{stats.fraudCount}</h4>
                </Card>
            </Col>
            <Col md={3} className="mb-2">
                <Card className="p-3 text-center">
                    <small>Safe Transactions</small>
                    <h4>{stats.safeCount}</h4>
                </Card>
            </Col>
            <Col md={3} className="mb-2">
                <Card className="p-3 text-center">
                    <small>Fraud %</small>
                    <h4>{stats.fraudPercent}%</h4>
                </Card>
            </Col>

            {stats.lastTx && (
                <Col md={12} className="mt-3">
                    <Card className="p-2">
                        <small>Last transaction:</small>
                        <div>
                            {new Date(stats.lastTx.timestamp).toLocaleString()} — ₹{stats.lastTx.amount} —{" "}
                            {stats.lastTx.fraud ? "⚠️ Flag" : "✅ Safe"}
                        </div>
                    </Card>
                </Col>
            )}
        </Row>
    );
}
