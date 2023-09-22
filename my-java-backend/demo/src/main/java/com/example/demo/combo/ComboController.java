package com.example.demo.combo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ComboController {
    @Autowired
    private ComboRepository itemRepository;

    @GetMapping("/combo")
    public List<Combo> getAllItems() {
        return itemRepository.findAll();
    }
    
}