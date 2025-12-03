import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Welcome to <span className="brand">DAT Health</span>
              </h1>
              <p className="hero-subtitle">
                Connect with healthcare professionals from the comfort of your
                home. Quality healthcare made accessible, convenient, and
                secure.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Available</div>
                </div>
                <div className="stat">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Specialists</div>
                </div>
                <div className="stat">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">Patients Served</div>
                </div>
              </div>
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started as Patient
                </Link>
                <Link
                  to="/register-doctor"
                  className="btn btn-secondary btn-large"
                >
                  Join as Doctor
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="image-placeholder">
                <div className="medical-icon">🏥</div>
                <p>Telemedicine Illustration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose DAT Health?</h2>
            <p>Experience healthcare that comes to you</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Quick Access</h3>
              <p>
                Get medical consultations within minutes, no more waiting rooms
                or long queues.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏠</div>
              <h3>From Anywhere</h3>
              <p>
                Connect with doctors from your home, office, or anywhere with
                internet access.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>
                Your medical information is protected with enterprise-grade
                security measures.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Expert Doctors</h3>
              <p>
                Consult with verified and experienced healthcare professionals
                across various specialties.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy to Use</h3>
              <p>
                Simple and intuitive platform designed for patients of all
                technical abilities.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Prescription Services</h3>
              <p>
                Get digital prescriptions and medical advice for common health
                concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Getting healthcare has never been easier</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Your Account</h3>
                <p>
                  Sign up as a patient and complete your medical profile in
                  minutes.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Book an Appointment</h3>
                <p>
                  Choose from available doctors and select a convenient time
                  slot.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Video Consultation</h3>
                <p>
                  Connect with your doctor through secure video call at the
                  scheduled time.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Receive Care</h3>
                <p>
                  Get diagnosis, treatment plans, and prescriptions as needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="specialties-section">
        <div className="container">
          <div className="section-header">
            <h2>Medical Specialties Available</h2>
            <p>Comprehensive healthcare across various medical fields</p>
          </div>
          <div className="specialties-grid">
            <div className="specialty-card">
              <div className="specialty-icon">❤️</div>
              <h4>Cardiology</h4>
              <p>Heart and cardiovascular health</p>
            </div>
            <div className="specialty-card">
              <div className="specialty-icon">🧠</div>
              <h4>Neurology</h4>
              <p>Brain and nervous system disorders</p>
            </div>
            <div className="specialty-card">
              <div className="specialty-icon">👶</div>
              <h4>Pediatrics</h4>
              <p>Child healthcare and development</p>
            </div>
            <div className="specialty-card">
              <div className="specialty-icon">🦴</div>
              <h4>Orthopedics</h4>
              <p>Bone and joint health</p>
            </div>
            <div className="specialty-card">
              <div className="specialty-icon">😊</div>
              <h4>Psychiatry</h4>
              <p>Mental health and wellness</p>
            </div>
            <div className="specialty-card">
              <div className="specialty-icon">👁️</div>
              <h4>Ophthalmology</h4>
              <p>Eye care and vision health</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>
              Join thousands of patients and doctors already using DAT Health
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Start Your Journey
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                Existing User? Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
