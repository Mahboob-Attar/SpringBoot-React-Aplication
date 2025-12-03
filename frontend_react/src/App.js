import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DoctorRegister from "./pages/DoctorRegister";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import UpdatePassword from "./pages/UpdatePassword";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import ConsultationHistory from "./pages/ConsultationHistory";
import {
  DoctorsAndPatientRoute,
  DoctorsOnlyRoute,
  PatientsOnlyRoute,
} from "./services/Guard";
import DoctorProfile from "./pages/doctors/DoctorProfile";
import UpdateDoctorProfile from "./pages/doctors/UpdateDoctorProfile";
import DoctorAppointments from "./pages/doctors/DoctorAppointments";
import CreateConsultation from "./pages/doctors/CreateConsultation";
import PatientConsultationHistory from "./pages/doctors/PatientConsultationHistory";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/register" element={<Register />} />
        <Route path="/register-doctor" element={<DoctorRegister />} />
        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* PATIENT ONLY ROUTES */}
        <Route
          path="/profile"
          element={<PatientsOnlyRoute element={<Profile />} />}
        />
        <Route
          path="/update-profile"
          element={<PatientsOnlyRoute element={<UpdateProfile />} />}
        />
        <Route
          path="/book-appointment"
          element={<PatientsOnlyRoute element={<BookAppointment />} />}
        />
        <Route
          path="/my-appointments"
          element={<PatientsOnlyRoute element={<MyAppointments />} />}
        />
        <Route
          path="/consultation-history"
          element={<PatientsOnlyRoute element={<ConsultationHistory />} />}
        />

        {/* SHARED ROUTE */}
        <Route
          path="/update-password"
          element={<DoctorsAndPatientRoute element={<UpdatePassword />} />}
        />

        {/* DOCTOR ONLY ROUTES */}
        <Route
          path="/doctor/profile"
          element={<DoctorsOnlyRoute element={<DoctorProfile />} />}
        />
        <Route
          path="/doctor/update-profile"
          element={<DoctorsOnlyRoute element={<UpdateDoctorProfile />} />}
        />
        <Route
          path="/doctor/appointments"
          element={<DoctorsOnlyRoute element={<DoctorAppointments />} />}
        />
        <Route
          path="/doctor/create-consultation"
          element={<DoctorsOnlyRoute element={<CreateConsultation />} />}
        />
        <Route
          path="/doctor/patient-consultation-history"
          element={
            <DoctorsOnlyRoute element={<PatientConsultationHistory />} />
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
