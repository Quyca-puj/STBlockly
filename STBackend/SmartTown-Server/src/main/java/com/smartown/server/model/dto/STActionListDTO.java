package com.smartown.server.model.dto;

import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.JoinColumn;


public class STActionListDTO {
	private String name;
	private List<ActionDTO> actions;
	
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
	@Override
	public String toString() {
		return "STActionListInDTO [name=" + name + ", actions=" + actions.size() + "]";
	}
	


}
