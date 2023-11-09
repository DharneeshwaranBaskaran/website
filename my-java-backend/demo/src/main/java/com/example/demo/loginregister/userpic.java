package com.example.demo.loginregister;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class userpic {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001"; 
    @PostMapping("/userpic/{username}")
    
     public ResponseEntity<String> Updateuser(@RequestBody User User,@PathVariable String username) {
     try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
     String profilepic=User.getProfilepic();
     String updateSql = "UPDATE users SET profilepic = ? WHERE username = ?";
            PreparedStatement updateStatement = connection.prepareStatement(updateSql);
            updateStatement.setString(1, profilepic);
            updateStatement.setString(2, username); 
            
            int rowsAffected = updateStatement.executeUpdate();
            if (rowsAffected > 0) {
                return ResponseEntity.ok("Updated successfully");
            } else {    
                return ResponseEntity.badRequest().body("No User found");
            }
        
            } catch (SQLException e) {
                e.printStackTrace();
            }
             return ResponseEntity.ok("Registered successful"); 
        }
    }
