package com.smartown.server.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartown.server.model.Emotion;
import com.smartown.server.model.EmotionalConfig;
import com.smartown.server.model.repository.EmotionRepository;
import com.smartown.server.model.repository.EmotionalConfigRepository;

@Service
/*
 * Emotion Service
 * @author IQBots
 */
public class EmotionService implements IEmotionService {

	@Autowired
	private EmotionRepository repository;
	@Autowired
	private EmotionalConfigRepository emoConfRepository;
	/*
	 * Method to get all the emotions in the database.
	 * @return list with all the emotions.
	 */
	@Override
	public List<Emotion> getAllEmotions() {
		List<Emotion> list = (List<Emotion>) repository.findAll();
		if (list.size() > 0) {
			return list;
		}
		return null;
	}
	/*
	 * Method to get an specific emotional configuration. If the emotional configuration doesnt exists the method returns the default one.
	 * @param name name of the configuration to search for. 
	 * @return EmotionalConfiguration DTO Object.
	 */
	@Override
	public EmotionalConfig getEmotionalConfig(String name) {
		EmotionalConfig emoConf = emoConfRepository.findByName(name);
		if (emoConf == null) {
			emoConf = emoConfRepository.findByName("default");
		}
		return emoConf;
	}

}
