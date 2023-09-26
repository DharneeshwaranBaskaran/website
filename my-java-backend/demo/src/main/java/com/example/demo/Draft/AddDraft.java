package com.example.demo.Draft;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Replace with the actual origin of your frontend
public class AddDraft {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "GBds@28102001";

    @PostMapping("/adddatadraft")
    public ResponseEntity<String> addDraft(@RequestBody Draftrequest request) {
            Long id = request.getId();
        
            String topic = request.getTopic();
            String description= request.getDescription();
            //String conpassword=request.getConpassword();  
            String url=request.getUrl();
            String cat=request.getCat();  
            Integer cost=request.getCost();
            Double rating=request.getRating(); 
            String person=request.getPerson(); 
            Long refnum=id;
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String checkIdQuery = "SELECT * FROM draft WHERE id = ?";
            PreparedStatement checkIdStatement = connection.prepareStatement(checkIdQuery);
            checkIdStatement.setLong(1, id);
            if (checkIdStatement.executeQuery().next()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"refnum already exists.\"}");
            }

            String sql = "INSERT INTO draft (id,topic, description,url,cat,cost,rating,person,refnum) VALUES (?,?,?,?,?,?,?,?,?)";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setLong(1, id);
                preparedStatement.setString(2, topic);
                preparedStatement.setString(3, description); 
                preparedStatement.setString(4, url); 
                preparedStatement.setString(5, cat);  
                preparedStatement.setInt(6, cost); 
                preparedStatement.setDouble(7, rating);
                preparedStatement.setString(8, person);
                preparedStatement.setLong(9, refnum);
            // Set other parameters based on your DraftRequest class

            int rowsAffected = preparedStatement.executeUpdate();
            if (rowsAffected > 0) {
                connection.commit(); // Commit the transaction
                System.out.println("Draft data inserted successfully.");
            } else {
                System.out.println("Draft data insertion failed.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok("Draft Data Added Successfully");
    }
}
