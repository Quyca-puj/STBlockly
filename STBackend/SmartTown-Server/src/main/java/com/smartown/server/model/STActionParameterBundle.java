package com.smartown.server.model;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
/*
 * @author IQBots
 */
public class STActionParameterBundle {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	@ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
	private STActionParameter parameter;
	@Basic
	private String translatedName;
	@Basic
	private int position;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public STActionParameter getParameter() {
		return parameter;
	}

	public void setParameter(STActionParameter parameter) {
		this.parameter = parameter;
	}

	public String getTranslatedName() {
		return translatedName;
	}

	public void setTranslatedName(String translatedName) {
		this.translatedName = translatedName;
	}

	public int getPosition() {
		return position;
	}

	public void setPosition(int position) {
		this.position = position;
	}

	@Override
	public String toString() {
		return "STActionParameterBundle [id=" + id + ", parameter=" + parameter + "]";
	}

}
