package com.jjapartments.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;

import com.jjapartments.backend.models.Unit;
import com.jjapartments.backend.mappers.UnitRowMapper;
import com.jjapartments.backend.exception.ErrorException;

@Repository
public class UnitRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public List<Unit> findAll() {
        String sql = "SELECT * FROM units";
        return jdbcTemplate.query(sql, new UnitRowMapper());
    }
    // for creating
    public boolean unitExists(Unit unit) {
        String sqlChecker = "SELECT COUNT(*) FROM units WHERE unit_number = ? AND name = ?";
        Integer count = jdbcTemplate.queryForObject(sqlChecker, Integer.class, unit.getUnitNumber(), unit.getName());
        return count != null && count > 0;
    }
    // for updating
    public boolean unitExists(Unit unit, int excludeId) {
        String sqlChecker = "SELECT COUNT(*) FROM units WHERE unit_number = ? AND name = ? AND id != ?";
        Integer count = jdbcTemplate.queryForObject(sqlChecker, Integer.class, unit.getUnitNumber(), unit.getName(), excludeId);
        return count != null && count > 0;
    }


    public Unit add(Unit unit) {
        if (unitExists(unit)) {
            throw new ErrorException("The unit already exists.");
        } else {
            String sql = "INSERT INTO units(unit_number, name, description, price, num_occupants, contact_number) VALUES (?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, unit.getUnitNumber(), unit.getName(), unit.getDescription(), unit.getPrice(), unit.getNumOccupants(), unit.getContactNumber());
            
            // return the created record
            String fetchSql = """
                SELECT * FROM units
                WHERE unit_number = ?
                AND name = ?
                AND description = ?
                AND price = ?
                AND num_occupants = ?
                AND contact_number = ?
                ORDER BY id DESC
                LIMIT 1
            """;

            return jdbcTemplate.queryForObject(
                fetchSql,
                new UnitRowMapper(),
                unit.getUnitNumber(),
                unit.getName(),
                unit.getDescription(),
                unit.getPrice(),
                unit.getNumOccupants(),
                unit.getContactNumber()
            );
        }
    }

    public int delete(int id) {
        String sql = "DELETE FROM units WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public Unit findById(int id) {
        String sql = "SELECT * FROM units WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new UnitRowMapper(), id);
        } catch (EmptyResultDataAccessException e) {
            throw new ErrorException("Unit with id " + id + " not found.");
        }
    }

    public int update(int id, Unit unit) {
        Unit existingUnit = findById(id);

        if (unitExists(unit, existingUnit.getId())) {
            throw new ErrorException("The unit already exists.");
        }
        String sql = "UPDATE units SET unit_number = ?, name = ?, description = ?, price = ?, num_occupants = ?, contact_number = ? WHERE id = ?";
        return jdbcTemplate.update(sql, unit.getUnitNumber(), unit.getName(), unit.getDescription(), unit.getPrice(), unit.getNumOccupants(), unit.getContactNumber(), id);
    }

    public List<Unit> searchByKeyword(String keyword) {
        String sql = "SELECT * FROM units WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(unit_number) LIKE ?";
        String likeKeyword = "%" + keyword.toLowerCase() + "%";
        return jdbcTemplate.query(sql, new UnitRowMapper(), likeKeyword, likeKeyword, likeKeyword);
    } 

    public Optional<Unit> findByNameAndUnitNumber(String name, String unitNumber) {
        String sql = "SELECT * FROM units WHERE name = ? AND unit_number = ?";

        try {
            Unit unit = jdbcTemplate.queryForObject(sql, new UnitRowMapper(), name, unitNumber);
            return Optional.ofNullable(unit); 
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return Optional.empty();
        } catch (Exception e) {
            System.err.println("Error finding unit by name and number: " + e.getMessage());
            return Optional.empty();
        }
    }
}
