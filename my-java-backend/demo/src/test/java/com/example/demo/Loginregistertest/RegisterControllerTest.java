package com.example.demo.Loginregistertest;

import com.example.demo.Seller.seller;
import com.example.demo.loginregister.GoogleUserRequest;
import com.example.demo.loginregister.LoginRequest;
import com.example.demo.loginregister.Registercontroller;
import com.example.demo.loginregister.company;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class RegisterControllerTest {

    @Autowired
    private Registercontroller registerController;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void testRegisterBuyer_ValidData_DataInsertedSuccessfully() {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password123");
        request.setAddress("123 Main Street");
        request.setEmail("testuser@example.com");

        ResponseEntity<String> response = registerController.loginBuyer(request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Registered successful", response.getBody());

        String username = request.getUsername();
        int count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users WHERE username = ?", Integer.class, username);
        assertEquals(1, count);
        jdbcTemplate.update("DELETE FROM users WHERE username = ?", username);
    }

    @Test
    public void testRegisterSeller_ValidData_DataInsertedSuccessfully() {
        seller request = new seller();
        request.setUsername("testseller");
        request.setPassword("sellerpassword");
        request.setAddress("456 Seller Street");
        request.setEmail("testseller@example.com");
        request.setName("Test Seller");
        request.setNum(1234567890L);
        request.setComaddress("789 Company Avenue");
        request.setCompany("Test Company");

        ResponseEntity<String> response = registerController.loginSeller(request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Registered successfully", response.getBody());

        String username = request.getUsername();
        int count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM seller WHERE username = ?", Integer.class, username);
        assertEquals(1, count);
        jdbcTemplate.update("DELETE FROM seller WHERE username = ?", username);
    }

    @Test
    public void testRegisterCompany_ValidData_DataInsertedSuccessfully() {
        company request = new company();
        request.setUsername("testcompany");
        request.setPassword("companypassword");
        request.setEmail("testcompany@example.com");
        request.setNum(9876543210L);
        request.setComaddress("987 Company Street");
        request.setCompany("Test Big Company");
        request.setWebsite("www.testcompany.com");

        ResponseEntity<String> response = registerController.loginCompany(request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Registered successfully", response.getBody());

        String username = request.getUsername();
        int count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM company WHERE username = ?", Integer.class, username);
        assertEquals(1, count);
        jdbcTemplate.update("DELETE FROM company WHERE username = ?", username);
    }

    @Test
    public void testRegisterGoogleUser_ValidData_DataInsertedSuccessfully() {
        GoogleUserRequest request = new GoogleUserRequest();
        request.setUsername("googletestuser");
        request.setEmail("googletestuser@example.com");

        ResponseEntity<String> response = registerController.registerGoogleUser(request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Registered successfully", response.getBody());

        String username = request.getUsername();
        int count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users WHERE username = ?", Integer.class, username);
        assertEquals(1, count);
        jdbcTemplate.update("DELETE FROM users WHERE username = ?", username);
    }
}