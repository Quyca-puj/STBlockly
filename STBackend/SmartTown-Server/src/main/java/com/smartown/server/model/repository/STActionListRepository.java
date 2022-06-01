package com.smartown.server.model.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.smartown.server.model.STActionList;
import com.smartown.server.model.STCommand;

@Repository
public interface STActionListRepository extends CrudRepository<STActionList, Long>{

}
