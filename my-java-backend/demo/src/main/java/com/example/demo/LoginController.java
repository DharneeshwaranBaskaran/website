package com.example.demo;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {

    @PostMapping("/buyer")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        String jdbcUrl = "jdbc:mysql://localhost:3306/ecom";
        String username = "root";
        String password = "GBds@28102001";

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password)) {
            String sql = "SELECT username, password FROM users WHERE username = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setString(1, loginRequest.getUsername());

                try (ResultSet resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        //String retrievedUsername = resultSet.getString("username");
                        String retrievedPassword = resultSet.getString("password");
                        
                        if (retrievedPassword.equals(loginRequest.getPassword())) {
                           
                                    // SecretKey secretKey = generateSecretKey();

                                    // String jwtToken = Jwts.builder()
                                    //         .setSubject(loginRequest.getUsername())
                                    //         .signWith(secretKey, SignatureAlgorithm.HS256)
                                    //         .compact();
                                    
                            // return ResponseEntity.ok(jwtToken);
                            return ResponseEntity.ok("Login successful!");
                        } else {
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password.");
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username not found.");
                    }
                }
            }
        }
            catch (SQLException e) {
                e.printStackTrace();
                System.out.println(e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
            }
        }
    
    
    // }
//     public static SecretKey generateSecretKey() {
//     byte[] secretKeyBytes = new byte[16]; // Adjust the key size as needed
//     SecureRandom secureRandom = new SecureRandom();
//     secureRandom.nextBytes(secretKeyBytes);
//     return new SecretKeySpec(secretKeyBytes, "HmacSHA256");
// }


    @PostMapping("/seller")
    public ResponseEntity<String> seller(@RequestBody LoginRequest loginRequest) {
        String jdbcUrl = "jdbc:mysql://localhost:3306/ecom";
        String username = "root";
        String password = "GBds@28102001";

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password)) {
            String sql = "SELECT username, password FROM seller WHERE username = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setString(1, loginRequest.getUsername());

                try (ResultSet resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        //String retrievedUsername = resultSet.getString("username");
                        String retrievedPassword = resultSet.getString("password");

                        if (retrievedPassword.equals(loginRequest.getPassword())) {
                            return ResponseEntity.ok("Login successful!");
                        } else {
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password.");
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username not found.");
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }
}
// package com.example.demo;

// import java.sql.Connection;
// import java.sql.DriverManager;
// import java.sql.PreparedStatement;
// import java.sql.ResultSet;
// import java.sql.SQLException;

// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;
// import io.jsonwebtoken.security.Keys;

// import javax.crypto.SecretKey;
// import java.util.Date;

// @RestController
// @RequestMapping("/api")
// @CrossOrigin(origins = "http://localhost:3000")
// public class LoginController {

//     @PostMapping("/buyer")
//     public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
//         String jdbcUrl = "jdbc:mysql://localhost:3306/ecom";
//         String username = "root";
//         String password = "GBds@28102001";

//         try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password)) {
//             String sql = "SELECT username, password FROM users WHERE username = ?";
//             try (PreparedStatement statement = connection.prepareStatement(sql)) {
//                 statement.setString(1, loginRequest.getUsername());

//                 try (ResultSet resultSet = statement.executeQuery()) {
//                     if (resultSet.next()) {
//                         String retrievedPassword = resultSet.getString("password");

//                         if (retrievedPassword.equals(loginRequest.getPassword())) {
//                             String jwtToken = generateJWTToken(loginRequest.getUsername());
//                             return ResponseEntity.ok(jwtToken);
//                         } else {
//                             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password.");
//                         }
//                     } else {
//                         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username not found.");
//                     }
//                 }
//             }
//         } catch (SQLException e) {
//             e.printStackTrace();
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
//         }
//     }

//     @PostMapping("/seller")
//     public ResponseEntity<String> seller(@RequestBody LoginRequest loginRequest) {
//         String jdbcUrl = "jdbc:mysql://localhost:3306/ecom";
//         String username = "root";
//         String password = "GBds@28102001";

//         try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password)) {
//             String sql = "SELECT username, password FROM seller WHERE username = ?";
//             try (PreparedStatement statement = connection.prepareStatement(sql)) {
//                 statement.setString(1, loginRequest.getUsername());

//                 try (ResultSet resultSet = statement.executeQuery()) {
//                     if (resultSet.next()) {
//                         String retrievedPassword = resultSet.getString("password");

//                         if (retrievedPassword.equals(loginRequest.getPassword())) {
//                             String jwtToken = generateJWTToken(loginRequest.getUsername());
//                             return ResponseEntity.ok(jwtToken);
//                         } else {
//                             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password.");
//                         }
//                     } else {
//                         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username not found.");
//                     }
//                 }
//             }
//         } catch (SQLException e) {
//             e.printStackTrace();
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
//         }
//     }

//     private String generateJWTToken(String username) {
//         SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

//         Date now = new Date();
//         Date expirationDate = new Date(now.getTime() + 3600000); // Set token expiration to 1 hour from now

//         return Jwts.builder()
//                 .setSubject(username)
//                 .setIssuedAt(now)
//                 .setExpiration(expirationDate)
//                 .signWith(key)
//                 .compact();
//     }
// }
