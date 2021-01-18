package org.westernacher.solutions.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.westernacher.solutions.domain.entities.SavedJob;
import org.westernacher.solutions.domain.models.binding.SavedOrderBindingModel;
import org.westernacher.solutions.domain.models.view.AllJobsViewModel;
import org.westernacher.solutions.domain.models.view.SavedJobsViewModel;
import org.westernacher.solutions.service.JobService;
import org.westernacher.solutions.service.LogServiceImpl;
import org.westernacher.solutions.service.UserService;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/", consumes = "application/json", produces = "application/json")
public class HomeController
{
    private final JobService jobService;
    private final UserService userService;
    private final ModelMapper modelMapper;
    private static final DateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
    private final LogServiceImpl logService;

    @Autowired
    public HomeController(JobService jobService, UserService userService, ModelMapper modelMapper, LogServiceImpl logService)
    {
        this.jobService = jobService;
        this.userService = userService;
        this.modelMapper = modelMapper;
        this.logService = logService;
    }

    @GetMapping
    public List<AllJobsViewModel> all()
    {
        List<AllJobsViewModel> allJobs =
                this.jobService.getAll()
                        .stream()
                        .map(x -> this.modelMapper.map(x, AllJobsViewModel.class))
                        .collect(Collectors.toList());

        return allJobs;
    }

   @GetMapping("/cart")
   public List<SavedJobsViewModel> cart(@RequestParam(name = "username") String username)
   {
       System.out.println(username);
       List<SavedJob> listSavedOrders = this.userService.getUserCart(username);

       List<SavedJobsViewModel> list = this.userService.getUserCart(username)
               .stream()
               .map(x -> this.modelMapper.map(x, SavedJobsViewModel.class))
               .collect(Collectors.toList());

       return list;
       //       return this.userService.getUserCart(username);
   }


    @PostMapping("/save-application")
    public ResponseEntity saveOrderToCart(@RequestBody SavedOrderBindingModel savedOrderBindingModel)
    {
        //return this.userService.saveOrder(this.modelMapper.map(savedOrderBindingModel, SavedJobServiceModel.class));
        return this.userService.saveOrder(savedOrderBindingModel);
    }

    @PostMapping("/delete-saved-order")
    public ResponseEntity deleteSavedOrder(@RequestParam(name = "id") String id)
    {
        return this.userService.removeSavedOrder(id);
    }


}
