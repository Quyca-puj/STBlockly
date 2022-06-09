package com.smartown.server.model;

import java.util.List;

import javax.persistence.Basic;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.smartown.server.model.dto.STActionListDTO;

import javax.persistence.JoinColumn;

@Entity
@Table(name = "action_lists")
public class STActionList {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", updatable = false, nullable = false)
	private long id;
	@Basic
	private String name;
	@ElementCollection
	@CollectionTable(name="list_actions", joinColumns=@JoinColumn(name="list_id"))
	private List<STInstanceAction> actions;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
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
	@Override
	public String toString() {
		return "STActionList [id=" + id + ", name=" + name + ", actions=" + actions.size() + "]";
	} 

}
