package org.westernacher.solutions.domain.entities;

import javax.persistence.*;

@Entity
@Table(name="applications")
public class Application
{
    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "number")
    private String number;

    @Column(name = "city")
    private String city;

    @Column(name = "email")
    private String email;

    @Column(name = "description")
    private String description;

    @Column(name = "delivered")
    private boolean delivered;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    public Job getJob() {
        return job;
    }

    public void getJob(Job job) {
        this.job = job;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isDelivered() {
        return delivered;
    }

    public void setDelivered(boolean delivered) {
        this.delivered = delivered;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setJob(Job job) {
        this.job = job;
    }
}
