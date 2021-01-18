package org.westernacher.solutions.service;

import org.westernacher.solutions.domain.entities.Job;
import org.westernacher.solutions.domain.models.binding.JobAdd;
import org.westernacher.solutions.domain.models.service.JobServiceModel;

import java.util.List;


public interface JobService
{
    List<JobServiceModel> getAll();
    String updateAvgRating(int id, int rating);
    boolean addJob(JobAdd jobAdd);
    Job getJob(int id);
}
