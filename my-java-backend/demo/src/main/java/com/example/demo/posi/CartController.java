
package com.example.demo.posi;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


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
        Double cost = cartItem.getCost();
        int count = cartItem.getCount();
        String username = cartItem.getUsername();
        Double rating = cartItem.getRating();
        String url = cartItem.getUrl();
        String person = cartItem.getPerson();
        String seller = cartItem.getSeller(); 
        String weekend=cartItem.getWeekend();
        
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String selectComboIdSql = "SELECT id FROM combo WHERE topic = ?";
            PreparedStatement selectComboIdStatement = connection.prepareStatement(selectComboIdSql);
            selectComboIdStatement.setString(1, topic);
            ResultSet comboIdResultSet = selectComboIdStatement.executeQuery();
            
            if (comboIdResultSet.next()) {
                int comboId = comboIdResultSet.getInt("id");
                        String getLastIdQuery = "SELECT MAX(id) FROM cart";
                        Statement statement = connection.createStatement();
                        ResultSet resultSet1 = statement.executeQuery(getLastIdQuery);
                        int lastId = 0;
                        if (resultSet1.next()) {
                            lastId = resultSet1.getInt(1);
                        }
                        
                        // Step 2: Increment the last ID to get the new ID
                        int newId = lastId + 1; 

                String sql = "INSERT INTO cart (cost, count, topic, description, username, state, rating, url, person, seller, combo_id,weekend) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                PreparedStatement preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setDouble(1, cost);
                preparedStatement.setInt(2, count);
                preparedStatement.setString(3, topic);
                preparedStatement.setString(4, description);
                preparedStatement.setString(5, username);
                preparedStatement.setBoolean(6, true);
                preparedStatement.setDouble(7, rating);
                preparedStatement.setString(8, url);
                preparedStatement.setString(9, person);
                preparedStatement.setString(10, seller);
                preparedStatement.setInt(11, comboId);
                preparedStatement.setString(12, weekend);
                int rowsAffected = preparedStatement.executeUpdate();
                
                if (rowsAffected > 0) {
                    System.out.println("Data inserted successfully.");
                    System.out.println(seller);
                   
                    String updateComboSql = "UPDATE combo SET cart_item_id = ? WHERE topic = ?";
                    PreparedStatement updateComboStatement = connection.prepareStatement(updateComboSql);
                    updateComboStatement.setInt(1, newId);
                    updateComboStatement.setString(2, topic);
                    updateComboStatement.executeUpdate();
                     return ResponseEntity.ok("Data inserted successfully");
                } else {
                    System.out.println("Data insertion failed.");
                    return ResponseEntity.badRequest().body("Data insertion failed");
                }
            } else {
                System.out.println("Combo not found for the given topic.");
                return ResponseEntity.badRequest().body("Combo not found for the given topic.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Data insertion failed");
        }
    }
}