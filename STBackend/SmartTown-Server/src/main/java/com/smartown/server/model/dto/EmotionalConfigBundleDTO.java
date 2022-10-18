package com.smartown.server.model.dto;

/*
 * @author IQBots
 */
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
