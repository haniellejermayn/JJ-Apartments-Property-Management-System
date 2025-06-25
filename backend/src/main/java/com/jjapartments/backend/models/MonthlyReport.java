package com.jjapartments.backend.models;

public class MonthlyReport {
    
    private int id;
    private int year;
    private int month;
    private double totalEarnings;
    private double totalExpenses;
    private double netIncome;


    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getYear() {
        return this.year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return this.month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public double getTotalEarnings() {
        return this.totalEarnings;
    }

    public void setTotalEarnings(double totalEarnings) {
        this.totalEarnings = totalEarnings;
    }

    public double getTotalExpenses() {
        return this.totalExpenses;
    }

    public void setTotalExpenses(double totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public double getNetIncome() {
        return this.netIncome;
    }

    public void setNetIncome(double netIncome) {
        this.netIncome = netIncome;
    }

}
