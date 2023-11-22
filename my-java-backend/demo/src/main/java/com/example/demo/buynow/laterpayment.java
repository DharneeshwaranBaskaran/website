package com.example.demo.buynow;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class laterpayment {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";
    @PostMapping("/paidlater/{username}/{id}")
    public ResponseEntity<String> transferCartToHistory(@PathVariable String username,@PathVariable Long id) throws SQLException {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String updateSql = "UPDATE paylater SET state = ? WHERE username = ? AND id=?";
                    PreparedStatement deleteStatement = connection.prepareStatement(updateSql);
                    deleteStatement.setBoolean(1, false);
                    deleteStatement.setString(2, username); 
                    deleteStatement.setLong(3, id);
                    deleteStatement.executeUpdate();
        }
        return null;
    }
    
}
