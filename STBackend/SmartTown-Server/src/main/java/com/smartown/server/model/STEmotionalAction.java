package com.smartown.server.model;

import javax.persistence.Basic;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import com.smartown.server.model.dto.ActionDTO;


@Entity
@DiscriminatorValue("EmotionalAction")
public class STEmotionalAction extends STInstanceAction{
	@Basic
	private String emotion;

	
	public STEmotionalAction() {
		
	}
	
	public STEmotionalAction(ActionDTO actionDto, STBaseAction baseAction) {
		super(baseAction);
		emotion=actionDto.getEmotion();
	}
	public String getEmotion() {
		return emotion;
	}
	public void setEmotion(String emotion) {
		this.emotion = emotion;
	}

	@Override
	public String toString() {
		return "STEmotionalAction [emotion=" + emotion + "]";
	}

}
