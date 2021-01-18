package org.westernacher.solutions.domain.models.service;

import org.westernacher.solutions.domain.entities.Job;
import org.westernacher.solutions.domain.entities.User;

public class SavedJobServiceModel
{
    private String id;
    private Job job;
    private User user;

    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public User getUser()
    {
        return user;
    }

    public void setUser(User user)
    {
        this.user = user;
    }
}
