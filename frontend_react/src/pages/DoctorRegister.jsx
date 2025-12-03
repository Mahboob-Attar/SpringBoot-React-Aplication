import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    licenseNumber: "",
    specialization: "",
    roles: ["DOCTOR"], // important
  });

  const [specializations, setSpecializations] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSpecializations, setLoadingSpecializations] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const response = await apiService.getAllSpecializations();
      if (response.data.statusCode === 200) {
        setSpecializations(response.data.data);
      }
    } catch (error) {
      setError("Failed to load specialization list");
    } finally {
      setLoadingSpecializations(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trimStart(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.specialization) {
      setError("Please select a specialization.");
      setLoading(false);
      return;
    }

    if (!formData.licenseNumber) {
      setError("License Number is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.register(formData);

      if (response.data.statusCode === 200) {
        setSuccess("Doctor registration successful! Redirecting to login...");

        setFormData({
          name: "",
          email: "",
          password: "",
          licenseNumber: "",
          specialization: "",
          roles: ["DOCTOR"],
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
        <h2 className="form-title">Register as Doctor</h2>

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

          <div className="form-group">
            <label className="form-label">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              className="form-input"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Specialization</label>

            <select
              name="specialization"
              className="form-select"
              value={formData.specialization}
              onChange={handleChange}
              required
              disabled={loadingSpecializations}
            >
              <option value="">Select Specialization</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec.replace(/_/g, " ")}
                </option>
              ))}
            </select>

            {loadingSpecializations && <small>Loading...</small>}
          </div>

          <button
            type="submit"
            className="form-btn"
            disabled={loading || loadingSpecializations}
          >
            {loading ? "Registering..." : "Register as Doctor"}
          </button>
        </form>

        <div className="form-link">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
          <p className="mt-1">
            Want to register as a patient?{" "}
            <Link to="/register">Click here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;
