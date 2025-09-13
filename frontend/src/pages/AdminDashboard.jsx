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
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { Card, Spinner } from "react-bootstrap";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get("/fraud/all/")
            .then(res => {
                const data = res.data.map(tx => ({
                    ...tx,
                    timestampDate: new Date(tx.timestamp),
                    timestampMs: new Date(tx.timestamp).getTime()
                }));
                setTransactions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Spinner animation="border" variant="primary" />
        </div>
    );

    const flaggedTransactions = transactions.filter(tx => tx.fraud);
    const normalTransactions = transactions.filter(tx => !tx.fraud);

    // Data for pie chart
    const pieData = [
        { name: "Normal", value: normalTransactions.length },
        { name: "Fraudulent", value: flaggedTransactions.length },
    ];
    const COLORS = ["#82ca9d", "#ff4d4f"];

    return (
        <div className="container my-4">
            <h2 className="mb-4 text-center">Admin Dashboard</h2>

            {/* Summary Cards */}
            <div className="dashboard-summary mb-4">
                <Card className="shadow-sm summary-card">
                    <Card.Body>
                        <Card.Title>Total Transactions</Card.Title>
                        <h3>{transactions.length}</h3>
                    </Card.Body>
                </Card>
                <Card className="shadow-sm summary-card">
                    <Card.Body>
                        <Card.Title>Fraudulent Transactions</Card.Title>
                        <h3>{flaggedTransactions.length}</h3>
                    </Card.Body>
                </Card>
            </div>

            {/* Timeline + Pie Chart */}
            <div className="row mb-4">
                {/* Timeline (left column) */}
                <div className="col-lg-8 mb-3">
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <Card.Title>Transaction Timeline</Card.Title>
                            <ResponsiveContainer width="100%" height={400}>
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="timestampMs"
                                        name="Time"
                                        type="number"
                                        domain={['auto', 'auto']}
                                        stroke="#000"
                                        tickFormatter={time => new Date(time).toLocaleTimeString()}
                                    />
                                    <YAxis dataKey="amount" name="Amount" stroke="#000" />
                                    <Tooltip
                                        cursor={{ strokeDasharray: '3 3' }}
                                        labelFormatter={time => `Time: ${new Date(time).toLocaleString()}`}
                                    />
                                    <Scatter
                                        name="Normal"
                                        data={normalTransactions}
                                        fill="#82ca9d"
                                    />
                                    <Scatter
                                        name="Fraudulent"
                                        data={flaggedTransactions}
                                        fill="#ff4d4f"
                                    />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </div>

                {/* Pie Chart (right column) */}
                <div className="col-lg-4 mb-3">
                    <Card className="shadow-sm h-100 d-flex align-items-center justify-content-center">
                        <Card.Body className="text-center">
                            <Card.Title>Transaction Breakdown</Card.Title>
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Transactions Table */}
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Card.Title>All Transactions</Card.Title>
                    {/* <div className="table-responsive custom-table">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
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
                    </div> */}

                    <div className="table-responsive custom-table">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th> {/* Serial number */}
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>Location</th>
                                    <th>Timestamp</th>
                                    <th>Fraudulent</th>
                                    <th>Reasons</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx, index) => (
                                    <tr key={tx.id} className={tx.fraud ? "table-danger" : ""}>
                                        <td>{index + 1}</td> {/* Serial number */}
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
                    </div>

                </Card.Body>
            </Card>
        </div>
    );
};

export default AdminDashboard;



// import React, { useEffect, useState } from "react";
// import axiosInstance from "../api/axiosInstance";
// import {
//     ScatterChart,
//     Scatter,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer,
// } from "recharts";

// const AdminDashboard = () => {
//     const [transactions, setTransactions] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         axiosInstance.get("/fraud/all/") // fetch all transactions
//             .then(res => {
//                 // Convert timestamps to Date object for table and milliseconds for chart
//                 const data = res.data.map(tx => ({
//                     ...tx,
//                     timestampDate: new Date(tx.timestamp),        // For table display
//                     timestampMs: new Date(tx.timestamp).getTime() // For chart plotting
//                 }));
//                 setTransactions(data);
//                 setLoading(false);
//             })
//             .catch(err => {
//                 console.error(err);
//                 setLoading(false);
//             });
//     }, []);

//     if (loading) return <div>Loading transactions...</div>;

//     const flaggedTransactions = transactions.filter(tx => tx.fraud);

//     return (
//         <div className="container mt-4">
//             <h2>All Transactions</h2>
//             <table className="table table-striped">
//                 <thead>
//                     <tr>
//                         <th>User</th>
//                         <th>Amount</th>
//                         <th>Location</th>
//                         <th>Timestamp</th>
//                         <th>Fraudulent</th>
//                         <th>Reasons</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {transactions.map(tx => (
//                         <tr key={tx.id} className={tx.fraud ? "table-danger" : ""}>
//                             <td>{tx.user}</td>
//                             <td>{tx.amount}</td>
//                             <td>{tx.location}</td>
//                             <td>{tx.timestampDate.toLocaleString()}</td>
//                             <td>{tx.fraud ? "Yes" : "No"}</td>
//                             <td>{tx.reasons.join(", ")}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             <h3 className="mt-5">Transaction Timeline</h3>
//             <ResponsiveContainer width="100%" height={400}>
//                 <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
//                     <CartesianGrid />
//                     <XAxis
//                         dataKey="timestampMs"
//                         name="Time"
//                         type="number"
//                         domain={['auto', 'auto']}
//                          stroke="#000"
//                         tickFormatter={time => new Date(time).toLocaleTimeString()}
//                     />
//                     <YAxis dataKey="amount" name="Amount"  stroke="#000" />
//                     <Tooltip
//                         cursor={{ strokeDasharray: '3 3' }}
//                         labelFormatter={time => `Time: ${new Date(time).toLocaleString()}`}
//                     />
//                     {/* Normal transactions */}
//                     <Scatter
//                         name="Normal"
//                         data={transactions.filter(tx => !tx.fraud)}
//                         fill="#82ca9d"
//                     />
//                     {/* Fraudulent transactions */}
//                     <Scatter
//                         name="Fraudulent"
//                         data={flaggedTransactions}
//                         fill="#ff4d4f"
//                     />
//                 </ScatterChart>
//             </ResponsiveContainer>
//         </div>
//     );
// };

// export default AdminDashboard;
