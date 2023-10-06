package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Random;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") 
public class password { 
    String password = null;
    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "GBds@28102001";
    @PostMapping("/pass/buyer")  
    public ResponseEntity<String> registerGoogleUser(@RequestBody LoginRequest request) {
        String username = request.getUsername();
        String email = request.getEmail();
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String sql = "SELECT password FROM users WHERE username = ? AND email = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, email);
         ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                // Password found in the database
                System.out.println(password);
                password = resultSet.getString("password");
                sendEmail(email,username, password);
                return ResponseEntity.ok("{\"message\": \"Registered successfully\"}");
            }
            else{
                System.out.println(username);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); 

            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println(email);
            // Handle any SQL-related errors here
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        
}
private void sendEmail(String toEmail, String username, String password) {
    Properties properties = new Properties();
    properties.put("mail.smtp.host", "smtp.gmail.com"); // Change this to your email provider's SMTP server
    properties.put("mail.smtp.port", "587"); // Change this to the appropriate port
    properties.put("mail.smtp.auth", "true");
    properties.put("mail.smtp.starttls.enable", "true");

    // Set up the session with your email credentials
    Session session = Session.getInstance(properties, new Authenticator() {
        @Override
        protected PasswordAuthentication getPasswordAuthentication() {
            return new PasswordAuthentication("dharnee28@gmail.com", "kmvu fpjt lfkg zwvp");
        }
    });

    try {
        // Create a message
        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress("dharnee28@gmail.com")); // Change this to your email address
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
        message.setSubject("Registration Successful");
        message.setText("Dear User,\n\nYour Reset is successful!\n\nUsername: " + username + "\nPassword: " + password);

        // Send the message
        Transport.send(message);
        System.out.println("Email sent successfully.");
    } catch (MessagingException e) {
        e.printStackTrace();
        System.out.println("Email sending failed: " + e.getMessage());
    }
}
@PostMapping("/pass/seller")  
    public ResponseEntity<String> registerUser(@RequestBody LoginRequest request) {
        String username = request.getUsername();
        String email = request.getEmail();
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String sql = "SELECT password FROM seller WHERE username = ? AND email = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, email);
         ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                // Password found in the database
                System.out.println(password);
                password = resultSet.getString("password");
                sendEmail(email,username, password);
                return ResponseEntity.ok("{\"message\": \"Registered successfully\"}");
            }
            else{
                System.out.println(username);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); 

            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println(email);
            // Handle any SQL-related errors here
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        
}

}

