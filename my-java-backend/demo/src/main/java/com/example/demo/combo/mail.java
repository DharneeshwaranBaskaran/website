package com.example.demo.combo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class mail {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public mail(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/mail")
    public ResponseEntity<String> sendEmailToSeller(@RequestBody Comborequest request) {
        String topic = request.getTopic();
        Integer cost = request.getCost();
        String seller = request.getSeller();

        String email = getSellerEmail(seller);

        if (email == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seller not found");
        } else {
            sendEmail(email, topic, cost, seller);
            return ResponseEntity.ok("Email sent to seller: " + email);
        }
    }

    private String getSellerEmail(String sellerUsername) {
        try {
            String sql = "SELECT email FROM seller WHERE username = ?";
            return jdbcTemplate.queryForObject(sql, new Object[]{sellerUsername}, String.class);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e);
        }
        return null;
    }

    private void sendEmail(String toEmail,String topic,Integer cost,String seller) {
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
            message.setText("Dear User,\n\nYour product is launched successfully:\n Name" +topic+ "\nCost: " + cost+"\nseller:"+seller);

            Transport.send(message);
            System.out.println("Email sent successfully.");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Email sending failed: " + e.getMessage());
        }
    }
}
