package com.trajectra.tmlcorrosion.controller;

import com.trajectra.tmlcorrosion.entity.Classification;
import com.trajectra.tmlcorrosion.repository.ClassificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/classifications")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "false")
public class ClassificationController {
    
    @Autowired
    private ClassificationRepository classificationRepository;
    
    @GetMapping
    public List<Classification> getAllClassifications() {
        return classificationRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Classification> getClassificationById(@PathVariable Long id) {
        return classificationRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/type/{type}")
    public List<Classification> getClassificationsByType(@PathVariable String type) {
        return classificationRepository.findByClassificationType(type);
    }
    
    @PostMapping
    public Classification createClassification(@RequestBody Classification classification) {
        return classificationRepository.save(classification);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Classification> updateClassification(@PathVariable Long id, @RequestBody Classification classificationDetails) {
        return classificationRepository.findById(id)
            .map(classification -> {
                classification.setClassificationType(classificationDetails.getClassificationType());
                classification.setRangeLabel(classificationDetails.getRangeLabel());
                classification.setMinValue(classificationDetails.getMinValue());
                classification.setMaxValue(classificationDetails.getMaxValue());
                return ResponseEntity.ok(classificationRepository.save(classification));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassification(@PathVariable Long id) {
        return classificationRepository.findById(id)
            .map(classification -> {
                classificationRepository.delete(classification);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}