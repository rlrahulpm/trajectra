package com.trajectra.tmlcorrosion.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "measurements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Measurement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tml_record_id", nullable = false)
    private Tml tml;
    
    @Column(name = "measurement_date", nullable = false)
    private LocalDate measurementDate;
    
    private Double thickness;
    
    private Double temperature;
    
    @Column(name = "corrosion_rate")
    private Double corrosionRate;
}