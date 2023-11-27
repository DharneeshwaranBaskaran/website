package com.example.demo.Access;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class accessprovider {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public accessprovider(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/ty/access/{username}")
    public ResponseEntity<List<access>> getComboByPerson(@PathVariable String username) {
        String sql = "SELECT * FROM access WHERE username = ?";
        List<access> accessList = jdbcTemplate.query(sql, (resultSet, rowNum) -> {
            access accesss = new access();
            accesss.setId(resultSet.getLong("id"));
            accesss.setUsername(resultSet.getString("username"));
            accesss.setType(resultSet.getString("type"));
            accesss.setProvider(resultSet.getString("provider"));
            return accesss;
        }, username);

        return ResponseEntity.ok(accessList);
    }

    @GetMapping("/access/{username}")
    public ResponseEntity<List<access>> getComByPerson(@PathVariable String username) {
        String sql = "SELECT * FROM access WHERE provider = ?";
        List<access> accessList = jdbcTemplate.query(sql, (resultSet, rowNum) -> {
            access accesss = new access();
            accesss.setId(resultSet.getLong("id"));
            accesss.setUsername(resultSet.getString("username"));
            accesss.setType(resultSet.getString("type"));
            accesss.setProvider(resultSet.getString("provider"));
            return accesss;
        }, username);

        return ResponseEntity.ok(accessList);
    }
}
