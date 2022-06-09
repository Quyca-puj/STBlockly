package com.smartown.server.model;

import javax.persistence.Basic;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import com.smartown.server.model.dto.ActionDTO;



@Entity
@DiscriminatorValue("TimedAction")
public class STTimedAction extends STInstanceAction{
	@Basic
	private float speed;
	@Basic
	private float time;

	public STTimedAction(ActionDTO actionDto, STBaseAction baseAction) {
		super(baseAction);
		speed=actionDto.getSpeed();
		time=actionDto.getTime();
	}
	public float getSpeed() {
		return speed;
	}
	public void setSpeed(float speed) {
		this.speed = speed;
	}
	public float getTime() {
		return time;
	}
	public void setTime(float time) {
		this.time = time;
	}

}
