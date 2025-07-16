package com.jjapartments.backend.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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
        String sql = "SELECT * FROM utilities ORDER BY is_paid ASC, COALESCE(due_date, month_of_end) ASC"; 
        return jdbcTemplate.query(sql, new UtilityRowMapper());
    }

    public void validate(Utility utility) {
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
    }

    public int add(Utility utility) {
        String rateSql = "SELECT id, rate FROM rates WHERE type = ? ORDER BY date DESC LIMIT 1";
        Map<String, Object> rate = jdbcTemplate.queryForMap(rateSql, utility.getType());
        int rateId = (int) rate.get("id");
        float rateValue = ((BigDecimal) rate.get("rate")).floatValue();
        
        String meterSql = "SELECT current_reading FROM utilities WHERE units_id = ? AND type = ? ORDER BY month_of_end DESC LIMIT 1";
        BigDecimal readingDecimal = jdbcTemplate.queryForObject(meterSql, BigDecimal.class, utility.getUnitId(), utility.getType());
        float previousReading = (readingDecimal != null) ? readingDecimal.floatValue() : 0f;
        if (utility.getCurrentReading() < previousReading) {
            throw new ErrorException("Current reading cannot be less than previous reading");
        }
        float totalMeter = utility.getCurrentReading() - previousReading;
        float totalAmount = totalMeter * rateValue;

        validate(utility);
        String sql = "INSERT INTO utilities(type, previous_reading, current_reading, total_meter, total_amount, due_date, month_of_start, month_of_end, is_paid, paid_at, units_id, rates_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, utility.getType(), previousReading, utility.getCurrentReading(), totalMeter, totalAmount, utility.getDueDate(), utility.getMonthOfStart(), utility.getMonthOfEnd(), utility.getIsPaid(), utility.getPaidAt(), utility.getUnitId(), rateId);
       
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

    public int update(int id, Utility utility) {
        findById(id);
        validate(utility);
        String sql = "UPDATE utilities SET type = ?, previous_reading = ?, current_reading = ?, total_meter = ?, total_amount = ?, due_date = ?, month_of_start = ?, month_of_end = ?, is_paid = ?, paid_at = ? WHERE id = ?";
        return jdbcTemplate.update(sql, utility.getType(), utility.getPreviousReading(), utility.getCurrentReading(), utility.getTotalMeter(), utility.getTotalAmount(), utility.getDueDate(), utility.getMonthOfStart(), utility.getMonthOfEnd(), utility.getIsPaid(), utility.getPaidAt(), id);
    }

    public List<Utility> findByUnit(int id) {
        String sql = "SELECT * FROM utilities WHERE units_id = ? ORDER BY is_paid ASC, due_date DESC";
        return jdbcTemplate.query(sql, new UtilityRowMapper(), id);
    }

    public List<Utility> findByType(String type) {
        String sql = "SELECT * FROM utilities WHERE type = ? ORDER BY due_date DESC"; 
        return jdbcTemplate.query(sql, new UtilityRowMapper(), type);
    }
}