package com.smartown.server.services;

import java.util.List;

import com.smartown.server.model.Emotion;
import com.smartown.server.model.EmotionalConfig;

public interface IEmotionService {
	
	List<Emotion> getAllEmotions();
	EmotionalConfig getEmotionalConfig(String name);
	
}
