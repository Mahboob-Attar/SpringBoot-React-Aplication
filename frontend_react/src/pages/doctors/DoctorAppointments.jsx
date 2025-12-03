import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';


const DoctorAppointments = () => {

    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, [])



    const fetchAppointments = async () => {
        try {

            const response = await apiService.getMyAppointments();

            if (response.data.statusCode === 200) {
                setAppointments(response.data.data);
            }

        } catch (error) {
            setError('Failed to load appointments');

        }
    }




    const formatDateTime = (dateTimeString) => {
        return new Date(dateTimeString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };



    const getStatusBadge = (status) => {
        const statusConfig = {
            'SCHEDULED': { class: 'status-scheduled', text: 'Scheduled' },
            'COMPLETED': { class: 'status-completed', text: 'Completed' },
            'CANCELLED': { class: 'status-cancelled', text: 'Cancelled' },
            'IN_PROGRESS': { class: 'status-in-progress', text: 'In Progress' }
        };

        const config = statusConfig[status] || { class: 'status-default', text: status };
        return <span className={`status-badge ${config.class}`}>{config.text}</span>;
    };


    const handleCompleteAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to mark this appointment as completed?')) {
            return;
        }

        try {
            const response = await apiService.completeAppointment(appointmentId);
            if (response.data.statusCode === 200) {
                // Refresh appointments list
                fetchAppointments();
            } else {
                alert('Failed to complete appointment');
            }
        } catch (error) {
            alert('Error completing appointment');
        }
    };


    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        try {
            const response = await apiService.cancelAppointment(appointmentId);
            if (response.data.statusCode === 200) {
                // Refresh appointments list
                fetchAppointments();
            } else {
                alert('Failed to cancel appointment');
            }
        } catch (error) {
            alert('Error cancelling appointment');
        }
    };

    const formatPatientInfo = (patient) => {
        return `${patient.firstName} ${patient.lastName} (${patient.user?.email})`;
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
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">My Appointments</h1>
                    <Link to="/doctor/profile" className="btn btn-secondary">
                        Back to Profile
                    </Link>
                </div>

                {appointments.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Appointments Found</h3>
                        <p>You don't have any scheduled appointments yet.</p>
                    </div>
                ) : (
                    <div className="appointments-list">
                        {appointments.map((appointment) => (
                            <div key={appointment.id} className="appointment-card">
                                <div className="appointment-header">
                                    <div className="appointment-info">
                                        <h3 className="patient-name">
                                            Patient: {formatPatientInfo(appointment.patient)}
                                        </h3>
                                        <p className="appointment-time">
                                            {formatDateTime(appointment.startTime)}
                                        </p>
                                    </div>
                                    <div className="appointment-actions">
                                        {getStatusBadge(appointment.status)}
                                        <div className="action-buttons">
                                            {appointment.status === 'SCHEDULED' && (
                                                <>
                                                    <button
                                                        onClick={() => handleCompleteAppointment(appointment.id)}
                                                        className="btn btn-success btn-sm"
                                                    >
                                                        Complete
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancelAppointment(appointment.id)}
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        Cancel
                                                    </button><Link
                                                        to={`/doctor/patient-consultation-history?patientId=${appointment.patient.id}`}
                                                        className="btn btn-info btn-sm"
                                                    >
                                                        View History
                                                    </Link>
                                                </>
                                            )}
                                            {appointment.status === 'COMPLETED' && (
                                                <Link
                                                    to={`/doctor/create-consultation?appointmentId=${appointment.id}`}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    Create Consultation
                                                </Link>
                                            )}
                                            {appointment.meetingLink && appointment.status === 'SCHEDULED' && (
                                                <a
                                                    href={appointment.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline btn-sm"
                                                >
                                                    Join Meeting
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="appointment-details">
                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <label>Purpose:</label>
                                            <span>{appointment.purposeOfConsultation}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Duration:</label>
                                            <span>1 hour</span>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <label>Symptoms:</label>
                                        <span>{appointment.initialSymptoms}</span>
                                    </div>

                                    <div className="detail-item">
                                        <label>Patient Info:</label>
                                        <div className="patient-details">
                                            <span><strong>DOB:</strong> {new Date(appointment.patient.dateOfBirth).toLocaleDateString()}</span>
                                            <span><strong>Blood Group:</strong> {appointment.patient.bloodGroup?.replace('_', ' ')}</span>
                                            <span><strong>Genotype:</strong> {appointment.patient.genotype}</span>
                                            <span><strong>Allergies:</strong> {appointment.patient.knownAllergies || 'None'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );


}
export default DoctorAppointments;