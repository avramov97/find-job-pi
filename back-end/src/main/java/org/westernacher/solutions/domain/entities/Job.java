package org.westernacher.solutions.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="jobs")
public class Job
{
    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private int id;

    @Column(name="position")
    private String position;

    @ManyToOne
    @JoinColumn(name="company_id", nullable=false)
    private Company company;

    @Column(name="img1")
    private String img1;

    @Column(name="img2")
    private String img2;

    @Column(name="numOfEmployees")
    private int numOfEmployees;

    @Column(name="salary")
    private double salary;

    @Column(name="location")
    private String location;

    @Column(name="likes")
    private int likes;

    @Column(name="rating_sum")
    private int ratingSum;

    @Column(name="times_rated")
    private int timesRated;

    @Column(name="description")
    private String description;

    @JsonIgnore
    @OneToMany(mappedBy = "job")
    private Set<Application> orders;

    @JsonIgnore
    @OneToMany(mappedBy = "job")
    private List<SavedJob> cart;

    public List<SavedJob> getCart()
    {
        return cart;
    }

    public void setCart(List<SavedJob> cart)
    {
        this.cart = cart;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getImg1()
    {
        return img1;
    }

    public void setImg1(String img1)
    {
        this.img1 = img1;
    }

    public String getImg2()
    {
        return img2;
    }

    public void setImg2(String img2)
    {
        this.img2 = img2;
    }

    public int getNumOfEmployees() {
        return numOfEmployees;
    }

    public void setNumOfEmployees(int numOfEmployees) {
        this.numOfEmployees = numOfEmployees;
    }

    public int getLikes()
    {
        return likes;
    }

    public void setLikes(int likes)
    {
        this.likes = likes;
    }


    public int getRatingSum()
    {
        return ratingSum;
    }

    public void setRatingSum(int ratingSum)
    {
        this.ratingSum = ratingSum;
    }

    public int getTimesRated()
    {
        return timesRated;
    }

    public void setTimesRated(int timesRated)
    {
        this.timesRated = timesRated;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public Set<Application> getOrders()
    {
        return orders;
    }

    public void setOrders(Set<Application> orders)
    {
        this.orders = orders;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

}
