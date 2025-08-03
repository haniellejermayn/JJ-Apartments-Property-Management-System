package com.jjapartments.backend.models;

public class MonthlyReport {
    
    private int id;
    private int year;
    private int month;
    private int unitId;
    private float monthlyDues;
    private float utilityBills;
    private float expenses;
    private String createdAt;


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

    public int getUnitId() {
        return this.unitId;
    }

    public void setUnitId(int unitId) {
        this.unitId = unitId;
    }

    public float getMonthlyDues() {
        return this.monthlyDues;
    }

    public void setMonthlyDues(float monthlyDues) {
        this.monthlyDues = monthlyDues;
    }

    public float getUtilityBills() {
        return this.utilityBills;
    }

    public void setUtilityBills(float utilityBills) {
        this.utilityBills = utilityBills;
    }

    public float getExpenses() {
        return this.expenses;
    }

    public void setExpenses(float expenses) {
        this.expenses = expenses;
    }
   
    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

}
