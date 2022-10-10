package com.smartown.server.model;

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

@Entity
public class EmotionalConfig {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	@Basic
	private String name;
	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name="config_emotions")
	private List<EmotionalConfigBundle> config;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public List<EmotionalConfigBundle> getConfig() {
		return config;
	}
	public void setConfig(List<EmotionalConfigBundle> config) {
		this.config = config;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	
	
}
