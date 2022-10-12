package com.smartown.server.model.dto;

import java.util.List;
import java.util.Set;
/*
 * @author IQBots
 */
public class STBaseActionDTO {

	private String name;
	private String translatedName;
	private Set<String> conditions;
	private List<STActionParameterDTO> parameters;
	private boolean shouldAnswer;
	private boolean emotionOriented;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Set<String> getConditions() {
		return conditions;
	}

	public void setConditions(Set<String> conditions) {
		this.conditions = conditions;
	}

	@Override
	public String toString() {
		return "STCommanDTO [name=" + name + "]";
	}

	public List<STActionParameterDTO> getParameters() {
		return parameters;
	}

	public void setParameters(List<STActionParameterDTO> parameters) {
		this.parameters = parameters;
	}

	public String getTranslatedName() {
		return translatedName;
	}

	public void setTranslatedName(String translatedName) {
		this.translatedName = translatedName;
	}

	public boolean isShouldAnswer() {
		return shouldAnswer;
	}

	public void setShouldAnswer(boolean shouldAnswer) {
		this.shouldAnswer = shouldAnswer;
	}

	public boolean isEmotionOriented() {
		return emotionOriented;
	}

	public void setEmotionOriented(boolean emotionOriented) {
		this.emotionOriented = emotionOriented;
	}

}
