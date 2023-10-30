package com.example.demo.Seller;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor 
public class SellerInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String username;
    private String person;
      
    private String password;  
    private String email;
    private String address;
    private String comaddress;
    private String name; 
    private String company;
    private Long num;


    // Constructors, getters, and setters
}
