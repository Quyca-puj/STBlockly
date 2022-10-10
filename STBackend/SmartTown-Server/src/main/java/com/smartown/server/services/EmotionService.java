package com.smartown.server.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartown.server.model.Emotion;
import com.smartown.server.model.EmotionalConfig;
import com.smartown.server.model.repository.EmotionRepository;
import com.smartown.server.model.repository.EmotionalConfigRepository;


@Service
public class EmotionService implements IEmotionService{

	
	@Autowired
	private EmotionRepository repository;
	@Autowired
	private EmotionalConfigRepository emoConfRepository;
	
	
	@Override
	public List<Emotion> getAllEmotions() {
		List<Emotion> list = (List<Emotion>) repository.findAll();
		if(list.size()>0)
		{
			return list;
		}
		return null;
	}

	@Override
	public EmotionalConfig getEmotionalConfig(String name) {
		EmotionalConfig emoConf = emoConfRepository.findByName(name);
		if(emoConf == null) {
			emoConf = emoConfRepository.findByName("default");
		}
		return emoConf;
	}

}
