package com.jjapartments.backend.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;

import com.jjapartments.backend.models.Rate;
import com.jjapartments.backend.mappers.RateRowMapper;
import com.jjapartments.backend.exception.ErrorException;

@Repository
public class RateRepository{
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public List<Rate> findAll() {
        String sql = "SELECT * FROM rates"; 
        return jdbcTemplate.query(sql, new RateRowMapper());
    }

    public Rate add(Rate rate) {
        List<String> validTypes = List.of("Meralco", "Manila Water");
        if (!validTypes.contains(rate.getType())) {
            throw new ErrorException("Invalid rate type " + rate.getType());
        }
        if (rate.getRate() <= 0) {
            throw new ErrorException("Amount cannot be 0 or below");
        }
        String sql = "INSERT INTO rates(type, rate, date) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, rate.getType(), rate.getRate(), rate.getDate());

        String fetchSql = """
            SELECT * FROM rates
            WHERE type = ?
            AND rate = ?
            AND date = ?
            ORDER BY id DESC
            LIMIT 1
        """;

        return jdbcTemplate.queryForObject(
            fetchSql,
            new RateRowMapper(),
            rate.getType(),
            rate.getRate(),
            rate.getDate()
        );
    }

    public int delete(int id) {
        String sql = "DELETE FROM rates WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public Rate findById(int id) {
        String sql = "SELECT * FROM rates WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new RateRowMapper(), id);
        } catch (EmptyResultDataAccessException e) {
            throw new ErrorException("Rate with id " + id + " not found.");
        }
    }

    public int update(int id, Rate rate) {
        if (findById(id) == null) {
            throw new ErrorException("Rate not found");
        }

        List<String> validTypes = List.of("Meralco", "Manila Water");
        if (!validTypes.contains(rate.getType())) {
            throw new ErrorException("Invalid rate type " + rate.getType());
        }

        if (rate.getRate() <= 0) {
            throw new ErrorException("Amount cannot be 0 or below");
        }
        
        String sql = "UPDATE rates SET type = ?, rate = ?, date = ? WHERE id = ?";
        return jdbcTemplate.update(sql, rate.getType(), rate.getRate(), rate.getDate(), id);
    }

    public Rate findLatestByType(String type) {
        try {
            String sql = "SELECT * FROM rates WHERE type = ? ORDER BY date DESC LIMIT 1";
            List<Rate> results = jdbcTemplate.query(sql, new RateRowMapper(), type);
            return results.isEmpty() ? null : results.get(0);
        } catch (EmptyResultDataAccessException e) {
            throw new ErrorException("Rate not found for type: " + type);
        }
        
    }

    public List<Rate> findByType(String type) {
        String sql = "SELECT * FROM rates WHERE type = ? ORDER BY date DESC";
        return jdbcTemplate.query(sql, new RateRowMapper(), type);
    }
}   