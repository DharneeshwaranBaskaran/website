package com.example.demo.combo;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.example.demo.Comment;
import com.example.demo.User;
import com.example.demo.History.HistoryItem;
import com.example.demo.combo.*;
import com.example.demo.posi.CartItem;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@RequiredArgsConstructor 
@Table(name = "combo")

public class Combo {
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
    
    private Boolean state; 
    private String seller; 
    private int count;
    @OneToMany(mappedBy = "combo")
    private List<HistoryItem> historyItems;

    @OneToMany(mappedBy = "combo")
    private List<CartItem> cartItems;
    // Constructors, getters, and setters
    
    
    

    
}
