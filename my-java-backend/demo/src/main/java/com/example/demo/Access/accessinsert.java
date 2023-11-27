package com.example.demo.Access;
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
public class accessinsert {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/register/access")
    public ResponseEntity<String> loginbuyer(@RequestBody access request) {
        String email = request.getEmail();
        String username = request.getUsername();
        String provider = request.getProvider();
        String type = request.getType();
        String password = generateRandomString(6);

        try {
            if (checkUsernameExists(username)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Username already exists.\"}");
            }
            Long providerId = findProviderId(provider);
            String sql = "INSERT INTO access (username,password,type,email,provider,seller_id) VALUES (?,?,?,?,?,?)";
            int rowsAffected = jdbcTemplate.update(
                    sql,
                    username, password, type, email, provider, providerId
            );

            if (rowsAffected > 0) {
                System.out.println("Data inserted successfully.");
                sendEmail(email, username, password, provider);
                return ResponseEntity.ok("{\"message\": \"Registered successfully\"}");
            } else {
                System.out.println("Data insertion failed.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e);
            String errorMessage = "An error occurred: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + errorMessage + "\"}");
        }
    }

    private boolean checkUsernameExists(String username) {
        String checkUsernameQuery = "SELECT * FROM access WHERE username = ?";
        return jdbcTemplate.queryForList(checkUsernameQuery, username).size() > 0;
    }

    private Long findProviderId(String provider) {
        String findProviderIdQuery = "SELECT id FROM seller WHERE username = ?";
        return jdbcTemplate.queryForObject(findProviderIdQuery, Long.class, provider);
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
