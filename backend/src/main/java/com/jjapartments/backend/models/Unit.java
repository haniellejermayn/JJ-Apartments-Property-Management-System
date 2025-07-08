package com.jjapartments.backend.models;

public class Unit {

    private int id;
    private String unitNumber;
    private String name;
    private String description;
    private int numOccupants;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUnitNumber() {
        return unitNumber;
    }

    public void setUnitNumber(String unitNumber) {
        this.unitNumber = unitNumber;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getNumOccupants() {
        return this.numOccupants;
    }

    public void setNumOccupants(int numOccupants) {
        this.numOccupants = numOccupants;
    }
   
}

