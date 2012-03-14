package com.wisemapping.rest;


import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

public class BaseController {

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public String handleClientErrors(@NotNull Exception ex) {
        ex.printStackTrace();
        return ex.getMessage();
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public String handleServerErrors(@NotNull Exception ex) {
        ex.printStackTrace();
//        LOGGER.error(ex.getMessage(), ex);
        return ex.getMessage();
    }
}
