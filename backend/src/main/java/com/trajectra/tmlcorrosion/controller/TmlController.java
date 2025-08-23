package com.trajectra.tmlcorrosion.controller;

import com.trajectra.tmlcorrosion.entity.Tml;
import com.trajectra.tmlcorrosion.repository.TmlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tmls")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "false")
public class TmlController {
    
    @Autowired
    private TmlRepository tmlRepository;
    
    @GetMapping
    public List<Tml> getAllTmls() {
        return tmlRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Tml> getTmlById(@PathVariable Long id) {
        return tmlRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/circuit/{circuitId}")
    public List<Tml> getTmlsByCircuit(@PathVariable String circuitId) {
        return tmlRepository.findByCircuitId(circuitId);
    }
    
    @PostMapping
    public Tml createTml(@RequestBody Tml tml) {
        return tmlRepository.save(tml);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Tml> updateTml(@PathVariable Long id, @RequestBody Tml tmlDetails) {
        return tmlRepository.findById(id)
            .map(tml -> {
                tml.setCircuitId(tmlDetails.getCircuitId());
                tml.setTmlId(tmlDetails.getTmlId());
                return ResponseEntity.ok(tmlRepository.save(tml));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTml(@PathVariable Long id) {
        return tmlRepository.findById(id)
            .map(tml -> {
                tmlRepository.delete(tml);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}