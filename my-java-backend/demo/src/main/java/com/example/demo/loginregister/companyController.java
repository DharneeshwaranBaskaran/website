package com.example.demo.loginregister;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@RestController
@RequestMapping("/api")
public class companyController {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @PostMapping("/upload-csv/company")
     public String handleFileUpload(@RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes) {
        if (file.isEmpty()) {
            return "Please select a CSV file to upload.";
        }

        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            String line;
            boolean firstLine = true;

            while ((line = reader.readLine()) != null) {
                if (firstLine) {
                 
                    firstLine = false;
                    continue;
                }
                String[] fields = line.split(",");                
                String email = fields[0].trim();
                String password = fields[1].trim();
                String provider=fields[2].trim(); 
                String type=fields[3].trim();
                String username = fields[4].trim();
                
                String insertSql = "INSERT INTO companyaccess (email, password,provider,type,username) " +
                        "VALUES (?, ?, ?, ?, ?)";
                jdbcTemplate.update(insertSql,email, password,provider,type, username);
            }

            return "CSV data uploaded successfully.";
        } catch (DataAccessException e) {

            e.printStackTrace();
            return "Error uploading CSV data to the database: " + e.getMessage();
        } catch (Exception e) {

            e.printStackTrace();
            return "Error uploading CSV data: " + e.getMessage();
        }
    }
}
