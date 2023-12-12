package com.example.demo.Loginregistertest;

import com.example.demo.loginregister.LoginRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class LoginControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testBuyerLogin_ValidCredentials_Success() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("dharnee28");
        request.setPassword("28102001");

        mockMvc.perform(post("/api/buyer")
                .content("{\"username\":\"dharnee28\",\"password\":\"28102001\"}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.parseMediaType("text/plain;charset=UTF-8")));
        
    }
}
