package org.westernacher.solutions.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.westernacher.solutions.domain.entities.Company;
import org.westernacher.solutions.domain.entities.Job;
import org.westernacher.solutions.domain.models.binding.JobAdd;
import org.westernacher.solutions.domain.models.service.JobServiceModel;
import org.westernacher.solutions.repository.CompanyRepository;
import org.westernacher.solutions.repository.JobsRepository;

import java.text.DecimalFormat;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService
{
    private final JobsRepository jobsRepository;
    private final ModelMapper modelMapper;
    private final CompanyRepository companyRepository;

    @Autowired
    public JobServiceImpl(JobsRepository jobsRepository, ModelMapper modelMapper, CompanyRepository companyRepository)
    {
        this.jobsRepository = jobsRepository;
        this.modelMapper = modelMapper;
        this.companyRepository = companyRepository;
    }

    @Override
    public List<JobServiceModel> getAll()
    {
        return this.jobsRepository
                .findAll()
                .stream()
                .map(x -> this.modelMapper.map(x, JobServiceModel.class))
                .collect(Collectors.toUnmodifiableList());
    }

    @Override
    public String updateAvgRating(int id,  int rating)
    {
        Job job = this.jobsRepository.findById(id).orElse(null);
        job.setTimesRated(job.getTimesRated()+1);
        job.setRatingSum(job.getRatingSum()+rating);
        this.jobsRepository.save(job);
        DecimalFormat df = new DecimalFormat("####0.00");

        double avgRating = (double)job.getRatingSum() / (double)job.getTimesRated();

        return df.format(avgRating);
    }

    @Override
    public boolean addJob(JobAdd jobAdd)
    {
        JobServiceModel jobServiceModel = this.modelMapper.map(jobAdd, JobServiceModel.class);
        Optional<Company> company = this.companyRepository.findByName(jobAdd.getCompanyName());
        if(company.isPresent())
        {
            jobServiceModel.setCompany(company.get());
        }
        else
        {
            Company newCompany = new Company(jobAdd.getCompanyName());
            try
            {
                this.companyRepository.save(newCompany);
                jobServiceModel.setCompany(newCompany);
            }
            catch (DataIntegrityViolationException e)
            {
                System.out.println("Error storing the Company");
                return false;
            }
        }

        Job job = this.modelMapper.map(jobServiceModel, Job.class);

        try
        {
            this.jobsRepository.save(job);
            return true;
        }
        catch (DataIntegrityViolationException e)
        {
            System.out.println("Error adding Job");
        }

        return false;
    }

    @Override
    public Job getJob(int id)
    {
        Optional<Job> job = this.jobsRepository.findById(id);

        if(job.isPresent())
        {
            return job.get();
        }
        else
        {
            throw new IllegalArgumentException();
        }
    }


}
