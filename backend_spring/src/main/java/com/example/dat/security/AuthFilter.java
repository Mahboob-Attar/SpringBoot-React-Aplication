package com.example.dat.security;

import com.example.dat.exceptions.CustomAuthenticationEntryPoint;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class AuthFilter extends OncePerRequestFilter {

    private final JwtService tokenService;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final CustomUserDetailsService customUserDetailsService;

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // Routes that DO NOT require authentication
    private static final String[] PUBLIC_URLS = {
            "/api/auth/**",
            "/api/doctors/**",
            "/",
            "/index.html",
            "/favicon.ico",
            "/static/**",
            "/assets/**",
            "/*.js",
            "/*.css",

            // Swagger (optional)
            "/swagger-ui/**",
            "/v3/api-docs/**"
    };

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        // ALWAYS skip OPTIONS preflight → necessary for React CORS
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        for (String pattern : PUBLIC_URLS) {
            if (pathMatcher.match(pattern, path)) {
                return true; // no JWT required
            }
        }

        return false; // JWT required
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = getTokenFromRequest(request);

        if (token != null) {
            try {
                String email = tokenService.getUsernameFromToken(token);
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

                if (tokenService.isTokenValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }

            } catch (Exception e) {
                log.error("Token error: {}", e.getMessage());
                AuthenticationException ex = new BadCredentialsException("Invalid Token");
                customAuthenticationEntryPoint.commence(request, response, ex);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }

        return null;
    }
}
