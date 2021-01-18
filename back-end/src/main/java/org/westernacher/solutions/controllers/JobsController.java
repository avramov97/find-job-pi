package org.westernacher.solutions.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.westernacher.solutions.domain.entities.Job;
import org.westernacher.solutions.domain.models.binding.JobAdd;
import org.westernacher.solutions.domain.models.binding.JobUpdateRating;
import org.westernacher.solutions.domain.models.service.JobServiceModel;
import org.westernacher.solutions.service.JobService;
import org.westernacher.solutions.service.LogServiceImpl;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
//@CrossOrigin("http://localhost:63343")
@RequestMapping(value = "/jobs", consumes = "application/json", produces = "application/json")
public class JobsController
{
    private final JobService jobService;
    private final ModelMapper modelMapper;
    private final LogServiceImpl logService;

    @Autowired
    public JobsController(JobService jobService, ModelMapper modelMapper, LogServiceImpl logService)
    {
        this.jobService = jobService;
        this.modelMapper = modelMapper;
        this.logService = logService;
    }

    @PostMapping("/change-rating")
    public ResponseEntity partialUpdateJob(@RequestBody JobUpdateRating jobUpdateRating) throws URISyntaxException
    {
        String avgRating = this.jobService.updateAvgRating(jobUpdateRating.id, jobUpdateRating.rating);

        return ResponseEntity.created(new URI("/jobs/change-rating")).body(avgRating);
    }

    @PostMapping("/add")
    public ResponseEntity addJob(@RequestBody JobAdd jobAdd) throws URISyntaxException
    {
        boolean result = this.jobService.addJob(jobAdd);

        return ResponseEntity.created(new URI("/jobs/add")).body(result);
    }

    @GetMapping("/product")
    public Job getSingleJob(@RequestParam(name = "id") int id)
    {
        Job job =  this.jobService.getJob(id);
        return job;
//        return this.jobservice.getjob(id);
    }


//    @GetMapping("/get-times-rated")
//    public int getTimesRated()
//    {
//        int timesRated = this.jobservice
//
//        List<AlljobsViewModel> alljobs =
//                this.jobservice.getAll()
//                        .stream()
//                        .map(x -> this.modelMapper.map(x, AlljobsViewModel.class))
//                        .collect(Collectors.toList());
//
//        return alljobs;
//    }


}
