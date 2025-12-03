import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';



const DoctorProfile = () => {


    const [userData, setUserData] = useState(null);
    const [doctorData, setDoctorData] = useState(null);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        fetchDoctorData();
    }, [])


    const fetchDoctorData = async () => {
        try {

            // Fetch user details
            const userResponse = await apiService.getMyUserDetails();

            if (userResponse.data.statusCode === 200) {
                setUserData(userResponse.data.data);

                // Fetch doctor profile
                const doctorResponse = await apiService.getMyDoctorProfile();
                if (doctorResponse.data.statusCode === 200) {
                    setDoctorData(doctorResponse.data.data);
                }
            }

        } catch (error) {
            setError('Failed to load profile data');
            console.error('Error fetching doctor profile:', error);

        }
    }



    const handleUpdateProfile = () => {
        navigate('/doctor/update-profile');
    };

    const handleUpdatePassword = () => {
        navigate('/update-password');
    };


    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Please select a valid image file (JPEG, PNG, GIF)');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setUploadError('File size must be less than 10MB');
            return;
        }

        setUploading(true);
        setUploadError('');
        setUploadSuccess('');

        try {
            const response = await apiService.uploadProfilePicture(file);
            if (response.data.statusCode === 200) {
                setUploadSuccess('Profile picture updated successfully!');
                // Refresh user data to get the new profile picture URL
                fetchDoctorData();
                // Clear the file input
                event.target.value = '';
            } else {
                setUploadError(response.data.message || 'Failed to upload profile picture');
            }
        } catch (error) {
            setUploadError(error.response?.data?.message || 'An error occurred while uploading the picture');
        } finally {
            setUploading(false);
        }
    };



    const formatSpecialization = (spec) => {
        if (!spec) return 'Not specified';
        return spec.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };


    // Construct full URL for profile picture
    const getProfilePictureUrl = () => {

        console.log("PRofile url is: ", userData?.profilePictureUrl)
        if (!userData?.profilePictureUrl) return null;
        return userData.profilePictureUrl;
    };


    if (error) {
        return (
            <div className="container">
                <div className="form-container">
                    <div className="alert alert-error">{error}</div>
                </div>
            </div>
        );
    }


    return (
        <div className="container">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-header-main">
                        <div className="profile-picture-section">
                            <div className="profile-picture-container">
                                {getProfilePictureUrl() ? (
                                    <img
                                        src={getProfilePictureUrl()}
                                        alt="Profile"
                                        className="profile-picture"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className={`profile-picture-placeholder ${getProfilePictureUrl() ? 'hidden' : ''}`}>
                                    {userData?.name?.charAt(0)?.toUpperCase() || 'D'}
                                </div>
                                <div className="profile-picture-overlay">
                                    <label htmlFor="doctor-profile-picture-upload" className="upload-label">
                                        {uploading ? 'Uploading...' : 'Change Photo'}
                                    </label>
                                    <input
                                        id="doctor-profile-picture-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        disabled={uploading}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                            {uploadError && (
                                <div className="alert alert-error mt-1">
                                    {uploadError}
                                </div>
                            )}
                            {uploadSuccess && (
                                <div className="alert alert-success mt-1">
                                    {uploadSuccess}
                                </div>
                            )}
                        </div>
                        <div className="profile-title-section">
                            <h1 className="profile-title">Doctor Profile</h1>
                            <p className="profile-subtitle">Dr. {userData?.name}</p>
                            {doctorData && (
                                <p className="profile-specialization">
                                    {formatSpecialization(doctorData.specialization)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button onClick={handleUpdateProfile} className="btn btn-primary">
                            Update Profile
                        </button>
                        <button onClick={handleUpdatePassword} className="btn btn-secondary">
                            Update Password
                        </button>
                        <Link to="/doctor/appointments" className="btn btn-primary">
                            My Appointments
                        </Link>
                    </div>
                </div>

                <div className="profile-content">
                    {/* User Information Section */}
                    <div className="profile-section">
                        <h2 className="section-title">Account Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <label className="info-label">Name</label>
                                <div className="info-value">{userData?.name || 'Not provided'}</div>
                            </div>
                            <div className="info-item">
                                <label className="info-label">Email</label>
                                <div className="info-value">{userData?.email || 'Not provided'}</div>
                            </div>
                            <div className="info-item">
                                <label className="info-label">User ID</label>
                                <div className="info-value">{userData?.id || 'Not provided'}</div>
                            </div>
                            <div className="info-item">
                                <label className="info-label">Roles</label>
                                <div className="info-value">
                                    {userData?.roles?.map(role => role.name).join(', ') || 'Not provided'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Information Section */}
                    {doctorData && (
                        <div className="profile-section">
                            <h2 className="section-title">Professional Information</h2>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label className="info-label">First Name</label>
                                    <div className="info-value">{doctorData.firstName || 'Not provided'}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">Last Name</label>
                                    <div className="info-value">{doctorData.lastName || 'Not provided'}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">Specialization</label>
                                    <div className="info-value">{formatSpecialization(doctorData.specialization)}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">Doctor ID</label>
                                    <div className="info-value">{doctorData.id || 'Not provided'}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!doctorData && (
                        <div className="profile-section">
                            <div className="alert alert-info">
                                <p>No doctor profile found. Please update your profile to add professional information.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default DoctorProfile;