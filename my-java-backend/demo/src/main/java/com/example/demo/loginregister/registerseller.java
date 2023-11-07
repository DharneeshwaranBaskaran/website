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
public class registerseller {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/up-csv/company")
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
                    // Skip the header line
                    firstLine = false;
                    continue;
                }

                // Split the CSV line into individual fields
                String[] fields = line.split(",");

                // Assuming the order of fields matches the CSV file
                String comaddress = fields[1].trim();
                String company = fields[2].trim();
                String email = fields[3].trim();
                long num = Long.parseLong(fields[4].trim());
                String password = fields[5].trim();
                String username = fields[6].trim();
                String website = fields[7].trim();

                // Use JdbcTemplate to insert data directly into the database
                String insertSql = "INSERT INTO company (comaddress, company, email, num, password, username, website) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?)";
                jdbcTemplate.update(insertSql, comaddress, company, email, num, password, username, website);
            }

            return "CSV data uploaded successfully.";
        } catch (DataAccessException e) {
            // Handle database-related errors
            e.printStackTrace();
            return "Error uploading CSV data to the database: " + e.getMessage();
        } catch (Exception e) {
            // Handle other general errors
            e.printStackTrace();
            return "Error uploading CSV data: " + e.getMessage();
        }
    }
}
