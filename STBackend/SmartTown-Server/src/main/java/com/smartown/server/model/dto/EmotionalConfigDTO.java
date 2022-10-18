package com.smartown.server.model.dto;

import java.util.List;
/*
 * @author IQBots
 */
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
