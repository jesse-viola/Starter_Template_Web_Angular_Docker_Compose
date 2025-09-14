package com.example.demo.repository;

import com.example.demo.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    
    Optional<Tag> findByNameIgnoreCase(String name);

    Optional<Tag> findByName(String name);

    //@Query("SELECT i FROM tags i WHERE i.description IS NOT NULL ORDER BY i.createdAt DESC")
    //List<Tag> findAllWithDescriptionOrderByCreatedAtDesc();

    //@Query("SELECT i FROM tags i WHERE i.name LIKE %:keyword% OR i.description LIKE %:keyword%")
    //List<Tag> searchByKeyword(@Param("keyword") String keyword);

    //long countByNameContainingIgnoreCase(String name);

}