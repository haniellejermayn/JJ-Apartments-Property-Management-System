package com.jjapartments.backend.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.jjapartments.backend.models.Utility;
import com.jjapartments.backend.exception.ErrorException;
import com.jjapartments.backend.repository.UtilityRepository;
import java.util.List;

@RestController
@RequestMapping("/api/utilities")
@CrossOrigin(origins = "http://localhost:3000")
public class UtilityController {

    @Autowired
    private UtilityRepository utilityRepository;

    // Create
    @PostMapping("/add")
    public ResponseEntity<String> addUtility(@RequestBody Utility utility) {        
        try { // returns 201 created
            utilityRepository.add(utility);
            return ResponseEntity.status(HttpStatus.CREATED).body("Utility record created successfully");
        } catch(ErrorException e) { // returns 400 bad request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get all utilities
    @GetMapping
    public ResponseEntity<List<Utility>> getAllUtilities() {
        List<Utility> utilities = utilityRepository.findAll();
        return ResponseEntity.ok(utilities);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUtility(@PathVariable int id) {
        int rowsAffected = utilityRepository.delete(id);
        if (rowsAffected > 0) {
            return ResponseEntity.ok("Utility record deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utility record not found");
        }
    }
    
    // Update
    @PatchMapping("/update/{id}")
    public ResponseEntity<?> updateUtility(@PathVariable int id, @RequestBody Utility utility) {
        try {
            utilityRepository.update(id, utility);
            return ResponseEntity.ok(utilityRepository.findById(id));
        } catch (ErrorException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get from specific unit
    @GetMapping("/unit/{id}")
    public ResponseEntity<List<Utility>> getByUnit(@PathVariable int id) {
        List<Utility> utilities = utilityRepository.findByUnit(id);
        return ResponseEntity.ok(utilities);
    }

    @GetMapping("/type")
    public ResponseEntity<List<Utility>> getByType(@RequestParam String type) {
        List<Utility> utilities = utilityRepository.findByType(type);
        return ResponseEntity.ok(utilities);
    }



}
