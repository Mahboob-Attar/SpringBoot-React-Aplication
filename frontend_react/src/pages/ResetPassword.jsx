import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';



const ResetPassword = () => {

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
        code: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const codeFromUrl = searchParams.get('code');
        if (codeFromUrl) {
            setFormData(prev => ({
                ...prev,
                code: codeFromUrl
            }));
        }
    }, [searchParams]);


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

        // Validation
        if (!formData.code) {
            setError('Reset code is missing. Please use the link from your email.');
            setLoading(false);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New password and confirm password do not match');
            setLoading(false);
            return;
        }

        if (formData.newPassword.length < 5) {
            setError('New password must be at least 5 characters long');
            setLoading(false);
            return;
        }

        try {
            const resetData = {
                newPassword: formData.newPassword,
                code: formData.code
            };

            const response = await apiService.resetPassword(resetData);

            if (response.data.statusCode === 200) {
                setSuccess('Password reset successfully! You can now login with your new password.');
                setFormData({
                    newPassword: '',
                    confirmPassword: '',
                    code: formData.code // Keep code for display
                });

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } else {
                setError(response.data.message || 'Failed to reset password');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while resetting your password');
        } finally {
            setLoading(false);
        }
    };





    return (
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">Reset Password</h2>

                {!formData.code && (
                    <div className="alert alert-error">
                        Invalid reset link. Please use the link sent to your email.
                    </div>
                )}

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

                {formData.code && (
                    <>
                        <div className="reset-code-info">
                            <p>
                                <strong>Reset Code:</strong> {formData.code}
                            </p>
                            <small>This code was extracted from your reset link</small>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="form-input"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Enter your new password"
                                    required
                                    minLength={6}
                                />
                                <small className="form-help">Must be at least 6 characters long</small>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-input"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your new password"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                className="form-btn"
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}

                <div className="form-link">
                    <p>
                        Remember your password? <Link to="/login">Back to Login</Link>
                    </p>
                    <p className="mt-1">
                        Need a new reset link? <Link to="/forgot-password">Request again</Link>
                    </p>
                </div>

                {/* Password Requirements */}
                <div className="password-requirements">
                    <h4>Password Requirements:</h4>
                    <ul>
                        <li className={formData.newPassword.length >= 5 ? 'requirement-met' : ''}>
                            At least 5 characters long
                        </li>
                        <li className={formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword ? 'requirement-met' : ''}>
                            Passwords match
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
}
export default ResetPassword;