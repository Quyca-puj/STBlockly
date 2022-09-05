package com.smartown.server.model;

import java.util.List;
import java.util.Set;

import javax.persistence.Basic;
import javax.persistence.CollectionTable;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import javax.persistence.JoinColumn;

@Entity
@Table(name = "action_lists")
public class STActionList {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	@Basic
	private String name;
	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name="list_actions", joinColumns=@JoinColumn(name="list_id"))
	private List<STInstanceAction> actions;
	
	public List<STInstanceAction> getActionList() {
		return actions;
	}
	public void setActionList(List<STInstanceAction> actionList) {
		this.actions = actionList;
	}
		
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public List<STInstanceAction> getActions() {
		return actions;
	}
	
	public void setActions(List<STInstanceAction> actions) {
		this.actions = actions;
	}
		
	@Override
	public String toString() {
		return "STActionList [name=" + name + ", actions=" + actions.size() + "]";
	} 

}
