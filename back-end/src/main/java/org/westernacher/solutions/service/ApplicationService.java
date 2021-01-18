package org.westernacher.solutions.service;

import org.westernacher.solutions.domain.entities.Application;
import org.westernacher.solutions.domain.models.service.ApplicationServiceModel;

import java.util.List;

public interface ApplicationService
{
    List<ApplicationServiceModel> getAllOrdersByDelivered(boolean delivered);
    Application addOrder(ApplicationServiceModel applicationServiceModel) throws Exception;
    boolean setDeliver(int id, boolean deliver);
    boolean removeOrder(int id);
    boolean removeSelectedOrders(List<Integer> selectedOrders);
    int countWaitingOrders();
    int countDeliveredOrders();
}
