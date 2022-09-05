package com.smartown.server.model.dto;

import java.util.List;
import java.util.Set;

public class STBaseActionDTO {

	private String name;
	private Set<String> conditions;
	private List<STActionParameterDTO> parameters;
	
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
	
	

}
