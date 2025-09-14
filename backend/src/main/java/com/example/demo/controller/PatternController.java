package com.example.demo.controller;

import com.example.demo.entity.Pattern;
import com.example.demo.entity.Tag;
import com.example.demo.repository.PatternRepository;
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
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class PatternController {

    @Autowired
    private PatternRepository patternRepository;

    @Autowired
    private TagRepository tagRepository;

    @GetMapping("/patterns")
    public ResponseEntity<List<Pattern>> getAllPatterns() {
        List<Pattern> patterns = patternRepository.findAll();
        return ResponseEntity.ok(patterns);
    }

    @GetMapping("/patterns/{id}")
    public ResponseEntity<Pattern> getPatternById(@PathVariable Long id) {
        Optional<Pattern> pattern = patternRepository.findById(id);
        return pattern.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    // Search patterns by name (partial match, case-insensitive)
    @GetMapping("/patterns/search")
    public ResponseEntity<List<Pattern>> searchPatterns(@RequestParam String name) {
        List<Pattern> patterns = patternRepository.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(patterns);
    }


    @GetMapping("/patterns/by-tag")
    public ResponseEntity<List<Pattern>> getPatternsByTag(@RequestParam String tag) {
        List<Pattern> patterns = patternRepository.findByTagName(tag);
        return ResponseEntity.ok(patterns);
    }

     @PostMapping("/patterns")
    public ResponseEntity<Pattern> createPattern(@RequestBody Pattern pattern) {
        // Optional: check for duplicate name
        if (patternRepository.findByName(pattern.getName()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        // If tags are provided, fetch them and link
        if (pattern.getTags() != null && !pattern.getTags().isEmpty()) {
            Set<Tag> linkedTags = new HashSet<>();
            for (Tag t : pattern.getTags()) {
                tagRepository.findById(t.getId()).ifPresent(linkedTags::add);
            }
            pattern.setTags(linkedTags);
        }

        Pattern savedPattern = patternRepository.save(pattern);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPattern);
    }

}