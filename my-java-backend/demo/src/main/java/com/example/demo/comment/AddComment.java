package com.example.demo.comment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AddComment {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public AddComment(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/addcomment")
    public ResponseEntity<String> addComment(@RequestBody Comment request) {
        String topic = request.getTopic();
        String comment = request.getComment();
        String username = request.getUsername();
        Long id=request.getId();
        try {
            String sql = "INSERT INTO comment (topic, comment, username,comid) VALUES (?, ?, ?,?)";
            int rowsAffected = jdbcTemplate.update(sql, topic, comment, username,id);

            if (rowsAffected > 0) {
                System.out.println("Comment inserted successfully.");
                return ResponseEntity.ok("CommentData Added Successfully");
            } else {
                System.out.println("Commentdata insertion failed.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(500).body("Internal Server Error");
    }
}
