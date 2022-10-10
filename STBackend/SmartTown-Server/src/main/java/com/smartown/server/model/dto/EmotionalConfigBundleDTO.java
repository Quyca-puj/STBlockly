package com.smartown.server.model.dto;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

public class EmotionalConfigBundleDTO {

	private EmotionDTO emotion;
	
	private float intensity;


	public EmotionDTO getEmotion() {
		return emotion;
	}

	public void setEmotion(EmotionDTO emotion) {
		this.emotion = emotion;
	}

	public float getIntensity() {
		return intensity;
	}

	public void setIntensity(float intensity) {
		this.intensity = intensity;
	}


	
}
