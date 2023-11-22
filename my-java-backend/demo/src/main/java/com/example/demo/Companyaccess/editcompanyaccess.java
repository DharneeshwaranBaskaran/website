package com.example.demo.Companyaccess;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class editcompanyaccess {
    
    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "GBds@28102001";

    @PostMapping("/edit/company")
    public ResponseEntity<String> addDraft(@RequestBody companyaccess request) {
        
            String type=request.getType();
            Long id=request.getId();
            
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String updateSql = "UPDATE companyaccess SET type=? WHERE id= ?";
            PreparedStatement updateStatement = connection.prepareStatement(updateSql);
            updateStatement.setString(1, type);
            updateStatement.setLong(2, id);
            
            int rowsAffected = updateStatement.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("Cost updated successfully");
                return ResponseEntity.ok("Cost updated successfully ");
            } 
        
            } catch (SQLException e) {
                e.printStackTrace();
            }
             return ResponseEntity.ok("Registered successful"); 
        }
}
