package com.trajectra.tmlcorrosion.repository;

import com.trajectra.tmlcorrosion.entity.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface MeasurementRepository extends JpaRepository<Measurement, Long> {
    @Query("SELECT m FROM Measurement m WHERE m.tml.id = :tmlId")
    List<Measurement> findByTmlId(@Param("tmlId") Long tmlId);
    
    List<Measurement> findByMeasurementDate(LocalDate measurementDate);
    
    @Query("SELECT m FROM Measurement m WHERE m.tml.id = :tmlId ORDER BY m.measurementDate DESC")
    List<Measurement> findByTmlIdOrderByMeasurementDateDesc(@Param("tmlId") Long tmlId);
    
    @Query("SELECT DISTINCT m.measurementDate FROM Measurement m ORDER BY m.measurementDate")
    List<LocalDate> findDistinctMeasurementDates();
    
    @Query(value = """
        SELECT 
            start.tml_record_id as tmlRecordId,
            tml.circuit_id as circuitId,
            tml.tml_id as tmlId,
            start.corrosion_rate as startRate,
            finish.corrosion_rate as endRate,
            CASE 
                WHEN finish.corrosion_rate < 10 THEN '< 10 mpy'
                WHEN finish.corrosion_rate >= 10 AND finish.corrosion_rate < 20 THEN '10-20 mpy'
                WHEN finish.corrosion_rate >= 20 AND finish.corrosion_rate < 30 THEN '20-30 mpy'
                WHEN finish.corrosion_rate >= 30 AND finish.corrosion_rate < 50 THEN '30-50 mpy'
                ELSE '> 50 mpy'
            END as endCategory
        FROM measurements start
        JOIN measurements finish ON start.tml_record_id = finish.tml_record_id
        JOIN tmls tml ON start.tml_record_id = tml.id
        WHERE start.measurement_date = :startDate
        AND finish.measurement_date = :endDate
        AND start.corrosion_rate <= :maxCorrosionRate
        """, nativeQuery = true)
    List<Map<String, Object>> findTemporalTracking(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("maxCorrosionRate") Double maxCorrosionRate
    );
}