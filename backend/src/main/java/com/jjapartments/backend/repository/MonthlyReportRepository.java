package com.jjapartments.backend.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;
import com.jjapartments.backend.models.MonthlyReport;
import com.jjapartments.backend.exception.ErrorException;
import com.jjapartments.backend.mappers.MonthlyReportRowMapper;

@Repository
public class MonthlyReportRepository{
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public List<MonthlyReport> findAll() {
        String sql = "SELECT * FROM monthly_reports"; 
        return jdbcTemplate.query(sql, new MonthlyReportRowMapper());
    }

    public int delete(int year, int month) {
        String sql = "DELETE FROM monthly_reports WHERE year = ? AND month = ?";
        return jdbcTemplate.update(sql, year, month);
    }

    public float sumPayments(int year, int month) {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM payments " +
                     "WHERE is_paid = 1 AND YEAR(paid_at) = ? AND MONTH(paid_at) = ?";
        Float sum = jdbcTemplate.queryForObject(sql, Float.class, year, month);
        return sum != null ? sum : 0.0f;
    }

    public float sumExpenses(int year, int month) {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM %s WHERE YEAR(date) = ? AND MONTH(date) = ?";
    
        Float expenseSum = jdbcTemplate.queryForObject(String.format(sql, "expenses"), Float.class, year, month);
        Float utilitySum = jdbcTemplate.queryForObject(String.format(sql, "utilities"), Float.class, year, month);
        
        return (expenseSum != null ? expenseSum : 0f) + (utilitySum != null ? utilitySum : 0f);
    }

    public int add(MonthlyReport report) {
        String sql = "INSERT INTO monthly_reports(year, month, units_id, monthly_dues, utility_bills, expenses) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
            report.getYear(),
            report.getMonth(),
            report.getUnitId(),
            report.getMonthlyDues(),
            report.getUtilityBills(),
            report.getExpenses()
        );
    }

    public MonthlyReport findById(int id) {
        String sql = "SELECT * FROM monthly_reports WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new MonthlyReportRowMapper(), id);
        } catch (EmptyResultDataAccessException e) {
            throw new ErrorException("Monthly Report with id " + id + " not found.");
        }
    }
    
}