package com.example.demo;
public class LoginRequest {

    private String username;
    private String password;
    private String conpassword;
    private String address;
    private String email;
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public void setConpassword(String conpassword) {
        this.conpassword = conpassword;
    }
    public String getConpassword() {
        return conpassword;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
