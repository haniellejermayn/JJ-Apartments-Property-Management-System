package com.jjapartments.backend.controllers;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.net.URLEncoder;
import java.time.LocalDateTime;
import com.jjapartments.backend.models.User;
import com.jjapartments.backend.exception.ErrorException;
import com.jjapartments.backend.repository.UserRepository;

@Controller

public class AddUserController{

    @Autowired
    private UserRepository userRepository;
    @PostMapping("add-user")
    public String addUser(
    @RequestParam("username") String username,
    @RequestParam("password") String password,
    @RequestParam("is_owner") Boolean is_owner) {

        User user = new User();
        
        user.setUsername(username);
        user.setPassword(password);
        user.setIsOwner(is_owner);
        user.setCreatedAt(String.valueOf(LocalDateTime.now()));

        try {
            userRepository.add(user);

        } catch(ErrorException e) {
            return "redirect:/error.html?errorMessage=" + URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);
        }
        
        return "redirect:/success.html?username=" + URLEncoder.encode(username, StandardCharsets.UTF_8);
    }

}
