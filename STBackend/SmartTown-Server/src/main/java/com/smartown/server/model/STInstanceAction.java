package com.smartown.server.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Embeddable
@Table(name = "instance_actions")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "action_type")
public class STInstanceAction {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "instance_id", updatable = false, nullable = false)
	private long instance_id;
	@ManyToOne(fetch=FetchType.EAGER,cascade = CascadeType.REMOVE)
	private STBaseAction baseAction;

		
	public STInstanceAction() {
		super();
	}
	public STInstanceAction(STBaseAction baseAction) {
		super();
		this.baseAction = baseAction;
	}
	public long getId() {
		return instance_id;
	}
	public void setId(long id) {
		this.instance_id = id;
	}
	public STBaseAction getBaseAction() {
		return baseAction;
	}
	public void setBaseAction(STBaseAction baseAction) {
		this.baseAction = baseAction;
	}
	@Override
	public String toString() {
		return "STInstanceAction [instance_id=" + instance_id + ", baseAction=" + baseAction + "]";
	}
	
	
}
