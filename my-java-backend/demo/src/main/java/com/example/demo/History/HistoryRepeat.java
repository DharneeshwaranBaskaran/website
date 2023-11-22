package com.example.demo.History;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class HistoryRepeat {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";
    @PostMapping("/repeatHistory/{id}")
    public ResponseEntity<String> transferFromHistory(@PathVariable long id) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String selectSql = "SELECT * FROM history WHERE id = ?";
            PreparedStatement selectStatement = connection.prepareStatement(selectSql);
            selectStatement.setLong(1, id);
            ResultSet resultSet = selectStatement.executeQuery();

            if (resultSet.next()) {
                String insertSql = "INSERT INTO history (topic, description, cost, count, username, state, rating, url, person, seller, weekend) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                PreparedStatement insertStatement = connection.prepareStatement(insertSql);

                insertStatement.setString(1, resultSet.getString("topic"));
                insertStatement.setString(2, resultSet.getString("description"));
                insertStatement.setDouble(3, resultSet.getDouble("cost"));
                insertStatement.setInt(4, resultSet.getInt("count"));
                insertStatement.setString(5, resultSet.getString("username"));
                insertStatement.setBoolean(6, resultSet.getBoolean("state"));
                insertStatement.setDouble(7, resultSet.getDouble("rating"));
                insertStatement.setString(8, resultSet.getString("url"));
                insertStatement.setString(9, resultSet.getString("person"));
                insertStatement.setString(10, resultSet.getString("seller"));
                insertStatement.setString(11, resultSet.getString("weekend"));

                insertStatement.executeUpdate();

                return ResponseEntity.ok("Record with ID " + id + " transferred from history to history.");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

