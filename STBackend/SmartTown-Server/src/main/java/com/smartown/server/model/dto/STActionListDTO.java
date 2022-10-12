package com.smartown.server.model.dto;

import java.util.List;
import java.util.Set;
/*
 * @author IQBots
 */
public class STActionListDTO {
	private String name;
	private List<ActionDTO> actions;
	private Set<String> conditions;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<ActionDTO> getActions() {
		return actions;
	}

	public void setActions(List<ActionDTO> actions) {
		this.actions = actions;
	}

	public Set<String> getConditions() {
		return conditions;
	}

	public void setConditions(Set<String> conditions) {
		this.conditions = conditions;
	}

	@Override
	public String toString() {
		return "STActionListInDTO [name=" + name + ", actions=" + actions.size() + "]";
	}

}
