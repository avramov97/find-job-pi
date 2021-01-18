package org.westernacher.solutions.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "saved_job")
public class SavedJob extends BaseEntity
{
    private Job job;
    private User user;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    public User getUser()
    {
        return user;
    }

    public void setUser(User user)
    {
        this.user = user;
    }

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="job_id", nullable=false)
    public Job getJob()
    {
        return job;
    }

    public void setJob(Job job)
    {
        this.job = job;
    }
}
