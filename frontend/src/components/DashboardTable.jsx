// src/components/DashboardTable.jsx
import React from "react";
import "./DashboardTable.css";

export default function DashboardTable({ transactions = [] }) {
    if (!Array.isArray(transactions)) {
        return <div>No transactions found.</div>;
    }

    return (
        <div className="fade-in">
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Location</th>
                            <th>Reasons</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No transactions
                                </td>
                            </tr>
                        )}
                        {transactions.map((t, i) => (
                            <tr key={t.id} className={t.fraud ? "table-danger" : ""}>
                                <td>{i + 1}</td>
                                <td>{new Date(t.timestamp).toLocaleString()}</td>
                                <td>₹{Number(t.amount).toLocaleString()}</td>
                                <td>{t.location}</td>
                                <td>{Array.isArray(t.reasons) ? t.reasons.join(", ") : t.reasons}</td>
                                <td>{t.fraud ? "⚠️ Flag" : "✅ Safe"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
