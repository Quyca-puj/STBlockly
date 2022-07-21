package com.smartown.utils.exceptions;

public class STException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	protected int code;

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}
	
	
}
