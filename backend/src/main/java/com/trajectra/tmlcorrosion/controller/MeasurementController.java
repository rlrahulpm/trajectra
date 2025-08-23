package com.trajectra.tmlcorrosion.controller;

import com.trajectra.tmlcorrosion.entity.Measurement;
import com.trajectra.tmlcorrosion.repository.MeasurementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/measurements")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "false")
public class MeasurementController {
    
    @Autowired
    private MeasurementRepository measurementRepository;
    
    @GetMapping("/testtrack")
    public String testTrackEndpoint() {
        return "Test endpoint working";
    }
    
    @GetMapping
    public List<Measurement> getAllMeasurements() {
        return measurementRepository.findAll();
    }
    
    @GetMapping("/tml/{tmlId:[0-9]+}")
    public List<Measurement> getMeasurementsByTml(@PathVariable Long tmlId) {
        return measurementRepository.findByTmlIdOrderByMeasurementDateDesc(tmlId);
    }
    
    @GetMapping("/date/{date}")
    public List<Measurement> getMeasurementsByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return measurementRepository.findByMeasurementDate(date);
    }
    
    @GetMapping("/dates")
    public List<LocalDate> getUniqueMeasurementDates() {
        return measurementRepository.findDistinctMeasurementDates();
    }
    
    
    @PostMapping
    public Measurement createMeasurement(@RequestBody Measurement measurement) {
        return measurementRepository.save(measurement);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Measurement> updateMeasurement(@PathVariable Long id, @RequestBody Measurement measurementDetails) {
        return measurementRepository.findById(id)
            .map(measurement -> {
                measurement.setTml(measurementDetails.getTml());
                measurement.setMeasurementDate(measurementDetails.getMeasurementDate());
                measurement.setThickness(measurementDetails.getThickness());
                measurement.setTemperature(measurementDetails.getTemperature());
                measurement.setCorrosionRate(measurementDetails.getCorrosionRate());
                return ResponseEntity.ok(measurementRepository.save(measurement));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeasurement(@PathVariable Long id) {
        return measurementRepository.findById(id)
            .map(measurement -> {
                measurementRepository.delete(measurement);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}