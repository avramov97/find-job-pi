package org.westernacher.solutions.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.westernacher.solutions.domain.entities.Application;
import org.westernacher.solutions.domain.models.service.ApplicationServiceModel;
import org.westernacher.solutions.repository.ApplicationsRepository;
import org.westernacher.solutions.repository.JobsRepository;
import org.westernacher.solutions.repository.ApplicationsRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ApplicationServiceImpl implements ApplicationService
{
    private final ApplicationsRepository applicationsRepository;
    private final JobsRepository jobsRepository;
    private final JobService jobService;
    private final ModelMapper modelMapper;

    @Autowired
    public ApplicationServiceImpl(ApplicationsRepository applicationsRepository, JobsRepository jobsRepository, JobService jobService, ModelMapper modelMapper)
    {
        this.applicationsRepository = applicationsRepository;
        this.jobsRepository = jobsRepository;
        this.jobService = jobService;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<ApplicationServiceModel> getAllOrdersByDelivered(boolean delivered)
    {
        List<ApplicationServiceModel> list;
        if(delivered)
        {
             list = this.applicationsRepository.findAllByDeliveredTrue().stream()
                     .map(x -> this.modelMapper.map(x, ApplicationServiceModel.class))
                     .collect(Collectors.toUnmodifiableList());
        }
        else
        {
            list = this.applicationsRepository.findAllByDeliveredFalse().stream()
                    .map(x -> this.modelMapper.map(x, ApplicationServiceModel.class))
                    .collect(Collectors.toUnmodifiableList());
        }

        return list;
    }

    @Override
    public Application addOrder(ApplicationServiceModel applicationServiceModel) throws Exception
    {
        Application order = this.modelMapper.map(applicationServiceModel, Application.class);

        try
        {
            this.applicationsRepository.save(order);
            return order;
        } catch (DataAccessException exception)
        {
            System.out.println("Data not stored correctly.");
            return null;
        }
    }

    @Override
    public boolean setDeliver(int id, boolean deliver)
    {
        Optional<Application> order = this.applicationsRepository.findById(id);
        if(order.isPresent())
        {
            if(deliver)
            {
                order.get().setDelivered(true);
            }
            else
            {
                order.get().setDelivered(false);
            }
            this.applicationsRepository.save(order.get());
            return true;
        }

        return false;
    }

    @Override
    public boolean removeOrder(int id)
    {
        Optional<Application> order = this.applicationsRepository.findById(id);
        if(order.isPresent())
        {
            this.applicationsRepository.delete(order.get());
            return true;
        }

        return false;
    }

    @Override
    public boolean removeSelectedOrders(List<Integer> selectedOrders)
    {
        for(int i : selectedOrders)
        {
//          boolean deleted = this.removeOrder(i);
            try
            {
                this.applicationsRepository.deleteById(i);
            }
            catch (Exception e)
            {
                System.out.println("Eror while deleting.");
                return false;
            }
        }

        return true;
    }

    @Override
    public int countWaitingOrders()
    {
        return this.applicationsRepository.countAllByDeliveredFalse();
    }

    @Override
    public int countDeliveredOrders()
    {
        return this.applicationsRepository.countAllByDeliveredTrue();
    }


}
