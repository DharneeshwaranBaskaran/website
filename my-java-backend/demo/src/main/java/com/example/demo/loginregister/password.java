package com.example.demo.loginregister;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Access.access;
import com.example.demo.Companyaccess.companyaccess;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class password {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/pass/buyer")
    public ResponseEntity<String> registerGoogleUser(@RequestBody LoginRequest request) {
        String username = request.getUsername();
        String email = request.getEmail();

        try {
            String sql = "SELECT password FROM users WHERE username = ? AND email = ?";
            String password = jdbcTemplate.queryForObject(sql, String.class, username, email);

            if (password != null) {
                sendEmail(email, username, password);
                return ResponseEntity.ok("{\"message\": \"Registered successfully\"}");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
            message.setSubject("Reset Password");
            message.setText(
                    "Dear User,\n\nYour Reset is successful!\n\nUsername: " + username + "\nPassword: " + password);

            Transport.send(message);
            System.out.println("Email sent successfully.");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Email sending failed: " + e.getMessage());
        }
    }

    @PostMapping("/pass/seller")
    public ResponseEntity<String> registerSeller(@RequestBody LoginRequest request) {
        String username = request.getUsername();
        String email = request.getEmail();

        try {
            String sql = "SELECT password FROM seller WHERE username = ? AND email = ?";
            String password = jdbcTemplate.queryForObject(sql, String.class, username, email);

            if (password != null) {
                sendEmail(email, username, password);
                return ResponseEntity.ok("{\"message\": \"Registered successfully\"}");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/pass/access")
    public ResponseEntity<String> registerAccess(@RequestBody access request) {
        String username = request.getUsername();
        String email = request.getEmail();

        try {
            String sql = "SELECT password FROM access WHERE username = ? AND email = ?";
            String password = jdbcTemplate.queryForObject(sql, String.class, username, email);

            if (password != null) {
                sendEmail(email, username, password);
                return ResponseEntity.ok("{\"message\": \"Registered successfully\"}");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/pass/companyaccess")
    public ResponseEntity<String> registerCompanyAccess(@RequestBody companyaccess request) {
        String username = request.getUsername();
        String email = request.getEmail();

        try {
            String sql = "SELECT password FROM companyaccess WHERE username = ? AND email = ?";
            String password = jdbcTemplate.queryForObject(sql, String.class, username, email);

            if (password != null) {
                sendEmail(email, username, password);
                return ResponseEntity.ok("{\"message\": \"Registered successfully\"}");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/pass/company")
    public ResponseEntity<String> registerCompany(@RequestBody company request) {
        String username = request.getUsername();
        String email = request.getEmail();

        try {
            String sql = "SELECT password FROM company WHERE username = ? AND email = ?";
            String password = jdbcTemplate.queryForObject(sql, String.class, username, email);

            if (password != null) {
                // Password found in the database
                sendEmail(email, username, password);
                return ResponseEntity.ok("{\"message\": \"Registered successfully\"}");
            } else {
                // No matching record found
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Handle any errors here
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
