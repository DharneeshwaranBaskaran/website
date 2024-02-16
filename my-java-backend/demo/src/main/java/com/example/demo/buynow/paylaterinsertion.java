package com.example.demo.buynow;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class paylaterinsertion {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public paylaterinsertion(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/transferToHistorypaylater/{username}")
    public ResponseEntity<String> transferCartToHistory(@PathVariable String username) {
        try {
        String selectSql = "SELECT * FROM cart WHERE username = ? AND state = ?";
        String insertSql = "INSERT INTO history (topic, description, cost, count, username, state, rating, url, person, seller, combo_id, weekend,status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
        String updateComboSql = "UPDATE combo SET stockcount = stockcount - ?, count = count + ? WHERE topic = ?";
        String insertPayLaterSql = "INSERT INTO paylater (topic, description, cost, count, username, state, rating, url, person, seller) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String updateSql = "UPDATE cart SET state = ? WHERE username = ?";

        List<String> dataToSend = new ArrayList<>();

        jdbcTemplate.query(selectSql, (resultSet) -> {
            while (resultSet.next()) {
                String itemName = resultSet.getString("topic");
                int itemCount = resultSet.getInt("count");

                if (jdbcTemplate.queryForObject("SELECT COUNT(*) FROM history WHERE topic = ? AND description = ?",
                        Integer.class, itemName, resultSet.getString("description")) > 0) {
                    jdbcTemplate.update(insertSql, resultSet.getString("topic"), resultSet.getString("description"),
                            resultSet.getDouble("cost"), resultSet.getInt("count"), resultSet.getString("username"),
                            resultSet.getBoolean("state"), resultSet.getDouble("rating"), resultSet.getString("url"),
                            resultSet.getString("person"), resultSet.getString("seller"), resultSet.getInt("combo_id"),
                            resultSet.getString("weekend"), "status");
                } else {
                    jdbcTemplate.update(insertSql, resultSet.getString("topic"), resultSet.getString("description"),
                            resultSet.getDouble("cost") * 10 / 9, resultSet.getInt("count"),
                            resultSet.getString("username"),
                            resultSet.getBoolean("state"), resultSet.getDouble("rating"), resultSet.getString("url"),
                            resultSet.getString("person"), resultSet.getString("seller"), resultSet.getInt("combo_id"),
                            resultSet.getString("weekend"), "status");
                }

                dataToSend.add("Topic: " + resultSet.getString("topic") +
                        "\nDescription: " + resultSet.getString("description") +
                        "\nCost: " + resultSet.getDouble("cost") +
                        "\nCount: " + resultSet.getInt("count"));

                jdbcTemplate.update(updateComboSql, itemCount, itemCount, itemName);
                jdbcTemplate.update(updateSql, false, username);
                jdbcTemplate.update(insertPayLaterSql, resultSet.getString("topic"), resultSet.getString("description"),
                        resultSet.getDouble("cost"), resultSet.getInt("count"), resultSet.getString("username"),
                        resultSet.getBoolean("state"), resultSet.getDouble("rating"), resultSet.getString("url"),
                        resultSet.getString("person"), resultSet.getString("seller"));
                int updatedStockCount = jdbcTemplate.queryForObject("SELECT stockcount FROM combo WHERE id = ?",
                        Integer.class, resultSet.getLong("id"));
                if (updatedStockCount == 0) {
                    jdbcTemplate.update("UPDATE combo SET message = 'out of stock' WHERE topic = ?",
                            resultSet.getString("topic"));
                } else {
                    jdbcTemplate.update("UPDATE combo SET message = '' WHERE topic= ?", resultSet.getString("topic"));
                }
            }
            
            return null;
        }, username, true);

        

        sendEmail("gbdharneeshwaran@gmail.com", username, dataToSend);

        
        } catch (EmptyResultDataAccessException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No items found for the user in the cart.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error occurred.");
        }
        return ResponseEntity.ok("Cart items transferred to history for username: " + username);
    }

    private void sendEmail(String toEmail, String username, List<String> data) {
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
            message.setSubject("Data from pending payment");

            StringBuilder messageText = new StringBuilder();
            messageText.append("Dear User,\n\n");
            messageText.append("Data from your pending payment:\n\n");
            for (String record : data) {
                messageText.append(record);
                messageText.append("\n\n");
            }
            messageText.append("Username: " + username);

            message.setText(messageText.toString());
            Transport.send(message);
            System.out.println("Email sent successfully.");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Email sending failed: " + e.getMessage());
        }
    }
}