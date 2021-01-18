package org.westernacher.solutions.domain.models.view;

import org.westernacher.solutions.domain.entities.User;

public class SavedJobsViewModel
{
    private String id;
    private int jobId;
    private String jobPosition;
    private String jobCompanyName;

    public String getJobCompanyName() {
        return jobCompanyName;
    }

    public void setJobCompanyName(String jobCompanyName) {
        this.jobCompanyName = jobCompanyName;
    }

    private String jobImg1;
    private User user;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getJobId() {
        return jobId;
    }

    public void setJobId(int jobId) {
        this.jobId = jobId;
    }

    public String getJobPosition() {
        return jobPosition;
    }

    public void setJobPosition(String jobPosition) {
        this.jobPosition = jobPosition;
    }

    public String getJobImg1() {
        return jobImg1;
    }

    public void setJobImg1(String jobImg1) {
        this.jobImg1 = jobImg1;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
