package com.example.demo.posi;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//import com.example.demo.GoogleUserRequest;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartItemService cartItemService;

    @Autowired
    public CartController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";
    @PostMapping("/add")
    public ResponseEntity<String> addItemToCart(@RequestBody CartItem cartItem) {
        String topic = cartItem.getTopic();
        String description = cartItem.getDescription();
        Double cost=cartItem.getCost();
        int count=cartItem.getCount(); 
        String username=cartItem.getUsername(); 
        Double rating=cartItem.getRating();
        String url=cartItem.getUrl();  
        String person=cartItem.getPerson(); 
        String seller=cartItem.getSeller();
        // Boolean state=true;
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String sql = "INSERT INTO cart (cost, count,topic,description,username,state,rating,url,person,seller) VALUES (?,?,?,?,?,?,?,?,?,?)";
                PreparedStatement preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setDouble(1,cost);
                preparedStatement.setInt(2, count); 
                preparedStatement.setString(3, topic); 
                preparedStatement.setString(4, description); 
                preparedStatement.setString(5, username);  
                preparedStatement.setBoolean(6,true);
                preparedStatement.setDouble(7,rating);
                preparedStatement.setString(8, url);
                preparedStatement.setString(9, person);
                preparedStatement.setString(10, seller);  
        int rowsAffected = preparedStatement.executeUpdate();
                if (rowsAffected > 0) {
                    System.out.println("Data inserted successfully.");
                } else {
                    System.out.println("Data insertion failed.");
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
             return ResponseEntity.ok("Registered successful");
    }
    
}
