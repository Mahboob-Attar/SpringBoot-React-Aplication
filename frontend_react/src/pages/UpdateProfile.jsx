import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';


const UpdateProfile = () => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        dateOfBirth: '',
        knownAllergies: '',
        bloodGroup: '',
        genotype: ''
    });


    const [bloodGroups, setBloodGroups] = useState([]);
    const [genotypes, setGenotypes] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingEnums, setLoadingEnums] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        fetchProfileData();
        fetchEnums();
    }, [])

    const fetchProfileData = async () => {

        try {

            const response = await apiService.getMyPatientProfile();

            if (response.data.statusCode === 200) {
                const patientData = response.data.data;
                setFormData({
                    firstName: patientData.firstName || '',
                    lastName: patientData.lastName || '',
                    phone: patientData.phone || '',
                    dateOfBirth: patientData.dateOfBirth || '',
                    knownAllergies: patientData.knownAllergies || '',
                    bloodGroup: patientData.bloodGroup || '',
                    genotype: patientData.genotype || ''
                });
            }

        } catch (error) {
            setError('Failed to load profile data');

        }
    }


    const fetchEnums = async () => {
        try {

            const [bloodGroupResponse, genotypeResponse] = await Promise.all([
                apiService.getAllBloodGroupEnums(),
                apiService.getAllGenotypeEnums()
            ]);

            if (bloodGroupResponse.data.statusCode === 200) {
                setBloodGroups(bloodGroupResponse.data.data);
            }
            if (genotypeResponse.data.statusCode === 200) {
                setGenotypes(genotypeResponse.data.data);
            }

        } catch (error) {
            setError('Failed to load medical data options');

        } finally {
            setLoadingEnums(false);
        }
    }

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
            const response = await apiService.updateMyPatientProfile(formData);

            if (response.data.statusCode === 200) {
                setSuccess('Profile updated successfully!');
                setTimeout(() => {
                    navigate('/profile');
                }, 5000);
            } else {
                setError(response.data.message || 'Failed to update profile');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while updating profile');
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
                <h2 className="form-title">Update Patient Profile</h2>

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
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                className="form-input"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter your first name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                className="form-input"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter your last name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-input"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            className="form-input"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Blood Group</label>
                            <select
                                name="bloodGroup"
                                className="form-select"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                disabled={loadingEnums}
                            >
                                <option value="">Select Blood Group</option>
                                {bloodGroups.map((group) => (
                                    <option key={group} value={group}>
                                        {group.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Genotype</label>
                            <select
                                name="genotype"
                                className="form-select"
                                value={formData.genotype}
                                onChange={handleChange}
                                disabled={loadingEnums}
                            >
                                <option value="">Select Genotype</option>
                                {genotypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Known Allergies</label>
                        <textarea
                            name="knownAllergies"
                            className="form-input"
                            value={formData.knownAllergies}
                            onChange={handleChange}
                            placeholder="List any known allergies (separate with commas)"
                            rows="3"
                        />
                        <small className="form-help">Separate multiple allergies with commas</small>
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
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default UpdateProfile;

