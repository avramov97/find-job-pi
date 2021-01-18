package org.westernacher.solutions.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.westernacher.solutions.domain.entities.Application;

import java.util.List;

public interface ApplicationsRepository extends JpaRepository<Application, Integer>
{
    List<Application> findAllByDeliveredFalse();
    List<Application> findAllByDeliveredTrue();
    int countAllByDeliveredTrue();
    int countAllByDeliveredFalse();
}
