import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';


const ConsultationHistory = () => {

    const [consultations, setConsultations] = useState([]);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const appointmentId = searchParams.get('appointmentId');


    useEffect(() => {
        fetchConsultationHistory()
    }, [])

    const fetchConsultationHistory = async () => {
        try {
            let response;
            if (appointmentId) {
                // Fetch consultation for specific appointment
                response = await apiService.getConsultationByAppointmentId(appointmentId);
                if (response.data.statusCode === 200) {
                    setConsultations([response.data.data]);
                }
            } else {
                // Fetch all consultation history
                response = await apiService.getConsultationHistoryForPatient();
                if (response.data.statusCode === 200) {
                    setConsultations(response.data.data);
                }
            }

        } catch (error) {
            setError('Failed to load consultation history');

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
                    <h1 className="page-title">
                        {appointmentId ? 'Consultation Notes' : 'Consultation History'}
                    </h1>
                    <Link to="/my-appointments" className="btn btn-secondary">
                        Back to Appointments
                    </Link>
                </div>

                {consultations.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Consultation History</h3>
                        <p>You don't have any consultation records yet.</p>
                        <Link to="/book-appointment" className="btn btn-primary">
                            Book an Appointment
                        </Link>
                    </div>
                ) : (
                    <div className="consultations-list">
                        {consultations.map((consultation) => (
                            <div key={consultation.id} className="consultation-card">
                                <div className="consultation-header">
                                    <h3>Consultation Notes</h3>
                                    <span className="consultation-date">
                                        {formatDateTime(consultation.consultationDate)}
                                    </span>
                                </div>

                                <div className="consultation-section">
                                    <h4>Subjective Notes</h4>
                                    <p>{consultation.subjectiveNotes || 'No subjective notes recorded.'}</p>
                                </div>

                                <div className="consultation-section">
                                    <h4>Objective Findings</h4>
                                    <p>{consultation.objectiveFindings || 'No objective findings recorded.'}</p>
                                </div>

                                <div className="consultation-section">
                                    <h4>Assessment</h4>
                                    <p>{consultation.assessment || 'No assessment recorded.'}</p>
                                </div>

                                <div className="consultation-section">
                                    <h4>Treatment Plan</h4>
                                    <p>{consultation.plan || 'No treatment plan recorded.'}</p>
                                </div>

                                {consultation.appointmentId && (
                                    <div className="consultation-footer">
                                        <Link
                                            to={`/my-appointments`}
                                            className="btn btn-outline btn-sm"
                                        >
                                            View Appointment Details
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );



}

export default ConsultationHistory;