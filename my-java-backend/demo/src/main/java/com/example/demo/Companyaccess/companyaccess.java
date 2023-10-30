package com.example.demo.Companyaccess;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.example.demo.loginregister.company;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor 
@Table(name = "companyaccess")
public class companyaccess {
     
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;  
    private String password;  
    private String email;
    private String type;
    private String provider;
    // Constructors, getters, and setters
    @ManyToOne
    @JoinColumn(name = "company_id")  // Create a foreign key column named seller_id
    private company company;

}