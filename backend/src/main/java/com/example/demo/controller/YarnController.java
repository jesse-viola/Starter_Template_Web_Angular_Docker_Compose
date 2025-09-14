package com.example.demo.controller;

import com.example.demo.entity.Yarn;
import com.example.demo.entity.Tag;
import com.example.demo.repository.YarnRepository;
import com.example.demo.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;

@RestController
@RequestMapping("/api")
public class YarnController {

    @Autowired
    private YarnRepository yarnRepository;

    @Autowired
    private TagRepository tagRepository;

    @GetMapping("/yarns")
    public ResponseEntity<List<Yarn>> getAllYarns() {
        List<Yarn> yarns = yarnRepository.findAll();
        return ResponseEntity.ok(yarns);
    }

     @GetMapping("/yarns/{id}")
    public ResponseEntity<Yarn> getYarnById(@PathVariable Long id) {
        Optional<Yarn> yarn = yarnRepository.findById(id);
        return yarn.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/yarns/search")
    public ResponseEntity<List<Yarn>> searchYarns(@RequestParam String name) {
        List<Yarn> yarns = yarnRepository.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(yarns);
    }

    @GetMapping("/yarns/by-tag")
    public ResponseEntity<List<Yarn>> getYarnsByTag(@RequestParam String tag) {
        List<Yarn> yarns = yarnRepository.findByTagName(tag);
        return ResponseEntity.ok(yarns);
    }

    @PostMapping("/yarns")
    public ResponseEntity<Yarn> createYarn(@RequestBody Yarn yarn) {
        // Optional: check for duplicate yarn name
        if (yarnRepository.findByName(yarn.getName()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        // If tags are provided, fetch them and link
        if (yarn.getTags() != null && !yarn.getTags().isEmpty()) {
            Set<Tag> linkedTags = new HashSet<>();
            for (Tag t : yarn.getTags()) {
                tagRepository.findById(t.getId()).ifPresent(linkedTags::add);
            }
            yarn.setTags(linkedTags);
        }

        Yarn savedYarn = yarnRepository.save(yarn);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedYarn);
    }
}