package com.jjapartments.backend.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;

import com.jjapartments.backend.models.Expense;
import com.jjapartments.backend.exception.ErrorException;
import com.jjapartments.backend.mappers.ExpenseRowMapper;

@Repository
public class ExpenseRepository{
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public List<Expense> findAll() {
        String sql = "SELECT * FROM expenses"; 
        return jdbcTemplate.query(sql, new ExpenseRowMapper());
    }

    public int add(Expense expense) {
        List<String> validReasons = List.of("Maintenance", "Utilities", "Supplies", "Repair", "Other");

        if (!validReasons.contains(expense.getReason())) {
            throw new ErrorException("Invalid reason " + expense.getReason());
        } else if (expense.getAmount() <= 0) {
            throw new ErrorException("Amount cannot be ₱0 or below");
        }

        String sql = "INSERT INTO expenses(amount, reason, date) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, expense.getAmount(), expense.getReason(), expense.getDate());
    }

    public int delete(int id) {
        String sql = "DELETE FROM expenses WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public Expense findById(int id) {
        String sql = "SELECT * FROM expenses WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new ExpenseRowMapper(), id);
        } catch (EmptyResultDataAccessException e) {
            throw new ErrorException("Expense with id " + id + " not found.");
        }
    }
}