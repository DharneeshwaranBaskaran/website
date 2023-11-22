package com.example.demo.combo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class Combostart {
    private final String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    private final String DB_USER = "root";
    private final String DB_PASSWORD = "GBds@28102001";

    @GetMapping("/combodata")
    public ResponseEntity<List<Combo>> getCombo() {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String sql = "SELECT * FROM combo WHERE state = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setBoolean(1, true);
            ResultSet resultSet = preparedStatement.executeQuery();
            List<Combo> combos = new ArrayList<>();

            while (resultSet.next()) {
                Combo combo = new Combo();
                combo.setId(resultSet.getLong("id"));
                combo.setTopic(resultSet.getString("topic"));
                combo.setRating(resultSet.getDouble("rating"));
                combo.setDescription(resultSet.getString("description"));
                combo.setUrl(resultSet.getString("url"));
                combo.setCost(resultSet.getInt("cost"));
                combo.setCat(resultSet.getString("cat"));
                combo.setPerson(resultSet.getString("person")); 
                combo.setSeller(resultSet.getString("seller"));
                combo.setCount(resultSet.getInt("count")); 
                combo.setStockcount(resultSet.getInt("stockcount"));
                combos.add(combo);
            }
            return ResponseEntity.ok(combos);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
