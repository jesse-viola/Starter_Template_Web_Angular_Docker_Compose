package com.example.demo.controller;

import com.example.demo.entity.Pattern;
import com.example.demo.repository.PatternRepository;
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
public class PatternController {

    @Autowired
    private PatternRepository patternRepository;

    @GetMapping("/patterns")
    public ResponseEntity<List<Pattern>> getAllItems() {
        List<Pattern> patterns = patternRepository.findAll();
        return ResponseEntity.ok(patterns);
    }

}