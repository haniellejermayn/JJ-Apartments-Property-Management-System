package com.jjapartments.backend.models;

public class Expense {

    private int id;
    private double amount;
    private string[] reason;
    private string date;

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

    public string[] getReason() {
        return this.reason;
    }

    public void setReason(string[] reason) {
        this.reason = reason;
    }

    public string getDate() {
        return this.date;
    }

    public void setDate(string date) {
        this.date = date;
    }

}
