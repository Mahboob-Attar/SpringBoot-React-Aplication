import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';


const BookAppointment = () => {

    const [formData, setFormData] = useState({
        doctorId: '',
        purposeOfConsultation: '',
        initialSymptoms: '',
        startTime: ''
    });


    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        fetchDoctors();
    }, [])


    const fetchDoctors = async () => {
        try {

            const response = await apiService.getAllDoctors();

            if (response.data.statusCode === 200) {
                setDoctors(response.data.data);
            }

        } catch (error) {
            setError('Failed to load doctors list');

        } finally {
            setLoadingDoctors(false)
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

        // Validation
        if (!formData.doctorId) {
            setError('Please select a doctor');
            setLoading(false);
            return;
        }

        if (!formData.startTime) {
            setError('Please select appointment date and time');
            setLoading(false);
            return;
        }

        // Convert local datetime to ISO format
        const appointmentData = {
            ...formData,
            doctorId: parseInt(formData.doctorId),
            startTime: new Date(formData.startTime).toISOString()
        };

        try {
            const response = await apiService.bookAppointment(appointmentData);

            if (response.data.statusCode === 200) {
                setSuccess('Appointment booked successfully!');
                setFormData({
                    doctorId: '',
                    purposeOfConsultation: '',
                    initialSymptoms: '',
                    startTime: ''
                });
                setTimeout(() => {
                    navigate('/my-appointments');
                }, 5000);
            } else {
                setError(response.data.message || 'Failed to book appointment');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while booking appointment');
        } finally {
            setLoading(false);
        }
    };



    const handleCancel = () => {
        navigate('/profile');
    };

    const formatDoctorName = (doctor) => {
        if (doctor.firstName && doctor.lastName) {
            return `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialization?.replace(/_/g, ' ')}`;
        }
        return `Dr. ${doctor.user?.name} - ${doctor.specialization?.replace(/_/g, ' ') || 'General Practice'}`;
    };

    // Get minimum datetime (current time)
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };




    return (
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">Book Appointment</h2>

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
                        <label className="form-label">Select Doctor</label>
                        <select
                            name="doctorId"
                            className="form-select"
                            value={formData.doctorId}
                            onChange={handleChange}
                            required
                            disabled={loadingDoctors}
                        >
                            <option value="">Choose a doctor</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {formatDoctorName(doctor)}
                                </option>
                            ))}
                        </select>
                        {loadingDoctors && (
                            <small className="form-help">Loading doctors...</small>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Purpose of Consultation</label>
                        <input
                            type="text"
                            name="purposeOfConsultation"
                            className="form-input"
                            value={formData.purposeOfConsultation}
                            onChange={handleChange}
                            placeholder="Briefly describe why you need consultation"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Initial Symptoms</label>
                        <textarea
                            name="initialSymptoms"
                            className="form-input"
                            value={formData.initialSymptoms}
                            onChange={handleChange}
                            placeholder="Describe your symptoms in detail"
                            rows="4"
                            required
                        />
                        <small className="form-help">Be specific about your symptoms, duration, and severity</small>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Preferred Date & Time</label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            className="form-input"
                            value={formData.startTime}
                            onChange={handleChange}
                            min={getMinDateTime()}
                            required
                        />
                        <small className="form-help">Select your preferred appointment date and time</small>
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
                            disabled={loading || loadingDoctors}
                        >
                            {loading ? 'Booking...' : 'Book Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default BookAppointment;