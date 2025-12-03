package com.example.dat.users.service;

import com.example.dat.doctor.entity.Doctor;
import com.example.dat.doctor.repo.DoctorRepo;
import com.example.dat.exceptions.BadRequestException;
import com.example.dat.exceptions.NotFoundException;
import com.example.dat.notification.dto.NotificationDTO;
import com.example.dat.notification.service.NotificationService;
import com.example.dat.patient.entity.Patient;
import com.example.dat.patient.repo.PatientRepo;
import com.example.dat.res.Response;
import com.example.dat.role.entity.Role;
import com.example.dat.role.repo.RoleRepo;
import com.example.dat.security.JwtService;
import com.example.dat.users.dto.LoginRequest;
import com.example.dat.users.dto.LoginResponse;
import com.example.dat.users.dto.RegistrationRequest;
import com.example.dat.users.dto.ResetPasswordRequest;
import com.example.dat.users.entity.PasswordResetCode;
import com.example.dat.users.entity.User;
import com.example.dat.users.repo.PasswordResetRepo;
import com.example.dat.users.repo.UserRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final NotificationService notificationService;
    private final PatientRepo patientRepo;
    private final DoctorRepo doctorRepo;
    private final PasswordResetRepo passwordResetRepo;
    private final CodeGenerator codeGenerator;

    @Value("${password.reset.link}")
    private String resetLink;

    @Value("${login.link}")
    private String loginLink;


    // REGISTER USER

    @Override
    public Response<String> register(RegistrationRequest request) {

        // Check duplicate email
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("User with this email already exists");
        }

        // Default role = PATIENT
        List<String> requestedRoles =
                (request.getRoles() != null && !request.getRoles().isEmpty())
                        ? request.getRoles().stream().map(String::toUpperCase).toList()
                        : List.of("PATIENT");

        boolean isDoctor = requestedRoles.contains("DOCTOR");

        // Doctor must have license number
        if (isDoctor && (request.getLicenseNumber() == null || request.getLicenseNumber().isBlank())) {
            throw new BadRequestException("Doctor registration requires license number");
        }

        // Load role entities from DB
        List<Role> roles = requestedRoles.stream()
                .map(roleRepo::findByName)
                .flatMap(Optional::stream)
                .toList();

        if (roles.isEmpty()) {
            throw new NotFoundException("Invalid roles provided");
        }

        // Create User
        User newUser = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .roles(roles)
                .build();

        User savedUser = userRepo.save(newUser);

        // Create profiles
        for (Role role : roles) {
            if (role.getName().equals("PATIENT")) {
                createPatientProfile(savedUser);
            }
            if (role.getName().equals("DOCTOR")) {
                createDoctorProfile(request, savedUser);   // <-- FIXED WITH FIRST/LAST NAME
            }
        }

        // Send Welcome Email
        sendRegistrationEmail(request, savedUser);

        return Response.<String>builder()
                .statusCode(200)
                .message("Registration successful! You can now log in.")
                .data(savedUser.getEmail())
                .build();
    }



    // LOGIN

    @Override
    public Response<LoginResponse> login(LoginRequest loginRequest) {

        User user = userRepo.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new NotFoundException("Email not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail());

        LoginResponse loginResponse = LoginResponse.builder()
                .token(token)
                .roles(user.getRoles().stream().map(Role::getName).toList())
                .build();

        return Response.<LoginResponse>builder()
                .statusCode(200)
                .message("Login successful")
                .data(loginResponse)
                .build();
    }



    // FORGOT PASSWORD

    @Override
    public Response<?> forgetPassword(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        passwordResetRepo.deleteByUserId(user.getId());

        String code = codeGenerator.generateUniqueCode();

        PasswordResetCode resetCode = PasswordResetCode.builder()
                .user(user)
                .code(code)
                .expiryDate(LocalDateTime.now().plusHours(5))
                .used(false)
                .build();

        passwordResetRepo.save(resetCode);

        NotificationDTO passwordResetEmail = NotificationDTO.builder()
                .recipient(user.getEmail())
                .subject("Password Reset Request")
                .templateName("password-reset")
                .templateVariables(Map.of(
                        "name", user.getName(),
                        "resetLink", resetLink + code
                ))
                .build();

        notificationService.sendEmail(passwordResetEmail, user);

        return Response.builder()
                .statusCode(200)
                .message("Password reset link sent to your email")
                .build();
    }



    // RESET PASSWORD

    @Override
    public Response<?> updatePasswordViaResetCode(ResetPasswordRequest resetRequest) {

        PasswordResetCode resetCode = passwordResetRepo.findByCode(resetRequest.getCode())
                .orElseThrow(() -> new BadRequestException("Invalid reset code"));

        if (resetCode.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetRepo.delete(resetCode);
            throw new BadRequestException("Reset code expired");
        }

        User user = resetCode.getUser();
        user.setPassword(passwordEncoder.encode(resetRequest.getNewPassword()));
        userRepo.save(user);

        passwordResetRepo.delete(resetCode);

        NotificationDTO confirmationEmail = NotificationDTO.builder()
                .recipient(user.getEmail())
                .subject("Password Updated Successfully")
                .templateName("password-update-confirmation")
                .templateVariables(Map.of("name", user.getName()))
                .build();

        notificationService.sendEmail(confirmationEmail, user);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Password updated successfully")
                .build();
    }



    // PROFILE CREATION HELPERS

    private void createPatientProfile(User user) {
        Patient patient = Patient.builder()
                .user(user)
                .build();
        patientRepo.save(patient);
    }

    //  FIXED — DOCTOR FIRSTNAME & LASTNAME ARE NOW SAVED
    private void createDoctorProfile(RegistrationRequest request, User user) {

        String[] nameParts = request.getName().trim().split(" ", 2);
        String firstName = nameParts.length > 0 ? nameParts[0] : "";
        String lastName  = nameParts.length > 1 ? nameParts[1] : "";

        Doctor doctor = Doctor.builder()
                .firstName(firstName)
                .lastName(lastName)
                .licenseNumber(request.getLicenseNumber())
                .specialization(request.getSpecialization())
                .user(user)
                .build();

        doctorRepo.save(doctor);
    }

    private void sendRegistrationEmail(RegistrationRequest request, User user) {
        NotificationDTO email = NotificationDTO.builder()
                .recipient(user.getEmail())
                .subject("Welcome to DAT Health!")
                .templateName("welcome")
                .templateVariables(Map.of(
                        "name", request.getName(),
                        "loginLink", loginLink
                ))
                .build();

        notificationService.sendEmail(email, user);
    }
}
