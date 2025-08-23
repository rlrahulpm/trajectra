package com.trajectra.tmlcorrosion.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "classifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Classification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "classification_type", nullable = false)
    private String classificationType;
    
    @Column(name = "range_label", nullable = false)
    private String rangeLabel;
    
    @Column(name = "min_value")
    private Double minValue;
    
    @Column(name = "max_value")
    private Double maxValue;
}