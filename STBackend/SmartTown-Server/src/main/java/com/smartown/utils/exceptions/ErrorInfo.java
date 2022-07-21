package com.smartown.utils.exceptions;

public class ErrorInfo {
    public final int code;
    public final String err_out;
    
    public ErrorInfo( STException ex) {
        this.code = ex.getCode();
        this.err_out = ex.getMessage();
    }
}
