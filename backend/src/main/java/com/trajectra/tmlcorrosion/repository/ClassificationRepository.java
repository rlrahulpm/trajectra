package com.trajectra.tmlcorrosion.repository;

import com.trajectra.tmlcorrosion.entity.Classification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClassificationRepository extends JpaRepository<Classification, Long> {
    List<Classification> findByClassificationType(String classificationType);
}