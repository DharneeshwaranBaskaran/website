package com.example.demo.comment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// import com.example.demo.seller;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AddComment{
    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "GBds@28102001";

    @PostMapping("/addcomment")
    public ResponseEntity<String> addDraft(@RequestBody Comment request) { 
        String topic=request.getTopic();
        String comment=request.getComment();
        String username=request.getUsername();
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String sql = "INSERT INTO comment (topic,comment,username) VALUES (?,?,?)";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, topic);
            preparedStatement.setString(2, comment);
            preparedStatement.setString(3, username);
            int rowsAffected = preparedStatement.executeUpdate();
            if (rowsAffected > 0) {
                // connection.commit(); // Commit the transaction
                System.out.println("Comment inserted successfully.");
                return ResponseEntity.ok("CommentData Added Successfully");
            } else {
                System.out.println("Commentdata insertion failed.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        //return ResponseEntity.ok("CommentData Added Successfully");
        return null;
    }
}