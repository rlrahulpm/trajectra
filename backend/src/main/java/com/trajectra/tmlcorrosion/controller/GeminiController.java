package com.trajectra.tmlcorrosion.controller;

import com.trajectra.tmlcorrosion.entity.GeminiKey;
import com.trajectra.tmlcorrosion.repository.GeminiKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/gemini")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "false")
public class GeminiController {
    
    @Autowired
    private GeminiKeyRepository geminiKeyRepository;
    
    @GetMapping("/api-key")
    public ResponseEntity<Map<String, String>> getApiKey() {
        Optional<String> apiKey = geminiKeyRepository.findActiveApiKeyValue();
        
        if (apiKey.isPresent()) {
            return ResponseEntity.ok(Map.of("apiKey", apiKey.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/api-key")
    public ResponseEntity<Map<String, String>> saveApiKey(@RequestBody Map<String, String> request) {
        String apiKey = request.get("apiKey");
        
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Deactivate existing keys
        geminiKeyRepository.findAll().forEach(key -> {
            key.setIsActive(false);
            geminiKeyRepository.save(key);
        });
        
        // Save new key
        GeminiKey newKey = new GeminiKey(apiKey.trim());
        geminiKeyRepository.save(newKey);
        
        return ResponseEntity.ok(Map.of("message", "API key saved successfully"));
    }
    
    @PutMapping("/api-key")
    public ResponseEntity<Map<String, String>> updateApiKey(@RequestBody Map<String, String> request) {
        String apiKey = request.get("apiKey");
        
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Optional<GeminiKey> existingKey = geminiKeyRepository.findActiveApiKey();
        
        if (existingKey.isPresent()) {
            GeminiKey key = existingKey.get();
            key.setApiKey(apiKey.trim());
            geminiKeyRepository.save(key);
        } else {
            // Create new key if none exists
            GeminiKey newKey = new GeminiKey(apiKey.trim());
            geminiKeyRepository.save(newKey);
        }
        
        return ResponseEntity.ok(Map.of("message", "API key updated successfully"));
    }
}