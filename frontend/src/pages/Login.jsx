import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // we'll create this for animations & styling

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/users/login/", form);
      const role = res.data.role;

    onLogin(role); 
    localStorage.setItem("user", JSON.stringify(role));

    // 🔹 Redirect based on role
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
    }
    } catch (err) {
      const apiError = err.response?.data?.error || "Server Error";
      setErrors({ form: apiError });
    }
    setLoading(false);
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center">
      <div className="login-card shadow-lg p-4 animate__animated animate__fadeIn">
        <h2 className="text-center mb-4">Login</h2>

        {errors.form && (
          <div className="alert alert-danger">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
            <div className="invalid-feedback">{errors.username}</div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            <div className="invalid-feedback">{errors.password}</div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="/register">Don't have an account? Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
