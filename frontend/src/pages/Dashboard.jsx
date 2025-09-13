import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/users/profile/");
        setUser(res.data);
        setError("");
      } catch (err) {
        // Handle different types of backend errors
        if (err.response) {
          // Backend returned a response
          setError(err.response.data.error || "Failed to fetch profile");
          if (err.response.status === 401) {
            navigate("/login"); // redirect if unauthorized
          }
        } else if (err.request) {
          setError("No response from server. Check your connection.");
        } else {
          setError("Error: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/users/logout/");
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Logout failed");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">
      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      {user && (
        <div className="card shadow p-4 animate__animated animate__fadeIn">
          <h2 className="text-center mb-3">Dashboard</h2>
          <p><strong>Full Name:</strong> {user.first_name} {user.middle_name} {user.last_name}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Contact:</strong> {user.contact}</p>
          <div className="text-center mt-4">
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
