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
        String sql = "SELECT * FROM expenses ORDER BY date ASC"; 
        return jdbcTemplate.query(sql, new ExpenseRowMapper());
    }

    public int add(Expense expense) {
        if (expense.getAmount() <= 0) {
            throw new ErrorException("Amount cannot be ₱0 or below");
        }

        String sql = "INSERT INTO expenses(units_id, amount, mode_of_payment, reason, date) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, expense.getUnitId(), expense.getAmount(), expense.getModeOfPayment(), expense.getReason(), expense.getDate());
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

    public int update(int id, Expense expense) {
        if (findById(id) == null) {
            throw new ErrorException("Expense not found");
        }
        if (expense.getAmount() < 0) {
            throw new ErrorException("Amount cannot be below ₱0");
        }
        
        String sql = "UPDATE expenses SET units_id = ?, amount = ?, mode_of_payment = ?, reason = ?, date = ? WHERE id = ?";
        return jdbcTemplate.update(sql, expense.getUnitId(), expense.getAmount(), expense.getModeOfPayment(), expense.getReason(), expense.getDate(), id);
    }
}