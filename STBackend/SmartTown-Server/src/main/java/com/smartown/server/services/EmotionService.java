package com.smartown.server.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartown.server.model.Emotion;
import com.smartown.server.model.repository.EmotionRepository;


@Service
public class EmotionService implements IEmotionService{

	
	@Autowired
	private EmotionRepository repository;
	
	@Override
	public List<Emotion> getAllEmotions() {
		List<Emotion> list = (List<Emotion>) repository.findAll();
		if(list.size()>0)
		{
			return list;
		}
		return null;
	}

}
