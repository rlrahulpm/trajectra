package com.trajectra.tmlcorrosion.repository;

import com.trajectra.tmlcorrosion.entity.GeminiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GeminiKeyRepository extends JpaRepository<GeminiKey, Long> {
    
    @Query("SELECT g FROM GeminiKey g WHERE g.isActive = true ORDER BY g.updatedAt DESC LIMIT 1")
    Optional<GeminiKey> findActiveApiKey();
    
    @Query("SELECT g.apiKey FROM GeminiKey g WHERE g.isActive = true ORDER BY g.updatedAt DESC LIMIT 1")
    Optional<String> findActiveApiKeyValue();
}