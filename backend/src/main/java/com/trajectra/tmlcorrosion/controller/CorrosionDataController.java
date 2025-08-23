package com.trajectra.tmlcorrosion.controller;

import com.trajectra.tmlcorrosion.entity.Classification;
import com.trajectra.tmlcorrosion.entity.Measurement;
import com.trajectra.tmlcorrosion.entity.Tml;
import com.trajectra.tmlcorrosion.repository.ClassificationRepository;
import com.trajectra.tmlcorrosion.repository.MeasurementRepository;
import com.trajectra.tmlcorrosion.repository.TmlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/corrosion-data")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "false")
public class CorrosionDataController {
    
    @Autowired
    private TmlRepository tmlRepository;
    
    @Autowired
    private MeasurementRepository measurementRepository;
    
    @Autowired
    private ClassificationRepository classificationRepository;
    
    @GetMapping
    public List<Map<String, Object>> getCorrosionDataForSankey() {
        List<Map<String, Object>> sankeyData = new ArrayList<>();
        List<Classification> classifications = classificationRepository.findByClassificationType("corrosion_rate");
        List<Tml> tmls = tmlRepository.findAll();
        
        // Group TMLs by circuit
        Map<String, List<Tml>> tmlsByCircuit = new HashMap<>();
        for (Tml tml : tmls) {
            tmlsByCircuit.computeIfAbsent(tml.getCircuitId(), k -> new ArrayList<>()).add(tml);
        }
        
        // For each circuit, count TMLs in each classification range
        for (Map.Entry<String, List<Tml>> entry : tmlsByCircuit.entrySet()) {
            String circuitId = entry.getKey();
            List<Tml> circuitTmls = entry.getValue();
            
            // Count TMLs by corrosion rate classification
            Map<String, Integer> countByClassification = new HashMap<>();
            
            for (Tml tml : circuitTmls) {
                // Get latest measurement for this TML
                List<Measurement> measurements = measurementRepository.findByTmlIdOrderByMeasurementDateDesc(tml.getId());
                if (!measurements.isEmpty()) {
                    Measurement latestMeasurement = measurements.get(0);
                    Double corrosionRate = latestMeasurement.getCorrosionRate();
                    
                    if (corrosionRate != null) {
                        // Find which classification this rate falls into
                        for (Classification classification : classifications) {
                            boolean inRange = false;
                            if (classification.getMinValue() != null && classification.getMaxValue() != null) {
                                inRange = corrosionRate >= classification.getMinValue() && corrosionRate < classification.getMaxValue();
                            } else if (classification.getMinValue() != null && classification.getMaxValue() == null) {
                                inRange = corrosionRate >= classification.getMinValue();
                            } else if (classification.getMinValue() == null && classification.getMaxValue() != null) {
                                inRange = corrosionRate < classification.getMaxValue();
                            }
                            
                            if (inRange) {
                                countByClassification.merge(classification.getRangeLabel(), 1, Integer::sum);
                                break;
                            }
                        }
                    }
                }
            }
            
            // Create Sankey data entries for this circuit
            for (Map.Entry<String, Integer> countEntry : countByClassification.entrySet()) {
                Map<String, Object> dataPoint = new HashMap<>();
                dataPoint.put("source", circuitId);
                dataPoint.put("target", countEntry.getKey());
                dataPoint.put("value", countEntry.getValue());
                sankeyData.add(dataPoint);
            }
        }
        
        return sankeyData;
    }
}