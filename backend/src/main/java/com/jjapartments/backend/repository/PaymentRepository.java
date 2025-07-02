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
        String sql = "SELECT * FROM payments"; 
        return jdbcTemplate.query(sql, new PaymentRowMapper());
    }

    public int add(Payment payment) {
        List<String> validReasons = List.of("Monthly Due", "Miscellaneous", "Maintenance");
        List<String> validModes = List.of("Cash", "GCash", "Bank", "Others");

        if (!validReasons.contains(payment.getReason())) {
            throw new ErrorException("Invalid reason type " + payment.getReason());
        }

        if (!validModes.contains(payment.getModeOfPayment())) {
            throw new ErrorException("Invalid mode of payment " + payment.getModeOfPayment());
        }
        String sql = "INSERT INTO payments(tenant_id, reason, mode_of_payment, amount, due_date, month_of_start, month_of_end, is_paid, paid_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, payment.getTenantId(), payment.getReason(), payment.getModeOfPayment(), payment.getAmount(), payment.getDueDate(), payment.getMonthOfStart(), payment.getMonthOfEnd(), payment.getIsPaid(), payment.getPaidAt());
       
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
}