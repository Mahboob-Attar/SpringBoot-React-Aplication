import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';


const UpdatePassword = () => {

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

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
            const updatePasswordRequest = {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            };

            const response = await apiService.updatePassword(updatePasswordRequest);

            if (response.data.statusCode === 200) {
                setSuccess('Password updated successfully!');
                setFormData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setTimeout(() => {
                    apiService.logout();
                    navigate('/login');
                }, 5000);
            } else {
                setError(response.data.message || 'Failed to update password');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while updating password');
        } finally {
            setLoading(false);
        }
    };



    const handleCancel = () => {
        navigate('/profile');
    };




    return (
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">Update Password</h2>

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
                        <label className="form-label">Current Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            className="form-input"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            placeholder="Enter your current password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            className="form-input"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
                            required
                        />
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
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default UpdatePassword;