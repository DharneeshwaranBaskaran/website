package com.example.demo.posi;

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
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartPrint {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";
    @GetMapping("/getItems/{username}")
    public ResponseEntity<List<CartItem>> getCartItemsForUsername(@PathVariable String username) {
    try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
        String sql = "SELECT * FROM cart WHERE username = ? AND state = ? ";
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        preparedStatement.setString(1, username); 
        preparedStatement.setBoolean(2, true);
        ResultSet resultSet = preparedStatement.executeQuery();

        List<CartItem> cartItems = new ArrayList<>();

        while (resultSet.next()) {
            CartItem cartItem = new CartItem();
            cartItem.setCost(resultSet.getDouble("cost"));
            cartItem.setCount(resultSet.getInt("count"));
            cartItem.setName(resultSet.getString("name"));
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

}
