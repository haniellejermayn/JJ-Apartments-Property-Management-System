package com.jjapartments.backend.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;
import com.jjapartments.backend.models.User;


@Repository
public class UserRepository{
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public List<User> findAll() {
        String sql = "SELECT * FROM users"; 
        return jdbcTemplate.query(sql, new UserRowMapper());
    }

    public boolean userExists(User user) {
    String sqlChecker = "SELECT COUNT(*) FROM users WHERE username = ?";
    int count = jdbcTemplate.queryForObject(sqlChecker, Integer.class, user.getName());
    return count > 0;
    }   

    public boolean idExists(User user) {
    String sqlChecker = "SELECT COUNT(*) FROM users WHERE id = ?";
    int count = jdbcTemplate.queryForObject(sqlChecker, Integer.class, user.getId());
    return count > 0;
    } 

    public boolean emailExists(User user) {
    String sqlChecker = "SELECT COUNT(*) FROM users WHERE id = ?";
    int count = jdbcTemplate.queryForObject(sqlChecker, Integer.class, user.getId());
    return count > 0;
    } 

    public int add(User user) {
        String sqlChecker = "SELECT COUNT(*) FROM users WHERE id = ? AND username = ? AND email = ?";
        int count = jdbcTemplate.queryForObject(sqlChecker, Integer.class, user.getId(), user.getName(), user.getEmail());

        if(count == 0){
            String sql = "INSERT INTO users(id, username, password, email, created_at) VALUES (?, ?, ?, ?)";
            return jdbcTemplate.update(sql, stock.getName(), stock.getPrice(), stock.getManufacturingDate(), stock.getWarranty());
        } else if(userExists()){
            throw new ErrorException("The username is already taken.");
        } else if(idExists()){
            throw new ErrorException("The id is already taken.");
        } else if(emailExists()){
            throw new ErrorException("The email is already taken.");
        } else {
            throw new ErrorException("The user is already registered.");
        }
    }
}