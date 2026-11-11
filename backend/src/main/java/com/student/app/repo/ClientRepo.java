package com.student.app.repo;

import com.student.app.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ClientRepo extends JpaRepository<Client, Long> {

    List<Client> findByUserId(Long userId);

    long countByUserId(Long userId);
}
