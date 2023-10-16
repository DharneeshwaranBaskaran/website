package com.example.demo.History;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class History {
        String DB_URL = "jdbc:mysql://localhost:3306/ecom";
        String DB_USER = "root";
        String DB_PASSWORD = "GBds@28102001";
        @PostMapping("/transferToHistory/{username}")
            public ResponseEntity<String> transferCartToHistory(@PathVariable String username) {
                try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
                    // Select cart items for the specific username
                    String selectSql = "SELECT * FROM cart WHERE username = ? AND state = ?";
                    PreparedStatement selectStatement = connection.prepareStatement(selectSql);
                    selectStatement.setString(1, username); 
                    selectStatement.setBoolean(2, true);
                    ResultSet resultSet = selectStatement.executeQuery();

                    // Insert selected cart items into the history table
                    String insertSql = "INSERT INTO history (topic, description, cost, count, username,state,rating,url,person,seller) VALUES (?,?,?,?,?,?,?,?,?,?)";
                    String updateComboSql = "UPDATE combo SET count = count + ? WHERE topic = ?";
                    PreparedStatement insertStatement = connection.prepareStatement(insertSql);
                    PreparedStatement updateComboStatement = connection.prepareStatement(updateComboSql);
                    List<String> dataToSend = new ArrayList<>();
                    while (resultSet.next()) {
                        String itemName = resultSet.getString("topic");
                        int itemCount = resultSet.getInt("count");
                        insertStatement.setString(1, resultSet.getString("topic"));
                        insertStatement.setString(2, resultSet.getString("description"));
                        insertStatement.setDouble(3, resultSet.getDouble("cost"));
                        insertStatement.setInt(4, resultSet.getInt("count"));
                        insertStatement.setString(5, resultSet.getString("username"));
                        insertStatement.setBoolean(6, resultSet.getBoolean("state"));
                        insertStatement.setDouble(7, resultSet.getDouble("rating"));
                        insertStatement.setString(8, resultSet.getString("url"));
                        insertStatement.setString(9, resultSet.getString("person"));
                        insertStatement.setString(10, resultSet.getString("seller"));
                        insertStatement.executeUpdate(); // This line inserts the data once
                        dataToSend.add("Topic: " + resultSet.getString("topic") +
                                "\nDescription: " + resultSet.getString("description") +
                                "\nCost: " + resultSet.getDouble("cost") +
                                "\nCount: " + resultSet.getInt("count"));
                        updateComboStatement.setInt(1, itemCount);
                        updateComboStatement.setString(2, itemName);
                        updateComboStatement.executeUpdate();
                    }


                    String updateSql = "UPDATE cart SET state = ? WHERE username = ?";
                    PreparedStatement deleteStatement = connection.prepareStatement(updateSql);
                    deleteStatement.setBoolean(1, false);
                    deleteStatement.setString(2, username);
                    deleteStatement.executeUpdate();
                    sendEmail("gbdharneeshwaran@gmail.com", username, dataToSend);
                    return ResponseEntity.ok("Cart items transferred to history for username: " + username);
                } catch (SQLException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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