package com.jjapartments.backend.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;

import com.jjapartments.backend.models.Tenant;
import com.jjapartments.backend.exception.ErrorException;
import com.jjapartments.backend.mappers.TenantRowMapper;

@Repository
public class TenantRepository{
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public List<Tenant> findAll() {
        String sql = "SELECT * FROM tenants"; 
        return jdbcTemplate.query(sql, new TenantRowMapper());
    }

    // for creating
    public String duplicateExists(Tenant tenant) {
        String sqlChecker = "SELECT COUNT(*) FROM tenants WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sqlChecker, Integer.class, tenant.getEmail()); 
        if (count != null && count > 0) {
            return "email";
        }
        String sqlChecker2 = "SELECT COUNT(*) FROM tenants WHERE phone_number = ?";
        Integer count2 = jdbcTemplate.queryForObject(sqlChecker2, Integer.class, tenant.getPhoneNumber());
        if (count2 != null && count2 > 0) {
            return "phone";
        }

        return null;
    }
    // for updating
    public String duplicateExists(Tenant tenant, int excludeId) {
        String sqlChecker = "SELECT COUNT(*) FROM tenants WHERE email = ? AND id != ?";
        Integer count = jdbcTemplate.queryForObject(sqlChecker, Integer.class, tenant.getEmail(), excludeId); 
        if (count != null && count > 0) {
            return "email";
        }
        String sqlChecker2 = "SELECT COUNT(*) FROM tenants WHERE phone_number = ? AND id != ?";
        Integer count2 = jdbcTemplate.queryForObject(sqlChecker2, Integer.class, tenant.getPhoneNumber(), excludeId);
        if (count2 != null && count2 > 0) {
            return "phone";
        }

        return null;
    }

    public int add(Tenant tenant) {
        String duplicateField = duplicateExists(tenant);
        if (duplicateField != null) {
            switch (duplicateField) {
                case "email":
                    throw new ErrorException("The email is already taken.");
                case "phone":
                    throw new ErrorException("The phone number is already taken.");
                default:
                    throw new ErrorException("The tenant is already registered.");

            }
        }
        String sql = "INSERT INTO tenants(last_name, first_name, middle_initial, email, phone_number, units_id) VALUES (?, ?, ?, ?, ?, ?)"; 
        return jdbcTemplate.update(sql, tenant.getLastName(), tenant.getFirstName(), tenant.getMiddleInitial(), tenant.getEmail(), tenant.getPhoneNumber(), tenant.getUnitId());
      
    }

    public int delete(int id) {
        String sql = "DELETE FROM tenants WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public Tenant findById(int id) {
        String sql = "SELECT * FROM tenants WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new TenantRowMapper(), id);
        } catch (EmptyResultDataAccessException e) {
            throw new ErrorException("Tenant with id " + id + " not found.");
        }
    }

    public int update(int id, Tenant tenant) {
        Tenant existingTenant = findById(id);

        String duplicateField = duplicateExists(tenant, existingTenant.getId());
        if (duplicateField != null) {
            switch (duplicateField) {
                case "email":
                    throw new ErrorException("The email is already taken.");
                case "phone":
                    throw new ErrorException("The phone number is already taken.");
                default:
                    throw new ErrorException("The tenant is already registered.");

            }
        }
        String sql = "UPDATE tenants SET last_name = ?, first_name = ?, middle_initial = ?, email = ?, phone_number = ?, units_id = ? WHERE id = ?";
        return jdbcTemplate.update(sql, tenant.getLastName(), tenant.getFirstName(), tenant.getMiddleInitial(), tenant.getEmail(), tenant.getPhoneNumber(), tenant.getUnitId(), id);
    }
}