package com.smartown.server.model.dto;

import java.util.List;

import javax.persistence.Basic;
import javax.persistence.CollectionTable;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;


public class EmotionalConfigDTO {

	private String name;

	private List<EmotionalConfigBundleDTO> config;

	public List<EmotionalConfigBundleDTO> getConfig() {
		return config;
	}
	public void setConfig(List<EmotionalConfigBundleDTO> config) {
		this.config = config;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	
	
}
 