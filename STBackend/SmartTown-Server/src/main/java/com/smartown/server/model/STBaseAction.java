package com.smartown.server.model;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "base_actions")
public class STBaseAction {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	@Basic
	private String name;
	@Basic
	private boolean custom;
	@Basic
	private boolean usesArgs;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public boolean isCustom() {
		return custom;
	}
	public void setCustom(boolean custom) {
		this.custom = custom;
	}
	
	public boolean isUsesArgs() {
		return usesArgs;
	}
	public void setUsesArgs(boolean usesArgs) {
		this.usesArgs = usesArgs;
	}
	@Override
	public String toString() {
		return "STCommand [id=" + id + ", name=" + name + "]";
	}
	
	

}
