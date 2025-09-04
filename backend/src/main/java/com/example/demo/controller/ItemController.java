// package com.example.demo.controller;

// import com.example.demo.entity.Item;
// import com.example.demo.repository.ItemRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import jakarta.validation.Valid;
// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Map;
// import java.util.Optional;

// @RestController
// @RequestMapping("/api")
// public class ItemController {
    
//     @Autowired
//     private ItemRepository itemRepository;

//     @GetMapping("/items")
//     public ResponseEntity<List<Item>> getAllItems() {
//         List<Item> items = itemRepository.findAll();
//         return ResponseEntity.ok(items);
//     }
    
//     @GetMapping("/items/{id}")
//     public ResponseEntity<Item> getItemById(@PathVariable Long id) {
//         Optional<Item> item = itemRepository.findById(id);
//         return item.map(ResponseEntity::ok)
//                   .orElse(ResponseEntity.notFound().build());
//     }
    
//     @PostMapping("/items")
//     public ResponseEntity<Item> createItem(@Valid @RequestBody Item item) {
//         Item savedItem = itemRepository.save(item);
//         return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
//     }
    
//     @PutMapping("/items/{id}")
//     public ResponseEntity<Item> updateItem(@PathVariable Long id, @Valid @RequestBody Item itemDetails) {
//         Optional<Item> optionalItem = itemRepository.findById(id);
//         if (optionalItem.isPresent()) {
//             Item item = optionalItem.get();
//             item.setName(itemDetails.getName());
//             item.setDescription(itemDetails.getDescription());
//             Item updatedItem = itemRepository.save(item);
//             return ResponseEntity.ok(updatedItem);
//         }
//         return ResponseEntity.notFound().build();
//     }
    
//     @DeleteMapping("/items/{id}")
//     public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
//         if (itemRepository.existsById(id)) {
//             itemRepository.deleteById(id);
//             return ResponseEntity.noContent().build();
//         }
//         return ResponseEntity.notFound().build();
//     }
    
//     @GetMapping("/items/search")
//     public ResponseEntity<List<Item>> searchItems(@RequestParam String keyword) {
//         List<Item> items = itemRepository.searchByKeyword(keyword);
//         return ResponseEntity.ok(items);
//     }

//     @GetMapping("/health")
//     public Map<String, Object> health() {
//         return Map.of(
//                 "status", "UP",
//                 "timestamp", LocalDateTime.now(),
//                 "message", "PostgreSQL database integration ready");
//     }
// }
