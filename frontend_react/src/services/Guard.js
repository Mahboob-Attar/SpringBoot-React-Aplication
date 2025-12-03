import { Navigate } from "react-router-dom";
import { apiService } from "./api";

export const PatientsOnlyRoute = ({ element }) => {
  return apiService.isPatient() ? element : <Navigate to="/login" replace />;
};

export const DoctorsOnlyRoute = ({ element }) => {
  return apiService.isDoctor() ? element : <Navigate to="/login" replace />;
};

export const DoctorsAndPatientRoute = ({ element }) => {
  return apiService.isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/login" replace />
  );
};
