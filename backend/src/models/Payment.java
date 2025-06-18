package com.jjapartments.backend.models;

public class Payment {

    private int id;
    private int tenantId;
    private string reason;
    private string modeOfPayment;
    private double amount;
    private string dueDate;
    private string monthOfStart;
    private string monthOfEnd;
    private boolean isPaid;
    private string paidAt;

    public Integer getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Tenant getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(int tenantId) {
        this.tenantId = tenantId;
    }

    public Reason getReason() {
        return this.reason;
    }

    public void setReason(string reason) {
        this.reason = reason;
    }

    public boolean isIsPaid() {
        return this.isPaid;
    }

    public string getModeOfPayment() {
        return this.ModeOfPayment;
    }

    public void setModeOfPayment(string modeOfPayment) {
        this.ModeOfPayment = modeOfPayment;
    }

    public double getAmount() {
        return this.amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public string getDueDate() {
        return this.dueDate;
    }

    public void setDueDate(string dueDate) {
        this.dueDate = dueDate;
    }
    public string getMonthOfStart() {
        return this.monthOfStart;
    }

    public void setMonthOfStart(string monthOfStart) {
        this.monthOfStart = monthOfStart;
    }

    public string getMonthOfEnd() {
        return this.monthOfEnd;
    }

    public void setMonthOfEnd(string monthOfEnd) {
        this.monthOfEnd = monthOfEnd;
    }

    public boolean getIsPaid() {
        return this.isPaid;
    }

    public void setIsPaid(boolean isPaid) {
        this.isPaid = isPaid;
    }

    public LocalDate getPaidAt() {
        return this.paidAt;
    }

    public void setPaidAt(LocalDate paidAt) {
        this.paidAt = paidAt;
    }

}
