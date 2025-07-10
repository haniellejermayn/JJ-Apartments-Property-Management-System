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
    // for creating
    public boolean userExists(User user) {
        String sqlChecker = "SELECT COUNT(*) FROM users WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sqlChecker, Integer.class, user.getUsername());
        return count != null && count > 0;
    }   
    // for updating
    public boolean userExists(User user, int excludeId) {
        String sqlChecker = "SELECT COUNT(*) FROM users WHERE username = ? AND id != ?";
        Integer count = jdbcTemplate.queryForObject(sqlChecker, Integer.class, user.getUsername(), excludeId);
        return count != null && count > 0;
    }   

    public int add(User user) {
        if (userExists(user)){
            throw new ErrorException("The username is already taken.");
        } else {
            String sql = "INSERT INTO users(username, password, is_owner) VALUES (?, ?, ?)";
            return jdbcTemplate.update(sql, user.getUsername(), user.getPassword(), user.getIsOwner());
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

    public int update(int id, User user) {
        User existingUser = findById(id);

        if (userExists(user, existingUser.getId())) {
            throw new ErrorException("The username is already taken.");
        } else {
            String sql = "UPDATE users SET username = ?, password = ?, is_owner = ? WHERE id = ?";
            return jdbcTemplate.update(sql, user.getUsername(), user.getPassword(), user.getIsOwner(), id);
        }
    }

    // Add method to find user by username and password
    public User findByUsernameAndPassword(String username, String password) {
        String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new UserRowMapper(), username, password);
        } catch (EmptyResultDataAccessException e) {
            throw new ErrorException("Invalid username or password.");
        }
    }
}