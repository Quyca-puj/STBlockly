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
	private List<String> actionList;
	
	public List<String> getActionList() {
		return actionList;
	}
	public void setActionList(List<String> actionList) {
		this.actionList = actionList;
	}
	@Override
	public String toString() {
		return "STActionList [actionList=" + actionList + "]";
	}

}
