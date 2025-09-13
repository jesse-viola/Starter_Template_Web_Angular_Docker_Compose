package com.example.demo.repository;

import com.example.demo.entity.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatternRepository extends JpaRepository<Pattern, Long> {
    
    List<Pattern> findByNameContainingIgnoreCase(String name);

    Optional<Pattern> findByName(String name);

}