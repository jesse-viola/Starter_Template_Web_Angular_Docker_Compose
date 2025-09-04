// package com.example.demo.repository;

// import com.example.demo.entity.Item;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

// import java.util.List;
// import java.util.Optional;

// @Repository
// public interface ItemRepository extends JpaRepository<Item, Long> {
    
//     List<Item> findByNameContainingIgnoreCase(String name);
    
//     Optional<Item> findByName(String name);
    
//     @Query("SELECT i FROM Item i WHERE i.description IS NOT NULL ORDER BY i.createdAt DESC")
//     List<Item> findAllWithDescriptionOrderByCreatedAtDesc();
    
//     @Query("SELECT i FROM Item i WHERE i.name LIKE %:keyword% OR i.description LIKE %:keyword%")
//     List<Item> searchByKeyword(@Param("keyword") String keyword);
    
//     long countByNameContainingIgnoreCase(String name);
// }