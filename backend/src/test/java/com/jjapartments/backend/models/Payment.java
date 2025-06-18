package com.jjapartments.backend.models;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tenants_id", referencedColumnName = "id", nullable = false)
    private Tenant tenantId;

    public enum Reason {
        MonthlyDue,
        Miscellaneous,
        Maintenance
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Reason reason;

    public enum ModeOfPayment {
        Cash,
        GCash,
        Bank,
        Others
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "mode_of_payment")
    private ModeOfPayment ModeOfPayment;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "month_of_start")
    private LocalDate monthOfStart;

    @Column(name = "month_of_end")
    private LocalDate monthOfEnd;

    @Column(name = "is_paid", nullable = false)
    private Boolean isPaid;

    @Column(name = "paid_at")
    private LocalDate paidAt;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Tenant getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(Tenant tenantId) {
        this.tenantId = tenantId;
    }

    public Reason getReason() {
        return this.reason;
    }

    public void setReason(Reason reason) {
        this.reason = reason;
    }

    public Boolean isIsPaid() {
        return this.isPaid;
    }

    public ModeOfPayment getModeOfPayment() {
        return this.ModeOfPayment;
    }

    public void setModeOfPayment(ModeOfPayment ModeOfPayment) {
        this.ModeOfPayment = ModeOfPayment;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
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

}
