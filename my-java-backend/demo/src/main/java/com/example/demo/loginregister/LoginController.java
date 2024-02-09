package com.example.demo.loginregister;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Value;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {
     
    @Value("${jwt.secret-key}")
    private String secretKey;

   private final JdbcTemplate jdbcTemplate;

    public LoginController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/buyer")
    public ResponseEntity<String> buyerLogin(@RequestBody LoginRequest loginRequest) {
        String sql = "SELECT id, password FROM users WHERE username = ?";
        try {
            Map<String, Object> result = jdbcTemplate.queryForMap(sql, loginRequest.getUsername());

            String retrievedPassword = (String) result.get("password");
            String userId = result.get("id").toString();

            if (retrievedPassword != null && retrievedPassword.equals(loginRequest.getPassword())) {
                String jwtToken = JwtUtils.generateToken(userId, loginRequest.getUsername(),"buyer");
                System.out.println(jwtToken);
                return ResponseEntity.ok(jwtToken);
            } else {
                System.out.println("error");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password.");
            }
        } catch (Exception e) {
            System.out.println(e);
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }
    @PostMapping("/seller")
public ResponseEntity<String> sellerLogin(@RequestBody LoginRequest loginRequest) {
    String sql = "SELECT id, password FROM seller WHERE username = ?";
    try {
        Map<String, Object> result = jdbcTemplate.queryForMap(sql, loginRequest.getUsername());

        String retrievedPassword = (String) result.get("password");
        String userId = result.get("id").toString();

        if (retrievedPassword != null && retrievedPassword.equals(loginRequest.getPassword())) {
            String jwtToken = JwtUtils.generateToken(userId, loginRequest.getUsername(), "seller");
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
@PostMapping("/company")
public ResponseEntity<String> companyLogin(@RequestBody LoginRequest loginRequest) {
    String sql = "SELECT id, password FROM company WHERE username = ?";
    try {
        Map<String, Object> result = jdbcTemplate.queryForMap(sql, loginRequest.getUsername());

        String retrievedPassword = (String) result.get("password");
        String userId = result.get("id").toString();

        if (retrievedPassword != null && retrievedPassword.equals(loginRequest.getPassword())) {
            String jwtToken = JwtUtils.generateToken(userId, loginRequest.getUsername(), "company");
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