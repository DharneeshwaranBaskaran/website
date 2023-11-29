package com.example.demo.comment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CommentController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/comments/{comid}")
    public ResponseEntity<List<Comment>> getCommentsForItem(@PathVariable Long comid) {
        try {
            String sql = "SELECT * FROM comment WHERE comid = ?";
            List<Comment> comments = jdbcTemplate.query(sql, (resultSet, rowNum) -> {
                Comment comment = new Comment();
                comment.setId(resultSet.getLong("id"));
                comment.setTopic(resultSet.getString("topic"));
                comment.setComment(resultSet.getString("comment"));
                comment.setUsername(resultSet.getString("username"));
                return comment;
            }, comid);

            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
