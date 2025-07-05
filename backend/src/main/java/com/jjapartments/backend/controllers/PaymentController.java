package com.jjapartments.backend.controllers;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.jjapartments.backend.models.Payment;
import com.jjapartments.backend.repository.PaymentRepository;
import com.jjapartments.backend.exception.ErrorException;
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private PaymentRepository paymentRepository;

    //Create
    @PostMapping("/add")
    public ResponseEntity<String> addPayment(@RequestBody Payment payment) {
        try {
            paymentRepository.add(payment);
            return ResponseEntity.status(HttpStatus.CREATED).body("Payment successfully added.");
        } catch (ErrorException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //Get all
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return ResponseEntity.ok(payments);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePayment(@PathVariable int id) {
        int rowsAffected = paymentRepository.delete(id);
        if (rowsAffected > 0) {
            return ResponseEntity.ok("Payment deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found");
        }
    }
    
}