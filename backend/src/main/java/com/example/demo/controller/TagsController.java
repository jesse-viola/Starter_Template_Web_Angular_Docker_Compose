package com.example.demo.controller;

import com.example.demo.entity.Tags;
import com.example.demo.repository.TagsRepository;
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
public class TagsController {

    @Autowired
    private TagsRepository tagsRepository;

    @GetMapping("/tags")
    public ResponseEntity<List<Tags>> getAllItems() {
        List<Tags> tags = tagsRepository.findAll();
        return ResponseEntity.ok(tags);
    }

}