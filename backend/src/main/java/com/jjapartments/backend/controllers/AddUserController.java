package com.jjapartments.backend.controllers;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.net.URLEncoder;
import com.jjapartments.backend.models.*;

@Controller

public class AddUserController{

    @Autowired

    @GetMapping()
    public String AddUser(
    @RequestParam("id") int userid,  
    @RequestParam("user") String username,
    @RequestParam("password") String password,
    @RequestParam("email") String email) {

        User user = new User();

        user.setId(userid);
        user.setName(username);
        user.setPassword(password);
        user.setEmail(email);
        user.setCreatedAt(LocalDateTime.now());

        try {
            UserRepository.add(user);

        } catch(ErrorException e) {
            return "redirect:/error.html?errorMessage=" + URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);
        }
        
        return "redirect:/success.html?firstname=";
    }

}
