package com.jjapartments.backend.models;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "monthly_reports")
public class MonthlyReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer month;

    @Column(name = "total_earnings", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalEarnings;

    @Column(name = "total_expenses", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalExpenses;

    @Column(name = "net_income", precision = 10, scale = 2, nullable = false)
    private BigDecimal netIncome;


    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getYear() {
        return this.year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return this.month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public BigDecimal getTotalEarnings() {
        return this.totalEarnings;
    }

    public void setTotalEarnings(BigDecimal totalEarnings) {
        this.totalEarnings = totalEarnings;
    }

    public BigDecimal getTotalExpenses() {
        return this.totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getNetIncome() {
        return this.netIncome;
    }

    public void setNetIncome(BigDecimal netIncome) {
        this.netIncome = netIncome;
    }

}
