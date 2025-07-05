package com.jjapartments.backend.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;

import com.jjapartments.backend.models.Utility;
import com.jjapartments.backend.exception.ErrorException;
import com.jjapartments.backend.mappers.UtilityRowMapper;

@Repository
public class UtilityRepository{
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public List<Utility> findAll() {
        String sql = "SELECT * FROM utilities"; 
        return jdbcTemplate.query(sql, new UtilityRowMapper());
    }

    public int add(Utility utility) {
        List<String> validTypes = List.of("Meralco", "Manila Water");
        if (!validTypes.contains(utility.getType())) {
            throw new ErrorException("Invalid rate type " + utility.getType());
        }
        if (utility.getPreviousReading() < 0) {
            throw new ErrorException("Previous reading cannot be less than 0.");
        }
        if (utility.getCurrentReading() < 0) {
            throw new ErrorException("Current reading cannot be less than 0.");
        }
        if (utility.getTotalMeter() < 0) {
            throw new ErrorException("Total meter cannot be less than 0.");
        }
        if (utility.getTotalAmount() < 0) {
            throw new ErrorException("Total amount cannot be less than 0.");
        }
        if (utility.getTotalMeter() < 0) {
            throw new ErrorException("Total meter cannot be less than 0.");
        }
        String sql = "INSERT INTO utilities(type, previous_reading, current_reading, total_meter, total_amount, due_date, month_of_start, month_of_end, is_paid, paid_at, tenants_id, rates_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, utility.getType(), utility.getPreviousReading(), utility.getCurrentReading(), utility.getTotalMeter(), utility.getTotalAmount(), utility.getDueDate(), utility.getMonthOfStart(), utility.getMonthOfEnd(), utility.getIsPaid(), utility.getPaidAt(), utility.getTenantId(), utility.getRateId());
       
    }

    public int delete(int id) {
        String sql = "DELETE FROM utilities WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public Utility findById(int id) {
        String sql = "SELECT * FROM utilites WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new UtilityRowMapper(), id);
        } catch (EmptyResultDataAccessException e) {
            throw new ErrorException("Utility record with id " + id + "  not found.");
        }
    }
}