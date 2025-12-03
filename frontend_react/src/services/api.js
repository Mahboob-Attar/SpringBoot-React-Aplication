import axios from "axios";

const API_BASE_URL = "http://localhost:8086/api";

// -------------------------------------
// AXIOS INSTANCE
// -------------------------------------
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------------------------
// TOKEN INTERCEPTOR
// -------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------------------------------------------
// MAIN API SERVICE OBJECT — FIXED ⭐
// ------------------------------------------------------------------
export const apiService = {
  // -------------------------------------------------------
  // AUTH MANAGEMENT
  // -------------------------------------------------------
  saveAuthData(token, roles) {
    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(roles));
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("user");
    sessionStorage.clear();

    delete api.defaults.headers.common["Authorization"];
  },

  hasRole(role) {
    const roles = localStorage.getItem("roles");
    return roles ? JSON.parse(roles).includes(role) : false;
  },

  isAuthenticated() {
    return localStorage.getItem("token") !== null;
  },

  // ⭐ FIXED: removed `this` because it breaks
  isDoctor() {
    return apiService.hasRole("DOCTOR");
  },

  isPatient() {
    return apiService.hasRole("PATIENT");
  },

  // -------------------------------------------------------
  // AUTH API CALLS
  // -------------------------------------------------------
  login(body) {
    return api.post("/auth/login", body);
  },

  register(body) {
    return api.post("/auth/register", body);
  },

  forgetPassword(body) {
    return api.post("/auth/forgot-password", body);
  },

  resetPassword(body) {
    return api.post("/auth/reset-password", body);
  },

  // -------------------------------------------------------
  // USER MANAGEMENT
  // -------------------------------------------------------
  getMyUserDetails() {
    return api.get("/users/me");
  },

  getUserById(id) {
    return api.get(`/users/by-id/${id}`);
  },

  getAllUsers() {
    return api.get("/users/all");
  },

  updatePassword(body) {
    return api.put("/users/update-password", body);
  },

  uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append("file", file);

    return api.put("/users/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // -------------------------------------------------------
  // PATIENT MANAGEMENT
  // -------------------------------------------------------
  getMyPatientProfile() {
    return api.get("/patients/me");
  },

  updateMyPatientProfile(body) {
    return api.put("/patients/me", body);
  },

  getPatientById(id) {
    return api.get(`/patients/${id}`);
  },

  getAllGenotypeEnums() {
    return api.get("/patients/genotype");
  },

  getAllBloodGroupEnums() {
    return api.get("/patients/bloodgroup");
  },

  // -------------------------------------------------------
  // DOCTOR MANAGEMENT
  // -------------------------------------------------------
  getMyDoctorProfile() {
    return api.get("/doctors/me");
  },

  updateMyDoctorProfile(body) {
    return api.put("/doctors/me", body);
  },

  getAllDoctors() {
    return api.get("/doctors");
  },

  getDoctorById(id) {
    return api.get(`/doctors/${id}`);
  },

  getAllSpecializations() {
    return api.get("/doctors/specializations");
  },

  // -------------------------------------------------------
  // APPOINTMENT MANAGEMENT
  // -------------------------------------------------------
  bookAppointment(body) {
    return api.post("/appointments", body);
  },

  getMyAppointments() {
    return api.get("/appointments");
  },

  cancelAppointment(id) {
    return api.put(`/appointments/cancel/${id}`);
  },

  completeAppointment(id) {
    return api.put(`/appointments/complete/${id}`);
  },

  // -------------------------------------------------------
  // CONSULTATION MANAGEMENT
  // -------------------------------------------------------
  createConsultation(body) {
    return api.post("/consultations", body);
  },

  getConsultationByAppointmentId(id) {
    return api.get(`/consultations/appointment/${id}`);
  },

  getConsultationHistoryForPatient(patientId) {
    return api.get("/consultations/history", {
      params: { patientId },
    });
  },
};

export default api;
