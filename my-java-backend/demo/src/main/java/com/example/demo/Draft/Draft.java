package com.example.demo.Draft;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@RequiredArgsConstructor 
@Table(name = "draft")

public class Draft {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String topic;
    private double rating;
    private String description;
    private String url; 
    private int cost;
    private String cat;
    private String person;  
    private Long refnum;
    
    // // getters and setters
    // public void add(Combo combo) {
    // }
  
}
