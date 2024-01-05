package com.example.demo.Loginregistertest;

import com.example.demo.loginregister.LoginRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Map;

@SpringBootTest
@AutoConfigureMockMvc
public class LoginControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate; 

    @Test
    public void testBuyerLogin_ValidCredentials_Success() throws Exception {
        String sql = "SELECT username, password FROM users WHERE id = ?";
        Object[] params = {2}; 
        LoginRequest request = new LoginRequest();
        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, params);
        Map<String, Object> row = results.get(0);
        request.setUsername((String) row.get("username"));
        request.setPassword((String) row.get("password"));
        mockMvc.perform(post("/api/buyer")
                .content("{\"username\":\"" + request.getUsername() + "\",\"password\":\"" + request.getPassword() + "\"}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.parseMediaType("text/plain;charset=UTF-8")));
    }
}