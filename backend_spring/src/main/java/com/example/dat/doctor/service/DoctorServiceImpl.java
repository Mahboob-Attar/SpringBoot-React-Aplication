package com.example.dat.doctor.service;

import com.example.dat.doctor.dto.DoctorDTO;
import com.example.dat.doctor.entity.Doctor;
import com.example.dat.doctor.repo.DoctorRepo;
import com.example.dat.enums.Specialization;
import com.example.dat.exceptions.NotFoundException;
import com.example.dat.res.Response;
import com.example.dat.users.entity.User;
import com.example.dat.users.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepo doctorRepo;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @Override
    public Response<DoctorDTO> getDoctorProfile() {

        User user = userService.getCurrentUser();

        Doctor doctor = doctorRepo.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException("Doctor profile not found."));

        return Response.<DoctorDTO>builder()
                .statusCode(200)
                .message("Doctor profile retrieved successfully.")
                .data(modelMapper.map(doctor, DoctorDTO.class))
                .build();
    }

    @Override
    public Response<?> updateDoctorProfile(DoctorDTO doctorDTO) {

        User user = userService.getCurrentUser();

        Doctor doctor = doctorRepo.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException("Doctor profile not found."));

        if (StringUtils.hasText(doctorDTO.getFirstName())) {
            doctor.setFirstName(doctorDTO.getFirstName());
        }

        if (StringUtils.hasText(doctorDTO.getLastName())) {
            doctor.setLastName(doctorDTO.getLastName());
        }

        Optional.ofNullable(doctorDTO.getSpecialization())
                .ifPresent(doctor::setSpecialization);

        doctorRepo.save(doctor);

        return Response.builder()
                .statusCode(200)
                .message("Doctor profile updated successfully.")
                .build();
    }

    @Override
    public Response<List<DoctorDTO>> getAllDoctors() {

        List<Doctor> doctors = doctorRepo.findAll();

        List<DoctorDTO> dtos = doctors.stream()
                .map(d -> modelMapper.map(d, DoctorDTO.class))
                .toList();

        return Response.<List<DoctorDTO>>builder()
                .statusCode(200)
                .message("All doctors retrieved successfully.")
                .data(dtos)
                .build();
    }

    @Override
    public Response<DoctorDTO> getDoctorById(Long doctorId) {

        Doctor doctor = doctorRepo.findById(doctorId)
                .orElseThrow(() -> new NotFoundException("Doctor not found"));

        return Response.<DoctorDTO>builder()
                .statusCode(200)
                .message("Doctor retrieved successfully.")
                .data(modelMapper.map(doctor, DoctorDTO.class))
                .build();
    }

    @Override
    public Response<List<DoctorDTO>> searchDoctorsBySpecialization(Specialization specialization) {

        List<Doctor> doctors = doctorRepo.findBySpecialization(specialization);

        List<DoctorDTO> dtos = doctors.stream()
                .map(d -> modelMapper.map(d, DoctorDTO.class))
                .toList();

        return Response.<List<DoctorDTO>>builder()
                .statusCode(200)
                .message("Doctors retrieved successfully.")
                .data(dtos)
                .build();
    }

    @Override
    public Response<List<Specialization>> getAllSpecializationEnums() {

        return Response.<List<Specialization>>builder()
                .statusCode(200)
                .message("Specializations retrieved successfully")
                .data(Arrays.asList(Specialization.values()))
                .build();
    }
}
