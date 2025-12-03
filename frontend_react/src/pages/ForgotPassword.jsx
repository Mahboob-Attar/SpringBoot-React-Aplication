import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';


const ForgotPassword = () => {

    const [formData, setFormData] = useState({
        email: ''
    });


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apiService.forgetPassword(formData);

            if (response.data.statusCode === 200) {
                setSuccess('Password reset instructions have been sent to your email!');
                setFormData({ email: '' });
            } else {
                setError(response.data.message || 'Failed to send reset instructions');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while processing your request');
        } finally {
            setLoading(false);
        }
    };





    return (
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">Forgot Password</h2>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your registered email address"
                            required
                        />
                        <small className="form-help">
                            Enter your email address and we'll send you instructions to reset your password.
                        </small>
                    </div>

                    <button
                        type="submit"
                        className="form-btn"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Instructions'}
                    </button>
                </form>

                <div className="form-link">
                    <p>
                        Remember your password? <Link to="/login">Back to Login</Link>
                    </p>
                    <p className="mt-1">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                </div>

                {/* Additional Help Information */}
                <div className="forgot-password-help">
                    <h4>What happens next?</h4>
                    <ul>
                        <li>Check your email for a password reset link</li>
                        <li>The reset code will expire after a certain period</li>
                        <li>If you don't see the email, check your spam folder</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default ForgotPassword;