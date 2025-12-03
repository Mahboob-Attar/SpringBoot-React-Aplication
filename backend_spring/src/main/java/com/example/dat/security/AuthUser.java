package com.example.dat.security;

import com.example.dat.users.entity.User;
import lombok.Builder;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Data
@Builder
public class AuthUser implements UserDetails {

    private final User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRoles()
                .stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .toList();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    // ---------- REQUIRED METHODS (MISSING BEFORE)
    @Override
    public boolean isAccountNonExpired() {
        return true; // always valid
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // no locking logic
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // password always valid
    }

    @Override
    public boolean isEnabled() {
        return true; // user always enabled
    }
}
