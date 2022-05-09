package com.smartown.server.model.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.smartown.server.model.STCommand;

@Repository
public interface STCommandRepository extends CrudRepository<STCommand, Long>{

}
