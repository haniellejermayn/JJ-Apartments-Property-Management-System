package com.jjapartments.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.jjapartments.backend.models.Expense;
import com.jjapartments.backend.exception.ErrorException;
import com.jjapartments.backend.repository.ExpenseRepository;


@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:3000")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    // Create
    @PostMapping("/add")
    public ResponseEntity<String> addExpense(@RequestBody Expense expense) {
        try {
            expenseRepository.add(expense);
            return ResponseEntity.status(HttpStatus.CREATED).body("Expense successfully added");
        } catch (ErrorException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get all
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        List<Expense> expenses = expenseRepository.findAll();
        return ResponseEntity.ok(expenses);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable int id) {
        int rowsAffected = expenseRepository.delete(id);
        if (rowsAffected > 0) {
            return ResponseEntity.ok("Expense deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found");
        }
    }
    
    // Update
    @PatchMapping("/update/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable int id, @RequestBody Expense expense) {
        try {
            expenseRepository.update(id, expense);
            return ResponseEntity.ok(expenseRepository.findById(id));
        } catch (ErrorException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Find by year and month
    @GetMapping("/{id}/{year}/{month}")
    public ResponseEntity<Float> findByYearAndMonth(@PathVariable int id, @PathVariable int year, @PathVariable int month) {
        float amount = expenseRepository.getMonthlyAmountById(id, year, month);
        return ResponseEntity.ok(amount);
    }
}