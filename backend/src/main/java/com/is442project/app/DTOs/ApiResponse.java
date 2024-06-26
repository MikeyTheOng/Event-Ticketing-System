package com.is442project.app.DTOs;

import lombok.Getter;
import lombok.Setter;

public class ApiResponse<T> {

  @Getter
  @Setter
  private boolean success;

  @Getter
  @Setter
  private String message;

  @Getter
  @Setter
  private T data;

  public ApiResponse(boolean success, String message, T data) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
