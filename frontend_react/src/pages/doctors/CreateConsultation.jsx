import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';



const CreateConsultation = () => {

    const [formData, setFormData] = useState({
        appointmentId: '',
        subjectiveNotes: '',
        objectiveFindings: '',
        assessment: '',
        plan: ''
    });

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const appointmentId = searchParams.get('appointmentId');



    useEffect(() => {

        if (appointmentId) {
            fetchAppointmentDetails();
        } else {
            setError('No appointment ID provided');
        }

    }, [appointmentId])





    const fetchAppointmentDetails = async () => {
        try {

            const response = await apiService.getMyAppointments();

            if (response.data.statusCode === 200) {
                const foundAppointment = response.data.data.find(
                    appt => appt.id === parseInt(appointmentId)
                );
                if (foundAppointment) {
                    setAppointment(foundAppointment);
                    setFormData(prev => ({
                        ...prev,
                        appointmentId: appointmentId
                    }));
                } else {
                    setError('Appointment not found');
                }
            }

        } catch (error) {
            setError('Failed to load appointment details');

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
        if (!formData.subjectiveNotes || !formData.objectiveFindings ||
            !formData.assessment || !formData.plan) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        try {
            const consultationData = {
                ...formData,
                appointmentId: parseInt(formData.appointmentId)
            };

            const response = await apiService.createConsultation(consultationData);

            if (response.data.statusCode === 200) {
                setSuccess('Consultation created successfully!');
                setTimeout(() => {
                    navigate('/doctor/appointments');
                }, 5000);
            } else {
                setError(response.data.message || 'Failed to create consultation');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while creating consultation');
        } finally {
            setLoading(false);
        }
    };


    const handleCancel = () => {
        navigate('/doctor/appointments');
    };


    const formatDateTime = (dateTimeString) => {
        return new Date(dateTimeString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };



    if (error && !appointment) {
        return (
            <div className="container">
                <div className="form-container">
                    <div className="alert alert-error">{error}</div>
                    <button onClick={handleCancel} className="btn btn-secondary">
                        Back to Appointments
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">Create Consultation</h2>

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

                {appointment && (
                    <div className="consultation-header-info">
                        <h3>Appointment Details</h3>
                        <div className="appointment-summary">
                            <p><strong>Patient:</strong> {appointment.patient.firstName} {appointment.patient.lastName}</p>
                            <p><strong>Date:</strong> {formatDateTime(appointment.startTime)}</p>
                            <p><strong>Purpose:</strong> {appointment.purposeOfConsultation}</p>
                            <p><strong>Symptoms:</strong> {appointment.initialSymptoms}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Subjective Notes</label>
                        <textarea
                            name="subjectiveNotes"
                            className="form-input"
                            value={formData.subjectiveNotes}
                            onChange={handleChange}
                            placeholder="Patient's reported symptoms, history, and concerns..."
                            rows="4"
                            required
                        />
                        <small className="form-help">Patient's subjective complaints and history</small>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Objective Findings</label>
                        <textarea
                            name="objectiveFindings"
                            className="form-input"
                            value={formData.objectiveFindings}
                            onChange={handleChange}
                            placeholder="Physical exam findings, vital signs, test results..."
                            rows="4"
                            required
                        />
                        <small className="form-help">Objective observations and examination findings</small>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Assessment</label>
                        <textarea
                            name="assessment"
                            className="form-input"
                            value={formData.assessment}
                            onChange={handleChange}
                            placeholder="Diagnosis, differential diagnosis, clinical impression..."
                            rows="3"
                            required
                        />
                        <small className="form-help">Clinical assessment and diagnosis</small>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Treatment Plan</label>
                        <textarea
                            name="plan"
                            className="form-input"
                            value={formData.plan}
                            onChange={handleChange}
                            placeholder="Treatment recommendations, medications, follow-up plans..."
                            rows="3"
                            required
                        />
                        <small className="form-help">Treatment plan and recommendations</small>
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
                            {loading ? 'Creating...' : 'Create Consultation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default CreateConsultation;