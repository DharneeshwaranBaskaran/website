package com.example.demo.jwt;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtUtils {

    private static final List<String> SECRET_KEYS = new ArrayList<>();

    static {
        for (int i = 0; i < 10; i++) {
            SECRET_KEYS.add(generateStrongSecretKey());
        }
    }

    public static String generateToken(String id, String username,String type) {
        int keyIndex = (int) (System.currentTimeMillis() % SECRET_KEYS.size());
        String secretKey = SECRET_KEYS.get(keyIndex);

        return Jwts.builder()
                .claim("id", id) 
                .claim("username", username)  
                .claim("type",type)
                .setIssuedAt(new Date())
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .compact();
    }

    public static String generateStrongSecretKey() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] key = new byte[64]; 
        secureRandom.nextBytes(key);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(key);
    }
}
