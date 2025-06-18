package com.jjapartments.backend.models;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "utilities")
public class Utilities {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    public enum Type {
        Meralco,
        ManilaWater
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Column(name = "previous_reading", precision = 10, scale = 2)
    private BigDecimal previousReading;

    @Column(name = "current_reading", precision = 10, scale = 2, nullable = false)
    private BigDecimal currentReading;

    @Column(name = "total_meter", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalMeter;

    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "month_of_start", nullable = false)
    private LocalDate monthOfStart;

    @Column(name = "month_of_end", nullable = false)
    private LocalDate monthOfEnd;

    @Column(name = "is_paid", nullable = false)
    private Boolean isPaid;

    @Column(name = "paid_at")
    private LocalDate paidAt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tenants_id", referencedColumnName = "id", nullable = false)
    private Tenant tenantId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "rates_id", referencedColumnName = "id", nullable = false)
    private Rate rateId;
    

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Type getType() {
        return this.type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public BigDecimal getPreviousReading() {
        return this.previousReading;
    }

    public void setPreviousReading(BigDecimal previousReading) {
        this.previousReading = previousReading;
    }

    public BigDecimal getCurrentReading() {
        return this.currentReading;
    }

    public void setCurrentReading(BigDecimal currentReading) {
        this.currentReading = currentReading;
    }

    public BigDecimal getTotalMeter() {
        return this.totalMeter;
    }

    public void setTotalMeter(BigDecimal totalMeter) {
        this.totalMeter = totalMeter;
    }

    public BigDecimal getTotalAmount() {
        return this.totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDate getDueDate() {
        return this.dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getMonthOfStart() {
        return this.monthOfStart;
    }

    public void setMonthOfStart(LocalDate monthOfStart) {
        this.monthOfStart = monthOfStart;
    }

    public LocalDate getMonthOfEnd() {
        return this.monthOfEnd;
    }

    public void setMonthOfEnd(LocalDate monthOfEnd) {
        this.monthOfEnd = monthOfEnd;
    }

    public Boolean getIsPaid() {
        return this.isPaid;
    }

    public void setIsPaid(Boolean isPaid) {
        this.isPaid = isPaid;
    }

    public LocalDate getPaidAt() {
        return this.paidAt;
    }

    public void setPaidAt(LocalDate paidAt) {
        this.paidAt = paidAt;
    }

    public Tenant getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(Tenant tenantId) {
        this.tenantId = tenantId;
    }

    public Rate getRateId() {
        return this.rateId;
    }

    public void setRateId(Rate rateId) {
        this.rateId = rateId;
    }

}
