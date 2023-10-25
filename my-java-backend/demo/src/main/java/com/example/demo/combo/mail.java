package com.example.demo.combo;
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
public class mail {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "GBds@28102001";
    @PostMapping("/mail")   
    public ResponseEntity<String> loginbuyer(@RequestBody Comborequest request) { 
        String topic = request.getTopic();
        String description= request.getDescription();   
        String url=request.getUrl();
        String cat=request.getCat();  
        Integer cost=request.getCost();
        Double rating=request.getRating(); 
        String person=request.getPerson(); 
        String seller=request.getSeller();  
        String email=getSellerEmail(seller);
        if (email == null) {
            // Handle the case where the seller is not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seller not found");
        }else{
            sendEmail(email,topic,cost,seller);
        return ResponseEntity.ok("Email sent to seller: " + email);
        }
        
    }
    private String getSellerEmail(String sellerUsername) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String sql = "SELECT email FROM seller WHERE username = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, sellerUsername);

            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getString("email");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            // Handle any exceptions
        }
        return null; // Return null if the seller is not found
    }
    private void sendEmail(String toEmail,String topic,Integer cost,String seller) {
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
            message.setText("Dear User,\n\nYour product is launched successfully:\n Name" +topic+ "\nCost: " + cost+"\nseller:"+seller);

            // Send the message
            Transport.send(message);
            System.out.println("Email sent successfully.");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Email sending failed: " + e.getMessage());
        }
    }
}
