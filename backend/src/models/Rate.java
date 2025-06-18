package com.jjapartments.backend.models;

public class Rate {
    
    private int id;
    private string type;
    private double rate;

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public string getType() {
        return this.type;
    }

    public void setType(string type) {
        this.type = type;
    }

    public double getRate() {
        return this.rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

}
