package org.westernacher.solutions.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.westernacher.solutions.domain.entities.Application;
import org.westernacher.solutions.domain.models.binding.ApplicationCreateBindingModel;
import org.westernacher.solutions.domain.models.service.ApplicationServiceModel;
import org.westernacher.solutions.domain.models.view.ApplicationsViewModel;
import org.westernacher.solutions.service.EmailService;
import org.westernacher.solutions.service.ApplicationService;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/applications", consumes = "application/json", produces = "application/json")
public class ApplicationsController
{
    private final ApplicationService applicationService;
    private final ModelMapper modelMapper;
    private final EmailService emailService;
    int countOrders = 0;

    @Autowired
    public ApplicationsController(ApplicationService applicationService, ModelMapper modelMapper, EmailService emailService)
    {
        this.applicationService = applicationService;
        this.modelMapper = modelMapper;
        this.emailService = emailService;
    }

    @GetMapping(value = "/waiting")
    public List<ApplicationsViewModel> notDeliveredApplications()
    {
        List<ApplicationsViewModel> notDeliveredOrders =
                this.applicationService.getAllOrdersByDelivered(false)
                        .stream()
                        .map(x -> this.modelMapper.map(x, ApplicationsViewModel.class))
                        .collect(Collectors.toList());

        return notDeliveredOrders;
    }

    @GetMapping(value = "/delivered")
    public List<ApplicationsViewModel> deliveredOrders()
    {
        List<ApplicationsViewModel> deliveredOrders =
                this.applicationService.getAllOrdersByDelivered(true)
                        .stream()
                        .map(x -> this.modelMapper.map(x, ApplicationsViewModel.class))
                        .collect(Collectors.toList());

        return deliveredOrders;
    }

    @PostMapping("/add")
    public ResponseEntity addApplication(@RequestBody ApplicationCreateBindingModel applicationCreateBindingModel, Authentication authentication) throws Exception
    { 
        Application application = this.applicationService.addOrder(this.modelMapper.map(applicationCreateBindingModel, ApplicationServiceModel.class));

        if(application == null) // Is it correct??
        {
            return ResponseEntity.badRequest().body("Извинете, во моментов нема останати дуксери.");
        }

        countOrders++;
        String toOwner = "alekbushinoska@gmail.com";
        String subjectOwner = "Апликация номер: " + countOrders;
        String textOwner = "Здравейте,,\n\n" + "Вие имате нова апликация за обявата " + applicationCreateBindingModel.getJob().getPosition() + " потполнувајќи ги следните информации: \n\n"
                            + "Име на кандидатстващ: " + application.getName() + "\n"
                            + "Град: " + applicationCreateBindingModel.getCity() + "\n"
                            + "Мобилен брой: " + applicationCreateBindingModel.getNumber() + "\n"
                            + "Емаил: " + applicationCreateBindingModel.getEmail() + "\n"
                            + "Мотивация: " + applicationCreateBindingModel.getDescription() + "\n\n\n"
                            + "Поздрав,\n"
                            + "Jobs Finder BG";

        
        String subjectClient = "Успешно извршено кандидатстване";
        String textClient = "Здраво,\n\nВие успешно кандидатствахте за обявата "  + application.getJob().getPosition() +
                            ".\n\nПри погрешни информации, Моля ни пишете на този мейл или да се обадите на телефона 075 930 288.\n" +
                            "Благодаря че одбрахте Jobs Finder BG.\n\n\n" +
                            "Срдечен поздрав,\n" +
                            "Тимот на Jobs Finder BG" + "\n\n";
                            // attachments (facebook, instagram profiles)

//       this.emailService.sendSimpleMessage("alekbushinoska@gmail.com", subjectClient, textClient);
//       this.emailService.sendSimpleMessage("alekbushinoska@gmail.com", subjectOwner, textOwner);

        return ResponseEntity.created(new URI("/orders/add")).body(true);
    }

    @PostMapping("/deliver")
    public ResponseEntity setOrderDone(@RequestParam(name = "id") int id, Authentication authentication)
    {
        boolean isDone = this.applicationService.setDeliver(id, true);

        if(isDone)
        {
            System.out.println("DELIVERED");
            return ResponseEntity.ok().body(true);
        }
        else
        {
            System.out.println("NOT ERROR DELIVERED");
            return ResponseEntity.badRequest().body(false);
        }
    }

    @PostMapping("/remove-delivered-flag")
    public ResponseEntity setApplicationNotDone(@RequestParam(name = "id") int id, Authentication authentication)
    {
        boolean isDone = this.applicationService.setDeliver(id, false);

        if(isDone)
        {
            return ResponseEntity.ok().body(true);
        }
        else
        {
            return ResponseEntity.badRequest().body(false);
        }
    }

    @PostMapping("/remove")
    public ResponseEntity removeApplication(@RequestParam(name = "id") int id, Authentication authentication)
    {
        boolean isDone = this.applicationService.removeOrder(id);

        if(isDone)
        {
            return ResponseEntity.ok().body("Order removed successfully!");
        }
        else
        {
            return ResponseEntity.badRequest().body("Order is not removed");
        }
    }

    @PostMapping("/remove-selected")
    public ResponseEntity removeSelectedOrders(@RequestParam(name = "selectedOrders") List<Integer> selectedOrders, Authentication authentication)
    {
        boolean removed = this.applicationService.removeSelectedOrders(selectedOrders);

        if(removed == true)
        {
            return ResponseEntity.ok(true);
        }
        else
        {
            return ResponseEntity.badRequest().body(false);
        }
    }

    @GetMapping("/count-waiting")
    public int getCountWaitingOrders()
    {
        return this.applicationService.countWaitingOrders();
    }

    @GetMapping("count-delivered")
    public int getCountDeliveredOrders()
    {
        return this.applicationService.countDeliveredOrders();
    }


}
