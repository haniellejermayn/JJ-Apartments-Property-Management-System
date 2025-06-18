package com.jjapartments.backend.models;

public class User {
  
    private int id;
    private String username;
    private String password;
    private String fullName;
    private String email;
    private boolean isOwner;
    private string createdAt;
    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean getIsOwner() {
        return isOwner;
    }

    public void setIsOwner(boolean isOwner) {
        this.isOwner = isOwner;
    }

    public string getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(string createdAt) {
        this.createdAt = createdAt;
    }
}
