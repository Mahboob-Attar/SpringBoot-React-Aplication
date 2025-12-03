import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
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

    try {
      const response = await apiService.login(formData);

      // Backend response structure:
      // { statusCode: 200, message: "...", data: { token, roles } }
      if (response.data?.statusCode === 200) {
        const { token, roles } = response.data.data;

        // Save token + roles
        apiService.saveAuthData(token, roles);

        // Redirect based on role:
        if (roles.includes("DOCTOR")) {
          navigate("/doctor-dashboard");
        } else if (roles.includes("PATIENT")) {
          navigate("/home");
        } else {
          navigate("/home");
        }
      } else {
        setError(response.data?.message || "Login failed.");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Login</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
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
            />
          </div>

          <button type="submit" className="form-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="form-link">
          <p>
            Don't have an account?{" "}
            <Link to="/register">Register as Patient</Link> or{" "}
            <Link to="/register-doctor">Register as Doctor</Link>
          </p>
          <p>
            Forgot Password? <Link to="/forgot-password">Reset Password</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
