package com.smartown.utils.exceptions;
/*
 * @author IQBots
 * */
public class STException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	protected int code;
	/*
	 * Getter for code variable
	 * @returns the code
	 * */
	public int getCode() {
		return code;
	}
	/*
	 * Setter for code variable
	 * @param the code
	 * */
	public void setCode(int code) {
		this.code = code;
	}

}
