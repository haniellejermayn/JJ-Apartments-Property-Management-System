package com.jjapartments.backend.mappers;

import org.springframework.jdbc.core.RowMapper;

import com.jjapartments.backend.models.Unit;
import org.springframework.lang.NonNull;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UnitRowMapper implements RowMapper<Unit> {
    @Override
    public Unit mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
        Unit unit = new Unit();
        unit.setId(rs.getInt("id"));
        unit.setUnitNumber(rs.getString("unit_number"));
        unit.setName(rs.getString("name"));
        unit.setDescription(rs.getString("description"));
        unit.setPrice(rs.getFloat("price"));
        unit.setNumOccupants(rs.getInt("num_occupants"));
        unit.setContactNumber(rs.getString("contact_number"));
        return unit;
    }

    /*
     * REPLACE WITH THE BELOW CODE AFTER ADDING ACTIVE TENANT FOREIGN KEY TO UNITS
     * TABLE (FIX INDENTATION, BLOCK COMMENT BROKE IT)
     * 
     * @Override
     * public Unit mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
     * Unit unit = new Unit();
     * unit.setId(rs.getInt("id"));
     * unit.setUnitNumber(rs.getString("unit_number"));
     * unit.setName(rs.getString("name"));
     * unit.setDescription(rs.getString("description"));
     * unit.setPrice(rs.getFloat("price"));
     * unit.setNumOccupants(rs.getInt("num_occupants"));
     * unit.setCurrOccupants(rs.getInt("curr_occupants"));
     * 
     * // Set contactNumber to active tenant's phone_number, or null if no active
     * tenant
     * unit.setContactNumber(contact_number); // will be null if active_tenant_id is
     * null
     * 
     * return unit;
     * }
     * 
     */
}
