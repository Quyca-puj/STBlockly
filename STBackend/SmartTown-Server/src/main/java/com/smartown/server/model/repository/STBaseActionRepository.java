package com.smartown.server.model.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.smartown.server.model.STBaseAction;

@Repository
public interface STBaseActionRepository extends CrudRepository<STBaseAction, Long>{

	List<STBaseAction> findAllByCustom(boolean custom);
	STBaseAction findByName(String name);
}
