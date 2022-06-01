package com.smartown.server.model;

import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.JoinColumn;

@Entity
@Table(name = "action_list")
public class STActionList {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	@ElementCollection
	@CollectionTable(name="ActionList", joinColumns=@JoinColumn(name="id"))
	private List<String> actionList;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public List<String> getActionList() {
		return actionList;
	}
	public void setActionList(List<String> actionList) {
		this.actionList = actionList;
	}
	@Override
	public String toString() {
		return "STActionList [id=" + id + ", actionList=" + actionList + "]";
	}

}
