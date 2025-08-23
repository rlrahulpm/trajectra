package com.trajectra.tmlcorrosion.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "tmls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tml {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "circuit_id", nullable = false)
    private String circuitId;
    
    @Column(name = "tml_id", nullable = false)
    private String tmlId;
    
    @JsonIgnore
    @OneToMany(mappedBy = "tml", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Measurement> measurements;
}