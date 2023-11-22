package com.example.demo.combo;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
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
public class stock {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";
    
    @PostMapping("/updatestock/{id}/{number}/{topic}")
     public ResponseEntity<String> UpdateCart(@PathVariable Long id,@PathVariable Integer number,@PathVariable String topic) {
         
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String selectSql = "SELECT stockcount FROM combo WHERE id=?";
            PreparedStatement selectStatement = connection.prepareStatement(selectSql);
            selectStatement.setLong(1, id);
            
            ResultSet resultSet = selectStatement.executeQuery();
            int currentCount = 0;
            if (resultSet.next()) {
                currentCount = resultSet.getInt("stockcount");
            }
            if(currentCount==0){
                String upsql = "UPDATE reminder SET state = ? WHERE topic=?";
                PreparedStatement updateReminderStatement = connection.prepareStatement(upsql);
                updateReminderStatement.setBoolean(1, true);
                updateReminderStatement.setString(2, topic);
                updateReminderStatement.executeUpdate();
            }
            int newCount = currentCount + number;  
            String updateSql = "UPDATE combo SET stockcount = ? WHERE id=?";
            PreparedStatement updateStatement = connection.prepareStatement(updateSql);
            updateStatement.setInt(1, newCount);
            updateStatement.setLong(2, id);
            int rowsAffected = updateStatement.executeUpdate();
            if (rowsAffected > 0) {
            System.out.println("Count updated successfully for product: " + id);
            return ResponseEntity.ok("Count updated successfully for product: " + id);
        } else {
            System.out.println("No product found with name: " + id);
            return ResponseEntity.badRequest().body("No product found with name: " + id);
        }
    } catch (SQLException e) {
        
            System.out.println("Error updating stock count: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error: " + e.getMessage());
    }
        }
}
