package com.smartown.server.model.repository;

import org.springframework.data.repository.CrudRepository;

import com.smartown.server.model.Emotion;
import com.smartown.server.model.EmotionalConfig;

public interface EmotionalConfigRepository extends CrudRepository<EmotionalConfig, Long>{
	EmotionalConfig findByName(String name);

}
