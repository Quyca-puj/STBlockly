package com.smartown.server.model.repository;

import org.springframework.data.repository.CrudRepository;

import com.smartown.server.model.Emotion;
import com.smartown.server.model.STActionParameter;

public interface STActionParametersRepository extends CrudRepository<STActionParameter, Long>{
	STActionParameter findByName(String name);
}
