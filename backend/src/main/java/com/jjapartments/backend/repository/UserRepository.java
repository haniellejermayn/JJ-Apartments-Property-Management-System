package com.jjapartments.backend.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;
import com.jjapartments.backend.models.User;
import com.jjapartments.backend.exception.ErrorException;
import com.jjapartments.backend.mappers.UserRowMapper;

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
        Integer count = jdbcTemplate.queryForObject(sqlChecker, Integer.class, user.getUsername());
        return count != null && count > 0;
    }   


    public int add(User user) {
        String sqlChecker = "SELECT COUNT(*) FROM users WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sqlChecker, Integer.class, user.getId(), user.getUsername());

        if(count != null && count == 0){
            String sql = "INSERT INTO users(username, password, is_owner) VALUES (?, ?, ?)";
            return jdbcTemplate.update(sql, user.getUsername(), user.getPassword(), user.getIsOwner());
        } else if(userExists(user)){
            throw new ErrorException("The username is already taken.");
        } else {
            throw new ErrorException("The user is already registered.");
        }
    }

    public int delete(int id) {
        String sql = "DELETE FROM users WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public User findById(int id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new UserRowMapper(), id);
        } catch (EmptyResultDataAccessException e) {
            throw new ErrorException("User with id " + id + " not found.");
        }
    }

    
}