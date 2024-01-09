package com.example.demo.Companyaccess;
import java.security.Key;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import com.example.demo.jwt.JwtUtils;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class companyaccesslogin {

     private final JdbcTemplate jdbcTemplate;

    public companyaccesslogin(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/companyaccess")
    public ResponseEntity<String> login(@RequestBody companyaccess loginRequest) {
         String sql = "SELECT id, password FROM companyaccess WHERE username = ?";
    try {
        Map<String, Object> result = jdbcTemplate.queryForMap(sql, loginRequest.getUsername());

        String retrievedPassword = (String) result.get("password");
        String userId = result.get("id").toString();

        if (retrievedPassword != null && retrievedPassword.equals(loginRequest.getPassword())) {
            String jwtToken = JwtUtils.generateToken(userId, loginRequest.getUsername(), "companyaccess");
            System.out.println(jwtToken);
            return ResponseEntity.ok(jwtToken);
        } else {
            System.out.println("error");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password.");
        }
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
    }
}

}