package com.jjapartments.backend.models;

public class Expense {

    private int id;
    private double amount;
    private String[] reason;
    private String date;

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getAmount() {
        return this.amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String[] getReason() {
        return this.reason;
    }

    public void setReason(String[] reason) {
        this.reason = reason;
    }

    public String getDate() {
        return this.date;
    }

    public void setDate(String date) {
        this.date = date;
    }

}
