package com.smartown.server.model.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.smartown.server.model.STActionList;

@Repository
public interface STActionListRepository extends CrudRepository<STActionList, Long>{

}
