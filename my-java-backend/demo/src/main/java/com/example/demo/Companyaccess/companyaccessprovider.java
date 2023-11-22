package com.example.demo.Companyaccess;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
public class companyaccessprovider {
    private final String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    private final String DB_USER = "root";
    private final String DB_PASSWORD = "GBds@28102001";

    @GetMapping("/ty/companyaccess/{username}")
    public ResponseEntity<List<companyaccess>> getComboByPerson(@PathVariable String username) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) { 
            String sql = "SELECT * FROM companyaccess WHERE username = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            ResultSet resultSet = preparedStatement.executeQuery();
            List<companyaccess> accessList = new ArrayList<>();

            while (resultSet.next()) {
                companyaccess accesss = new companyaccess();
                accesss.setId(resultSet.getLong("id"));
                accesss.setUsername(resultSet.getString("username"));
                accesss.setType(resultSet.getString("type"));
                accesss.setProvider(resultSet.getString("provider"));
                accessList.add(accesss);
            }

            return ResponseEntity.ok(accessList);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/companyaccess/{username}")
    public ResponseEntity<List<companyaccess>> getComByPerson(@PathVariable String username) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) { 
            String sql = "SELECT * FROM companyaccess WHERE provider = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            ResultSet resultSet = preparedStatement.executeQuery();
            List<companyaccess> accessList = new ArrayList<>();

            while (resultSet.next()) {
                companyaccess accesss = new companyaccess();
                accesss.setId(resultSet.getLong("id"));
                accesss.setUsername(resultSet.getString("username"));
                accesss.setType(resultSet.getString("type"));
                accesss.setProvider(resultSet.getString("provider"));
                accessList.add(accesss);
            }

            return ResponseEntity.ok(accessList);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
