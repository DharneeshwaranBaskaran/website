package com.example.demo.History;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class History {
        @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/transferToHistory/{username}")
    public ResponseEntity<String> transferCartToHistory(@PathVariable String username) {
        try {
            String selectSql = "SELECT * FROM cart WHERE username = ? AND state = ?";
            List<HistoryItem> cartItems = jdbcTemplate.query(selectSql, new Object[]{username, true}, new HistoryItemRowMapper());

            String insertSql = "INSERT INTO history (topic, description, cost, count, username, state, rating, url, person, seller, combo_id, weekend) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            String updateComboSql = "UPDATE combo SET history_item_id = ?, stockcount = stockcount - ?, count = count + ? WHERE topic = ?";

            List<String> dataToSend = new ArrayList<>();

            for (HistoryItem cartItem : cartItems) {
                int newId = jdbcTemplate.queryForObject("SELECT MAX(id) FROM history", Integer.class) + 1;

                String checkHistorySql = "SELECT * FROM history WHERE topic = ? AND description = ?";
                List<HistoryItem> historyItems = jdbcTemplate.query(checkHistorySql, new Object[]{cartItem.getTopic(), cartItem.getDescription()}, new HistoryItemRowMapper());

                double modifiedCost = historyItems.isEmpty() ? cartItem.getCost() * 10 / 9 : cartItem.getCost();

                jdbcTemplate.update(insertSql,
                        cartItem.getTopic(),
                        cartItem.getDescription(),
                        modifiedCost,
                        cartItem.getCount(),
                        cartItem.getUsername(),
                        cartItem.getState(),
                        cartItem.getRating(),
                        cartItem.getUrl(),
                        cartItem.getPerson(),
                        cartItem.getSeller(),
                        cartItem.getId(),
                        cartItem.getWeekend());

                dataToSend.add("Topic: " + cartItem.getTopic() +
                        "\nDescription: " + cartItem.getDescription() +
                        "\nCost: " + modifiedCost +
                        "\nCount: " + cartItem.getCount());

                jdbcTemplate.update(updateComboSql, newId, cartItem.getCount(), cartItem.getCount(), cartItem.getTopic());
            }

            String updateSql = "UPDATE cart SET state = ? WHERE username = ?";
            jdbcTemplate.update(updateSql, false, username);

            sendEmail("gbdharneeshwaran@gmail.com", username, dataToSend);

            return ResponseEntity.ok("Cart items transferred to history for username: " + username);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private static class HistoryItemRowMapper implements RowMapper<HistoryItem> {
        @Override
        public HistoryItem mapRow(ResultSet resultSet, int rowNum) throws SQLException {
             BeanPropertyRowMapper<HistoryItem> rowMapper = new BeanPropertyRowMapper<>(HistoryItem.class);
        return rowMapper.mapRow(resultSet, rowNum);
        }
    }

            private void sendEmail(String toEmail, String username, List<String> data) {
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
            message.setSubject("Data from Cart");
            
            StringBuilder messageText = new StringBuilder();
            messageText.append("Dear User,\n\n");
            messageText.append("Data from your cart:\n\n");
            for (String record : data) {
                messageText.append(record);
                messageText.append("\n\n");
            }
            messageText.append("Username: " + username);

            message.setText(messageText.toString());

            // Send the message
            Transport.send(message);
            System.out.println("Email sent successfully.");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Email sending failed: " + e.getMessage());
        }
    }
}