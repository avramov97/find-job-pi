package org.westernacher.solutions.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.westernacher.solutions.domain.entities.Company;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Integer>
{
    Optional<Company> findByName(String s);
}
