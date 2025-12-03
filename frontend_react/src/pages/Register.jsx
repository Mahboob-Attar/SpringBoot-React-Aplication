import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roles: ["PATIENT"], // <-- IMPORTANT
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiService.register(formData);

      if (response.data.statusCode === 200) {
        setSuccess("Registration successful! You can now login.");

        setFormData({
          name: "",
          email: "",
          password: "",
          roles: ["PATIENT"],
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during registration"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Register as Patient</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="form-btn" disabled={loading}>
            {loading ? "Registering..." : "Register as Patient"}
          </button>
        </form>

        <div className="form-link">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
          <p className="mt-1">
            Want to register as a doctor?{" "}
            <Link to="/register-doctor">Click here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
