import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    contact: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on change
  };

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.first_name.trim()) newErrors.first_name = "First name is required";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email address";

    if (!form.contact) newErrors.contact = "Contact number is required";
    else if (!/^[6-9]\d{9}$/.test(form.contact))
      newErrors.contact = "Contact must start with 6,7,8,9 and be 10 digits";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!form.confirm_password)
      newErrors.confirm_password = "Please confirm your password";
    else if (form.password !== form.confirm_password)
      newErrors.confirm_password = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form };
      delete payload.confirm_password;
      const res = await axiosInstance.post("/users/register/", payload);
      alert(res.data.message);
      setForm({
        username: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        contact: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      setErrors({});
      navigate("/login");
    } catch (err) {
      const apiErrors = err.response?.data || { error: "Server error" };
      setErrors(apiErrors);
    }
    setLoading(false);
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "650px" }}>
        <h2 className="text-center mb-4">Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Row 1 */}
            <div className="col-md-6">
              <label className="form-label">Username *</label>
              <input
                type="text"
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
              <div className="invalid-feedback">{errors.username}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
              <div className="invalid-feedback">{errors.email}</div>
            </div>

            {/* Row 2 */}
            <div className="col-md-6">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="First Name"
              />
              <div className="invalid-feedback">{errors.first_name}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Middle Name</label>
              <input
                type="text"
                className="form-control"
                name="middle_name"
                value={form.middle_name}
                onChange={handleChange}
                placeholder="Middle Name"
              />
            </div>

            {/* Row 3 */}
            <div className="col-md-6">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Last Name"
              />
              <div className="invalid-feedback">{errors.last_name}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Contact *</label>
              <input
                type="text"
                className={`form-control ${errors.contact ? "is-invalid" : ""}`}
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Mobile Number"
              />
              <div className="invalid-feedback">{errors.contact}</div>
            </div>

            {/* Row 4 */}
            <div className="col-md-6">
              <label className="form-label">Password *</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
              />
              <div className="invalid-feedback">{errors.password}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                className={`form-control ${errors.confirm_password ? "is-invalid" : ""}`}
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
              <div className="invalid-feedback">{errors.confirm_password}</div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-4"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
