package com.example.demo.buynow;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.example.demo.combo.Combo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
@Entity
@Getter
@Setter
@RequiredArgsConstructor 

@Table(name = "paylater")
public class paylater {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String topic;
    private String description;
    private double cost;
    private int count;
    private String username; 
    private Boolean state; 
    private String url;
    private double rating;
    private String person; 
    private String seller;
    

}
