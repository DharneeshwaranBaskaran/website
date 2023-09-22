// package com.example.demo;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// import io.jsonwebtoken.SignatureAlgorithm;
// import io.jsonwebtoken.security.Keys;
// import java.security.Key;

// @Configuration
// public class JwtConfig {  
//     @Value("${jwt.secret}")
//     private String jwtSecret;

//     @Value("${jwt.expiration}")
//     private int jwtExpiration;

//     @Bean
//     public Key jwtSecretKey() {
//         // Generate a secure key with a sufficient size
//         return Keys.secretKeyFor(SignatureAlgorithm.HS256);
//     }
    

//     public int getJwtExpiration() {
//         return jwtExpiration;
//     }
// }
