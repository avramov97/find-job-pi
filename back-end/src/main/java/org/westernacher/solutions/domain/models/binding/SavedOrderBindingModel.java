package org.westernacher.solutions.domain.models.binding;


import org.westernacher.solutions.domain.entities.Job;

public class SavedOrderBindingModel
{
    private Job job;
    private String username;

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public Job getJob()
    {
        return job;
    }

    public void setJob(Job job)
    {
        this.job = job;
    }
}
