package com.example.demo.History;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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
@Table(name = "history")
public class HistoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String topic;
    private String description;
    private Double cost;
    private Integer count;
    private String username; 
    private Boolean state;
    private String url;
    private double rating;
    private String person; 
    private String seller;
    private String weekend;


@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "combo_id")
private Combo combo;

}
