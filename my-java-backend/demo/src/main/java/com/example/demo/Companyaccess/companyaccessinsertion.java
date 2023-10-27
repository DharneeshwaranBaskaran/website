package com.example.demo.Companyaccess;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.LoginRequest;

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
public class companyaccessinsertion {
 
    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "GBds@28102001";
    @PostMapping("/register/companyaccess")   
    public ResponseEntity<String> loginbuyer(@RequestBody companyaccess request){
    String email=request.getEmail();
    String username = request.getUsername(); 
    String Provider=request.getProvider();  
    String type=request.getType(); 
    String password=generateRandomString(6);
    try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
        String checkUsernameQuery = "SELECT * FROM companyaccess WHERE username = ?";
        PreparedStatement checkUsernameStatement = connection.prepareStatement(checkUsernameQuery);
        checkUsernameStatement.setString(1, username);
        if (checkUsernameStatement.executeQuery().next()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Username already exists.\"}");
        }
        String findProviderIdQuery = "SELECT id FROM company WHERE username = ?";
        PreparedStatement findProviderIdStatement = connection.prepareStatement(findProviderIdQuery);
        findProviderIdStatement.setString(1, Provider);

        ResultSet resultSet = findProviderIdStatement.executeQuery();
        if (resultSet.next()) {
            long providerId = resultSet.getLong("id");
        String sql = "INSERT INTO companyaccess (username,password,type,email,provider,company_id) VALUES (?,?,?,?,?,?)";
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        preparedStatement.setString(1, username);
        preparedStatement.setString(2, password); 
        preparedStatement.setString(3, type);
        preparedStatement.setString(4, email);
        preparedStatement.setString(5, Provider);
        preparedStatement.setLong(6, providerId);
        int rowsAffected = preparedStatement.executeUpdate();
        if (rowsAffected > 0) {
            System.out.println("Data inserted successfully.");
            sendEmail(email,username,password,Provider);
            return ResponseEntity.ok("{\"message\": \"Registered successfully\"}");

        } else {
            System.out.println("Data insertion failed.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed");
        }
    }} catch (SQLException e) {
            e.printStackTrace();
            String errorMessage = "An error occurred: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + errorMessage + "\"}");
        }
    return null; 
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
    private void sendEmail(String toEmail, String username, String password,String provider) {
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
            message.setText("Dear User,\n\nYour give  access to "+provider+" DB\n\nUsername: " + username + "\nPassword: " + password);

            // Send the message
            Transport.send(message);
            System.out.println("Email sent successfully.");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Email sending failed: " + e.getMessage());
        }
    }
}
