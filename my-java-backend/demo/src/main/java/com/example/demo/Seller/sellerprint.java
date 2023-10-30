package com.example.demo.Seller;
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

import com.example.demo.posi.CartItem;
@RestController
@RequestMapping("/api")
public class sellerprint {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";
    @GetMapping("/getperson/{username}")
     public ResponseEntity<List<SellerInfo>> getCartItemsForUsername(@PathVariable String username) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String sql = "SELECT * FROM seller WHERE username = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            ResultSet resultSet = preparedStatement.executeQuery();

            List<SellerInfo> sellerInfos = new ArrayList<>();

        while (resultSet.next()) {
            SellerInfo sellerInfo = new SellerInfo();
            sellerInfo.setUsername(username);
            sellerInfo.setPerson(resultSet.getString("person"));
            
            
            sellerInfos.add(sellerInfo);
        }
        return ResponseEntity.ok(sellerInfos);
    } catch (SQLException e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

}
    
