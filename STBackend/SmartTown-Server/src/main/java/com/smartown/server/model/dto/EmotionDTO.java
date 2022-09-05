package com.smartown.server.model.dto;

import java.util.Set;

public class EmotionDTO {

	private String name;
	private String traduction;

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public String getTraduction() {
		return traduction;
	}
	public void setTraduction(String traduction) {
		this.traduction = traduction;
	}
	public String toString() {
		return "STCommanDTO [name=" + name + "]";
	}
	
	

}
