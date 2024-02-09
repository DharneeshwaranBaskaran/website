package com.example.demo.loginregister;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.Random;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") 
public class phone {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/phone")
    public ResponseEntity<String> loginUser(@RequestBody LoginRequest request) {
        String username = request.getUsername();
        String password = generateRandomString(6);
        String address = "";
        String email = request.getEmail();
        int balance = 1000;

        try {
            if (isUsernameExists(username)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Username already exists.\"}");
            }

            String sql = "INSERT INTO users (username, password, address, email, balance, loyalty) VALUES (?, ?, ?, ?, ?, ?)";
            int rowsAffected = jdbcTemplate.update(sql, username, password, address, email, balance, 0.0);

            if (rowsAffected > 0) {
                System.out.println("Data inserted successfully.");
                sendEmail(email, username, password);
                return ResponseEntity.ok("Registered successfully");
            } else {
                System.out.println("Data insertion failed.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Data Insertion failed\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }

    private boolean isUsernameExists(String username) {
        String checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
        return jdbcTemplate.query(checkUsernameQuery, (resultSet, rowNum) -> resultSet.getString("username"), username)
                .stream()
                .anyMatch(existingUsername -> existingUsername.equals(username));
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
    private void sendEmail(String toEmail, String username, String password) {
            Properties properties = new Properties();
            properties.put("mail.smtp.host", "smtp.gmail.com"); 
            properties.put("mail.smtp.port", "587"); 
            properties.put("mail.smtp.auth", "true");
            properties.put("mail.smtp.starttls.enable", "true");
    
            Session session = Session.getInstance(properties, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication("dharnee28@gmail.com", "kmvu fpjt lfkg zwvp");
                }
            });
    
            try {
                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress("dharnee28@gmail.com")); 
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
                message.setSubject("Registration Successful");
                message.setText("Dear User,\n\nYour registration is successful!\n\nUsername: " + username + "\nPassword: " + password);
    
                Transport.send(message);
                System.out.println("Email sent successfully.");
            } catch (MessagingException e) {
                e.printStackTrace();
                System.out.println("Email sending failed: " + e.getMessage());
            }
        }
}