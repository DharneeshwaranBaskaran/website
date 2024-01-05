package com.example.demo.loginregister;
import java.security.Key;
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
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api")
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
        String sql = "SELECT password FROM users WHERE username = ?";
        try {
            String retrievedPassword = jdbcTemplate.queryForObject(sql, String.class, loginRequest.getUsername());

            if (retrievedPassword != null && retrievedPassword.equals(loginRequest.getPassword())) {
                Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
                String jwtToken = Jwts.builder()
                        .setSubject(loginRequest.getUsername())
                        .signWith(key, SignatureAlgorithm.HS512)
                        .compact();
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
        String sql = "SELECT password FROM seller WHERE username = ?";
        try {
            String retrievedPassword = jdbcTemplate.queryForObject(sql, String.class, loginRequest.getUsername());

            if (retrievedPassword != null && retrievedPassword.equals(loginRequest.getPassword())) {
                Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);

                String jwtToken = Jwts.builder()
                        .setSubject(loginRequest.getUsername())
                        .signWith(key, SignatureAlgorithm.HS512)
                        .compact();
                System.out.println(jwtToken);
                return ResponseEntity.ok(jwtToken);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }
    @PostMapping("/company")
    public ResponseEntity<String> companyLogin(@RequestBody LoginRequest loginRequest) {
        String sql = "SELECT password FROM company WHERE username = ?";
        try {
            String retrievedPassword = jdbcTemplate.queryForObject(sql, String.class, loginRequest.getUsername());

            if (retrievedPassword != null && retrievedPassword.equals(loginRequest.getPassword())) {
                Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);

                String jwtToken = Jwts.builder()
                        .setSubject(loginRequest.getUsername())
                        .signWith(key, SignatureAlgorithm.HS512)
                        .compact();
                System.out.println(jwtToken);
                return ResponseEntity.ok(jwtToken);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }
}