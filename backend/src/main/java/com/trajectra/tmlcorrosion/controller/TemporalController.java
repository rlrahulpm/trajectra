package com.trajectra.tmlcorrosion.controller;

import com.trajectra.tmlcorrosion.repository.MeasurementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/temporal")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "false")
public class TemporalController {
    
    @Autowired
    private MeasurementRepository measurementRepository;
    
    @GetMapping("/tracking")
    public List<Map<String, Object>> getTemporalTracking(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam Double maxCorrosionRate) {
        
        return measurementRepository.findTemporalTracking(startDate, endDate, maxCorrosionRate);
    }
    
    @GetMapping("/tracking-specific")
    public List<Map<String, Object>> getTemporalTrackingForSpecificTmls(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam String tmlIds) {
        
        // Parse comma-separated TML IDs
        String[] idArray = tmlIds.split(",");
        List<String> tmlIdList = new java.util.ArrayList<>();
        
        for (String id : idArray) {
            String trimmedId = id.trim();
            if (!trimmedId.isEmpty()) {
                tmlIdList.add(trimmedId);
            }
        }
        
        return measurementRepository.findTemporalTrackingForSpecificTmls(startDate, endDate, tmlIdList);
    }
}