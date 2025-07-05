package com.jjapartments.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.jjapartments.backend.models.Unit;
import com.jjapartments.backend.repository.UnitRepository;
import com.jjapartments.backend.exception.ErrorException;
@RestController
@RequestMapping("/api/units")
public class UnitController {

    @Autowired
    private UnitRepository unitRepository;

    //Create
    @PostMapping("/add")
    public ResponseEntity<String> addUnit(@RequestBody Unit unit) {
        try {
            unitRepository.add(unit);
            return ResponseEntity.status(HttpStatus.CREATED).body("Unit successfully added");
        } catch(ErrorException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //Get all
    @GetMapping
    public ResponseEntity<List<Unit>> getAllUnits() {
        List<Unit> units = unitRepository.findAll();
        return ResponseEntity.ok(units);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUnit(@PathVariable int id) {
        int rowsAffected = unitRepository.delete(id);
        if (rowsAffected > 0) {
            return ResponseEntity.ok("Unit deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Unit not found");
        }
    }
    

}
