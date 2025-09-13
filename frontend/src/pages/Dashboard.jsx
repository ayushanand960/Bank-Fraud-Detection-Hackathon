
// // src/pages/Dashboard.jsx
// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
// import axiosInstance from "../api/axiosInstance";
// import DashboardTable from "../components/DashboardTable";
// import DashboardSummary from "../components/DashboardSummary";

// export default function Dashboard() {
//   const [txns, setTxns] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let mounted = true;
//     axiosInstance
//       .get("/fraud/") // note: your fraud urls use '' for user transactions endpoint
//       .then((res) => {
//         if (mounted) setTxns(res.data);
//       })
//       .catch((err) => {
//         console.error("Could not fetch transactions:", err);
//         if (mounted) setTxns([]);
//       })
//       .finally(() => mounted && setLoading(false));
//     return () => (mounted = false);
//   }, []);

//   if (loading) {
//     return (
//       <Container className="mt-5 text-center">
//         <Spinner animation="border" />
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="mt-4">
//       <Row>
//         <Col md={12}>
//           <Card className="p-3 shadow-sm mb-3">
//             <h4 className="mb-3">User Dashboard</h4>
//             <DashboardSummary transactions={txns} />
//           </Card>
//         </Col>
//       </Row>

//       <Row>
//         <Col md={12}>
//           <Card className="p-3 shadow-sm">
//             <h5 className="mb-3">Transactions</h5>
//             <DashboardTable transactions={txns} />
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }





// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import DashboardTable from "../components/DashboardTable";
import DashboardSummary from "../components/DashboardSummary";
import AddTransactionModal from "../components/AddTransactionModal";

export default function Dashboard() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/fraud/");
      setTxns(res.data);
    } catch (err) {
      console.error("Could not fetch transactions:", err);
      setTxns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleTransactionAdded = (tx) => {
    setTxns([tx, ...txns]); // turant dashboard update
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={12}>
          <Card className="p-3 shadow-sm mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>User Dashboard</h4>
              <Button onClick={() => setShowModal(true)}>Add Transaction</Button>
            </div>
            <DashboardSummary transactions={txns} />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="p-3 shadow-sm">
            <h5 className="mb-3">Transactions</h5>
            <DashboardTable transactions={txns} />
          </Card>
        </Col>
      </Row>

      <AddTransactionModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </Container>
  );
}
