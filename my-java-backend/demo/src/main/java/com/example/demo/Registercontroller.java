package com.example.demo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Random;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") 
public class Registercontroller {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "GBds@28102001";
    @PostMapping("/register/buyer")    
    public ResponseEntity<String> loginbuyer(@RequestBody LoginRequest request) {
            String username = request.getUsername();
            String password = request.getPassword();
            String address=request.getAddress();
            String email=request.getEmail();  
            Integer balance=1000;
            
            try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
                String checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
                PreparedStatement checkUsernameStatement = connection.prepareStatement(checkUsernameQuery);
                checkUsernameStatement.setString(1, username);
                if (checkUsernameStatement.executeQuery().next()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Username already exists.\"}");
                }
                String sql = "INSERT INTO users (username, password,address,email,balance) VALUES (?,?,?,?,?)";
                PreparedStatement preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setString(1, username);
                preparedStatement.setString(2, password); 
                preparedStatement.setString(3, address); 
                preparedStatement.setString(4, email);  
                preparedStatement.setInt(5, balance);
                
                int rowsAffected = preparedStatement.executeUpdate();
                if (rowsAffected > 0) {
                    System.out.println("Data inserted successfully.");
                    return ResponseEntity.ok("Registered successful");
                    
                } else {
                    System.out.println("Data insertion failed.");
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Data Insertion failed\"}");
                }
            } catch (SQLException e) {

                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
            }
    }
    @PostMapping("/register/seller")    
    public ResponseEntity<String> loginseller(@RequestBody LoginRequest request) {
            String username = request.getUsername();
            String password = request.getPassword();
            String address=request.getAddress();
            String email=request.getEmail();  
            // Integer balance=1000;
            
            try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
                String checkUsernameQuery = "SELECT * FROM seller WHERE username = ?";
                PreparedStatement checkUsernameStatement = connection.prepareStatement(checkUsernameQuery);
                checkUsernameStatement.setString(1, username);
                if (checkUsernameStatement.executeQuery().next()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Username already exists.\"}");
                }
                String sql = "INSERT INTO seller (username, password,address,email) VALUES (?,?,?,?)";
                PreparedStatement preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setString(1, username);
                preparedStatement.setString(2, password); 
                preparedStatement.setString(3, address); 
                preparedStatement.setString(4, email);  
                
                
                int rowsAffected = preparedStatement.executeUpdate();
                if (rowsAffected > 0) {
                    System.out.println("Data inserted successfully.");
                    return ResponseEntity.ok("Registered successful");
                    
                } else {
                    System.out.println("Data insertion failed.");
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Data Insertion failed\"}");
                }
            } catch (SQLException e) {

                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
            }
    }
    
    public static String generateRandomString(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder randomString = new StringBuilder();

        Random random = new Random();

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            char randomChar = characters.charAt(index);
            randomString.append(randomChar);
        }

        return randomString.toString();
    }
    @PostMapping("/register/google")
    public ResponseEntity<String> registerGoogleUser(@RequestBody GoogleUserRequest request) {
        String username = request.getUsername(); // Assuming you're passing the first name as the username
        String email = request.getEmail();
        String generatedPassword = generateRandomString(6);
        String address=" ";
        
        if (username.length() < 6 || email.equals("")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid data");
        }

        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String checkUsernameQuery = "SELECT * FROM users WHERE email = ?";
                    PreparedStatement checkUsernameStatement = connection.prepareStatement(checkUsernameQuery);
                    checkUsernameStatement.setString(1, email);
                    if (checkUsernameStatement.executeQuery().next()) {
                        return ResponseEntity.ok("{\"message\": \"Registered successfully\"}");
                    }
            String sql = "INSERT INTO users (username,password,address,email,balance) VALUES (?,?,?,?,?)";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, generatedPassword); 
            preparedStatement.setString(3, address);
            preparedStatement.setString(4, email);
            preparedStatement.setInt(5, 1000);
         
            int rowsAffected = preparedStatement.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("Data inserted successfully.");
                return ResponseEntity.ok("{\"message\": \"Registered successfully\"}");

            } else {
                System.out.println("Data insertion failed.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed");
            }
        } catch (SQLException e) {
                e.printStackTrace();
                String errorMessage = "An error occurred: " + e.getMessage();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("{\"error\": \"" + errorMessage + "\"}");
            }
            
        }

}