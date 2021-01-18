package org.westernacher.solutions.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.westernacher.solutions.domain.entities.SavedJob;


public interface SavedJobRepository extends JpaRepository<SavedJob, String>
{
}

