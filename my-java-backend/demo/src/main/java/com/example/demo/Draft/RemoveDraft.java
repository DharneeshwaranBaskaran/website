package com.example.demo.Draft;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.combo.Comborequest;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Random;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") 
public class RemoveDraft {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "GBds@28102001";
    @PostMapping("/removedatadraft")    
    public ResponseEntity<String> login(@RequestBody Draftrequest request) {
            Long id=request.getId();
            
            String seller = request.getSeller(); 
            try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
                String sql = "DELETE FROM combo WHERE id = ? AND state = ? AND seller = ?";
                PreparedStatement preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setLong(1, id); 
                preparedStatement.setBoolean(2, false);
                preparedStatement.setString(3, seller);
                int rowsAffected = preparedStatement.executeUpdate();
                if (rowsAffected > 0) {
                    System.out.println("Product deleted successfully: " + id);
                    return ResponseEntity.ok("Product deleted successfully: " + id);
                } else {
                    System.out.println("No product found with name: " + id);
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"refnum not found.\"}");
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
            return null;
    }
    
}
