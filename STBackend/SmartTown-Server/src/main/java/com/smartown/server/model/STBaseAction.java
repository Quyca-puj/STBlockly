package com.smartown.server.model;

import java.util.List;
import java.util.Set;

import javax.persistence.Basic;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
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
	@ElementCollection(fetch = FetchType.EAGER)
	private Set<String> conditions;
	@ElementCollection(fetch = FetchType.EAGER)
	private List<STActionParameterBundle> parameters;
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
	
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	
	public Set<String> getConditions() {
		return conditions;
	}
	public void setConditions(Set<String> conditions) {
		this.conditions = conditions;
	}
	
	@Override
	public String toString() {
		return "STCommand [name=" + name + "]";
	}

	public List<STActionParameterBundle> getParams() {
		return parameters;
	}
	public void setParams(List<STActionParameterBundle> params) {
		this.parameters = params;
	}
	

}
