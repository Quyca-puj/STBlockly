package com.smartown.server.model;

import java.util.Set;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.ElementCollection;
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

import com.smartown.server.model.dto.ActionDTO;

@Entity
@Embeddable
@Table(name = "instance_actions")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "action_type")
/*
 * @author IQBots
 */
public class STInstanceAction {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "instance_id", updatable = false, nullable = false)
	protected long instance_id;
	@ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
	protected STBaseAction baseAction;
	@Basic
	protected float speed;

	public STInstanceAction() {
		super();
	}

	public STInstanceAction(ActionDTO actionDto, STBaseAction baseAction) {
		super();
		if (actionDto.getSpeed() != null) {
			speed = actionDto.getSpeed();
		}
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

	public long getInstance_id() {
		return instance_id;
	}

	public void setInstance_id(long instance_id) {
		this.instance_id = instance_id;
	}

	public float getSpeed() {
		return speed;
	}

	public void setSpeed(float speed) {
		this.speed = speed;
	}

	@Override
	public String toString() {
		return "STInstanceAction [instance_id=" + instance_id + ", baseAction=" + baseAction + "]";
	}

}
