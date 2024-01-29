package com.example.demo.loginregister;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.Random;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;
import com.example.demo.Seller.seller;
import com.example.demo.jwt.JwtUtils;
import javax.sql.DataSource;
import java.util.Map;
import java.util.Objects;

@RestController
@CrossOrigin(origins = "http://localhost:3000") 
public class Registercontroller {
    private JdbcTemplate jdbcTemplate;

    public Registercontroller(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @PostMapping("/register/buyer")
    public ResponseEntity<String> loginBuyer(@RequestBody LoginRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();
        String address = request.getAddress();
        String email = request.getEmail();
        Integer balance = 1000;

        if (Objects.requireNonNull(jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE username = ?", Integer.class, username)) > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Username already exists.\"}");
        }
        String sql = "INSERT INTO users (username, password, address, email, balance, loyalty) VALUES (?, ?, ?, ?, ?, ?)";
        int rowsAffected = jdbcTemplate.update(sql, username, password, address, email, balance, 0.0);

        if (rowsAffected > 0) {
            System.out.println("Data inserted successfully.");
            return ResponseEntity.ok("Registered successful");
        } else {
            System.out.println("Data insertion failed.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Data Insertion failed\"}");
        }
    }
    @PostMapping("/register/seller")
    public ResponseEntity<String> loginSeller(@RequestBody seller request) {
        String username = request.getUsername();
        String password = request.getPassword();
        String address = request.getAddress();
        String email = request.getEmail();
        String name = request.getName();
        Long num = request.getNum();
        String comAddress = request.getComaddress();
        String company = request.getCompany();
        if (Objects.requireNonNull(jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM seller WHERE username = ?", Integer.class, username)) > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Username already exists.\"}");
        }

        String sql = "INSERT INTO seller (username, password, address, email, name, num, comaddress, company) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        int rowsAffected = jdbcTemplate.update(sql, username, password, address, email, name, num, comAddress, company);
        if (rowsAffected > 0) {
            System.out.println("Data inserted successfully.");
            return ResponseEntity.ok("Registered successfully");
        } else {
            System.out.println("Data insertion failed.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Data Insertion failed\"}");
        }
    }
    @PostMapping("/register/company")
    public ResponseEntity<String> loginCompany(@RequestBody company request) {
        String username = request.getUsername();
        String password = request.getPassword();
        String email = request.getEmail();
        Long num = request.getNum();
        String comAddress = request.getComaddress();
        String companyName = request.getCompany();
        String website = request.getWebsite();

        if (Objects.requireNonNull(jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM company WHERE username = ?", Integer.class, username)) > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Username already exists.\"}");
        }

        String sql = "INSERT INTO company (username, password, email, num, comaddress, company, website) VALUES (?, ?, ?, ?, ?, ?, ?)";
        int rowsAffected = jdbcTemplate.update(sql, username, password, email, num, comAddress, companyName, website);
        if (rowsAffected > 0) {
            System.out.println("Data inserted successfully.");
            return ResponseEntity.ok("Registered successfully");
        } else {
            System.out.println("Data insertion failed.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Data Insertion failed\"}");
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
    @Value("${jwt.secret-key}")
    private String secretKey;

    @PostMapping("/register/google")
    public ResponseEntity<String> registerGoogleUser(@RequestBody GoogleUserRequest request) {
        String username = request.getUsername(); 
        String email = request.getEmail();
        String generatedPassword = generateRandomString(6);
        String address = " ";

        if (checkUserExistsByEmail(email)) {
            String sql1 = "SELECT id, username FROM users WHERE email = ?";
        try {
            Map<String, Object> result = jdbcTemplate.queryForMap(sql1, email);
            String userId = result.get("id").toString();
                String jwtToken = JwtUtils.generateToken(userId, username,"buyer");
                System.out.println(jwtToken);
                return ResponseEntity.ok(jwtToken);
           
        } catch (Exception e) {
            System.out.println(e);
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
        }
        try {
            String sql = "INSERT INTO users (username, password, address, email, balance) VALUES (?, ?, ?, ?, ?)";
            int rowsAffected = jdbcTemplate.update(sql, username, generatedPassword, address, email, 1000);

            if (rowsAffected > 0) {
                int userId = jdbcTemplate.queryForObject("SELECT MAX(id) FROM users", Integer.class);
                int lastId = userId+1;
                String jwtToken = JwtUtils.generateToken(String.valueOf(lastId), username, "buyer");
                System.out.println(jwtToken);
                sendEmail(email, username, generatedPassword);
                return ResponseEntity.ok(jwtToken);
            } else {
                System.out.println("Data insertion failed.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            String errorMessage = "An error occurred: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + errorMessage + "\"}");
        }
    }

    private boolean checkUserExistsByEmail(String email) {
        String checkUsernameQuery = "SELECT COUNT(*) FROM users WHERE email = ?";
        return Objects.requireNonNull(jdbcTemplate.queryForObject(checkUsernameQuery, Integer.class, email)) > 0;
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