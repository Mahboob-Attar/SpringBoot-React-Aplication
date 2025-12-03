import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, [location]);

  const checkAuthStatus = () => {
    setIsAuthenticated(apiService.isAuthenticated());
    setIsPatient(apiService.isPatient());
    setIsDoctor(apiService.isDoctor());
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    apiService.logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link to="/" className="logo">
              DAT Health
            </Link>

            <div className="nav-links">
              <Link to="/" className={isActiveLink("/")}>
                Home
              </Link>

              {!isAuthenticated ? (
                <>
                  <Link to="/login" className={isActiveLink("/login")}>
                    Login
                  </Link>
                  <Link to="/register" className={isActiveLink("/register")}>
                    Register as Patient
                  </Link>
                  <Link
                    to="/register-doctor"
                    className={isActiveLink("/register-doctor")}
                  >
                    Register as Doctor
                  </Link>
                </>
              ) : (
                <>
                  {/* Patient specific links */}
                  {isPatient && (
                    <>
                      <Link to="/profile" className={isActiveLink("/profile")}>
                        Profile
                      </Link>
                      <Link
                        to="/book-appointment"
                        className={isActiveLink("/book-appointment")}
                      >
                        Book Appointment
                      </Link>
                      <Link
                        to="/my-appointments"
                        className={isActiveLink("/my-appointments")}
                      >
                        My Appointments
                      </Link>
                    </>
                  )}

                  {/* Doctor specific links */}
                  {isDoctor && (
                    <>
                      <Link
                        to="/doctor/profile"
                        className={isActiveLink("/doctor/profile")}
                      >
                        Doctor Dashboard
                      </Link>
                      <Link
                        to="/doctor/appointments"
                        className={isActiveLink("/doctor/appointments")}
                      >
                        My Appointments
                      </Link>
                    </>
                  )}

                  <button onClick={handleLogoutClick} className="logout-btn">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="modal-actions">
              <button
                onClick={handleCancelLogout}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleConfirmLogout} className="btn btn-primary">
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
