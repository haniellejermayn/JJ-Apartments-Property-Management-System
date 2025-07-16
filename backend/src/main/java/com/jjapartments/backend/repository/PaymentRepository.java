package com.jjapartments.backend.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;
import org.springframework.dao.EmptyResultDataAccessException;

import com.jjapartments.backend.models.Payment;
import com.jjapartments.backend.mappers.PaymentRowMapper;
import com.jjapartments.backend.exception.ErrorException;

@Repository
public class PaymentRepository{
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public List<Payment> findAll() {
        String sql = "SELECT * FROM payments ORDER BY is_paid ASC, COALESCE(due_date, month_of_end) ASC"; 
        return jdbcTemplate.query(sql, new PaymentRowMapper());
    }

    public int add(Payment payment) {
        if (payment.getAmount() <= 0) {
            throw new ErrorException("Amount cannot be ₱0 or below");
        }
        String sql = "INSERT INTO payments(units_id, mode_of_payment, amount, due_date, month_of_start, month_of_end, is_paid, paid_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, payment.getUnitId(), payment.getModeOfPayment(), payment.getAmount(), payment.getDueDate(), payment.getMonthOfStart(), payment.getMonthOfEnd(), payment.getIsPaid(), payment.getPaidAt());
       
    }

    public int delete(int id) {
        String sql = "DELETE FROM payments WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public Payment findById(int id) {
        String sql = "SELECT * FROM payments WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new PaymentRowMapper(), id);
        } catch (EmptyResultDataAccessException e) {
            throw new ErrorException("Payment with id " + id + " not found.");
        }
    }

    public int update(int id, Payment payment) {
        if (findById(id) == null) {
            throw new ErrorException("Expense not found");
        }
        if (payment.getAmount() < 0) {
            throw new ErrorException("Amount cannot be below ₱0");
        }
        
        String sql = "UPDATE payments SET mode_of_payment = ?, amount = ?, due_date = ?, month_of_start = ?, month_of_end = ?, "
        + "is_paid = ?, paid_at = ? WHERE id = ?";
        return jdbcTemplate.update(sql,  payment.getModeOfPayment(), payment.getAmount(), payment.getDueDate(), payment.getMonthOfStart(), payment.getMonthOfEnd(), payment.getIsPaid(), payment.getPaidAt(), id);
    }
}