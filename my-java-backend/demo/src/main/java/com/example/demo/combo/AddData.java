package com.example.demo.combo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") 
public class AddData {
    
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public AddData(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/adddata")
    public ResponseEntity<String> addData(@RequestBody Comborequest request) {
        String topic = request.getTopic();
        String description = request.getDescription();
        String url = request.getUrl();
        String cat = request.getCat();
        Integer cost = request.getCost();
        Double rating = request.getRating();
        String person = request.getPerson();
        String seller = request.getSeller();

        try {
            String getLastIdQuery = "SELECT MAX(id) FROM combo";
            Integer lastId = jdbcTemplate.queryForObject(getLastIdQuery, Integer.class);

            int newId = (lastId != null) ? lastId + 1 : 1;

            String sql = "INSERT INTO combo (id, topic, description, url, cat, cost, rating, person, state, seller, count,stockcount) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            int rowsAffected = jdbcTemplate.update(sql, newId, topic, description, url, cat, cost, rating, person, true, seller, 0,0);

            if (rowsAffected > 0) {
                System.out.println("Data inserted successfully.");
                return ResponseEntity.ok("Data Added Successfully");
            } else {
                System.out.println("Data insertion failed.");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(500).body("Internal Server Error");
    }
}