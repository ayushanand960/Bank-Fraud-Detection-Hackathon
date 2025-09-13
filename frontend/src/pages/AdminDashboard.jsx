import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get("/fraud/all/") // fetch all transactions
            .then(res => {
                // Convert timestamps to Date object for table and milliseconds for chart
                const data = res.data.map(tx => ({
                    ...tx,
                    timestampDate: new Date(tx.timestamp),        // For table display
                    timestampMs: new Date(tx.timestamp).getTime() // For chart plotting
                }));
                setTransactions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading transactions...</div>;

    const flaggedTransactions = transactions.filter(tx => tx.fraud);

    return (
        <div className="container mt-4">
            <h2>All Transactions</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Amount</th>
                        <th>Location</th>
                        <th>Timestamp</th>
                        <th>Fraudulent</th>
                        <th>Reasons</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => (
                        <tr key={tx.id} className={tx.fraud ? "table-danger" : ""}>
                            <td>{tx.user}</td>
                            <td>{tx.amount}</td>
                            <td>{tx.location}</td>
                            <td>{tx.timestampDate.toLocaleString()}</td>
                            <td>{tx.fraud ? "Yes" : "No"}</td>
                            <td>{tx.reasons.join(", ")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 className="mt-5">Transaction Timeline</h3>
            <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis
                        dataKey="timestampMs"
                        name="Time"
                        type="number"
                        domain={['auto', 'auto']}
                         stroke="#000"
                        tickFormatter={time => new Date(time).toLocaleTimeString()}
                    />
                    <YAxis dataKey="amount" name="Amount"  stroke="#000" />
                    <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        labelFormatter={time => `Time: ${new Date(time).toLocaleString()}`}
                    />
                    {/* Normal transactions */}
                    <Scatter
                        name="Normal"
                        data={transactions.filter(tx => !tx.fraud)}
                        fill="#82ca9d"
                    />
                    {/* Fraudulent transactions */}
                    <Scatter
                        name="Fraudulent"
                        data={flaggedTransactions}
                        fill="#ff4d4f"
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AdminDashboard;
    