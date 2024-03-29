package com.smartown.server.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.smartown.server.model.STBaseAction;

@Repository
/*
 * @author IQBots
 */
public interface STBaseActionRepository extends CrudRepository<STBaseAction, Long> {

	List<STBaseAction> findAllByCustom(boolean custom);

	Optional<STBaseAction> findByName(String name);
}
