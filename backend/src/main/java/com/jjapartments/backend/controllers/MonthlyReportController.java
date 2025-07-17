package com.jjapartments.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DuplicateKeyException;

import com.jjapartments.backend.models.MonthlyReport;
import com.jjapartments.backend.repository.MonthlyReportRepository;
import com.jjapartments.backend.exception.ErrorException;

@RestController
@RequestMapping("/api/monthlyreports")
@CrossOrigin(origins = "http://localhost:3000")
public class MonthlyReportController {

    @Autowired
    private MonthlyReportRepository monthlyReportRepository;

    @PostMapping("/add")
    public ResponseEntity<String> addMonthlyReport(
        @RequestParam("year") int year,
        @RequestParam("month") int month
    ) {
        try {
            float totalEarnings = monthlyReportRepository.sumPayments(year, month);
            float totalExpenses = monthlyReportRepository.sumExpenses(year, month);
            float netIncome = totalEarnings - totalExpenses;

            MonthlyReport report = new MonthlyReport();
            report.setYear(year);
            report.setMonth(month);
            report.setTotalEarnings(totalEarnings);
            report.setTotalExpenses(totalExpenses);
            report.setNetIncome(netIncome);

            monthlyReportRepository.add(report);

            return ResponseEntity.status(HttpStatus.CREATED).body("Monthly report successfully created for " + month + "/" + year);
        } catch (DuplicateKeyException e) { // if report already exists with same month and year
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Monthly report already exists for " + month + "/" + year);
        } catch (ErrorException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not generate monthly report: " + e.getMessage());
        }
    }

    // Get all
    @GetMapping
    public ResponseEntity<List<MonthlyReport>> getAllReports() {
        List<MonthlyReport> reports = monthlyReportRepository.findAll();
        return ResponseEntity.ok(reports);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMonthlyReport(@PathVariable int id) {
        int rowsAffected = monthlyReportRepository.delete(id);
        if (rowsAffected > 0) {
            return ResponseEntity.ok("Monthly Report deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Monthly Report not found");
        }
    }
    
}