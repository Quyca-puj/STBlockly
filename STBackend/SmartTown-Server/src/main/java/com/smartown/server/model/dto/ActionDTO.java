package com.smartown.server.model.dto;



public class ActionDTO {

	private String action;
	private String emotion;
	private Float time;
	private Float speed;
	
	

	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public String getEmotion() {
		return emotion;
	}
	public void setEmotion(String emotion) {
		this.emotion = emotion;
	}
	public Float getTime() {
		return time;
	}
	public void setTime(Float time) {
		this.time = time;
	}
	public Float getSpeed() {
		return speed;
	}
	public void setSpeed(Float speed) {
		this.speed = speed;
	}
	@Override
	public String toString() {
		return "ActionDTO [action=" + action + ", emotion=" + emotion + ", time=" + time + ", speed=" + speed + "]";
	}
	
	public ActionDTOType getActionType() {
		if(speed == null && time == null && emotion != null) {
			return ActionDTOType.EMOTIONAL;
		}else {
			if(!(speed == null && time == null)) {
				return ActionDTOType.TIMED;
			}else {
				return ActionDTOType.COMMAND;
			}
		}
	}
	
	public enum ActionDTOType{
		COMMAND,EMOTIONAL,TIMED;
	}
	
	
}
