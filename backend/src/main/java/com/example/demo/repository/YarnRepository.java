package com.example.demo.repository;

import com.example.demo.entity.Yarn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface YarnRepository extends JpaRepository<Yarn, Long> {
    
    List<Yarn> findByNameContainingIgnoreCase(String name);

    Optional<Yarn> findByName(String name);
    
    @Query("SELECT y FROM Yarn y JOIN y.tags t WHERE LOWER(t.name) = LOWER(:tagName)")
    List<Yarn> findByTagName(@Param("tagName") String tagName);

}