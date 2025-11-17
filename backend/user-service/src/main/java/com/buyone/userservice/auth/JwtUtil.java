package com.buyone.userservice.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    
    // Inject from app config/secrets in production!
    @Value("${jwt.secret:oogabooga123}")
    private String jwtSecret;
    
    // Expiration: 1 day (configurable)
    // @Value("${jwt.expirationMs:600000}") // 10 min
    // @Value("${jwt.expirationMs:300000}") // 5 minutes
    // @Value("${jwt.expirationMs:60000}") // 1 minute
    @Value("${jwt.expirationMs:86400000}")
    private long jwtExpirationMs;
    
    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
    
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSecretKey())
                .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("JWT Validation failed: " + e.getMessage());
            return false;
        }
    }
    
    public String extractEmail(String token) {
        Jws<Claims> claimsJws = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token);
        return claimsJws.getPayload().getSubject();
    }
    
    public String extractRole(String token) {
        Jws<Claims> claimsJws = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token);
        return claimsJws.getPayload().get("role", String.class);
    }
}
