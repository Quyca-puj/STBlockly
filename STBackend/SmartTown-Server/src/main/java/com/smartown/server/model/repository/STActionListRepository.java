package com.smartown.server.model.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.smartown.server.model.STActionList;
import com.smartown.server.model.STBaseAction;

@Repository
public interface STActionListRepository extends CrudRepository<STActionList, Long>{
	Optional<STActionList> findByName(String name);
}
