package com.example.demo.loginregister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Random;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;
import com.example.demo.Seller.seller;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") 
public class phone {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "GBds@28102001";
    @PostMapping("/phone")    
    public ResponseEntity<String> loginbuyer(@RequestBody LoginRequest request) {
            String username = request.getUsername();
            String password = generateRandomString(6);
            String address="";
            String email=request.getEmail();  
            Integer balance=1000;
            
            try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
                String checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
                PreparedStatement checkUsernameStatement = connection.prepareStatement(checkUsernameQuery);
                checkUsernameStatement.setString(1, username);
                if (checkUsernameStatement.executeQuery().next()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Username already exists.\"}");
                }
                String sql = "INSERT INTO users (username, password,address,email,balance,loyalty) VALUES (?,?,?,?,?,?)";
                PreparedStatement preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setString(1, username);
                preparedStatement.setString(2, password); 
                preparedStatement.setString(3, address); 
                preparedStatement.setString(4, email);  
                preparedStatement.setInt(5, balance);
                preparedStatement.setDouble(6, 0.0);
                
                int rowsAffected = preparedStatement.executeUpdate();
                if (rowsAffected > 0) {
                    System.out.println("Data inserted successfully.");
                    sendEmail(email,username,password);
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
                message.setText("Dear User,\n\nYour registration is successful!\n\nUsername: " + username + "\nPassword: " + password);
    
                // Send the message
                Transport.send(message);
                System.out.println("Email sent successfully.");
            } catch (MessagingException e) {
                e.printStackTrace();
                System.out.println("Email sending failed: " + e.getMessage());
            }
        }
}