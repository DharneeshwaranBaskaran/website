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

    @PostMapping("/up-csv")
    public String handleFileUpload(@RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes) {
        if (file.isEmpty()) {
            return "Please select a CSV file to upload.";
        }

        try {
            int maxId = jdbcTemplate.queryForObject("SELECT MAX(id) FROM combo", Integer.class);
            if (maxId < 1) {
                maxId = 1; // Start from 1 if the table is empty
            }
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            String line;
            boolean firstLine = true;

            while ((line = reader.readLine()) != null) {
                if (firstLine) {
                    // Skip the header line
                    firstLine = false;
                    continue;
                }
                maxId=maxId+1;
                // Split the CSV line into individual fields
                String[] fields = line.split(",");
                System.out.println(fields);
                // Assuming the order of fields matches the CSV file
                String cat = fields[0].trim();
                Integer cost = Integer.parseInt(fields[1].trim());
                String description = fields[2].trim();
                double rating = Double.parseDouble(fields[3].trim());
                String topic = fields[4].trim();
                String url = fields[5].trim();
                String person = fields[6].trim();
                boolean state = Boolean.parseBoolean(fields[7].trim());
                String seller = (fields[9].trim());
                int count = Integer.parseInt(fields[8].trim());
                int stockcount = Integer.parseInt(fields[10].trim());

                // Use JdbcTemplate to insert data into the "combo" table
                String insertSql = "INSERT INTO combo (id,cat, cost, description, rating, topic, url, person, state, count,seller, stockcount) " +
                        "VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
                jdbcTemplate.update(insertSql,maxId, cat, cost, description, rating, topic, url, person, state, count,seller, stockcount);
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
