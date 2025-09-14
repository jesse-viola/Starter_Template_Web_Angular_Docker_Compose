package com.example.demo.controller;

import com.example.demo.entity.Tag;
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

@RestController
@RequestMapping("/api")
public class TagController {

    @Autowired
    private TagRepository tagRepository;

    @GetMapping("/tags")
    public ResponseEntity<List<Tag>> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        return ResponseEntity.ok(tags);
    }

    @PostMapping("/tags")
    public ResponseEntity<?> createTag(@RequestBody Tag tag) {
        // Check for duplicate
        if (tagRepository.findByNameIgnoreCase(tag.getName()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Tag with name '" + tag.getName() + "' already exists");
        }

        Tag savedTag = tagRepository.save(tag);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTag);
    }

}