package com.trajectra.tmlcorrosion.repository;

import com.trajectra.tmlcorrosion.entity.Tml;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TmlRepository extends JpaRepository<Tml, Long> {
    List<Tml> findByCircuitId(String circuitId);
    List<Tml> findByTmlId(String tmlId);
}