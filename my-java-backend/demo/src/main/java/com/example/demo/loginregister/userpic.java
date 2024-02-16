package com.example.demo.loginregister;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class userpic{

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @PostMapping("/userpic/{username}")
    public ResponseEntity<String> updateUserProfilePic(@RequestBody User user, @PathVariable String username) {
        try {
            String profilePic = user.getProfilepic();

            String updateSql = "UPDATE users SET profilepic = ? WHERE username = ?";
            int rowsAffected = jdbcTemplate.update(updateSql, profilePic, username);

            if (rowsAffected > 0) {
                return ResponseEntity.ok("Updated successfully");
            } else {
                return ResponseEntity.badRequest().body("No user found with the given username");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An error occurred while updating the user profile pic");
        }
    }
}
