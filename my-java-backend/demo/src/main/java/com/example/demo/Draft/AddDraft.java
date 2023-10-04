package com.example.demo.Draft;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.seller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Replace with the actual origin of your frontend
public class AddDraft {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "GBds@28102001";

    @PostMapping("/adddatadraft")
    public ResponseEntity<String> addDraft(@RequestBody Draftrequest request) {
            
        
            String topic = request.getTopic();
            String description= request.getDescription();
            //String conpassword=request.getConpassword();  
            String url=request.getUrl();
            String cat=request.getCat();  
            Integer cost=request.getCost();
            Double rating=request.getRating(); 
            String person=request.getPerson(); 
            String seller=request.getSeller();
            
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
           String getLastIdQuery = "SELECT MAX(id) FROM combo";
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(getLastIdQuery);
            int lastId = 0;
            if (resultSet.next()) {
                lastId = resultSet.getInt(1);
            }
            
            // Step 2: Increment the last ID to get the new ID
            int newId = lastId + 1;
            
                String sql = "INSERT INTO combo (id,topic, description,url,cat,cost,rating,person,state,seller,count) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
                PreparedStatement preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setLong(1, newId);
                preparedStatement.setString(2, topic);
                preparedStatement.setString(3, description); 
                preparedStatement.setString(4, url); 
                preparedStatement.setString(5, cat);  
                preparedStatement.setInt(6, cost); 
                preparedStatement.setDouble(7, rating);
                preparedStatement.setString(8, person);
                
                preparedStatement.setBoolean(9, false); 
                preparedStatement.setString(10, seller);  
                preparedStatement.setInt(11, 0);
            int rowsAffected = preparedStatement.executeUpdate();
            if (rowsAffected > 0) {
                // connection.commit(); // Commit the transaction
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
