package com.example.demo.buynow;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/paylater")
@CrossOrigin(origins = "http://localhost:3000")
public class paylaterprint {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";
    @GetMapping("/getpaylater/{username}")
    public ResponseEntity<List<paylater>> getCartItemsForUsername(@PathVariable String username) {
    try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
        String sql = "SELECT * FROM paylater WHERE username = ? AND state = ? ";
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        preparedStatement.setString(1, username); 
        preparedStatement.setBoolean(2, true);
        ResultSet resultSet = preparedStatement.executeQuery();

        List<paylater> cartItems = new ArrayList<>();

        while (resultSet.next()) {
            paylater cartItem = new paylater(); 
            cartItem.setId(resultSet.getLong("id"));
            cartItem.setCost(resultSet.getDouble("cost"));
            cartItem.setCount(resultSet.getInt("count"));
            cartItem.setTopic(resultSet.getString("topic"));
            cartItem.setDescription(resultSet.getString("description"));
            cartItem.setUsername(resultSet.getString("username"));
            cartItem.setState(resultSet.getBoolean("state"));
            
            cartItems.add(cartItem);
        }
        return ResponseEntity.ok(cartItems);
    } catch (SQLException e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}   
@GetMapping("/getpaylat/{id}")
    public ResponseEntity<List<paylater>> getCartItemsForId(@PathVariable Long id) {
    try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
        String sql = "SELECT * FROM paylater WHERE id=?";
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        preparedStatement.setLong(1, id); 
        ResultSet resultSet = preparedStatement.executeQuery();

        List<paylater> cartItems = new ArrayList<>();

        while (resultSet.next()) {
            paylater cartItem = new paylater(); 
            cartItem.setId(resultSet.getLong("id"));
            cartItem.setCost(resultSet.getDouble("cost"));
            cartItem.setCount(resultSet.getInt("count"));
            cartItem.setTopic(resultSet.getString("topic"));
            cartItem.setDescription(resultSet.getString("description"));
            cartItem.setUsername(resultSet.getString("username"));
            cartItem.setState(resultSet.getBoolean("state"));
            
            cartItems.add(cartItem); 
            System.out.println("qwertyuiop[]");
            System.out.println(cartItem);
        } 
        System.out.println("qwertyuiop[]");
        return ResponseEntity.ok(cartItems);
    } catch (SQLException e) {
        System.out.println(e);
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

}
