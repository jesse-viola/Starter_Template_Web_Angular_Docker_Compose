// package com.example.demo.entity;

// import jakarta.persistence.*;
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Size;
// import org.hibernate.annotations.CreationTimestamp;
// import org.hibernate.annotations.UpdateTimestamp;

// import java.time.LocalDateTime;

// @Entity
// @Table(name = "items")
// public class Item {
    
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
    
//     @NotBlank(message = "Name is required")
//     @Size(max = 255, message = "Name must not exceed 255 characters")
//     @Column(name = "name", nullable = false)
//     private String name;
    
//     @Column(name = "description", columnDefinition = "TEXT")
//     private String description;
    
//     @CreationTimestamp
//     @Column(name = "created_at", nullable = false, updatable = false)
//     private LocalDateTime createdAt;
    
//     @UpdateTimestamp
//     @Column(name = "updated_at", nullable = false)
//     private LocalDateTime updatedAt;
    
//     public Item() {}
    
//     public Item(String name, String description) {
//         this.name = name;
//         this.description = description;
//     }
    
//     // Getters and Setters
//     public Long getId() {
//         return id;
//     }
    
//     public void setId(Long id) {
//         this.id = id;
//     }
    
//     public String getName() {
//         return name;
//     }
    
//     public void setName(String name) {
//         this.name = name;
//     }
    
//     public String getDescription() {
//         return description;
//     }
    
//     public void setDescription(String description) {
//         this.description = description;
//     }
    
//     public LocalDateTime getCreatedAt() {
//         return createdAt;
//     }
    
//     public void setCreatedAt(LocalDateTime createdAt) {
//         this.createdAt = createdAt;
//     }
    
//     public LocalDateTime getUpdatedAt() {
//         return updatedAt;
//     }
    
//     public void setUpdatedAt(LocalDateTime updatedAt) {
//         this.updatedAt = updatedAt;
//     }
    
//     @Override
//     public String toString() {
//         return "Item{" +
//                 "id=" + id +
//                 ", name='" + name + '\'' +
//                 ", description='" + description + '\'' +
//                 ", createdAt=" + createdAt +
//                 ", updatedAt=" + updatedAt +
//                 '}';
//     }
// }