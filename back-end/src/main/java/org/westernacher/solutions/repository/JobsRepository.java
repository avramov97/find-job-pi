package org.westernacher.solutions.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.westernacher.solutions.domain.entities.Job;

import java.util.Optional;

public interface JobsRepository extends JpaRepository<Job, Integer>
{
    Optional<Job> findById(int s);
    Optional<Job> findByPosition(String s);

    // This was my excercise for PATCH request, but it did not succeed
    @Modifying
    @Query("update Job u set u.timesRated = :timesRated where u.id = :id")
    void updateRating(@Param(value = "id") int id, @Param(value = "timesRated") int timesRated);

}
